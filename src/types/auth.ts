export type UserRole =
  | 'admin'
  | 'tutor'
  | 'student'
  | 'company representative'

export interface User {
  id     : number
  name   : string
  email  : string
  role   : UserRole
  avatar : string | null
}

export interface LoginCredentials {
  email    : string
  password : string
}

export interface RegisterData {
  name                  : string
  email                 : string
  password              : string
  password_confirmation : string
}

export const ROLE_ROUTES: Record<UserRole, string> = {
  'admin'                  : '/admin',
  'tutor'                  : '/tutor/dashboard',
  'student'                : '/student/dashboard',
  'company representative' : '/company/dashboard',
}