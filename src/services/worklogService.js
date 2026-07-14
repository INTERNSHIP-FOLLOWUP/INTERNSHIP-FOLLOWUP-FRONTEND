import api from '@/services/api'

export const worklogService = {
  // ── Student endpoints ───────────────────────────────
  async getWorklogs(params = {}) {
    const response = await api.get('/student/worklogs', { params })
    return response.data
  },

  async getWorklog(id) {
    const response = await api.get(`/student/worklogs/${id}`)
    return response.data
  },

  async createWorklog(formData) {
    const response = await api.post('/student/worklogs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async updateWorklog(id, formData) {
    const response = await api.post(`/student/worklogs/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async deleteWorklog(id) {
    await api.delete(`/student/worklogs/${id}`)
  },

  // ── Tutor endpoints ────────────────────────────────
  async getTutorWorklogs(params = {}) {
    const response = await api.get('/tutor/worklogs', { params })
    return response.data
  },

  async getTutorWorklog(id) {
    const response = await api.get(`/tutor/worklogs/${id}`)
    return response.data
  },

  async reviewWorklog(id, data) {
    const response = await api.put(`/tutor/worklogs/${id}`, data)
    return response.data
  },
}


