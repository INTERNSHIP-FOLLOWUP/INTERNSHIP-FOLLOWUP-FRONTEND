import api from '@/services/api'

export const profileService = {
  async getProfile() {
    const { data } = await api.get('/profile')
    return data
  },

  async updateProfile(payload) {
    const { data } = await api.put('/profile', payload)
    return data
  },

  async uploadAvatar(formData) {
    const { data } = await api.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async removeAvatar() {
    const { data } = await api.delete('/profile/avatar')
    return data
  },

  async changePassword(payload) {
    const { data } = await api.put('/profile/password', payload)
    return data
  },
}