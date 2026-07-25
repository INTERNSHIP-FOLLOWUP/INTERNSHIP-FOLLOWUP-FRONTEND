// src/types/studentProfile.ts
// Types for student self-profile management
// Matches the actual backend API contract (GET /api/student/profile)

export interface StudentBatch {
  id: number
  batch_name: string
  year: number
}

export interface StudentTutor {
  id: number
  name: string
  email: string
}

export interface StudentProfile {
  id: number
  name: string
  email: string
  student_code: string | null
  user?: {
    id?: number
    first_name?: string
    last_name?: string
    name?: string
    email?: string
    phone?: string
    gender?: string
    status?: string
    avatar?: string | null
  } | null
  gender: string | null
  phone: string | null
  /** Relative path like "students/abc.jpg" or null — construct full URL for display */
  photo: string | null
  status: string | null
  batch: StudentBatch | null
  tutor: StudentTutor | null
  created_at: string
  updated_at: string
}

export interface StudentProfileUpdatePayload {
  name?: string
  phone?: string
  gender?: string
}

export interface PasswordChangePayload {
  current_password: string
  password: string
  password_confirmation: string
}

/** Response from POST /api/student/profile/photo */
export interface PhotoUploadResponse {
  photo_url: string
}

export interface StudentProfileResponse {
  data: StudentProfile
  message?: string
}
