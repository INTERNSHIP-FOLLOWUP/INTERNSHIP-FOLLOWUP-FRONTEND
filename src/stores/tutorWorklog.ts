import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tutorWorklogService } from '@/services/tutorDashboard'
import { useToastStore } from '@/stores/toast'
import type { TutorWorklog } from '@/types/tutorWorklogs'

export const useTutorWorklogStore = defineStore('tutorWorklog', () => {
  const list = ref<TutorWorklog[]>([])
  const selected = ref<TutorWorklog | null>(null)
  const loading = ref(false)
  const loadingDetail = ref(false)
  const submitting = ref(false)
  const error = ref<string | null>(null)
  const meta = ref({
    total: 0,
    per_page: 15,
    current_page: 1,
    last_page: 1,
    from: null as number | null,
    to: null as number | null,
  })

  const isEmpty = computed(() => !loading.value && list.value.length === 0)

  async function fetchList(params?: {
    student_id?: number
    week?: number
    status?: string
    page?: number
    per_page?: number
  }): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const response = await tutorWorklogService.list({
        page: params?.page ?? 1,
        per_page: params?.per_page ?? 15,
        student_id: params?.student_id,
        week: params?.week,
        status: params?.status,
      })

      const data = Array.isArray((response as any).data)
        ? ((response as any).data as TutorWorklog[])
        : []
      list.value = data
      const pagination = (response as any).meta?.pagination
      if (pagination) {
        meta.value = {
          total: pagination.total,
          per_page: pagination.per_page,
          current_page: pagination.current_page,
          last_page: pagination.last_page,
          from: pagination.from ?? null,
          to: pagination.to ?? pagination.total,
        }
      }
    } catch (err: unknown) {
      const parsed = err as { message?: string }
      error.value = parsed?.message || 'Failed to load worklogs.'
      useToastStore().error(error.value, 'Worklogs')
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id: number): Promise<TutorWorklog | null> {
    loadingDetail.value = true
    error.value = null
    try {
      const response = await tutorWorklogService.get(id)
      selected.value = (response as any).data
      return (response as any).data
    } catch (err: unknown) {
      const parsed = err as { message?: string }
      error.value = parsed?.message || 'Failed to load worklog.'
      useToastStore().error(error.value, 'Worklog')
      return null
    } finally {
      loadingDetail.value = false
    }
  }

  async function submitReview(
    id: number,
    payload: { status: 'Pending' | 'Reviewed' | 'Approved' | 'Rejected'; feedback?: string },
  ): Promise<boolean> {
    submitting.value = true
    error.value = null
    try {
      const response = await tutorWorklogService.review(id, payload)
      const index = list.value.findIndex((w) => w.id === id)
      if (index !== -1) {
        list.value[index] = {
          ...list.value[index],
          ...(((response as any).data || {}) as Partial<TutorWorklog>),
        } as TutorWorklog
      }
      if (selected.value?.id === id) {
        selected.value = {
          ...selected.value,
          ...(((response as any).data || {}) as Partial<TutorWorklog>),
        } as TutorWorklog
      }
      useToastStore().success('Worklog reviewed.', 'Success')
      return true
    } catch (err: unknown) {
      const parsed = err as { message?: string }
      error.value = parsed?.message || 'Review failed.'
      useToastStore().error(error.value, 'Review')
      return false
    } finally {
      submitting.value = false
    }
  }

  function setPage(page: number): void {
    if (page >= 1 && page <= meta.value.last_page) {
      meta.value.current_page = page
    }
  }

  function clearSelection(): void {
    selected.value = null
  }

  return {
    list,
    selected,
    loading,
    loadingDetail,
    submitting,
    error,
    meta,
    isEmpty,
    fetchList,
    fetchOne,
    submitReview,
    setPage,
    clearSelection,
  }
})
