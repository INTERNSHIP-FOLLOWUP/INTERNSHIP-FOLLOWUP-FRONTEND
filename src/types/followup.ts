// 'Annual' is kept only so older records still render; new follow-ups use Weekly/Monthly/Quarterly.
export type MeetingType = 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual'

export interface FollowupUser {
  id: number
  name: string
  email: string
  phone?: string | null
  photo_url?: string | null
}

export interface Followup {
  id: number
  student_id: number
  tutor_id: number
  company_id: number
  meeting_type: MeetingType
  meeting_date: string
  notes: string
  action_items: string
  next_followup: string | null
  created_at: string
  updated_at: string
  student?: FollowupUser
  tutor?: FollowupUser
}

export interface FollowupPayload {
  student_id: number
  meeting_type: MeetingType
  meeting_date: string
  notes: string
  action_items: string
  next_followup: string | null
}
