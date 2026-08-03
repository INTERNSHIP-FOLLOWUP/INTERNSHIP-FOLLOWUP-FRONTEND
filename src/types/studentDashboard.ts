export interface StudentDashboardBatch {
  id: number
  batch_name: string
  year: number
}

export interface StudentDashboardTutor {
  id: number
  name: string
  email: string
}

export interface StudentDashboardStudent {
  id: number
  name: string
  student_code: string | null
  batch: StudentDashboardBatch | null
  tutor: StudentDashboardTutor | null
}

export interface StudentDashboardInternship {
  id: number
  company_name: string
  position: string
  status: string
  start_date: string
  end_date: string
}

export interface StudentDashboardWorklogItem {
  id: number
  week_number: number
  status: string
  title?: string
  created_at: string
}

export interface StudentDashboardWorklogs {
  total: number
  submitted: number
  approved: number
  recent: StudentDashboardWorklogItem[]
}

export interface StudentDashboardFeedbackItem {
  id: number
  week_number: number
  feedback: string
  status: string
  created_at: string
}

export interface StudentDashboardData {
  student: StudentDashboardStudent
  internship: StudentDashboardInternship | null
  worklogs: StudentDashboardWorklogs
  pending_reviews: number
  open_issues: number
  tutor_feedback: StudentDashboardFeedbackItem[]
}

export interface StudentDashboardResponse {
  data: StudentDashboardData
  message?: string
}
