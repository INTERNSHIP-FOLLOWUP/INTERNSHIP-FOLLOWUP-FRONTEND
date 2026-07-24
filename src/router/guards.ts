import { useAuthStore } from '@/stores/auth'
import type { UserRole } from '@/types/auth'

export interface AppRouteMeta extends Record<PropertyKey, unknown> {
  guest?: boolean
  requiresAuth?: boolean
  roles?: UserRole[]
  adminOnly?: boolean
  title?: string
}

const GUEST_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password']

export async function ensureBooted(): Promise<void> {
  const store = useAuthStore()
  if (!store.initialized) {
    await store.boot()
  }
}

export function isGuestRoute(meta: AppRouteMeta, path: string): boolean {
  return meta.guest === true || GUEST_ROUTES.includes(path)
}

export function getDashboardForRole(role: string | null): string {
  const map: Record<string, string> = {
    admin: '/admin/dashboard',
    tutor: '/tutor/dashboard',
    student: '/student/dashboard',
    supervisor: '/company/dashboard',
  }
  return map[role || ''] || '/login'
}
