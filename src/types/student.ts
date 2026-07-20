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
  batch?: { id: number; batch_name?: string; name?: string }
  tutor?: { id: number; name?: string }
  status?: 'active' | 'inactive' | 'graduated' | 'suspended' | ''
  photo?: string | null
  photo_url?: string | null
  students_count?: number
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'suspended'

export interface StudentFormData {
  student_code: string
  name: string
  email: string
  gender: string
  phone: string
  batch_id: number | null
  tutor_id: number | null
  status?: StudentStatus | ''
  password: string
  password_confirmation: string
  photo?: File | string | null
  photo_url?: string | null
  avatar?: File | string | null
}

export interface StudentSingleResponse {
  data: Student
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
