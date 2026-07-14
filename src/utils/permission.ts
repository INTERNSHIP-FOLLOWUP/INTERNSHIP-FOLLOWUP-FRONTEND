import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { UserRole } from '@/types/auth'

export const ADMIN_ROLE: UserRole = 'admin'

export function isAdminRole(role: UserRole | null | undefined): boolean {
  return role === ADMIN_ROLE
}

export function hasAnyRole(
  userRole: UserRole | null | undefined,
  allowedRoles: readonly UserRole[],
): boolean {
  return !!userRole && allowedRoles.includes(userRole)
}

export function routeRequiresAdmin(route: RouteLocationNormalizedLoaded): boolean {
  return route.matched.some((record) => record.meta.adminOnly === true)
}

export function getRouteRoles(route: RouteLocationNormalizedLoaded): UserRole[] {
  return route.matched
    .flatMap((record) => record.meta.roles)
    .filter((role): role is UserRole => typeof role === 'string')
}
