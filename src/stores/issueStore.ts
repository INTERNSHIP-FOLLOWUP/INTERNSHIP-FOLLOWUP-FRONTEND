import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { issueService } from '@/services/issueService'
import { useToastStore } from '@/stores/toast'
import type { AxiosError } from 'axios'
import type { Issue, IssueStats, IssueFilters, PaginationMeta, IssueForm, Attachment } from '@/types/issue'

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
      const searchOk =
        !query || item.title.toLowerCase().includes(query) || item.id.toLowerCase().includes(query)
      const statusOk = !filters.value.status || item.status === filters.value.status
      const priorityOk = !filters.value.priority || item.priority === filters.value.priority
      return searchOk && statusOk && priorityOk
    })
  })

  const paginatedIssues = computed(() => {
    return filteredIssues.value.slice(
      (pagination.value.page - 1) * pagination.value.perPage,
      pagination.value.page * pagination.value.perPage,
    )
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
      pagination.value.totalItems = response.meta?.totalItems ?? response.data?.length ?? 0
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
      // Backend does not expose issue stats on this build; leave panel in empty state.
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

  /**
   * Fetch a single issue via tutor-specific endpoint.
   * Returns the full issue with attachments, history etc.
   */
  async function fetchTutorIssueById(id: string): Promise<Issue | null> {
    try {
      const response = await issueService.getTutorIssue(id)
      const item = response.data
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
      const issue = created as Issue
      issues.value.unshift(issue)
      await fetchIssueStats()
      return issue
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
      const issue = updated as Issue
      const found = issues.value.find((x) => x.id === payload.id)
      if (found) Object.assign(found, issue)
      await fetchIssueStats()
      return issue
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string; errors?: Record<string, unknown> }>
      const backendErrors = axiosErr.response?.data?.errors
      if (backendErrors) {
        const messages = Object.entries(backendErrors)
          .map(([field, msgs]) => {
            const messageList = Array.isArray(msgs) ? msgs : [String(msgs ?? '')]
            return `${field}: ${messageList.join(', ')}`
          })
          .join('; ')
        error.value = messages || 'Failed to update issue.'
      } else {
        error.value = axiosErr.response?.data?.message || 'Failed to update issue.'
      }
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

  /**
   * Update an issue using the tutor-specific endpoint.
   * Sends PUT /api/tutor/issues/{id} with title, description, priority, status, student_id, assigned_user_id, due_date.
   */
  async function updateTutorIssue(payload: {
    id: string
    title: string
    description: string
    priority: string
    status: string
    student_id: string | number
    assigned_user_id?: string | number | null
    due_date?: string | null
  }): Promise<Issue | null> {
    loading.value = true
    error.value = null
    try {
      const response = await issueService.updateTutorIssue(payload.id, {
        title: payload.title,
        description: payload.description,
        priority: payload.priority,
        status: payload.status,
        student_id: payload.student_id,
        assigned_user_id: payload.assigned_user_id ?? null,
        due_date: payload.due_date ?? null,
      })
      const updatedIssue = response.data
      const found = issues.value.find((x) => x.id === payload.id)
      if (found) Object.assign(found, updatedIssue)
      await fetchIssueStats()
      useToastStore().success(response.message || 'Issue updated successfully.', 'Updated')
      return updatedIssue
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string; errors?: Record<string, unknown> }>
      const backendErrors = axiosErr.response?.data?.errors
      if (backendErrors) {
        const messages = Object.entries(backendErrors)
          .map(([field, msgs]) => {
            const messageList = Array.isArray(msgs) ? msgs : [String(msgs ?? '')]
            return `${field}: ${messageList.join(', ')}`
          })
          .join('; ')
        error.value = messages || 'Failed to update issue.'
      } else {
        error.value = axiosErr.response?.data?.message || 'Failed to update issue.'
      }
      useToastStore().error(error.value, 'Update Issue Failed')
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
    fetchTutorIssueById,
    createIssue,
    updateIssue,
    updateTutorIssue,
    assignIssue,
    resolveIssue,
    setFilters,
    resetFilters,
    setPage,
    deleteIssue,
  }
})
