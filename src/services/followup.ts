import api from '@/services/api'
import type { Followup, FollowupPayload } from '@/types/followup'

interface PaginatedFollowupResponse {
  data: Followup[]
}

export const followupService = {
  async list() {
    const response = await api.get<PaginatedFollowupResponse | Followup[]>('/followups')
    const payload = response.data
    return Array.isArray(payload) ? payload : payload.data
  },

  async get(id: number) {
    const response = await api.get<Followup>(`/followups/${id}`)
    return response.data
  },

  async create(payload: FollowupPayload) {
    const response = await api.post<Followup>('/followups', payload)
    return response.data
  },

  async update(id: number, payload: FollowupPayload) {
    const response = await api.put<Followup>(`/followups/${id}`, payload)
    return response.data
  },

  async delete(id: number) {
    const response = await api.delete<{ message: string }>(`/followups/${id}`)
    return response.data
  },
}
