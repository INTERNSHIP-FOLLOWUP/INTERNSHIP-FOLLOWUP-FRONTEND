import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'
import router from '@/router'

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'tutor' | 'student' | 'company'
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role ?? null)

  async function login(credentials: { email: string; password: string }) {
    const response = await api.post('/login', credentials)
    token.value = response.data.token
    user.value = response.data.user
    localStorage.setItem('token', response.data.token)
  }

  async function logout() {
    try {
      await api.post('/logout')
    } catch {
      // ignore
    }
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    router.push('/login')
  }

  async function fetchUser() {
    try {
      const response = await api.get('/user')
      user.value = response.data
    } catch {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
    }
  }

  return { user, token, isAuthenticated, userRole, login, logout, fetchUser }
})
