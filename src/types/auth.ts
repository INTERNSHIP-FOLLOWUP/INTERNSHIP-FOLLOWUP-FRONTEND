export type UserRole = 'admin' | 'tutor' | 'student' | 'company'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  email_verified_at?: string | null
  created_at?: string
  updated_at?: string
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
  token: string
}

export const ROLE_ROUTES: Record<UserRole, string> = {
  admin: '/admin/dashboard',
  tutor: '/tutor',
  student: '/student',
  company: '/company/dashboard',
}
