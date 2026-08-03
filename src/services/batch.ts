import api from '@/services/api'

export interface Batch {
  id: number
  batch_name: string
  year: string
  students_count?: number
  created_at?: string
  updated_at?: string
}

export interface BatchListResponse {
  data: Batch[]
  message: string
}

export interface BatchStatistics {
  batch_id: number
  batch_name: string
  year: string
  total_students: number
  status_breakdown: Record<string, number>
}

export const batchService = {
  async list(): Promise<BatchListResponse> {
    const response = await api.get<BatchListResponse>('/admin/batches')
    return response.data
  },

  async get(id: number): Promise<{ data: Batch; message: string }> {
    const response = await api.get<{ data: Batch; message: string }>(`/admin/batches/${id}`)
    return response.data
  },

  async create(payload: {
    batch_name: string
    year: string
  }): Promise<{ data: Batch; message: string }> {
    const response = await api.post<{ data: Batch; message: string }>('/admin/batches', payload)
    return response.data
  },

  async update(
    id: number,
    payload: { batch_name: string; year: string },
  ): Promise<{ data: Batch; message: string }> {
    const response = await api.put<{ data: Batch; message: string }>(
      `/admin/batches/${id}`,
      payload,
    )
    return response.data
  },

  async delete(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/admin/batches/${id}`)
    return response.data
  },

  async getStatistics(id: number): Promise<{ data: BatchStatistics; message: string }> {
    const response = await api.get<{ data: BatchStatistics; message: string }>(`/admin/batches/${id}/statistics`)
    return response.data
  },

  async exportPdf(id: number): Promise<Blob> {
    const response = await api.get(`/admin/batches/${id}/export/pdf`, { responseType: 'blob' })
    return response.data
  },

  async exportExcel(id: number): Promise<Blob> {
    const response = await api.get(`/admin/batches/${id}/export/excel`, { responseType: 'blob' })
    return response.data
  },
}
