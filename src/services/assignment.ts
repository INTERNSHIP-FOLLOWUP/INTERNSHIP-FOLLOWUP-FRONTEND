import api from '@/services/api'
import type {
  Assignment,
  AssignmentListResponse,
  CreateAssignmentPayload,
  UpdateAssignmentPayload,
} from '@/types/assignment'

export const assignmentService = {
  async list(params?: { page?: number; per_page?: number; status?: string; company_id?: number }): Promise<AssignmentListResponse> {
    const response = await api.get<AssignmentListResponse>('/admin/assignments', { params })
    return response.data
  },

  async get(id: number): Promise<Assignment> {
    const response = await api.get<Assignment>(`/admin/assignments/${id}`)
    return response.data
  },

  async create(payload: CreateAssignmentPayload): Promise<Assignment> {
    const response = await api.post<Assignment>('/admin/assignments', payload)
    return response.data
  },

  async update(id: number, payload: UpdateAssignmentPayload): Promise<Assignment> {
    const response = await api.put<Assignment>(`/admin/assignments/${id}`, payload)
    return response.data
  },

  async delete(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/admin/assignments/${id}`)
    return response.data
  },
}
