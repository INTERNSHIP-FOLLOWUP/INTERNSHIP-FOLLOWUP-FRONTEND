import api from '@/services/api'
import type { Student, StudentFormData, StudentListResponse } from '@/types/student'

export const studentService = {
  async list(params?: { role?: string; per_page?: number; page?: number }): Promise<StudentListResponse> {
    const response = await api.get<StudentListResponse>('/admin/users', { params: { role: 'student', ...params } })
    return response.data
  },

  async get(id: number): Promise<Student> {
    const response = await api.get<Student>(`/admin/users/${id}`)
    return response.data
  },

  async create(data: StudentFormData): Promise<Student> {
    const response = await api.post<Student>('/admin/users', { ...data, role: 'student' })
    return response.data
  },

  async update(id: number, data: Partial<StudentFormData>): Promise<{ user: Student; message: string }> {
    const response = await api.put<{ user: Student; message: string }>(`/admin/users/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/admin/users/${id}`)
    return response.data
  },
}
