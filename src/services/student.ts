import api from '@/services/api'
import type {
  Student,
  StudentFormData,
  StudentListResponse,
  StudentSingleResponse,
} from '@/types/student'

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
    search?: string
    per_page?: number
    page?: number
    batch_id?: string
    tutor_id?: string
    status?: string
  }): Promise<StudentListResponse> {
    const response = await api.get<StudentListResponse>('/admin/students', { params })
    return response.data
  },

  async get(id: number): Promise<Student> {
    const response = await api.get<StudentSingleResponse>(`/admin/students/${id}`)
    return response.data.data
  },

  async create(data: StudentFormData): Promise<Student> {
    const hasFile = data.photo instanceof File
    const payload = hasFile ? toFormData(data as unknown as Record<string, unknown>) : data
    const response = await api.post<StudentSingleResponse>('/admin/students', payload, {
      headers: hasFile ? { 'Content-Type': 'multipart/form-data' } : {},
    })
    return response.data.data
  },

  async update(id: number, data: Partial<StudentFormData>): Promise<Student> {
    const hasFile = data.photo instanceof File

    if (hasFile) {
      const fd = toFormData({ ...data, _method: 'PUT' } as unknown as Record<string, unknown>)
      const response = await api.post<StudentSingleResponse>(`/admin/students/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data.data
    }

    const response = await api.put<StudentSingleResponse>(`/admin/students/${id}`, data)
    return response.data.data
  },

  async delete(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/admin/students/${id}`)
    return response.data
  },
}
