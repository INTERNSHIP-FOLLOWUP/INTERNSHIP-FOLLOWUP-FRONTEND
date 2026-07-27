/**
 * Pinia store for the Tutor → My Students feature.
 * Uses Composition API (setup store).
 *
 * Manages the student list, pagination, filters,
 * and computes dashboard summary stats from the data.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tutorMyStudentsService } from '@/services/tutorMyStudents'
import { parseApiError } from '@/utils/errorParser'
import { useToastStore } from '@/stores/toast'
import type {
  TutorMyStudent,
  TutorStudentSummary,
  PaginationMeta,
} from '@/types/tutorMyStudents'

export const useTutorMyStudentsStore = defineStore('tutorMyStudents', () => {
  // ── State ──
  const students = ref<TutorMyStudent[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: null,
    to: null,
  })

  // ── Active filter state (syncs with the view) ──
  const searchQuery = ref('')
  const statusFilter = ref('')
  const companyFilter = ref<number | undefined>(undefined)

  // ── Computed: Dashboard Summary Cards ──
  const summary = computed<TutorStudentSummary>(() => {
    const list = students.value
    return {
      totalStudents: list.length,
      activeStudents: list.filter(
        (s) =>
          s.assignment_status === 'In Progress' || s.assignment_status === 'Assigned',
      ).length,
      studentsWithIssues: list.filter((s) => (s.open_issues_count ?? 0) > 0).length,
      pendingFollowups: list.filter(
        (s) =>
          s.next_followup &&
          (s.next_followup.status === 'pending' || s.next_followup.status === 'scheduled'),
      ).length,
    }
  })

  const totalCount = computed(() => pagination.value.total)
  const isEmpty = computed(() => !loading.value && students.value.length === 0)

  // ── Actions ──

  /**
   * Fetch the tutor's assigned students from the API.
   * Accepts optional query overrides (merged with current filter state).
   */
  async function fetchStudents(overrides?: {
    search?: string
    status?: string
    company_id?: number
    page?: number
    per_page?: number
  }): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const params = {
        search: overrides?.search ?? (searchQuery.value || undefined),
        status: overrides?.status ?? (statusFilter.value || undefined),
        company_id: overrides?.company_id ?? (companyFilter.value || undefined),
        page: overrides?.page ?? pagination.value.current_page,
        per_page: overrides?.per_page ?? pagination.value.per_page,
      }

      const response = await tutorMyStudentsService.list(params)
      students.value = response.data
      pagination.value = response.meta
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message || 'Failed to load students.'
      useToastStore().error(error.value, 'Students')
    } finally {
      loading.value = false
    }
  }

  /** Go to a specific page */
  async function goToPage(page: number): Promise<void> {
    if (page < 1 || page > pagination.value.last_page) return
    await fetchStudents({ page })
  }

  /** Apply current filter state and reload */
  async function applyFilters(): Promise<void> {
    pagination.value.current_page = 1
    await fetchStudents({ page: 1 })
  }

  /** Clear all filters and reload */
  async function resetFilters(): Promise<void> {
    searchQuery.value = ''
    statusFilter.value = ''
    companyFilter.value = undefined
    pagination.value.current_page = 1
    await fetchStudents({ page: 1 })
  }

  /** Clear error state */
  function clearError(): void {
    error.value = null
  }

  return {
    // State
    students,
    loading,
    error,
    pagination,
    searchQuery,
    statusFilter,
    companyFilter,

    // Computed
    summary,
    totalCount,
    isEmpty,

    // Actions
    fetchStudents,
    goToPage,
    applyFilters,
    resetFilters,
    clearError,
  }
})
