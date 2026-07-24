import api from '@/services/api'
import type {
  TutorStudentConversationsResponse,
  TutorStudentMessagesResponse,
  TutorStudentSendMessageResponse,
  SendMessagePayload,
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

  async sendMessage(
    studentId: number,
    payload: SendMessagePayload,
  ): Promise<TutorStudentSendMessageResponse> {
    const res = await api.post<TutorStudentSendMessageResponse>(
      `/tutor/student-messages/${studentId}`,
      payload,
    )
    return res.data
  },
}
