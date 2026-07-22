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
  data: T[]
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
        const res = await api.get<PaginatedResponse<Followup> | Followup[]>('/tutor/followups', {
          params,
        })
        const payload = res.data
        this.followups = Array.isArray(payload) ? payload : payload.data
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
        const res = await api.post<Followup>('/tutor/followups', payload)
        this.followups.unshift(res.data)
        return res.data
      } catch (err) {
        const axiosErr = err as AxiosError<ApiErrorResponse>
        this.error = axiosErr.response?.data?.message ?? 'Failed to create follow-up'
        throw err
      }
    },

    async updateFollowup(id: number, payload: FollowupPayload): Promise<Followup> {
      this.error = null
      try {
        const res = await api.put<Followup>(`/tutor/followups/${id}`, payload)
        const idx = this.followups.findIndex((f) => f.id === id)
        if (idx !== -1) this.followups[idx] = res.data
        return res.data
      } catch (err) {
        const axiosErr = err as AxiosError<ApiErrorResponse>
        this.error = axiosErr.response?.data?.message ?? 'Failed to update follow-up'
        throw err
      }
    },

    async deleteFollowup(id: number): Promise<void> {
      this.error = null
      try {
        await api.delete(`/followups/${id}`)
        this.followups = this.followups.filter((f) => f.id !== id)
      } catch (err) {
        const axiosErr = err as AxiosError<ApiErrorResponse>
        this.error = axiosErr.response?.data?.message ?? 'Failed to delete follow-up'
        throw err
      }
    },
  },
})
