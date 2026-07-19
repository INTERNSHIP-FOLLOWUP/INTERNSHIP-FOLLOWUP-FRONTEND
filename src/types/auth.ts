export type UserRole = 'admin' | 'tutor' | 'student' | 'company representative'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  avatar: string | null
  avatar_url?: string | null
  permissions?: string[]
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
  expiresAt?: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface AuthResponse {
  user: User
  access_token: string
  refresh_token?: string
  expires_in?: number
}

export interface RefreshResponse {
  access_token: string
  refresh_token?: string
  expires_in?: number
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

export const ROLE_ROUTES: Record<UserRole, string> = {
  admin: '/admin/dashboard',
  tutor: '/tutor/dashboard',
  student: '/student/dashboard',
  'company representative': '/company/dashboard',
}

export const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/403', '/404']
