export interface StudentBatch {
  id: number
  batch_name?: string
  name?: string
  year?: string
}

export interface StudentTutor {
  id: number
  name: string
  email: string
}

export interface Student {
  id: number
  student_code: string
  name: string
  email: string
  gender: string
  phone: string | null
  photo: string | null
  photo_url: string | null
  batch_id: number | null
  tutor_id: number | null
  batch: StudentBatch | null
  tutor: StudentTutor | null
  status: string
  created_at: string
  updated_at: string
}

export interface StudentFormData {
  student_code: string
  name: string
  email: string
  gender: string
  phone: string
  batch_id: number | null
  tutor_id: number | null
  status: string
  password?: string
  password_confirmation?: string
  photo?: File | string | null
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
  message: string
}

export interface StudentSingleResponse {
  data: Student
  message: string
}
