import { defineStore } from 'pinia'
import { tutorService } from '@/services/tutor'
import { parseApiError } from '@/utils/errorParser'
import type { TutorWorkload, TutorOption } from '@/types/user'
import type { Student } from '@/types/student'

export interface TutorState {
  tutors: Student[]
  students: Student[]
  loading: boolean
  error: string | null
  loaded: boolean
}

export const useTutorStore = defineStore('tutor', {
  state: (): TutorState => ({
    tutors: [],
    students: [],
    loading: false,
    error: null,
    loaded: false,
  }),

  getters: {
    tutorOptions: (state): TutorOption[] =>
      state.tutors.map((t) => ({ value: t.id, label: t.name })),
    workload: (state): TutorWorkload[] =>
      state.tutors.map((t) => ({
        id: t.id,
        name: t.name,
        email: t.email,
        students_count: state.students.filter((s) => s.tutor_id === t.id).length,
      })),
    workloadLoading: (state): boolean => state.loading,
    workloadError: (state): string | null => state.error,
  },

  actions: {
    async fetchTutors(params?: { search?: string }, force: boolean = false): Promise<void> {
      if (this.loaded && !force && !params?.search) return

      this.loading = true
      this.error = null

      try {
        const res = await tutorService.list({
          search: params?.search,
          per_page: 100,
        })
        this.tutors = res.data
        this.loaded = true
      } catch (err) {
        const parsed = parseApiError(err)
        if (parsed.message) {
          this.error = parsed.message
        }
      } finally {
        this.loading = false
      }
    },

    async fetchWorkload(force: boolean = false): Promise<void> {
      await this.fetchTutors({}, force)
    },

    async createTutor(data: { first_name: string; last_name: string; email: string; password?: string }): Promise<Student> {
      this.loading = true
      this.error = null

      try {
        const tutor = await tutorService.create(data)
        this.tutors.unshift(tutor)
        return tutor
      } catch (err) {
        const parsed = parseApiError(err)
        this.error = parsed.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateTutor(
      id: number,
      data: Partial<{ first_name: string; last_name: string; email: string }>,
    ): Promise<Student> {
      this.loading = true
      this.error = null

      try {
        const updated = await tutorService.update(id, data)
        const index = this.tutors.findIndex((t) => t.id === id)
        if (index !== -1) {
          this.tutors[index] = updated
        }
        return updated
      } catch (err) {
        const parsed = parseApiError(err)
        this.error = parsed.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteTutor(id: number): Promise<void> {
      this.loading = true
      this.error = null

      try {
        await tutorService.delete(id)
        this.tutors = this.tutors.filter((t) => t.id !== id)
        this.students = this.students.filter((s) => s.tutor_id !== id)
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

    reset(): void {
      this.tutors = []
      this.students = []
      this.loading = false
      this.error = null
      this.loaded = false
    },
  },
})
