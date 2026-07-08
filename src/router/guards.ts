import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { UserRole } from '@/types/auth'
import { ROLE_ROUTES } from '@/types/auth'

export interface AppRouteMeta extends Record<PropertyKey, unknown> {
  guest?: boolean
  requiresAuth?: boolean
  roles?: UserRole[]
  title?: string
}

const GUEST_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password']

/**
 * Ensure the auth store is initialized (booted) before checking auth state.
 */
export async function ensureBooted(): Promise<void> {
  const store = useAuthStore()
  if (!store.initialized) {
    await store.boot()
  }
}

/**
 * Check if the route is a guest-only page.
 */
export function isGuestRoute(meta: AppRouteMeta, path: string): boolean {
  return meta.guest === true || GUEST_ROUTES.includes(path)
}

/**
 * Redirect authenticated users away from guest pages to their dashboard.
 */
export function redirectAuthenticatedGuest(
  store: ReturnType<typeof useAuthStore>,
  next: NavigationGuardNext,
): boolean {
  if (store.isLoggedIn) {
    const path = ROLE_ROUTES[store.userRole as UserRole] || '/login'
    next(path)
    return true
  }
  return false
}

/**
 * Redirect unauthenticated users to login, preserving the intended destination.
 */
export function requireAuth(
  store: ReturnType<typeof useAuthStore>,
  to: RouteLocationNormalized,
  next: NavigationGuardNext,
): boolean {
  if (!store.isLoggedIn) {
    next(`/login?redirect=${encodeURIComponent(to.path)}`)
    return true
  }
  return false
}

/**
 * Enforce role-based access control.
 * Redirects unauthorized users to their own dashboard.
 */
export function checkRoles(
  store: ReturnType<typeof useAuthStore>,
  meta: AppRouteMeta,
  next: NavigationGuardNext,
): boolean {
  const allowedRoles = meta.roles
  if (!allowedRoles || allowedRoles.length === 0) return false

  if (!store.userRole) {
    next('/login')
    return true
  }

  if (!store.hasAnyRole(...allowedRoles)) {
    const fallback = ROLE_ROUTES[userRole] || '/login'
    next(fallback)
    return true
  }

  return false
}

/**
 * Validate session: if token is present but user is null, try to restore.
 */
export async function validateSession(store: ReturnType<typeof useAuthStore>): Promise<boolean> {
  const token = localStorage.getItem('auth_token')
  if (!token) return false

  if (store.isLoggedIn) return true

  try {
    await store.boot()
    return store.isLoggedIn
  } catch {
    store.forceLogout()
    return false
  }
}

/**
 * Get the role-based redirect path after login.
 */
export function getDashboardForRole(role: string | null): string {
  const map: Record<string, string> = {
    admin: '/admin/dashboard',
    tutor: '/tutor/dashboard',
    student: '/student/dashboard',
    'company representative': '/company/dashboard',
  }
  return map[role || ''] || '/login'
}
