export interface TutorWorklog {
  id: number
  student_id?: number
  week_number: number
  description: string
  status: string
  submitted_at?: string
  created_at?: string
  updated_at?: string
  challenges?: string
  can_edit?: boolean
  submission_date?: string
  student?: {
    id: number
    name?: string
    email?: string
    phone?: string
  } | null
  tutor_review?: {
    id?: number
    feedback?: string
    status?: string
    reviewed_at?: string
  }
  attachments?: Array<{
    id: number
    filename: string
    file_type?: string
    url?: string
  }>
}

export interface TutorWorklogListResponse {
  success?: boolean
  data: TutorWorklog[]
  meta?: {
    pagination?: {
      current_page: number
      last_page: number
      per_page: number
      total: number
    }
  }
}
