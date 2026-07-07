import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { UserRole } from '@/types/auth'
import { PUBLIC_ROUTES } from '@/types/auth'
import { AUTH_CONFIG } from '@/constants/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ── Public ──
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/Login.vue'),
      meta: { requiresAuth: false, title: 'Sign In' },
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('@/views/auth/Login.vue'),
      meta: { requiresAuth: false, title: 'Forgot Password' },
    },
    {
      path: '/403',
      name: 'Forbidden',
      component: () => import('@/views/auth/Login.vue'),
      meta: { requiresAuth: false, title: 'Forbidden' },
    },
    {
      path: '/404',
      name: 'NotFound',
      component: () => import('@/views/auth/Login.vue'),
      meta: { requiresAuth: false, title: 'Not Found' },
    },

    // ── Admin ──
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: {
        requiresAuth: true,
        role: 'admin' as UserRole,
        title: 'Admin',
      },
      children: [
        {
          path: '',
          name: 'AdminDashboard',
          component: () => import('@/views/dashboard/AdminDashboardView.vue'),
          meta: { title: 'Dashboard' },
        },
        {
          path: 'users',
          name: 'AdminUsers',
          component: () => import('@/views/student/StudentDashboardView.vue'),
          meta: { title: 'Users' },
        },
        {
          path: 'profile',
          name: 'AdminProfile',
          component: () => import('@/views/profile/ProfileView.vue'),
          meta: { title: 'Profile' },
        },
      ],
    },
    {
      path: '/admin/dashboard',
      redirect: '/admin',
    },

    // ── Tutor ──
    {
      path: '/tutor',
      component: () => import('@/layouts/TutorLayout.vue'),
      meta: {
        requiresAuth: true,
        role: 'tutor' as UserRole,
        title: 'Tutor',
      },
      children: [
        {
          path: '',
          name: 'TutorDashboard',
          component: () => import('@/views/dashboard/TutorDashboardView.vue'),
          meta: { title: 'Dashboard' },
        },
        {
          path: 'students',
          name: 'TutorStudents',
          component: () => import('@/views/student/StudentDashboardView.vue'),
          meta: { title: 'My Students' },
        },
        {
          path: 'worklogs',
          name: 'TutorWorklogs',
          component: () => import('@/views/worklog/WorklogSubmissionView.vue'),
          meta: { title: 'Worklogs' },
        },
        {
          path: 'followups',
          name: 'TutorFollowups',
          component: () => import('@/views/followup/FollowupListView.vue'),
          meta: { title: 'Follow-ups' },
        },
        {
          path: 'issues',
          name: 'TutorIssues',
          component: () => import('@/views/issue/IssueTrackerView.vue'),
          meta: { title: 'Issues' },
        },
        {
          path: 'profile',
          name: 'TutorProfile',
          component: () => import('@/views/profile/ProfileView.vue'),
          meta: { title: 'Profile' },
        },
      ],
    },
    {
      path: '/tutor/dashboard',
      redirect: '/tutor',
    },

    // ── Student ──
    {
      path: '/student',
      component: () => import('@/layouts/StudentLayout.vue'),
      meta: {
        requiresAuth: true,
        role: 'student' as UserRole,
        title: 'Student',
      },
      children: [
        {
          path: '',
          name: 'StudentDashboard',
          component: () => import('@/views/student/StudentDashboardView.vue'),
          meta: { title: 'Dashboard' },
        },
        {
          path: 'internship',
          name: 'StudentInternship',
          component: () => import('@/views/assignment/AssignmentView.vue'),
          meta: { title: 'My Internship' },
        },
        {
          path: 'worklogs',
          name: 'StudentWorklogs',
          component: () => import('@/views/worklog/WorklogSubmissionView.vue'),
          meta: { title: 'Worklogs' },
        },
        {
          path: 'followups',
          name: 'StudentFollowups',
          component: () => import('@/views/followup/FollowupListView.vue'),
          meta: { title: 'Follow-ups' },
        },
        {
          path: 'issues',
          name: 'StudentIssues',
          component: () => import('@/views/issue/IssueTrackerView.vue'),
          meta: { title: 'Issues' },
        },
        {
          path: 'profile',
          name: 'StudentProfile',
          component: () => import('@/views/profile/ProfileView.vue'),
          meta: { title: 'Profile' },
        },
      ],
    },
    {
      path: '/student/dashboard',
      redirect: '/student',
    },

    // ── Company ──
    {
      path: '/company',
      component: () => import('@/layouts/CompanyLayout.vue'),
      meta: {
        requiresAuth: true,
        role: 'company representative' as UserRole,
        title: 'Company',
      },
      children: [
        {
          path: '',
          name: 'CompanyDashboard',
          component: () => import('@/views/company/CompanyDashboardView.vue'),
          meta: { title: 'Dashboard' },
        },
        {
          path: 'internships',
          name: 'CompanyInternships',
          component: () => import('@/views/company/CompanyListView.vue'),
          meta: { title: 'Internships' },
        },
        {
          path: 'students',
          name: 'CompanyStudents',
          component: () => import('@/views/student/StudentDashboardView.vue'),
          meta: { title: 'Students' },
        },
        {
          path: 'worklogs',
          name: 'CompanyWorklogs',
          component: () => import('@/views/worklog/WorklogSubmissionView.vue'),
          meta: { title: 'Worklogs' },
        },
        {
          path: 'followups',
          name: 'CompanyFollowups',
          component: () => import('@/views/followup/FollowupListView.vue'),
          meta: { title: 'Follow-ups' },
        },
        {
          path: 'issues',
          name: 'CompanyIssues',
          component: () => import('@/views/issue/IssueTrackerView.vue'),
          meta: { title: 'Issues' },
        },
        {
          path: 'profile',
          name: 'CompanyProfile',
          component: () => import('@/views/profile/ProfileView.vue'),
          meta: { title: 'Profile' },
        },
      ],
    },
    {
      path: '/company/dashboard',
      redirect: '/company',
    },

    // ── Catch-all ──
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404',
    },
  ],
})

// ── Multi-role route meta helper ──────────────────────────────

export interface RouteMeta {
  requiresAuth?: boolean
  role?: UserRole | UserRole[]
  title?: string
  permission?: string
}

// ── Navigation Guard ──────────────────────────────────────────

router.beforeEach(async (to, _from, next) => {
  const store = useAuthStore()
  const meta = to.meta as RouteMeta

  // ── 1. Boot if not initialized ──
  if (!store.initialized) {
    await store.boot()
  }

  // ── 2. Public routes ──
  if (meta.requiresAuth === false) {
    if (store.isLoggedIn && (to.path === '/login' || to.path === '/register')) {
      return next(getRedirectForRole(store.userRole))
    }
    return next()
  }

  // ── 3. Protected routes — must be logged in ──
  if (!store.isLoggedIn) {
    return next(`/login?redirect=${encodeURIComponent(to.path)}`)
  }

  // ── 4. Role-based access ──
  const routeRoles = meta.role
  if (routeRoles) {
    const roles = Array.isArray(routeRoles) ? routeRoles : [routeRoles]
    if (!store.hasRole(...roles)) {
      return next('/403')
    }
  }

  // ── 5. Permission-based access ──
  if (meta.permission && !store.hasPermission(meta.permission)) {
    return next('/403')
  }

  next()
})

function getRedirectForRole(role: string | null): string {
  const map: Record<string, string> = {
    admin: '/admin',
    tutor: '/tutor',
    student: '/student',
    'company representative': '/company',
  }
  return map[role || ''] || '/login'
}

export default router
