export interface TutorDashboardStats {
  assigned_students: number
  pending_reviews: number
  followups_due: number
  open_issues: number
  inactive_students: number
}

export interface TutorDashboardActivity {
  type: 'worklog' | 'issue' | 'followup'
  icon: string
  message: string
  timestamp?: string
  reference_id: number
}

export interface TutorDashboardResponse {
  success: boolean
  data: {
    stats: TutorDashboardStats
    recent_worklogs: TutorDashboardWorklog[]
    upcoming_followups: TutorDashboardFollowup[]
    open_issues: TutorDashboardIssue[]
    recent_activity: TutorDashboardActivity[]
  }
}

export interface TutorDashboardWorklog {
  id: number
  week_number: number
  status: string
  submission_date?: string
  submitted_at?: string
  description?: string
  student?: {
    id: number
    name: string
    email?: string
    phone?: string
  } | null
}

export interface TutorDashboardFollowup {
  id: number
  scheduled_at: string
  date_label: string
  time_label: string
  relative: string
  type: string
  notes?: string
  status: string
  student?: {
    id: number
    name: string
    phone?: string
  } | null
}

export interface TutorDashboardIssue {
  id: number
  title: string
  status: string
  priority: string
  created_at?: string
  student?: {
    id: number
    name: string
    email?: string
  } | null
}
