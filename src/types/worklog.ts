import type { Student } from '@/types/student'

export type WorklogStatus = 'Pending' | 'Reviewed' | 'Approved' | 'Rejected' | 'Needs Revision'

export interface Attachment {
  id?: number
  filename?: string
  name?: string
  original_name?: string
  originalName?: string
  mime_type?: string
  mimeType?: string
  size_bytes?: number
  size?: number
  file_size?: number
  fileSize?: number
  url?: string
  created_at?: string | null
  createdAt?: string | null
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
  search?: string
}

export interface Worklog {
  id: number
  week_number: number
  description: string
  challenges?: string
  status: WorklogStatus
  submitted_at: string
  updated_at?: string
  attachments: Attachment[]
  student?: (Student & {
    company_name?: string
    position?: string
    email?: string
    student_code?: string
    batch?: string
  })
  tutor_review?: TutorReview

  // optional backend flags
  can_edit?: boolean
  can_delete?: boolean
}

