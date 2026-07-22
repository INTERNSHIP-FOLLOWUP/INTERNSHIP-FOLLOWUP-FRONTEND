export interface Attachment {
  id: number
  worklog_id: number
  file_path: string
  file_type: string
  file_size: string
  filename: string
  url?: string
  size_bytes?: number
  mime_type?: string
  created_at?: string
}

export type WorklogStatus = 'Pending' | 'Reviewed' | 'Approved' | 'Rejected' | 'Draft' | 'Submitted'

export interface WorklogStudent {
  id: number
  name: string
  email: string
  student_code?: string
  tutor_name?: string
  company_name?: string
  position?: string
  internship_position?: string
  batch_name?: string
  phone?: string | null
}

export interface TutorReview {
  id?: number
  tutor_id?: number
  tutor_name?: string
  status?: WorklogStatus
  feedback?: string
  reviewed_at?: string
}

export interface Worklog {
  id: number
  week_number: number
  description: string
  status: WorklogStatus
  submitted_at?: string
  created_at?: string
  updated_at?: string
  student_id?: number
  tutor_id?: number
  challenges?: string
  can_edit?: boolean
  submission_date?: string
  student?: WorklogStudent | null
  tutor_review?: TutorReview | null
  attachments?: Attachment[]
}

export interface WorklogPaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from?: number
  to?: number
  path?: string
}

export interface WorklogListResponse {
  data: Worklog[]
  meta: {
    pagination?: WorklogPaginationMeta
  }
}

export interface WorklogFilters {
  page?: number
  status?: WorklogStatus
  week?: number
  student_id?: number
  search?: string
}

export interface ReviewWorklogPayload {
  status: WorklogStatus
  feedback?: string
}
