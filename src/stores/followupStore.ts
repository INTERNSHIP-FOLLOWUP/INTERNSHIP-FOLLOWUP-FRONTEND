import { defineStore } from 'pinia'
import api from '@/services/api'
import type { Followup } from '@/types/followup'
import type { AxiosError } from 'axios'

interface FollowupState {
  followups: Followup[]
  loading: boolean
  error: string | null
  posting: boolean
  postError: string | null
}

interface PaginatedResponse<T> {
  data: T[]
}

export const useFollowupStore = defineStore('followup', {
  state: (): FollowupState => ({
    followups: [],
    loading: false,
    error: null,
    posting: false,
    postError: null,
  }),

  actions: {
    async fetchFollowups(): Promise<void> {
      this.loading = true
      this.error = null
      try {
        const res = await api.get<PaginatedResponse<Followup> | Followup[]>('/followups')
        const payload = res.data
        this.followups = Array.isArray(payload) ? payload : payload.data
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>
        this.error = axiosErr.response?.data?.message ?? 'Failed to load follow-ups'
      } finally {
        this.loading = false
      }
    },

    async createFollowup(payload: Partial<Followup>): Promise<Followup> {
      this.posting = true
      this.postError = null
      try {
        const res = await api.post<Followup>('/followups', payload)
        this.followups.push(res.data)
        return res.data
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>
        this.postError = axiosErr.response?.data?.message ?? 'Failed to create follow-up'
        throw err
      } finally {
        this.posting = false
      }
    },
  },
})
