import api from '@/services/api'
import { tokenService } from '@/services/token'
import { AUTH_CONFIG } from '@/constants/auth'
import type { AuthResponse, LoginCredentials, RegisterData, User, RefreshResponse } from '@/types/auth'

const { ENDPOINTS } = AUTH_CONFIG

/**
 * AuthService
 *
 * All direct API interactions for authentication.
 * The Pinia store should call these methods, not the API directly.
 */
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(ENDPOINTS.LOGIN, credentials)
    const data = response.data

    tokenService.setTokens({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_in ? Date.now() + data.expires_in * 1000 : undefined,
    })

    return data
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(ENDPOINTS.REGISTER, data)
    const result = response.data

    tokenService.setTokens({
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      expiresAt: result.expires_in ? Date.now() + result.expires_in * 1000 : undefined,
    })

    return result
  },

  async logout(): Promise<void> {
    try {
      await api.post(ENDPOINTS.LOGOUT)
    } catch {
      // Swallow — we clear locally regardless
    } finally {
      tokenService.clearTokens()
    }
  },

  async fetchUser(): Promise<User> {
    const response = await api.get<User>(ENDPOINTS.USER)
    return response.data
  },

  async refreshToken(): Promise<RefreshResponse> {
    const refreshToken = tokenService.getRefreshToken()
    const response = await api.post<RefreshResponse>(ENDPOINTS.REFRESH, {
      refresh_token: refreshToken,
    })

    const data = response.data
    tokenService.setTokens({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_in ? Date.now() + data.expires_in * 1000 : undefined,
    })

    return data
  },
}
