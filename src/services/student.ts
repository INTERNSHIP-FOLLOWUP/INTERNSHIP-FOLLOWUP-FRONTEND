import api from '@/services/api'
import type { Student, StudentFormData, StudentListResponse } from '@/types/student'

function toFormData(data: Record<string, unknown>): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue
    if (value instanceof File) {
      fd.append(key, value)
    } else {
      fd.append(key, String(value))
    }
  }
  return fd
}

export const studentService = {
  async list(params?: {
    role?: string
    per_page?: number
    page?: number
  }): Promise<StudentListResponse> {
    const response = await api.get<StudentListResponse>('/admin/users', {
      params: { role: 'student', ...params },
    })
    return response.data
  },

  async get(id: number): Promise<Student> {
    const response = await api.get<Student>(`/admin/users/${id}`)
    return response.data
  },

  async create(data: StudentFormData): Promise<Student> {
    const payload =
      data.avatar instanceof File
        ? toFormData({ ...data, role: 'student' })
        : { ...data, role: 'student' }
    const response = await api.post<Student>('/admin/users', payload, {
      headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    })
    return response.data
  },

  async update(id: number, data: Partial<StudentFormData>): Promise<Student> {
    const hasFile = data.avatar instanceof File
    const url = `/admin/users/${id}`

    if (hasFile) {
      const fd = toFormData({ ...data, _method: 'PUT' })
      const response = await api.post<{ user: Student }>(url, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data.user
    }

    const response = await api.put<{ user: Student }>(url, data)
    return response.data.user
  },

  async delete(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/admin/users/${id}`)
    return response.data
  },
}
