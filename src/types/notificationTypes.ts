export type NotificationType = 
  | 'general' 
  | 'worklog' 
  | 'assignment' 
  | 'evaluation'
  | 'followup'
  | 'issue'
  | 'reminder'
  | 'company'
  | 'student'
  | 'tutor'
  | 'system'

export type NotificationCategory = 
  | 'all'
  | 'unread'
  | 'worklogs'
  | 'assignments'
  | 'evaluations'
  | 'issues'
  | 'followups'
  | 'reminders'

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  category: NotificationCategory
  role: string
  isRead: boolean
  createdAt: string
  actionLabel?: string
  actionRoute?: string
}

export interface NotificationState {
  notifications: Notification[]
  loading: boolean
}
