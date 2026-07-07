import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'
import router from '@/router'
import type { User, LoginCredentials, RegisterData, UserRole } from '@/types/auth'
import { ROLE_ROUTES } from '@/types/auth'

const IS_DEV = import.meta.env.DEV

function detectRoleFromEmail(email: string): UserRole {
  if (email.includes('admin')) return 'admin'
  if (email.includes('tutor')) return 'tutor'
  if (email.includes('company')) return 'company'
  return 'student'
}

const MOCK_NAMES: Record<UserRole, string> = {
  admin: 'Admin User',
  tutor: 'Tutor User',
  student: 'Student User',
  company: 'Company User',
}

function createMockUser(overrides?: Partial<User>): User {
  const email = overrides?.email || 'tutor@example.com'
  let role: UserRole = 'tutor'
  let name = 'Tutor User'

  if (email.toLowerCase().includes('admin')) {
    role = 'admin'
    name = 'Admin User'
  } else if (email.toLowerCase().includes('student')) {
    role = 'student'
    name = 'Student User'
  } else if (email.toLowerCase().includes('company')) {
    role = 'company'
    name = 'Company Representative'
  }

  return {
    id: 1,
    name,
    email,
    role,
    ...overrides,
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  function getRedirectPath(role: UserRole): string {
    return ROLE_ROUTES[role] || '/login'
  }

  async function login(credentials: LoginCredentials) {
    try {
      const response = await api.post('/login', credentials)
      const { user: userData, token: tokenData }: { user: User; token: string } = response.data

      user.value = userData
      token.value = tokenData
      localStorage.setItem('token', tokenData)

      router.push(getRedirectPath(userData.role))

      return response.data
    } catch (error: unknown) {
      if (IS_DEV) {
        const mockUser = createMockUser({ email: credentials.email })
        const mockToken = 'dev-mock-token'
        user.value = mockUser
        token.value = mockToken
        localStorage.setItem('token', mockToken)
        router.push(getRedirectPath(mockUser.role))
        return { user: mockUser, token: mockToken }
      }
      throw error
    }
  }

  async function register(data: RegisterData) {
    try {
      const response = await api.post('/register', data)
      const { user: userData, token: tokenData }: { user: User; token: string } = response.data

      user.value = userData
      token.value = tokenData
      localStorage.setItem('token', tokenData)

      router.push(getRedirectPath(userData.role))

      return response.data
    } catch (error: unknown) {
      if (IS_DEV) {
        const mockUser = createMockUser({
          name: data.name,
          email: data.email,
        })
        const mockToken = 'dev-mock-token'
        user.value = mockUser
        token.value = mockToken
        localStorage.setItem('token', mockToken)
        router.push(getRedirectPath(mockUser.role))
        return { user: mockUser, token: mockToken }
      }
      throw error
    }
  }

  async function logout() {
    try {
      await api.post('/logout')
    } catch {
      // ignore in dev mode
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('token')
      router.push('/login')
    }
  }

  async function fetchUser() {
    try {
      const response = await api.get('/user')
      user.value = response.data
      return response.data
    } catch {
      if (IS_DEV) {
        if (!user.value && token.value) {
          user.value = createMockUser()
        }
        return user.value
      }
      user.value = null
      token.value = null
      localStorage.removeItem('token')
      throw new Error('Failed to fetch user')
    }
  }

  return { user, token, login, register, logout, fetchUser }
})
