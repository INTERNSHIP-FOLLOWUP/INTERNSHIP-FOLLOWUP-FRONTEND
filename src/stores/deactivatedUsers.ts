import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { parseApiError } from '@/utils/errorParser'

// ── Types ──────────────────────────────────────────────────────

interface Role {
  id: number
  name: string
}

export interface DeactivatedUser {
  id: number
  name: string
  email: string
  first_name?: string
  last_name?: string
  role: Role | null
  status?: string
  deleted_at: string | null
  avatar_url?: string | null
  avatar?: string | null
  photo_url?: string | null
  photo?: string | null
  students_count?: number
}

export interface DeactivatedPaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

export interface DeactivatedUsersFilters {
  search?: string
  role?: string
  page?: number
  per_page?: number
}

interface FetchResponse {
  data: DeactivatedUser[]
  meta?: DeactivatedPaginationMeta
}

// ── Store ──────────────────────────────────────────────────────

export const useDeactivatedUsersStore = defineStore('deactivatedUsers', () => {
  // ── State ──
  const users = ref<DeactivatedUser[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<DeactivatedPaginationMeta | null>(null)

  // ── Getters ──
  const totalDeactivated = computed(() => pagination.value?.total ?? users.value.length)
  const hasMore = computed(
    () => !!pagination.value && pagination.value.current_page < pagination.value.last_page,
  )
  const currentPage = computed(() => pagination.value?.current_page ?? 1)
  const lastPage = computed(() => pagination.value?.last_page ?? 1)

  // ── Actions ──

  /**
   * Fetch a paginated list of deactivated users.
   * Supports optional search and role filters.
   */
  async function fetchDeactivated(filters: DeactivatedUsersFilters = {}): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const params: Record<string, string | number> = {
        status: 'deactivated',
        page: filters.page ?? 1,
        per_page: filters.per_page ?? 15,
      }
      if (filters.search) params.search = filters.search
      if (filters.role) params.role = filters.role

      const res = await api.get<FetchResponse>('/admin/users', { params })
      const body = res.data

      users.value = body.data ?? []
      pagination.value = body.meta ?? null
    } catch (err: unknown) {
      if ((err as { cancelled?: boolean })?.cancelled) return
      const parsed = parseApiError(err)
      error.value = parsed.message || 'Failed to load deactivated users.'
    } finally {
      loading.value = false
    }
  }

  /**
   * Reactivate a user by ID.
   * Removes them from the local list on success.
   */
  async function reactivateUser(userId: number): Promise<void> {
    loading.value = true
    error.value = null

    try {
      await api.put(`/admin/users/${userId}/activate`)
      users.value = users.value.filter((u) => u.id !== userId)
      if (pagination.value && pagination.value.total > 0) {
        pagination.value = { ...pagination.value, total: pagination.value.total - 1 }
      }
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Deactivate a user by ID.
   * Removes them from the local list on success.
   */
  async function deactivateUser(userId: number): Promise<void> {
    loading.value = true
    error.value = null

    try {
      await api.put(`/admin/users/${userId}/deactivate`)
      users.value = users.value.filter((u) => u.id !== userId)
      if (pagination.value && pagination.value.total > 0) {
        pagination.value = { ...pagination.value, total: pagination.value.total - 1 }
      }
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Go to a specific page number.
   */
  async function goToPage(page: number, filters?: DeactivatedUsersFilters): Promise<void> {
    if (page < 1 || (pagination.value && page > pagination.value.last_page)) return
    await fetchDeactivated({ ...filters, page })
  }

  /**
   * Clear any stored error.
   */
  function clearError(): void {
    error.value = null
  }

  /**
   * Reset the entire store state.
   */
  function reset(): void {
    users.value = []
    loading.value = false
    error.value = null
    pagination.value = null
  }

  return {
    // State
    users,
    loading,
    error,
    pagination,
    // Getters
    totalDeactivated,
    hasMore,
    currentPage,
    lastPage,
    // Actions
    fetchDeactivated,
    reactivateUser,
    deactivateUser,
    goToPage,
    clearError,
    reset,
  }
})
