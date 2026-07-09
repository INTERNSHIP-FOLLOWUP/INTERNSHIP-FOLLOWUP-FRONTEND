import type { UserRole } from '@/types/auth'

export interface Student {
  id: number
  name: string
  email: string
  role: UserRole
  avatar: string | null
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface StudentFormData {
  name: string
  email: string
  password?: string
  password_confirmation?: string
  avatar?: string | null
}

export interface StudentPaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

export interface StudentListResponse {
  data: Student[]
  meta: StudentPaginationMeta
}
