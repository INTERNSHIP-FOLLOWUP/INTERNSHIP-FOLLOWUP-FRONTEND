// src/stores/followupStore.ts
import { defineStore } from 'pinia'
import { followupService } from '@/services/followupService'
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
        this.followups = await followupService.getAll(params)
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
        const followup = await followupService.create(payload)
        this.followups.unshift(followup)
        return followup
      } catch (err) {
        const axiosErr = err as AxiosError<ApiErrorResponse>
        this.error = axiosErr.response?.data?.message ?? 'Failed to create follow-up'
        throw err
      }
    },

    async updateFollowup(id: number, payload: FollowupPayload): Promise<Followup> {
      this.error = null
      try {
        const followup = await followupService.update(id, payload)
        const idx = this.followups.findIndex((f) => f.id === id)
        if (idx !== -1) this.followups[idx] = followup
        return followup
      } catch (err) {
        const axiosErr = err as AxiosError<ApiErrorResponse>
        this.error = axiosErr.response?.data?.message ?? 'Failed to update follow-up'
        throw err
      }
    },
  },
})
