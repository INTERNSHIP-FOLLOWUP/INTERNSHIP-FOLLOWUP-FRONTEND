import { defineStore } from 'pinia'
import api from '@/services/api'
import type { User } from '@/types/auth'
import { parseApiError } from '@/utils/errorParser'

export interface TutorOption {
  value: number
  label: string
}

export interface TutorState {
  tutors: User[]
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
      state.tutors.map(t => ({ value: t.id, label: t.name })),
  },

  actions: {
    async fetchTutors(force: boolean = false): Promise<void> {
      if (this.loaded && !force) return

      this.loading = true
      this.error = null

      try {
        const res = await api.get<PaginatedResponse<User> | User[]>('/users', {
          params: { role: 'Tutor' },
        })

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
  },
})
