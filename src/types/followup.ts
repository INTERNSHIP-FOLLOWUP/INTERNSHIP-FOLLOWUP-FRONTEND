// src/types/followup.ts
export type MeetingType = 'Monthly' | 'Quarterly' | 'Annual'

export interface Followup {
  id: number
  student_id: number
  tutor_id: number
  company_id: number
  meeting_type: MeetingType
  meeting_date: string       // ISO date string
  notes: string
  action_items: string
  next_followup: string | null
  created_at: string
  updated_at: string
}

export interface FollowupPayload {
  student_id: number
  meeting_type: MeetingType
  meeting_date: string
  notes: string
  action_items: string
  next_followup: string | null
}