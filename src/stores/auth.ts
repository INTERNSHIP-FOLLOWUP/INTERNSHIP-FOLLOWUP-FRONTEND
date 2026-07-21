import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '@/router'
import { authService } from '@/services/auth'
import { tokenService } from '@/services/token'
import { AUTH_CONFIG, AUTH_TOKEN_KEY, AUTH_SESSION_KEY } from '@/constants/auth'
import { parseApiError } from '@/utils/errorParser'
import type { User, UserRole, LoginCredentials, RegisterData } from '@/types/auth'
import { ROLE_ROUTES, PUBLIC_ROUTES } from '@/types/auth'

const { SESSION_TIMEOUT_MS } = AUTH_CONFIG

// Strip malformed tokens on store creation
const raw = localStorage.getItem(AUTH_TOKEN_KEY)
if (!raw || ['undefined', 'null', ''].includes(raw)) {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export const useAuthStore = defineStore('auth', () => {
  // ── State ──
  const user = ref<User | null>(null)
  const hasSession = ref(localStorage.getItem(AUTH_SESSION_KEY) === 'true')
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)
  const lastActivity = ref(Date.now())
  const isSessionTimedOut = ref(false)
  let bootPromise: Promise<void> | null = null

  // ── Getters ──
  const isLoggedIn = computed(() => !!user.value)
  const userRole = computed<UserRole | null>(() => user.value?.role ?? null)
  const userName = computed(() => user.value?.name ?? '')
  const isAdmin = computed(() => user.value?.role === 'admin')

  // ── RBAC ──
  function hasRole(role: UserRole): boolean {
    return userRole.value === role
  }

  function hasAnyRole(...roles: UserRole[]): boolean {
    if (!userRole.value) return false
    return roles.includes(userRole.value)
  }

  function hasPermission(permission: string): boolean {
    return user.value?.permissions?.includes(permission) ?? false
  }

  function roleLevel(role?: UserRole | null): number {
    return role ? (AUTH_CONFIG.ROLE_HIERARCHY[role] ?? 0) : 0
  }

  function canAccess(minRoleLevel: number): boolean {
    return roleLevel(userRole.value) >= minRoleLevel
  }

  // ── Helpers ──
  function getRedirectPath(role: UserRole): string {
    return ROLE_ROUTES[role] || '/login'
  }

  function setSession(data: { user: User; access_token?: string; token?: string }): void {
    user.value = data.user
    hasSession.value = true
    localStorage.setItem(AUTH_SESSION_KEY, 'true')

    const tok = data.access_token || data.token
    if (tok) {
      localStorage.setItem(AUTH_TOKEN_KEY, tok)
    }
  }

  function clearSession(): void {
    user.value = null
    hasSession.value = false
    error.value = null
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_SESSION_KEY)
  }

  // ── Session Tracking ──
  function updateActivity() {
    lastActivity.value = Date.now()
    isSessionTimedOut.value = false
  }

  function checkSessionTimeout(): boolean {
    if (Date.now() - lastActivity.value >= SESSION_TIMEOUT_MS) {
      isSessionTimedOut.value = true
      return true
    }
    return false
  }

  // ── CSRF (optional — for Sanctum SPA auth) ──
  async function getCsrfCookie(): Promise<void> {
    try {
      const { default: axios } = await import('axios')
      // Strip "/api" suffix from the API URL to get the base Sanctum URL
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
      const baseUrl = apiUrl.replace(/\/api\/?$/, '')
      await axios.get(`${baseUrl}/sanctum/csrf-cookie`, {
        withCredentials: true,
        headers: { Accept: 'application/json' },
      })
    } catch {
      // Bearer-token APIs don't need the CSRF cookie
    }
  }

  // ── Boot: validate session on app start ──
  async function boot(): Promise<void> {
    if (initialized.value) return
    if (bootPromise) return bootPromise

    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (!hasSession.value || !token) {
      initialized.value = true
      return
    }

    bootPromise = (async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)
        const userData = await authService.fetchUser()
        clearTimeout(timeoutId)
        user.value = userData
      } catch {
        clearSession()
        tokenService.clearTokens()
      } finally {
        initialized.value = true
        bootPromise = null
      }
    })()

    return bootPromise
  }

  // ── Login ──
  async function login(credentials: LoginCredentials): Promise<void> {
    loading.value = true
    error.value = null

    try {
      await getCsrfCookie()
      const data = await authService.login(credentials)
      setSession(data)
      updateActivity()

      const redirect =
        (router.currentRoute.value.query.redirect as string) || getRedirectPath(data.user.role)
      await router.push(redirect)
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ── Register ──
  async function register(payload: RegisterData): Promise<void> {
    loading.value = true
    error.value = null

    try {
      await getCsrfCookie()
      const data = await authService.register(payload)
      setSession(data)
      updateActivity()

      const redirect =
        (router.currentRoute.value.query.redirect as string) || getRedirectPath(data.user.role)
      await router.push(redirect)
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ── Logout ──
  async function logout(): Promise<void> {
    try {
      await authService.logout()
    } finally {
      clearSession()
      tokenService.clearTokens()
      await router.push('/login')
    }
  }

  // ── Refresh user data (e.g. after profile update) ──
  async function refreshUser(): Promise<void> {
    try {
      const userData = await authService.fetchUser()
      user.value = userData
    } catch {
      // Silent — user can still use the app with stale data
    }
  }

  // ── Force logout (session timeout, 401) ──
  async function forceLogout(): Promise<void> {
    clearSession()
    tokenService.clearTokens()
    if (!PUBLIC_ROUTES.includes(router.currentRoute.value.path)) {
      await router.push('/login')
    }
  }

  return {
    user,
    hasSession,
    loading,
    error,
    initialized,
    lastActivity,
    isSessionTimedOut,
    isLoggedIn,
    userRole,
    userName,
    isAdmin,
    hasRole,
    hasAnyRole,
    hasPermission,
    canAccess,
    roleLevel,
    updateActivity,
    checkSessionTimeout,
    boot,
    login,
    register,
    logout,
    refreshUser,
    forceLogout,
  }
})
