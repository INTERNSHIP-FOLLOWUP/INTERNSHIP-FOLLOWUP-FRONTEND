import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'
import router from '@/router'
import type { User, LoginCredentials, RegisterData, UserRole } from '@/types/auth'
import { ROLE_ROUTES } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  function getRedirectPath(role: UserRole): string {
    return ROLE_ROUTES[role] || '/login'
  }

  async function login(credentials: LoginCredentials) {
    const response = await api.post('/login', credentials)
    const { user: userData, token: tokenData }: { user: User; token: string } = response.data

    user.value = userData
    token.value = tokenData
    localStorage.setItem('token', tokenData)

    router.push(getRedirectPath(userData.role))

    return response.data
  }

  async function register(data: RegisterData) {
    const response = await api.post('/register', data)
    const { user: userData, token: tokenData }: { user: User; token: string } = response.data

    user.value = userData
    token.value = tokenData
    localStorage.setItem('token', tokenData)

    router.push(getRedirectPath(userData.role))

    return response.data
  }

  async function logout() {
    try {
      await api.post('/logout')
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('token')
      router.push('/login')
    }
  }

  async function fetchUser() {
    const response = await api.get('/user')
    user.value = response.data
    return response.data
  }

  return { user, token, login, register, logout, fetchUser }
})
