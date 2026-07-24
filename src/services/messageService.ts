import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import type {
  MessageConversationsResponse,
  MessagesResponse,
  MessageItem,
  SendMessagePayload,
  SendMessageResponse,
} from '@/types/message'

function getMessagePrefix(): string {
  const auth = useAuthStore()
  const role = auth.userRole
  if (role === 'supervisor') {
    return '/company'
  }
  return '/tutor'
}

export const messageService = {
  async getConversations(): Promise<MessageConversationsResponse> {
    const prefix = getMessagePrefix()
    const res = await api.get<MessageConversationsResponse>(`${prefix}/messages`)
    return res.data
  },

  async getMessages(otherPartyId: number): Promise<MessagesResponse> {
    const prefix = getMessagePrefix()
    const res = await api.get<MessagesResponse>(`${prefix}/messages/${otherPartyId}`)
    return res.data
  },

  async sendMessage(otherPartyId: number, payload: SendMessagePayload): Promise<SendMessageResponse> {
    const prefix = getMessagePrefix()
    const res = await api.post<SendMessageResponse>(`${prefix}/messages/${otherPartyId}`, payload)
    return res.data
  },

  /**
   * Poll for new messages since a given timestamp.
   */
  async getUpdates(
    since: string,
    otherPartyId?: number,
  ): Promise<{
    new_messages: MessageItem[]
    total_unread: number
    server_time: string
  }> {
    const prefix = getMessagePrefix()
    const params: Record<string, string> = { since }
    if (otherPartyId !== undefined) {
      params.other_party_id = String(otherPartyId)
    }
    const res = await api.get(`${prefix}/messages/poll`, { params })
    return res.data
  },
}
