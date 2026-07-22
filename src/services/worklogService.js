import api from '@/services/api'

export const worklogService = {
  async getWorklogs(params = {}) {
    const response = await api.get('/worklogs', { params })
    return response.data
  },

  async getWorklog(id) {
    const response = await api.get(`/worklogs/${id}`)
    return response.data
  },

  async createWorklog(formData) {
    const response = await api.post('/worklogs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async updateWorklog(id, payload) {
    const isFormData = payload instanceof FormData
    if (isFormData) {
      payload.append('_method', 'PUT')
    }

    const response = await api.request({
      method: isFormData ? 'post' : 'put',
      url: `/worklogs/${id}`,
      data: payload,
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    })
    return response.data
  },

  async deleteWorklog(id) {
    await api.delete(`/worklogs/${id}`)
  },

  async getTutorWorklogs(params = {}) {
    const response = await api.get('/worklogs', { params })
    return response.data
  },

  async getTutorWorklog(id) {
    const response = await api.get(`/worklogs/${id}`)
    return response.data
  },

  async reviewWorklog(id, data) {
    const response = await api.put(`/worklogs/${id}/status`, data)
    return response.data
  },
}
