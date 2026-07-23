export interface MessageConversation {
  user?: {
    id: number
    name: string
    email: string
    avatar_url: string | null
  }
  company?: {
    id: number
    name: string
    email: string
    logo_url: string | null
  }
  last_message: {
    id: number
    message: string
    sender_type: 'company' | 'tutor'
    created_at: string
  } | null
  unread_count: number
}

export interface MessageItem {
  id: number
  message: string
  sender_type: 'company' | 'tutor'
  is_read: boolean
  created_at: string
  company_id?: number
  tutor_id?: number
}

export interface MessageConversationsResponse {
  data: MessageConversation[]
  company_name?: string
}

export interface MessagesResponse {
  data: MessageItem[]
}

export interface SendMessagePayload {
  message: string
}

export interface SendMessageResponse {
  data: MessageItem
  message: string
}

// ── Tutor-Student Messaging Types ──

export interface TutorStudentConversation {
  student: {
    id: number
    name: string
    email: string | null
    photo_url: string | null
  }
  last_message: {
    id: number
    message: string
    sender_type: 'tutor' | 'student'
    created_at: string
  } | null
  unread_count: number
}

export interface TutorStudentMessageItem {
  id: number
  message: string
  sender_type: 'tutor' | 'student'
  is_read: boolean
  created_at: string
  tutor_id?: number
  student_id?: number
}

export interface TutorStudentConversationsResponse {
  data: TutorStudentConversation[]
}

export interface TutorStudentMessagesResponse {
  data: TutorStudentMessageItem[]
}
