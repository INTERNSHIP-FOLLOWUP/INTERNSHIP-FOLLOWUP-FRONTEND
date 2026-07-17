import api from '@/services/api'
import type { Issue, IssueForm, IssueStats, IssueFilters, PaginationMeta } from '@/types/issue'

export const issueService = {
  async getIssues(filters: IssueFilters = { search: '', status: '', priority: '' }): Promise<{ data: Issue[]; meta?: PaginationMeta }> {
    const params: Record<string, string> = {}
    if (filters.search) params.search = filters.search
    if (filters.status) params.status = filters.status
    if (filters.priority) params.priority = filters.priority

    const { data } = await api.get<{ data: Issue[]; meta?: PaginationMeta }>('/issues', { params })
    return data
  },

  async getIssue(id: string): Promise<Issue> {
    const { data } = await api.get<Issue>(`/issues/${encodeURIComponent(id)}`)
    return data
  },

  async createIssue(payload: IssueForm): Promise<Issue> {
    const formData = new FormData()
    formData.append('title', payload.title)
    formData.append('description', payload.description)
    formData.append('priority', payload.priority || 'Medium')
    if (payload.status) formData.append('status', payload.status)
    if (payload.assignedUserId || payload.assignedUserId === 0) formData.append('assigned_user_id', String(payload.assignedUserId))
    if (payload.dueDate) formData.append('due_date', payload.dueDate)
    if (payload.files && payload.files.length) {
      for (const file of payload.files) {
        formData.append('attachments[]', file)
      }
    }

    const { data } = await api.post<Issue>('/issues', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async updateIssue(id: string, payload: Partial<IssueForm>): Promise<Issue> {
    const { data } = await api.put<Issue>(`/issues/${encodeURIComponent(id)}`, payload)
    return data
  },

  async assignIssue(id: string, userId: string | number): Promise<Issue> {
    const { data } = await api.patch<Issue>(`/issues/${encodeURIComponent(id)}/assign`, { userId: String(userId) })
    return data
  },

  async resolveIssue(id: string): Promise<Issue> {
    const { data } = await api.patch<Issue>(`/issues/${encodeURIComponent(id)}/resolve`)
    return data
  },

  async getIssueStats(): Promise<IssueStats> {
    const { data } = await api.get<IssueStats>('/issues/stats')
    return data
  },
}
