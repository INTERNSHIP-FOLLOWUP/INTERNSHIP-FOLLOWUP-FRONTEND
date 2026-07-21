export interface DashboardStats {
  assigned_students: number
  pending_reviews: number
  followups_due: number
  open_issues: number
  inactive_students: number
}

export interface DashboardWorklog {
  id: number
  week_number: number
  status?: string
  submission_date?: string
  submitted_at?: string
  description?: string
  student?: {
    id: number
    name?: string
  } | null
}

export interface DashboardFollowup {
  id: number
  scheduled_at: string
  date_label?: string
  time_label?: string
  relative?: string
  type?: string
  student?: {
    id: number
    name?: string
  } | null
}

export interface DashboardIssue {
  id: number
  title?: string
  status?: string
  priority?: string
  student?: {
    id: number
    name?: string
  } | null
}

export interface DashboardActivityItem {
  type: 'worklog' | 'issue' | 'followup'
  message?: string
  timestamp?: string
  reference_id?: number
  icon?: string
}

export interface DashboardData {
  stats: DashboardStats
  recent_worklogs: DashboardWorklog[]
  upcoming_followups: DashboardFollowup[]
  open_issues: DashboardIssue[]
  recent_activity: DashboardActivityItem[]
}

export interface DashboardResponse {
  success: boolean
  data: DashboardData
}
