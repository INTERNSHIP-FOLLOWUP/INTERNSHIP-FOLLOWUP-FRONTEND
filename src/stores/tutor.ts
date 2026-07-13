import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import { parseApiError } from '@/utils/errorParser'
import type { Tutor } from '@/types/student'

export const useTutorStore = defineStore('tutor', () => {
  const tutors = ref<Tutor[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  async function fetchTutors(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<Tutor[]>('/admin/tutors')
      tutors.value = response.data
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
    } finally {
      loading.value = false
    }
  }
  return { tutors, loading, error, fetchTutors }
})
