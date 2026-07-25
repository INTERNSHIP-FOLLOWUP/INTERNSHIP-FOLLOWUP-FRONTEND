export type UserRole = 'admin' | 'tutor' | 'student' | 'supervisor' | 'company' | 'company representative'

export interface User {
  id: number
  first_name: string
  last_name: string
  name: string
  email: string
  role: UserRole
  avatar: string | null
  theme: 'light' | 'dark'
  must_change_password?: boolean
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
  first_name: string
  last_name: string
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
  supervisor: '/company/dashboard',
  company: '/company/dashboard',
  'company representative': '/company/dashboard',
}

export const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/403', '/404']
