import api from '@/services/api'
import { tokenService } from '@/services/token'
import { AUTH_CONFIG } from '@/constants/auth'
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  UserRole,
  RefreshResponse,
} from '@/types/auth'

const { ENDPOINTS } = AUTH_CONFIG

/** @note Backend returns "company" but the frontend uses "company representative" everywhere. */
const ROLE_MAP: Record<string, UserRole> = {
  company: 'company representative',
}

function normalizeRole(raw: unknown): UserRole {
  if (typeof raw === 'string') {
    const mapped = ROLE_MAP[raw]
    if (mapped) return mapped
    return raw as UserRole
  }
  if (raw && typeof raw === 'object') {
    const obj = raw as { name?: string }
    if (typeof obj.name === 'string') {
      const mapped = ROLE_MAP[obj.name]
      if (mapped) return mapped
      return obj.name as UserRole
    }
  }
  return 'student'
}

function normalizeUser(user: User): User {
  return { ...user, role: normalizeRole(user.role) }
}

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

    return { ...data, user: normalizeUser(data.user) }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(ENDPOINTS.REGISTER, data)
    const result = response.data

    tokenService.setTokens({
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      expiresAt: result.expires_in ? Date.now() + result.expires_in * 1000 : undefined,
    })

    return { ...result, user: normalizeUser(result.user) }
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
    return normalizeUser(response.data)
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(ENDPOINTS.FORGOT_PASSWORD, { email })
    return response.data
  },

  async resetPassword(payload: {
    email: string
    password: string
    password_confirmation: string
    token: string
  }): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(ENDPOINTS.RESET_PASSWORD, payload)
    return response.data
  },

  async updateProfile(data: FormData): Promise<User> {
    const response = await api.post<{ user: User }>('/profile/update', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return normalizeUser(response.data.user)
  },

  async changePassword(payload: {
    current_password: string
    password: string
    password_confirmation: string
  }): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>('/profile/password', payload)
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
