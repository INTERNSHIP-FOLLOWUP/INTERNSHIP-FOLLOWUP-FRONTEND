import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { UserRole } from '@/types/auth'

/**
 * useAuth
 *
 * High-level auth composable for components.
 * Provides permission checking, user info, and session state.
 */
export function useAuth() {
  const store = useAuthStore()

  const isAdmin = computed(() => store.userRole === 'admin')
  const isTutor = computed(() => store.userRole === 'tutor')
  const isStudent = computed(() => store.userRole === 'student')
  const isCompany = computed(
    () => store.userRole === 'company' || store.userRole === 'company representative',
  )

  /**
   * Check if the current user has any of the given roles.
   * Usage: hasRole('admin') or hasRole('admin', 'tutor')
   */
  function hasRole(...roles: UserRole[]): boolean {
    return store.hasAnyRole(...roles)
  }

  /**
   * Check if the current user has a specific permission.
   * Usage: hasPermission('manage-users')
   */
  function hasPermission(permission: string): boolean {
    return store.hasPermission(permission)
  }

  /**
   * Check if the current user's role meets a minimum level.
   * Usage: canAccess(AUTH_CONFIG.ROLE_HIERARCHY.tutor)
   */
  function canAccess(minLevel: number): boolean {
    return store.canAccess(minLevel)
  }

  /**
   * Vue directives for templates.
   * Usage: v-if="can('manage-users')"
   */
  function can(permission: string): boolean {
    return hasPermission(permission)
  }

  return {
    // User info
    user: computed(() => store.user),
    role: computed(() => store.userRole),
    isAuthenticated: computed(() => store.isLoggedIn),
    isLoading: computed(() => store.loading),

    // Role checks
    isAdmin,
    isTutor,
    isStudent,
    isCompany,

    // Permission checks
    hasRole,
    hasPermission,
    canAccess,
    can,

    // Session
    isSessionTimedOut: computed(() => store.isSessionTimedOut),
    updateActivity: store.updateActivity,

    // Actions
    login: store.login,
    logout: store.logout,
    register: store.register,
  }
}
