import api from '@/services/api'
import type { StudentListResponse } from '@/types/student'
import type { WorklogListResponse, ReviewWorklogPayload, WorklogStatus } from '@/types/worklog'
import type { DashboardResponse, DashboardData } from '@/types/tutor'

export const tutorDashboardService = {
  async getDashboard(): Promise<DashboardData> {
    const response = await api.get<DashboardResponse>('/tutor/dashboard')
    return response.data.data
  },
}

export const tutorStudentService = {
  async list(params?: {
    search?: string
    status?: string
    batch_id?: number
    has_open_issue?: boolean
    per_page?: number
    page?: number
  }): Promise<StudentListResponse> {
    const response = await api.get<StudentListResponse>('/tutor/students', { params })
    return response.data
  },

  async get(id: number) {
    const response = await api.get(`/tutor/students/${id}`)
    return response.data
  },

  async updateStatus(id: number, status: string) {
    const response = await api.put(`/tutor/students/${id}/status`, { status })
    return response.data
  },
}

export const tutorWorklogService = {
  async list(params?: {
    student_id?: number
    week?: number
    status?: string
    page?: number
    per_page?: number
  }): Promise<WorklogListResponse> {
    const response = await api.get('/tutor/worklogs', { params })
    return response.data
  },

  async get(id: number) {
    const response = await api.get(`/tutor/worklogs/${id}`)
    return response.data
  },

  async review(id: number, payload: { status: WorklogStatus; feedback?: string }) {
    const response = await api.post(`/tutor/worklogs/${id}`, payload as ReviewWorklogPayload)
    return response.data
  },
}

export { api }
