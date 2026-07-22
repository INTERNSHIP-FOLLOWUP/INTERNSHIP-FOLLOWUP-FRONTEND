import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tutorStudentService } from '@/services/tutorDashboard'
import { useToastStore } from '@/stores/toast'
import type { TutorStudent, TutorStudentDetail } from '@/types/tutorStudent'

export const useTutorStudentStore = defineStore('tutorStudent', () => {
  const students = ref<TutorStudent[]>([])
  const selectedStudent = ref<TutorStudentDetail | null>(null)
  const loading = ref(false)
  const loadingDetail = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    total: 0,
    per_page: 15,
    current_page: 1,
    last_page: 1,
    from: null as number | null,
    to: null as number | null,
  })

  const totalCount = computed(() => students.value.length)
  const isEmpty = computed(() => !loading.value && students.value.length === 0)

  async function fetchStudents(params?: {
    search?: string
    status?: string
    batch_id?: number
    has_open_issue?: boolean
    per_page?: number
    page?: number
  }): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const response = await tutorStudentService.list({
        per_page: params?.per_page ?? 15,
        page: params?.page ?? 1,
        search: params?.search,
        status: params?.status,
        batch_id: params?.batch_id,
        has_open_issue: params?.has_open_issue,
      })
      const payload = (response as any)?.data ?? response
      students.value = Array.isArray(payload) ? payload : []
      pagination.value = {
        total: response.meta.total,
        per_page: response.meta.per_page,
        current_page: response.meta.current_page,
        last_page: response.meta.last_page,
        from: response.meta.from,
        to: response.meta.to,
      }
    } catch (err: unknown) {
      const parsed = err as { message?: string }
      error.value = parsed?.message || 'Failed to load students.'
      useToastStore().error(error.value, 'Students')
    } finally {
      loading.value = false
    }
  }

  async function fetchStudent(id: number): Promise<TutorStudentDetail | null> {
    loadingDetail.value = true
    error.value = null
    try {
      const response = await tutorStudentService.get(id)
      selectedStudent.value = response.data
      return response.data
    } catch (err: unknown) {
      const parsed = err as { message?: string }
      error.value = parsed?.message || 'Failed to load student details.'
      useToastStore().error(error.value, 'Student Details')
      return null
    } finally {
      loadingDetail.value = false
    }
  }

  async function updateStudentStatus(id: number, status: string): Promise<TutorStudent | null> {
    loadingDetail.value = true
    error.value = null
    try {
      const response = await tutorStudentService.updateStatus(id, status)
      const student = response.data.student as TutorStudent

      // Update in list cache if present.
      const index = students.value.findIndex((s) => s.id === id)
      if (index !== -1) {
        students.value[index] = student
      }

      if (selectedStudent.value?.id === id) {
        selectedStudent.value = { ...selectedStudent.value, ...student }
      }

      useToastStore().success('Student status updated.', 'Success')
      return student
    } catch (err: unknown) {
      const parsed = err as { message?: string }
      error.value = parsed?.message || 'Failed to update status.'
      useToastStore().error(error.value, 'Update Status')
      return null
    } finally {
      loadingDetail.value = false
    }
  }

  function clearSelection(): void {
    selectedStudent.value = null
  }

  return {
    students,
    selectedStudent,
    loading,
    loadingDetail,
    error,
    pagination,
    totalCount,
    isEmpty,
    fetchStudents,
    fetchStudent,
    updateStudentStatus,
    clearSelection,
  }
})
