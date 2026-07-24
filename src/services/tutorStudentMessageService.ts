import api from '@/services/api'
import type {
  TutorStudentConversationsResponse,
  TutorStudentMessagesResponse,
  SendMessagePayload,
  SendMessageResponse,
} from '@/types/message'

export const tutorStudentMessageService = {
  async getConversations(): Promise<TutorStudentConversationsResponse> {
    const res = await api.get<TutorStudentConversationsResponse>('/tutor/student-messages')
    return res.data
  },

  async getMessages(studentId: number): Promise<TutorStudentMessagesResponse> {
    const res = await api.get<TutorStudentMessagesResponse>(`/tutor/student-messages/${studentId}`)
    return res.data
  },

  async sendMessage(studentId: number, payload: SendMessagePayload): Promise<SendMessageResponse> {
    const res = await api.post<SendMessageResponse>(`/tutor/student-messages/${studentId}`, payload)
    return res.data
  },
}
