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
        const res = await api.get('/admin/batches', { params })
        this.batches = res.data.data ?? res.data
      } catch (err: unknown) {
        this.error =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Failed to load batches'
      } finally {
        this.loading = false
      }
    },
    async createBatch(payload: Record<string, unknown>) {
      this.loading = true
      this.error = null
      try {
        const res = await api.post('/admin/batches', payload)
        this.batches.push(res.data)
        return res.data
      } catch (err: unknown) {
        this.error =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Failed to create batch'
        throw err
      } finally {
        this.loading = false
      }
    },
    async updateBatch(id: number | string, payload: Record<string, unknown>) {
      this.loading = true
      this.error = null
      try {
        const res = await api.put(`/admin/batches/${id}`, payload)
        const idx = this.batches.findIndex((b) => b.id === id)
        if (idx !== -1) this.batches[idx] = res.data
        return res.data
      } catch (err: unknown) {
        this.error =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Failed to update batch'
        throw err
      } finally {
        this.loading = false
      }
    },
    async fetchBatch(id: number | string) {
      this.loading = true
      this.error = null
      try {
        const res = await api.get(`/admin/batches/${id}`)
        this.currentBatch = res.data.data ?? res.data
        return this.currentBatch
      } catch (err: unknown) {
        this.error =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Failed to load batch'
        return null
      } finally {
        this.loading = false
      }
    },
    setCurrentBatch(batch: Batch | null) {
      this.currentBatch = batch
    },
    async deleteBatch(id: number | string) {
      this.loading = true
      this.error = null
      try {
        await api.delete(`/admin/batches/${id}`)
        this.batches = this.batches.filter((b) => b.id !== id)
      } catch (err: unknown) {
        this.error =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Failed to delete batch'
        throw err
      } finally {
        this.loading = false
      }
    },
    resetState() {
      this.batches = []
      this.currentBatch = null
      this.loading = false
      this.error = null
    },
  },
})
