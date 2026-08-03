import api from '@/services/api'
import type { Student } from '@/types/student'

interface TutorListResponse {
  data: Student[]
}

export const tutorService = {
  async list(params?: {
    search?: string
    per_page?: number
    page?: number
  }): Promise<TutorListResponse> {
    // Use /admin/tutors — returns Tutor model with correct tutors.id and students_count
    // Do NOT use /admin/users?role=tutor — that returns users.id which mismatches students.tutor_id
    const response = await api.get<TutorListResponse>('/admin/tutors', {
      params,
    })
    return response.data
  },

  async create(data: { first_name: string; last_name: string; email: string; phone?: string; password?: string; gender?: string }): Promise<Student> {
    const payload = { ...data, role: 'tutor' as const }
    const response = await api.post<Student>('/admin/users', payload)
    return response.data
  },

  async update(id: number, data: Partial<{ first_name: string; last_name: string; email: string; phone?: string; gender?: string }>): Promise<Student> {
    const response = await api.put<{ user: Student }>(`/admin/users/${id}`, data)
    return response.data.user
  },

  async delete(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/admin/users/${id}`)
    return response.data
  },
}
