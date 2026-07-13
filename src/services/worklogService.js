import api from '@/services/api'

export const worklogService = {
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
}

