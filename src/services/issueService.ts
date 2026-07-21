import api from '@/services/api'
import type { Issue, IssueForm, IssueStats, IssueFilters, PaginationMeta } from '@/types/issue'

export const issueService = {
  async getIssues(filters: IssueFilters = { search: '', status: '', priority: '' }): Promise<{ data: Issue[]; meta?: PaginationMeta }> {
    const params: Record<string, string> = {}
    if (filters.search) params.search = filters.search
    if (filters.status) params.status = filters.status
    if (filters.priority) params.priority = filters.priority

    const { data } = await api.get<{ data: Issue[]; meta?: any }>('/issues', { params })
    const meta = data.meta || {}
    const mappedMeta: PaginationMeta = {
      page: Number(meta.current_page || 1),
      perPage: Number(meta.per_page || 0),
      totalItems: Number(meta.total || 0),
      totalPages: Number(meta.last_page || 1),
    }
    return { data: data.data || [], meta: mappedMeta }
  },

  async getIssue(id: string): Promise<Issue> {
    const { data } = await api.get<{ success: boolean; data: Issue }>(`/issues/${encodeURIComponent(id)}`)
    return data.data
  },

  async createIssue(payload: IssueForm): Promise<Issue> {
    const formData = new FormData()
    formData.append('title', payload.title)
    formData.append('description', payload.description)
    formData.append('priority', payload.priority || 'Medium')
    if (payload.status) formData.append('status', payload.status)
    formData.append('student_id', String(payload.studentId ?? ''))
    if (payload.assignedUserId || payload.assignedUserId === 0) formData.append('assigned_user_id', String(payload.assignedUserId))
    if (payload.dueDate) formData.append('due_date', payload.dueDate)
    if (payload.files && payload.files.length) {
      for (const file of payload.files) {
        formData.append('attachments[]', file)
      }
    }

    const { data } = await api.post<{ success: boolean; data: Issue }>('/issues', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  },

  async updateIssue(id: string, payload: Partial<IssueForm>): Promise<Issue> {
    const formData = new FormData()
    if (payload.title) formData.append('title', payload.title)
    if (payload.description) formData.append('description', payload.description)
    if (payload.priority) formData.append('priority', payload.priority)
    if (payload.status) formData.append('status', payload.status)
    if (payload.studentId !== null && payload.studentId !== undefined && payload.studentId !== '') formData.append('student_id', String(payload.studentId))
    if (payload.assignedUserId !== null && payload.assignedUserId !== undefined && payload.assignedUserId !== '') formData.append('assigned_user_id', String(payload.assignedUserId))
    if (payload.dueDate) formData.append('due_date', payload.dueDate)

    const { data } = await api.put<{ success: boolean; data: Issue }>(`/issues/${encodeURIComponent(id)}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  },

  async assignIssue(id: string, userId: string | number): Promise<Issue> {
    const { data } = await api.patch<{ success: boolean; data: Issue }>(`/issues/${encodeURIComponent(id)}/assign`, { assigned_user_id: String(userId) })
    return data.data
  },

  async resolveIssue(id: string): Promise<Issue> {
    const { data } = await api.patch<{ success: boolean; data: Issue }>(`/issues/${encodeURIComponent(id)}/resolve`)
    return data.data
  },

  async getIssueStats(): Promise<IssueStats> {
    const { data } = await api.get<{ success: boolean; data: IssueStats }>('/issues/stats')
    return data.data
  },

  async deleteIssue(id: string): Promise<void> {
    await api.delete<{ success: boolean }>(`/issues/${encodeURIComponent(id)}`)
  },
}