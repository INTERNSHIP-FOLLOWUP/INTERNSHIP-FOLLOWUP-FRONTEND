import { defineStore } from 'pinia'
import { ref } from 'vue'
import { followupService } from '@/services/followup'
import { parseApiError } from '@/utils/errorParser'
import type { Followup, FollowupPayload } from '@/types/followup'

export const useFollowupStore = defineStore('followup', () => {
  const followups = ref<Followup[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchFollowups(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      followups.value = await followupService.list()
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createFollowup(payload: FollowupPayload): Promise<Followup> {
    error.value = null
    try {
      const created = await followupService.create({ ...payload })
      followups.value.unshift(created)
      return created
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    }
  }

  async function updateFollowup(
    id: number,
    payload: FollowupPayload,
  ): Promise<Followup> {
    error.value = null
    try {
      const updated = await followupService.update(id, payload)
      const index = followups.value.findIndex((f) => f.id === id)
      if (index !== -1) {
        followups.value[index] = updated
      }
      return updated
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    }
  }

  async function removeFollowup(id: number): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await followupService.delete(id)
      followups.value = followups.value.filter((f) => f.id !== id)
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError(): void {
    error.value = null
  }

  function reset(): void {
    followups.value = []
    loading.value = false
    error.value = null
  }

  return {
    followups,
    loading,
    error,
    fetchFollowups,
    createFollowup,
    updateFollowup,
    removeFollowup,
    clearError,
    reset,
  }
})
