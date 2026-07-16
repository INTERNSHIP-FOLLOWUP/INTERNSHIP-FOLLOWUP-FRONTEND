export interface Comment {
  id: number
  user_id: number
  worklog_id: number
  message: string
  created_at: string
  updated_at: string
}

export interface CommentPayload {
  worklog_id: number
  message: string
}
