export interface TutorStudent {
  id: number
  name: string
  email: string
  role?: string
  avatar?: string | null
  student_code?: string
  gender?: string
  phone?: string
  batch_id?: number | null
  tutor_id?: number | null
  first_name?: string
  last_name?: string
  batch?: {
    id: number
    batch_name?: string
    name?: string
    year?: number | string
  }
  tutor?: {
    id: number
    name?: string
  }
  status?: string
  photo?: string | null
  created_at?: string
  updated_at?: string

  // Tutor-scoped extras
  assignment_status?: string
  company_name?: string | null
  position?: string | null
  last_worklog_at?: string | null
  feedback_given?: boolean
  open_issues_count?: number
  next_followup?: {
    id: number
    scheduled_at: string
    date_label: string
    time_label: string
    type: string
    status: string
  } | null
}

export interface TutorStudentDetail extends TutorStudent {
  worklogs?: Array<{
    id: number
    week_number: number
    status: string
    submitted_at?: string
    created_at?: string
    description?: string
    challenges?: string
  }>
  issues?: Array<{
    id: number
    title: string
    status: string
    priority: string
    created_at?: string
  }>
  evaluations?: Array<unknown>
}

export interface TutorStudentListResponse {
  success: boolean
  data: TutorStudent[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
    from: number | null
    to: number | null
  }
}

export interface TutorStudentDetailResponse {
  success: boolean
  data: TutorStudentDetail
}

export interface TutorStudentStatusResponse {
  success: boolean
  message?: string
  data: {
    student_id: number
    status: string
    company_id?: number
    student: TutorStudent
  }
}
