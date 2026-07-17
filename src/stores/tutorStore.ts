import { defineStore } from 'pinia'
import api from '@/services/api'
import type { TutorWorkload } from '@/types/user'
import { parseApiError } from '@/utils/errorParser'

export interface TutorOption {
  value: number
  label: string
}

export interface TutorState {
  tutors: TutorWorkload[]
  loading: boolean
  error: string | null
  loaded: boolean
}

interface PaginatedResponse<T> {
  data: T[]
}

export const useTutorStore = defineStore('tutor', {
  state: (): TutorState => ({
    tutors: [],
    loading: false,
    error: null,
    loaded: false,
  }),

  getters: {
    tutorOptions: (state): TutorOption[] =>
      state.tutors.map((t) => ({ value: t.id, label: t.name })),
    workload: (state): TutorWorkload[] => state.tutors,
    workloadLoading: (state): boolean => state.loading,
    workloadError: (state): string | null => state.error,
  },

  actions: {
    async fetchTutors(force: boolean = false): Promise<void> {
      if (this.loaded && !force) return

      this.loading = true
      this.error = null

      try {
        const res = await api.get<PaginatedResponse<TutorWorkload> | TutorWorkload[]>(
          '/admin/users',
          {
            params: { role: 'tutor' },
          },
        )

        const payload = res.data
        this.tutors = Array.isArray(payload) ? payload : payload.data

        this.loaded = true
      } catch (err) {
        const parsed = parseApiError(err)
        this.error = parsed.message
      } finally {
        this.loading = false
      }
    },

    async fetchWorkload(force: boolean = false): Promise<void> {
      await this.fetchTutors(force)
    },

    async deleteTutor(id: number): Promise<void> {
      this.loading = true
      this.error = null

      try {
        await api.delete(`/admin/users/${id}`)
        this.tutors = this.tutors.filter((t) => t.id !== id)
      } catch (err) {
        const parsed = parseApiError(err)
        this.error = parsed.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async createTutor(payload: { name: string; email: string; password: string }): Promise<void> {
      this.loading = true
      this.error = null

      try {
        await api.post('/admin/users', { ...payload, role: 'tutor' })
        await this.fetchTutors(true)
      } catch (err) {
        const parsed = parseApiError(err)
        this.error = parsed.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateTutor(id: number, payload: { name: string; email: string; password?: string }): Promise<void> {
      this.loading = true
      this.error = null

      try {
        await api.put(`/admin/users/${id}`, { ...payload, role: 'tutor' })
        await this.fetchTutors(true)
      } catch (err) {
        const parsed = parseApiError(err)
        this.error = parsed.message
        throw err
      } finally {
        this.loading = false
      }
    },

    clearError(): void {
      this.error = null
    },
  },
})
