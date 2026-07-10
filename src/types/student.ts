import type { UserRole } from '@/types/auth'

export interface Student {
  id: number
  name: string
  email: string
  role: UserRole
  avatar: string | null
  student_code?: string
  gender?: string
  phone?: string
  batch_id?: number | null
  tutor_id?: number | null
  batch?: string
  tutor?: string
  status?: string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface StudentFormData {
  student_code: string
  name: string
  email: string
  gender: string
  phone: string
  batch_id: number | null
  tutor_id: number | null
  password?: string
  password_confirmation?: string
  avatar?: File | string | null
}

export interface Batch {
  id: number
  name: string
}

export interface Tutor {
  id: number
  name: string
  email: string
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
