import { defineStore } from 'pinia'
import { ref } from 'vue'
import { worklogService } from '@/services/worklogService.ts'
import type { Worklog, WorklogStatus, WorklogFilters } from '@/types/worklog'
import { parseApiError } from '@/utils/errorParser'

export const useWorklogStore = defineStore('worklog', () => {
  const worklogs = ref<Worklog[]>([])
  const worklog = ref<Worklog | null>(null)
  const tutorWorklogs = ref<Worklog[]>([])
  const tutorWorklog = ref<Worklog | null>(null)
  const pagination = ref<{
    current_page: number
    last_page: number
    per_page: number
    total: number
    from?: number
    to?: number
    path?: string
  } | null>(null)
  const tutorPagination = ref<{
    current_page: number
    last_page: number
    per_page: number
    total: number
    from?: number
    to?: number
    path?: string
  } | null>(null)
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

      const data = res.data ?? []
      worklogs.value = Array.isArray(data) ? data : []
      pagination.value = res.meta?.pagination ?? null
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
      const w = res as Worklog
      worklog.value = w
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      errors.value = parsed.fields ?? {}
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createWorklog(data: FormData) {
    loading.value = true
    errors.value = {}
    try {
      const res = await worklogService.createWorklog(data)
      const created = res as Worklog
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

  async function updateWorklog(
    id: number,
    data?: FormData | Record<string, unknown>,
    extra?: Record<string, unknown>,
  ) {
    loading.value = true
    errors.value = {}
    try {
      const payload: FormData | Record<string, unknown> = extra
        ? data instanceof FormData
          ? data
          : { ...(data as Record<string, unknown> | undefined), ...extra }
        : (data ?? new FormData())
      const updated = await worklogService.updateWorklog(id, payload)
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

  async function fetchTutorWorklogs(filters: WorklogFilters = {}) {
    loading.value = true
    errors.value = {}
    try {
      const res = await worklogService.getTutorWorklogs({
        student_id: filters.student_id,
        status: filters.status,
        page: filters.page,
        week: filters.week,
      })

      const data = res.data ?? []
      tutorWorklogs.value = Array.isArray(data) ? data : []
      tutorPagination.value = res.meta?.pagination ?? null
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
      const w = res as Worklog
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
    data: { status: WorklogStatus; feedback: string },
  ): Promise<Worklog> {
    loading.value = true
    errors.value = {}
    try {
      const res = await worklogService.reviewWorklog(id, {
        status: data.status,
        feedback: data.feedback,
      })

      const updated = res as Worklog

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
    worklogs,
    worklog,
    pagination,
    tutorWorklogs,
    tutorWorklog,
    tutorPagination,
    loading,
    errors,
    fetchWorklogs,
    fetchWorklog,
    createWorklog,
    updateWorklog,
    deleteWorklog,
    fetchTutorWorklogs,
    fetchTutorWorklog,
    reviewWorklog,
    clearErrors,
    reset,

    get error() {
      return (errors.value as Record<string, unknown> | null)?.message ?? ''
    },
  }
})
