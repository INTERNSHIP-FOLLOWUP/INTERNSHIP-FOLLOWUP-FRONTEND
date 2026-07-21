// src/types/followup.ts
export type MeetingType = 'In-Person' | 'Online' | 'Phone' | 'Virtual'

export interface Followup {
  id: number
  student_id: number
  tutor_id: number
  company_id: number
  meeting_type: MeetingType
  meeting_date: string // ISO date string
  notes: string
  action_items: string
  next_followup: string | null
  created_at: string
  updated_at: string
  student?: {
    id: number
    name: string
  } | null
  company?: {
    id: number
    name: string
  } | null
}

export interface FollowupPayload {
  student_id: number
  company_id?: number | null
  meeting_type: MeetingType
  meeting_date: string
  notes: string
  action_items: string
  next_followup: string | null
}
