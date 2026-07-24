// src/stores/followupStore.ts
import { defineStore } from 'pinia'
import api from '@/services/api'
import type { Followup, FollowupPayload } from '@/types/followup'
import type { AxiosError } from 'axios'

interface FollowupState {
  followups: Followup[]
  loading: boolean
  error: string | null
}

interface ApiErrorResponse {
  message?: string
}

interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  meta?: {
    total: number
    per_page: number
    current_page: number
    last_page: number
    from?: number | null
    to?: number | null
  }
}

export const useFollowupStore = defineStore('followup', {
  state: (): FollowupState => ({
    followups: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchFollowups(params: Record<string, unknown> = {}): Promise<void> {
      this.loading = true
      this.error = null
      try {
        const res = await api.get<PaginatedResponse<Followup>>('/tutor/followups', {
          params,
        })
        this.followups = res.data.data ?? []
      } catch (err) {
        const axiosErr = err as AxiosError<ApiErrorResponse>
        this.error = axiosErr.response?.data?.message ?? 'Failed to load follow-ups'
      } finally {
        this.loading = false
      }
    },

    async createFollowup(payload: FollowupPayload): Promise<Followup> {
      this.error = null
      try {
        const res = await api.post<{ data: Followup }>('/tutor/followups', payload)
        const created = res.data.data ?? (res.data as unknown as Followup)
        this.followups.unshift(created)
        return created
      } catch (err) {
        const axiosErr = err as AxiosError<ApiErrorResponse>
        this.error = axiosErr.response?.data?.message ?? 'Failed to create follow-up'
        throw err
      }
    },

    async updateFollowup(id: number, payload: FollowupPayload): Promise<Followup> {
      this.error = null
      try {
        const res = await api.put<{ data: Followup }>(`/tutor/followups/${id}`, payload)
        const updated = res.data.data ?? (res.data as unknown as Followup)
        const idx = this.followups.findIndex((f) => f.id === id)
        if (idx !== -1) this.followups[idx] = updated
        return updated
      } catch (err) {
        const axiosErr = err as AxiosError<ApiErrorResponse>
        this.error = axiosErr.response?.data?.message ?? 'Failed to update follow-up'
        throw err
      }
    },

    async deleteFollowup(id: number): Promise<void> {
      this.error = null
      try {
        await api.delete(`/tutor/followups/${id}`)
        this.followups = this.followups.filter((f) => f.id !== id)
      } catch (err) {
        const axiosErr = err as AxiosError<ApiErrorResponse>
        this.error = axiosErr.response?.data?.message ?? 'Failed to delete follow-up'
        throw err
      }
    },
  },
})
