import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import { parseApiError } from '@/utils/errorParser'
import type { Batch } from '@/types/student'

export const useBatchStore = defineStore('batch', () => {
  const batches = ref<Batch[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  async function fetchBatches(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<Batch[]>('/admin/batches')
      batches.value = response.data
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
    } finally {
      loading.value = false
    }
  }
  return { batches, loading, error, fetchBatches }
})
