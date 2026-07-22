import api from '@/services/api'
import type { Student } from '@/types/student'

interface TutorListResponse {
  data: Student[]
}

export const tutorService = {
  async list(params?: {
    role?: string
    search?: string
    per_page?: number
    page?: number
  }): Promise<TutorListResponse> {
    const response = await api.get<TutorListResponse>('/admin/users', {
      params: { role: 'tutor', ...params },
    })
    return response.data
  },

  async create(data: { first_name: string; last_name: string; email: string; password?: string }): Promise<Student> {
    const payload = { ...data, role: 'tutor' as const }
    const response = await api.post<Student>('/admin/users', payload)
    return response.data
  },

  async update(id: number, data: Partial<{ first_name: string; last_name: string; email: string }>): Promise<Student> {
    const response = await api.put<{ user: Student }>(`/admin/users/${id}`, data)
    return response.data.user
  },

  async delete(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/admin/users/${id}`)
    return response.data
  },
}
