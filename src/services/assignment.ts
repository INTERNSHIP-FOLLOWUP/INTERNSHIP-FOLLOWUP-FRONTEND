import api from '@/services/api'
import type {
  Assignment,
  AssignmentListResponse,
  CreateAssignmentPayload,
  UpdateAssignmentPayload,
} from '@/types/assignment'

interface BackendListResponse {
  data: Assignment[]
  meta: AssignmentListResponse['meta']
}

interface BackendSingleResponse {
  data: Assignment
  message: string
}

export const assignmentService = {
  async list(params?: {
    page?: number
    per_page?: number
    status?: string
    company_id?: number
  }): Promise<AssignmentListResponse> {
    const response = await api.get<BackendListResponse>('/admin/assignments', { params })
    return {
      data: response.data.data,
      meta: response.data.meta,
    }
  },

  async get(id: number): Promise<Assignment> {
    const response = await api.get<BackendSingleResponse>(`/admin/assignments/${id}`)
    return response.data.data
  },

  async create(payload: CreateAssignmentPayload): Promise<Assignment> {
    const response = await api.post<BackendSingleResponse>('/admin/assignments', payload)
    return response.data.data
  },

  async update(id: number, payload: UpdateAssignmentPayload): Promise<Assignment> {
    const response = await api.put<BackendSingleResponse>(`/admin/assignments/${id}`, payload)
    return response.data.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/admin/assignments/${id}`)
  },
}
