import type { Student } from '@/types/student'

export type WorklogStatus = 'Pending' | 'Reviewed' | 'Approved' | 'Rejected'

export interface Attachment {
  id: number
  filename: string
  mime_type?: string
  size_bytes?: number
  url?: string
}

export interface TutorReview {
  tutor_name: string
  reviewed_at?: string
  feedback: string
  status: WorklogStatus
}

export interface WorklogPayload {
  week_number: number
  description: string
  challenges?: string
  attachments?: Attachment[]
}

export interface WorklogFilters {
  page?: number
  week?: number
  status?: WorklogStatus
  student_id?: number
}

export interface Worklog {
  id: number
  week_number: number
  description: string
  challenges?: string
  status: WorklogStatus
  submitted_at: string
  attachments: Attachment[]
  student?: {
    name: string
    company_name?: string
    position?: string
  } | Student
  tutor_review?: TutorReview

  // optional backend flag
  can_edit?: boolean
}

