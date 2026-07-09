import { defineStore } from 'pinia'
import api from '@/services/api'

interface Batch {
  id: number | string
  [key: string]: unknown
}

export const useBatchStore = defineStore('batch', {
  state: () => ({
    batches: [] as Batch[],
    currentBatch: null as Batch | null,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchBatches(params: Record<string, unknown> = {}) {
      this.loading = true
      this.error = null
      try {
        const res = await api.get('/batches', { params })
        this.batches = res.data.data ?? res.data
      } catch (err: unknown) {
        this.error = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load batches'
      } finally {
        this.loading = false
      }
    },
    async createBatch(payload: Record<string, unknown>) {
      const res = await api.post('/batches', payload)
      this.batches.push(res.data)
      return res.data
    },
    async updateBatch(id: number | string, payload: Record<string, unknown>) {
      const res = await api.put(`/batches/${id}`, payload)
      const idx = this.batches.findIndex(b => b.id === id)
      if (idx !== -1) this.batches[idx] = res.data
      return res.data
    },
    async fetchBatch(id: number | string) {
      this.loading = true
      this.error = null
      try {
        const res = await api.get(`/batches/${id}`)
        this.currentBatch = res.data.data ?? res.data
        return this.currentBatch
      } catch (err: unknown) {
        this.error = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load batch'
        return null
      } finally {
        this.loading = false
      }
    },
    setCurrentBatch(batch: Batch | null) {
      this.currentBatch = batch
    },
    async deleteBatch(id: number | string) {
      await api.delete(`/batches/${id}`)
      this.batches = this.batches.filter(b => b.id !== id)
    },
    resetState() {
      this.batches = []
      this.currentBatch = null
      this.loading = false
      this.error = null
    },
  },
})