import { defineStore } from 'pinia'
import { ref } from 'vue'
import { worklogService } from '@/services/worklogService'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _worklogService: any = worklogService

import type { Worklog, WorklogFilters } from '@/types/worklog'
import { parseApiError } from '@/utils/errorParser'

export const useWorklogStore = defineStore('worklog', () => {
  const worklogs = ref<Worklog[]>([])
  const worklog = ref<Worklog | null>(null)
  const loading = ref(false)
  const errors = ref<Record<string, string>>({})
  const pagination = ref<any>(null)

  async function fetchWorklogs(filters: WorklogFilters = {}) {
    loading.value = true
    errors.value = {}
    try {
      const res = await _worklogService.getWorklogs({

        page: filters.page,
        status: filters.status,
        week: filters.week,
      })

      // Expected shapes (adjust if backend differs)
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
      const res = await _worklogService.getWorklog(id)

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
      const res = await _worklogService.createWorklog(data)

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

  async function updateWorklog(id: number, data?: FormData, reviewPayload?: any): Promise<Worklog> {
    loading.value = true
    errors.value = {}
    try {
      if (reviewPayload) {
        // If backend uses same endpoint for tutor review, send JSON instead.
        const res = await (worklogService as any).updateWorklog(id, data ?? undefined, reviewPayload)
        const updated: Worklog = res.data ?? res
        if (worklog.value?.id === id) worklog.value = updated
        worklogs.value = worklogs.value.map((w) => (w.id === id ? updated : w))
        return updated
      }

      const res = await _worklogService.updateWorklog(id, data!)

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
      await _worklogService.deleteWorklog(id)

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

  function clearErrors() {
    errors.value = {}
  }

  function reset() {
    worklogs.value = []
    worklog.value = null
    loading.value = false
    errors.value = {}
    pagination.value = null
  }

  return {
    worklogs,
    worklog,
    loading,
    errors,
    pagination,
    fetchWorklogs,
    fetchWorklog,
    createWorklog,
    updateWorklog,
    deleteWorklog,
    clearErrors,
    reset,
    // convenience
    get error() {
      return (errors.value as any)?.message ?? ''
    },
  }
})

