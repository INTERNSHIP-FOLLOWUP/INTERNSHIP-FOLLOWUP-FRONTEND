import axios, { AxiosError, type AxiosResponse } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { AUTH_CONFIG } from '@/constants/auth'
import { tokenService } from '@/services/token'
import { updateEchoAuth } from '@/services/echo'

// ── Types ──────────────────────────────────────────────────────

interface QueueItem {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

interface CancellableRequestConfig extends InternalAxiosRequestConfig {
  cancelToken: ReturnType<typeof axios.CancelToken.source>['token']
  cancel: () => void
}

// ── Axios Instance ──────────────────────────────────────────────

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 15000,
  withCredentials: true, // For httpOnly cookies (CSRF / refresh)
})

// ── Refresh Token Queue ─────────────────────────────────────────

let isRefreshing = false
let failedQueue: QueueItem[] = []
const pendingRequests: Map<string, InternalAxiosRequestConfig> = new Map()
let isLoggingOut = false

function processQueue(error: unknown, token: string | null = null) {
  for (const item of failedQueue) {
    if (error) {
      item.reject(error)
    } else if (token) {
      item.resolve(token)
    }
  }
  failedQueue = []
}

async function attemptTokenRefresh(): Promise<string> {
  const refreshToken = tokenService.getRefreshToken()
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await axios.post(
    `${api.defaults.baseURL}${AUTH_CONFIG.ENDPOINTS.REFRESH}`,
    { refresh_token: refreshToken },
    { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } },
  )

  const { access_token, refresh_token, expires_in } = response.data

  tokenService.setTokens({
    accessToken: access_token,
    refreshToken: refresh_token,
    expiresAt: expires_in ? Date.now() + expires_in * 1000 : undefined,
  })

  // Update Echo's auth headers with the new token
  updateEchoAuth(access_token)

  return access_token
}

// ── Request Interceptor ─────────────────────────────────────────

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach access token
    const token = tokenService.getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add CSRF token if available (for non-get requests)
    const csrfToken = getCsrfToken()
    if (
      csrfToken &&
      config.method &&
      !['get', 'head', 'options'].includes(config.method) &&
      config.headers
    ) {
      config.headers['X-CSRF-TOKEN'] = csrfToken
    }

    // Let the browser set Content-Type with boundary for FormData
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type']
    }

    const requestKey = `${config.method}:${config.url}:${JSON.stringify(config.data || config.params)}`
    if (config.method?.toLowerCase() === 'get' && pendingRequests.has(requestKey)) {
      return Promise.reject({ cancelled: true, key: requestKey })
    }

    if (config.method?.toLowerCase() === 'get') {
      pendingRequests.set(requestKey, config)
      const cancellable = config as CancellableRequestConfig
      const source = axios.CancelToken.source()
      cancellable.cancelToken = source.token
      cancellable.cancel = () => {
        pendingRequests.delete(requestKey)
        source.cancel('Request cancelled due to duplicate')
      }
    }

    return config
  },
  (error) => Promise.reject(error),
)

// Cleanup completed request keys
api.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as InternalAxiosRequestConfig & { cancel?: () => void }
    if (config.cancel) config.cancel()
    return response
  },
  (error) => {
    if (error.config?.cancel) error.config.cancel()
    return Promise.reject(error)
  },
)

// ── Response Interceptor (Token Refresh) ────────────────────────

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const { config, response } = error

    // Gracefully handle cancelled requests
    const cancelled = (error as { cancelled?: boolean } | undefined)?.cancelled
    if (cancelled) return Promise.reject(error)

    // No response = network error
    if (!response) {
      const { useToastStore } = await import('@/stores/toast')
      useToastStore().error('Network error. Please check your connection.', 'Connection Lost')
      return Promise.reject(error)
    }

    const status = response.status

    // ── 401 Unauthorized ──
    if (status === 401) {
      // Don't attempt refresh for auth endpoints
      const url = config?.url || ''
      if (
        url.includes(AUTH_CONFIG.ENDPOINTS.LOGIN) ||
        url.includes(AUTH_CONFIG.ENDPOINTS.REGISTER) ||
        url.includes(AUTH_CONFIG.ENDPOINTS.REFRESH)
      ) {
        return Promise.reject(error)
      }

      // Already logging out, reject immediately
      if (isLoggingOut) {
        return Promise.reject(error)
      }

      // If no config (e.g., response error without request), reject
      if (!config) {
        return Promise.reject(error)
      }

      // Queue this request while refreshing
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (config.headers) {
                config.headers.Authorization = `Bearer ${token}`
              }
              resolve()
            },
            reject,
          })
        }).then(() => api(config))
      }

      isRefreshing = true
      const originalConfig = config

      try {
        const newToken = await attemptTokenRefresh()
        processQueue(null, newToken)

        // Retry the original request with new token
        if (originalConfig.headers) {
          originalConfig.headers.Authorization = `Bearer ${newToken}`
        }
        return api(originalConfig)
      } catch (refreshError) {
        processQueue(refreshError, null)
        isLoggingOut = true

        // Clear session and redirect
        tokenService.clearTokens()
        localStorage.removeItem('auth_has_session')

        // Use a small delay to avoid race conditions
        setTimeout(() => {
          isLoggingOut = false
          window.location.href = '/login'
        }, 100)

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // ── 403 Forbidden ──
    if (status === 403) {
      window.location.href = '/forbidden'
      return Promise.reject(error)
    }

    // ── 419 CSRF Token Mismatch ──
    if (status === 419) {
      clearCsrfToken()
      return Promise.reject(error)
    }

    // ── 500+ Server Errors ──
    if (status >= 500) {
      const { useToastStore } = await import('@/stores/toast')
      useToastStore().error(
        'An unexpected server error occurred. Please try again.',
        'Server Error',
      )
    }

    return Promise.reject(error)
  },
)

// ── CSRF Helpers ────────────────────────────────────────────────

function getCsrfToken(): string | null {
  const meta = document.querySelector('meta[name="csrf-token"]')
  return meta ? meta.getAttribute('content') : null
}

function clearCsrfToken() {
  const meta = document.querySelector('meta[name="csrf-token"]')
  if (meta) meta.remove()
}

export default api
