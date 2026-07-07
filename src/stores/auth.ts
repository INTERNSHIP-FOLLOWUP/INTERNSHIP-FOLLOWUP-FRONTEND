import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'
import type { User, LoginCredentials, RegisterData } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  async function login(credentials: LoginCredentials) {
    const response = await api.post('/login', credentials)
    const { user: userData, token: tokenData } = response.data

    user.value = userData
    token.value = tokenData
    localStorage.setItem('token', tokenData)

    return response.data
  }

  async function register(data: RegisterData) {
    const response = await api.post('/register', data)
    const { user: userData, token: tokenData } = response.data

    user.value = userData
    token.value = tokenData
    localStorage.setItem('token', tokenData)

    return response.data
  }

  async function logout() {
    try {
      await api.post('/logout')
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('token')
    }
  }

  async function fetchUser() {
    const response = await api.get('/user')
    user.value = response.data
    return response.data
  }

  return { user, token, login, register, logout, fetchUser }
})
