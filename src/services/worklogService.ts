import api from '@/services/api'
import type { Worklog, WorklogFilters } from '@/types/worklog'
import type { WorklogListResponse } from '@/types/worklog'

export const worklogService = {
  // Student
  async getWorklogs(params: WorklogFilters = {}) {
    const response = await api.get('/worklogs', { params })
    return response.data as WorklogListResponse
  },

  async getWorklog(id: number) {
    const response = await api.get(`/worklogs/${id}`)
    return response.data as Worklog
  },

  async createWorklog(formData: FormData) {
    const response = await api.post('/worklogs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data as Worklog
  },

  async updateWorklog(id: number, payload: FormData | Record<string, unknown>) {
    const isFormData = payload instanceof FormData
    const response = await api.post(`/worklogs/${id}`, payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    })
    return response.data as Worklog
  },

  async deleteWorklog(id: number) {
    await api.delete(`/worklogs/${id}`)
  },

  // Tutor
  async getTutorWorklogs(params: WorklogFilters = {}) {
    const response = await api.get('/tutor/worklogs', { params })
    return response.data as WorklogListResponse
  },

  async getTutorWorklog(id: number) {
    const response = await api.get(`/tutor/worklogs/${id}`)
    return response.data as Worklog
  },

  async reviewWorklog(id: number, data: { status: string; feedback?: string }) {
    const response = await api.post(`/tutor/worklogs/${id}/review`, data)
    return response.data as Worklog
  },
}
