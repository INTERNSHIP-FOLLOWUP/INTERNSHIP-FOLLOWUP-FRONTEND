import { defineStore } from 'pinia'
import { ref } from 'vue'
import { worklogService } from '@/services/worklogService'

import type { TutorReview, Worklog, WorklogFilters } from '@/types/worklog'
import { parseApiError } from '@/utils/errorParser'

export const useWorklogStore = defineStore('worklog', () => {
  // ── Student state ───────────────────────────────────
  const worklogs = ref<Worklog[]>([])
  const worklog = ref<Worklog | null>(null)
  const pagination = ref<any>(null)

  // ── Tutor state ──────────────────────────────────────
  const tutorWorklogs = ref<Worklog[]>([])
  const tutorWorklog = ref<Worklog | null>(null)
  const tutorPagination = ref<any>(null)

  // ── Shared state ────────────────────────────────────
  const loading = ref(false)
  const errors = ref<Record<string, string>>({})

  async function fetchWorklogs(filters: WorklogFilters = {}) {
    loading.value = true
    errors.value = {}
    try {
      const res = await worklogService.getWorklogs({
        page: filters.page,
        status: filters.status,
        week: filters.week,
      })

      const data = res.data?.data ?? res.data ?? []
      worklogs.value = Array.isArray(data) ? data : []
      pagination.value = res.data?.meta?.pagination ?? res.data?.meta ?? null
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      errors.value = parsed.fields ?? {}
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchWorklog(id: number) {
    loading.value = true
    errors.value = {}
    try {
      const res = await worklogService.getWorklog(id)
      const w: Worklog = res.data ?? res
      worklog.value = w
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      errors.value = parsed.fields ?? {}
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createWorklog(data: FormData): Promise<Worklog> {
    loading.value = true
    errors.value = {}
    try {
      const res = await worklogService.createWorklog(data)
      const created: Worklog = res.data ?? res
      worklogs.value = [created, ...worklogs.value]
      return created
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      errors.value = parsed.fields ?? {}
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateWorklog(id: number, data?: FormData): Promise<Worklog> {
    loading.value = true
    errors.value = {}
    try {
      const res = await worklogService.updateWorklog(id, data!)
      const updated: Worklog = res.data ?? res
      if (worklog.value?.id === id) worklog.value = updated
      worklogs.value = worklogs.value.map((w) => (w.id === id ? updated : w))
      return updated
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      errors.value = parsed.fields ?? {}
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteWorklog(id: number) {
    loading.value = true
    errors.value = {}
    try {
      await worklogService.deleteWorklog(id)
      worklogs.value = worklogs.value.filter((w) => w.id !== id)
      if (worklog.value?.id === id) worklog.value = null
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      errors.value = parsed.fields ?? {}
      throw err
    } finally {
      loading.value = false
    }
  }

  // ── Tutor actions ───────────────────────────────────

  async function fetchTutorWorklogs(filters: {
    student_id?: number
    status?: WorklogFilters['status']
    page?: number
  } = {}) {

    loading.value = true
    errors.value = {}
    try {
      const res = await worklogService.getTutorWorklogs({
        student_id: filters.student_id,
        status: filters.status,
        page: filters.page,
      })

      const data = res.data?.data ?? res.data ?? []
      tutorWorklogs.value = Array.isArray(data) ? data : []
      tutorPagination.value = res.data?.meta?.pagination ?? res.data?.meta ?? null
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      errors.value = parsed.fields ?? {}
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchTutorWorklog(id: number) {
    loading.value = true
    errors.value = {}
    try {
      const res = await worklogService.getTutorWorklog(id)
      const w: Worklog = res.data ?? res
      tutorWorklog.value = w
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      errors.value = parsed.fields ?? {}
      throw err
    } finally {
      loading.value = false
    }
  }

  async function reviewWorklog(
    id: number,
    data: { status: 'Reviewed'; feedback: string },
  ): Promise<Worklog> {
    loading.value = true
    errors.value = {}
    try {
      const res = await worklogService.reviewWorklog(id, {
        status: data.status,
        feedback: data.feedback,
      })

      const updated: Worklog = res.data ?? res

      if (tutorWorklog.value?.id === id) tutorWorklog.value = updated
      tutorWorklogs.value = tutorWorklogs.value.map((w) => (w.id === id ? updated : w))

      return updated
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      errors.value = parsed.fields ?? {}
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearErrors() {
    errors.value = {}
  }

  function reset() {
    worklogs.value = []
    worklog.value = null
    tutorWorklogs.value = []
    tutorWorklog.value = null
    loading.value = false
    errors.value = {}
    pagination.value = null
    tutorPagination.value = null
  }

  return {
    // state
    worklogs,
    worklog,
    pagination,
    tutorWorklogs,
    tutorWorklog,
    tutorPagination,
    loading,
    errors,

    // student actions
    fetchWorklogs,
    fetchWorklog,
    createWorklog,
    updateWorklog,
    deleteWorklog,

    // tutor actions
    fetchTutorWorklogs,
    fetchTutorWorklog,
    reviewWorklog,

    clearErrors,
    reset,

    // convenience
    get error() {
      return (errors.value as any)?.message ?? ''
    },
  }
})

