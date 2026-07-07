import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'
import router from '@/router'
import type { User, LoginCredentials, RegisterData, UserRole } from '@/types/auth'
import { ROLE_ROUTES } from '@/types/auth'

const IS_DEV = import.meta.env.DEV

// ==============================
// Dev Mock Helpers
// ==============================
function detectRoleFromEmail(email: string): UserRole {
  if (email.includes('admin'))   return 'admin'
  if (email.includes('tutor'))   return 'tutor'
  if (email.includes('company')) return 'company representative'
  return 'student'
}

const MOCK_NAMES: Record<UserRole, string> = {
  'admin'                  : 'Admin User',
  'tutor'                  : 'Tutor User',
  'student'                : 'Student User',
  'company representative' : 'Company User',
}

function createMockUser(overrides?: Partial<User>): User {
  const email = overrides?.email || 'student@example.com'
  const role  = overrides?.role  || detectRoleFromEmail(email)
  return {
    id    : 1,
    name  : MOCK_NAMES[role],
    email : `${role}@example.com`,
    role,
    avatar: null,
    ...overrides,
  }
}

// ==============================
// Auth Store
// ==============================
export const useAuthStore = defineStore('auth', () => {

  // ==============================
  // State
  // ==============================
  const user = ref<User | null>(
    localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!)
      : null
  )
  const token = ref<string | null>(localStorage.getItem('token'))

  // ==============================
  // Getters
  // ==============================
  const isAuthenticated = computed(() => !!token.value)
  const userRole        = computed(() => user.value?.role ?? null)

  // ==============================
  // Session Helpers
  // ==============================
  function saveSession(userData: User, tokenData: string) {
    user.value  = userData
    token.value = tokenData
    localStorage.setItem('token', tokenData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function clearSession() {
    user.value  = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  function getRedirectPath(role: UserRole): string {
    return ROLE_ROUTES[role] || '/login'
  }

  // ==============================
  // Login
  // Backend returns: { access_token, user }
  // ==============================
  async function login(credentials: LoginCredentials) {
    try {
      const response = await api.post('/login', credentials)
      const { user: userData, access_token } = response.data

      saveSession(userData, access_token)
      router.push(getRedirectPath(userData.role))

      return response.data

    } catch (error: unknown) {
      if (IS_DEV) {
        const mockUser  = createMockUser({ email: credentials.email })
        const mockToken = 'dev-mock-token'
        saveSession(mockUser, mockToken)
        router.push(getRedirectPath(mockUser.role))
        return { user: mockUser, access_token: mockToken }
      }
      throw error
    }
  }

  // ==============================
  // Register
  // Backend returns: { token, user }
  // ==============================
  async function register(data: RegisterData) {
    try {
      const response = await api.post('/register', data)
      const { user: userData, token: tokenData } = response.data

      saveSession(userData, tokenData)
      router.push(getRedirectPath(userData.role))

      return response.data

    } catch (error: unknown) {
      if (IS_DEV) {
        const mockUser  = createMockUser({ name: data.name, email: data.email })
        const mockToken = 'dev-mock-token'
        saveSession(mockUser, mockToken)
        router.push(getRedirectPath(mockUser.role))
        return { user: mockUser, token: mockToken }
      }
      throw error
    }
  }

  // ==============================
  // Logout
  // Backend returns: { message }
  // ==============================
  async function logout() {
    try {
      await api.post('/logout')
    } catch {
      // ignore silently
    } finally {
      clearSession()
      router.push('/login')
    }
  }

  // ==============================
  // Fetch Current User
  // Backend returns: user object
  // ==============================
  async function fetchUser() {
    try {
      const response = await api.get('/user')
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
      return response.data

    } catch {
      if (IS_DEV) {
        if (!user.value && token.value) {
          user.value = createMockUser()
        }
        return user.value
      }
      clearSession()
      throw new Error('Failed to fetch user')
    }
  }

  return {
    // state
    user,
    token,
    // getters
    isAuthenticated,
    userRole,
    // actions
    login,
    register,
    logout,
    fetchUser,
  }
})