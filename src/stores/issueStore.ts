import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { issueService } from '@/services/issueService'
import { useToastStore } from '@/stores/toast'
import type { Issue, IssueStats, IssueFilters, PaginationMeta, IssueForm } from '@/types/issue'

export const useIssueStore = defineStore('issue', () => {
  const perPage = 6

  const issues = ref<Issue[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const stats = ref<IssueStats | null>(null)
  const filters = ref<IssueFilters>({ search: '', status: '', priority: '' })
  const pagination = ref<PaginationMeta>({ page: 1, perPage, totalItems: 0, totalPages: 1 })

  const filteredIssues = computed(() => {
    const query = filters.value.search.trim().toLowerCase()
    return issues.value.filter((item) => {
      const searchOk = !query || item.title.toLowerCase().includes(query) || item.id.toLowerCase().includes(query)
      const statusOk = !filters.value.status || item.status === filters.value.status
      const priorityOk = !filters.value.priority || item.priority === filters.value.priority
      return searchOk && statusOk && priorityOk
    })
  })

  const paginatedIssues = computed(() => {
    return filteredIssues.value.slice((pagination.value.page - 1) * pagination.value.perPage, pagination.value.page * pagination.value.perPage)
  })

  const statsItems = computed(() => {
    if (!stats.value) {
      return [
        { label: 'Total Issues', value: 0, color: 'bg-[#2563EB]' },
        { label: 'Open Issues', value: 0, color: 'bg-[#F59E0B]' },
        { label: 'In Progress', value: 0, color: 'bg-[#7C3AED]' },
        { label: 'Resolved', value: 0, color: 'bg-[#22C55E]' },
      ]
    }
    return [
      { label: 'Total Issues', value: stats.value.total, color: 'bg-[#2563EB]' },
      { label: 'Open Issues', value: stats.value.open, color: 'bg-[#F59E0B]' },
      { label: 'In Progress', value: stats.value.inProgress, color: 'bg-[#7C3AED]' },
      { label: 'Resolved', value: stats.value.resolved, color: 'bg-[#22C55E]' },
    ]
  })

  const isEmpty = computed(() => !loading.value && issues.value.length === 0)

  async function fetchIssues(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const response = await issueService.getIssues(filters.value)
      issues.value = response.data || []
      pagination.value.totalItems = response.meta?.totalItems ?? (response.data?.length ?? 0)
      pagination.value.totalPages = response.meta?.totalPages ?? 1
    } catch (err: unknown) {
      const parsed = err as { message?: string }
      error.value = parsed?.message || 'Failed to load issues.'
      useToastStore().error(error.value, 'Load Issues Failed')
    } finally {
      loading.value = false
    }
  }

  async function fetchIssueStats(): Promise<void> {
    try {
      const data = await issueService.getIssueStats()
      stats.value = data
    } catch {
      // Keep stats as null; UI handles empty state.
    }
  }

  async function fetchIssueById(id: string): Promise<Issue | null> {
    try {
      const item = await issueService.getIssue(id)
      const found = issues.value.find((x) => x.id === id)
      if (found) {
        Object.assign(found, item)
      } else {
        issues.value.push(item)
      }
      return item
    } catch {
      return null
    }
  }

  async function createIssue(payload: { form: IssueForm }): Promise<Issue | null> {
    loading.value = true
    error.value = null
    try {
      const created = await issueService.createIssue(payload.form)
      issues.value.unshift(created)
      await fetchIssueStats()
      return created
    } catch (err: unknown) {
      const parsed = err as { message?: string }
      error.value = parsed?.message || 'Failed to create issue.'
      useToastStore().error(error.value, 'Create Issue Failed')
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateIssue(payload: { id: string; form: IssueForm }): Promise<Issue | null> {
    loading.value = true
    error.value = null
    try {
      const updated = await issueService.updateIssue(payload.id, payload.form)
      const found = issues.value.find((x) => x.id === payload.id)
      if (found) Object.assign(found, updated)
      await fetchIssueStats()
      return updated
    } catch (err: unknown) {
      const parsed = err as { message?: string }
      error.value = parsed?.message || 'Failed to update issue.'
      useToastStore().error(error.value, 'Update Issue Failed')
      return null
    } finally {
      loading.value = false
    }
  }

  async function assignIssue(id: string, userId: string | number): Promise<Issue | null> {
    loading.value = true
    error.value = null
    try {
      const updated = await issueService.assignIssue(id, userId)
      const found = issues.value.find((x) => x.id === id)
      if (found) Object.assign(found, updated)
      await fetchIssueStats()
      return updated
    } catch (err: unknown) {
      const parsed = err as { message?: string }
      error.value = parsed?.message || 'Failed to assign issue.'
      useToastStore().error(error.value, 'Assign Issue Failed')
      return null
    } finally {
      loading.value = false
    }
  }

  async function resolveIssue(id: string): Promise<Issue | null> {
    loading.value = true
    error.value = null
    try {
      const updated = await issueService.resolveIssue(id)
      const found = issues.value.find((x) => x.id === id)
      if (found) Object.assign(found, updated)
      await fetchIssueStats()
      return updated
    } catch (err: unknown) {
      const parsed = err as { message?: string }
      error.value = parsed?.message || 'Failed to resolve issue.'
      useToastStore().error(error.value, 'Resolve Issue Failed')
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteIssue(id: string): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      await issueService.deleteIssue(id)
      issues.value = issues.value.filter((x) => x.id !== id)
      await fetchIssueStats()
      return true
    } catch (err: unknown) {
      const parsed = err as { message?: string }
      error.value = parsed?.message || 'Failed to delete issue.'
      useToastStore().error(error.value, 'Delete Issue Failed')
      return false
    } finally {
      loading.value = false
    }
  }

  function setFilters(next: Partial<IssueFilters>): void {
    filters.value = { ...filters.value, ...next }
    pagination.value.page = 1
  }

  function resetFilters(): void {
    filters.value = { search: '', status: '', priority: '' }
    pagination.value.page = 1
  }

  function setPage(page: number): void {
    if (page >= 1 && page <= pagination.value.totalPages) {
      pagination.value.page = page
    }
  }

  return {
    issues,
    loading,
    error,
    stats,
    filters,
    pagination,
    filteredIssues,
    paginatedIssues,
    statsItems,
    isEmpty,
    fetchIssues,
    fetchIssueStats,
    fetchIssueById,
    createIssue,
    updateIssue,
    assignIssue,
    resolveIssue,
    setFilters,
    resetFilters,
    setPage,
    deleteIssue,
  }
})
