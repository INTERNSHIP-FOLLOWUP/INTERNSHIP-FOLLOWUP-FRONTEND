// src/types/comment.ts
export interface Comment {
  id: number
  user_id: number
  user_name: string        // assumes backend includes this via a relationship/resource
  worklog_id: number
  message: string
  created_at: string
}

export interface CommentPayload {
  worklog_id: number
  message: string
}