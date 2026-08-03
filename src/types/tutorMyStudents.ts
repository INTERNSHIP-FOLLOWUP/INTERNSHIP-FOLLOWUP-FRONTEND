/**
 * Types for the Tutor → My Students feature.
 * Represents a student assigned to a tutor, with internship & tracking metadata.
 */

export interface TutorMyStudent {
  id: number
  student_code?: string
  first_name?: string
  last_name?: string
  name: string
  email: string
  phone?: string | null
  avatar?: string | null
  photo?: string | null

  // Internship
  company_name?: string | null
  company_id?: number | null
  position?: string | null
  assignment_status?: string
  batch?: {
    id: number
    batch_name?: string
    name?: string
  } | null
  tutor?: {
    id: number
    name?: string
  } | null

  // Tracking
  last_worklog_at?: string | null
  total_worklogs?: number
  open_issues_count?: number
  next_followup?: {
    id: number
    scheduled_at: string
    date_label: string
    time_label: string
    type: string
    status: string
  } | null
  feedback_given?: boolean
}

/** Pagination metadata from Laravel API resources */
export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

/** Standard API list response wrapping data + meta */
export interface TutorMyStudentListResponse {
  data: TutorMyStudent[]
  meta: PaginationMeta
}

/** Dashboard summary derived from the student list */
export interface TutorStudentSummary {
  totalStudents: number
  activeStudents: number
  studentsWithIssues: number
  pendingFollowups: number
}
