import api from '@/services/api'
import type { TutorStudentMessageItem, TutorStudentMessagesResponse } from '@/types/message'

interface StudentSendResponse {
  data: TutorStudentMessageItem
  message: string
}

export interface StudentMessagesResult {
  messages: TutorStudentMessageItem[]
  tutorName: string | null
  tutorPhotoUrl: string | null
}

export const studentMessageService = {
  async getMessages(): Promise<StudentMessagesResult> {
    const res = await api.get<TutorStudentMessagesResponse>('/student/messages')
    return {
      messages: res.data.data,
      tutorName: res.data.tutor_name ?? null,
      tutorPhotoUrl: res.data.tutor_photo_url ?? null,
    }
  },

  async sendMessage(text: string): Promise<TutorStudentMessageItem> {
    const res = await api.post<StudentSendResponse>('/student/messages', { message: text })
    return res.data.data
  },
}
