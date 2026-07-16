import api from '@/services/api'
import type { Followup, FollowupPayload } from '@/types/followup'

interface PaginatedResponse<T> {
  data: T[]
}

export const followupService = {
  async getAll(params?: Record<string, unknown>): Promise<Followup[]> {
    const response = await api.get<PaginatedResponse<Followup> | Followup[]>('/followups', {
      params,
    })
    const payload = response.data
    return Array.isArray(payload) ? payload : payload.data
  },

  async create(payload: FollowupPayload): Promise<Followup> {
    const response = await api.post<Followup>('/followups', payload)
    return response.data
  },

  async update(id: number, payload: FollowupPayload): Promise<Followup> {
    const response = await api.put<Followup>(`/followups/${id}`, payload)
    return response.data
  },
}
