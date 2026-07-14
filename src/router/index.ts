import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { UserRole } from '@/types/auth'
import type { AppRouteMeta } from './guards'
import { ensureBooted, isGuestRoute, getDashboardForRole } from './guards'
import { PUBLIC_ROUTES, ROLE_ROUTES } from '@/types/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ── Public (Guest) ──
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/SignIn.vue'),
      meta: { guest: true, title: 'Sign In' } as AppRouteMeta,
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/auth/SignIn.vue'),
      meta: { guest: true, title: 'Register' } as AppRouteMeta,
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('@/views/auth/ForgotPassword.vue'),
      meta: { requiresAuth: false, title: 'Forgot Password' },
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: () => import('@/views/auth/ResetPassword.vue'),
      meta: { requiresAuth: false, title: 'Reset Password' },
    },
    {
      path: '/403',
      name: 'Forbidden',
      component: () => import('@/views/auth/SignIn.vue'),
      meta: { guest: true, title: 'Forbidden' } as AppRouteMeta,
    },
    {
      path: '/404',
      name: 'NotFound',
      component: () => import('@/views/auth/SignIn.vue'),
      meta: { guest: true, title: 'Not Found' } as AppRouteMeta,
    },

    // ── Admin ──
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { roles: ['admin'] as UserRole[], title: 'Admin' } as AppRouteMeta,
      children: [
        {
          path: '',
          name: 'AdminDashboard',
          component: () => import('@/views/dashboard/AdminDashboardView.vue'),
          meta: { title: 'Dashboard' },
        },
        {
          path: 'dashboard',
          redirect: { name: 'AdminDashboard' },
        },
        {
          path: 'users',
          name: 'AdminUsers',
          component: () => import('@/views/user/AdminUsersView.vue'),
          meta: { title: 'Users' },
        },
        {
          path: 'users/create',
          name: 'AdminUsersCreate',
          component: () => import('@/views/user/AdminUsersView.vue'),
          meta: { title: 'Add Student' },
        },
        {
          path: 'users/:id',
          name: 'AdminUsersEdit',
          component: () => import('@/views/user/AdminUsersView.vue'),
          meta: { title: 'Edit Student' },
        },
        {
          path: 'batches',
          name: 'AdminBatches',
          component: () => import('@/views/batch/BatchListView.vue'),
          meta: { title: 'Batches' },
        },
        {
          path: 'companies',
          name: 'AdminCompanies',
          component: () => import('@/views/company/CompanyListView.vue'),
          meta: { title: 'Companies' },
        },
        {
          path: 'companies/create',
          name: 'AdminCompaniesCreate',
          component: () => import('@/views/company/CompanyFormView.vue'),
          meta: { title: 'Create Company' },
        },
        {
          path: 'companies/:id/edit',
          name: 'AdminCompaniesEdit',
          component: () => import('@/views/company/CompanyFormView.vue'),
          meta: { title: 'Edit Company' },
        },
        {
          path: 'assignments',
          name: 'AdminAssignments',
          component: () => import('@/views/assignment/AssignmentView.vue'),
          meta: { title: 'Assignments' },
        },
        {
          path: 'assignments/create',
          name: 'AdminAssignmentsCreate',
          component: () => import('@/views/assignment/AssignmentView.vue'),
          meta: { title: 'New Assignment' },
        },
        {
          path: 'assignments/:id',
          name: 'AdminAssignmentsEdit',
          component: () => import('@/views/assignment/AssignmentView.vue'),
          meta: { title: 'Edit Assignment' },
        },
        {
          path: 'profile',
          name: 'AdminProfile',
          component: () => import('@/views/profile/ProfileView.vue'),
          meta: { title: 'Profile' },
        },
        {
          path: 'tutors',
          name: 'AdminTutors',
          component: () => import('@/views/tutor/TutorList.vue'),
          meta: {
            requiresAuth: true,
            roles: ['admin'] as UserRole[],
            title: 'Tutors',
          } as AppRouteMeta,
        },
      ],
    },

    // ── Company Management (explicit spec routes) ──
    // Maps directly to existing pages:
    // - /companies => CompanyListView
    // - /companies/create => CompanyFormView (create mode)
    // - /companies/:id/edit => CompanyFormView (edit mode)
    {
      path: '/companies',
      name: 'Companies',
      component: () => import('@/views/company/CompanyListView.vue'),
      meta: { roles: ['admin'] as UserRole[], title: 'Companies' } as AppRouteMeta,
    },
    {
      path: '/companies/create',
      name: 'CompaniesCreate',
      component: () => import('@/views/company/CompanyFormView.vue'),
      meta: { roles: ['admin'] as UserRole[], title: 'Create Company' } as AppRouteMeta,
    },
    {
      path: '/companies/:id/edit',
      name: 'CompaniesEdit',
      component: () => import('@/views/company/CompanyFormView.vue'),
      meta: { roles: ['admin'] as UserRole[], title: 'Edit Company' } as AppRouteMeta,
    },

    // ── Tutor ──
    {
      path: '/tutor',
      component: () => import('@/layouts/TutorLayout.vue'),
      meta: { roles: ['tutor'] as UserRole[], title: 'Tutor' } as AppRouteMeta,
      children: [
        {
          path: '',
          name: 'TutorDashboard',
          component: () => import('@/views/dashboard/TutorDashboardView.vue'),
          meta: { title: 'Dashboard' },
        },
        {
          path: 'dashboard',
          redirect: { name: 'TutorDashboard' },
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

    // ── Student ──
    {
      path: '/student',
      component: () => import('@/layouts/StudentLayout.vue'),
      meta: { roles: ['student'] as UserRole[], title: 'Student' } as AppRouteMeta,
      children: [
        {
          path: '',
          name: 'StudentDashboard',
          component: () => import('@/views/student/StudentDashboardView.vue'),
          meta: { title: 'Dashboard' },
        },
        {
          path: 'dashboard',
          redirect: { name: 'StudentDashboard' },
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

    // ── Company ──
    {
      path: '/company',
      component: () => import('@/layouts/CompanyLayout.vue'),
      meta: { roles: ['company representative'] as UserRole[], title: 'Company' } as AppRouteMeta,
      children: [
        {
          path: '',
          name: 'CompanyDashboard',
          component: () => import('@/views/company/CompanyDashboardView.vue'),
          meta: { title: 'Dashboard' },
        },
        {
          path: 'dashboard',
          redirect: { name: 'CompanyDashboard' },
        },
        {
          path: 'students',
          name: 'CompanyStudents',
          component: () => import('@/views/company/CompanyStudentListView.vue'),
          meta: { title: 'Assigned Students' },
        },
        {
          path: 'evaluations',
          name: 'CompanyEvaluations',
          component: () => import('@/views/company/CompanyEvaluationView.vue'),
          meta: { title: 'Evaluations' },
        },
        {
          path: 'feedback',
          name: 'CompanyFeedback',
          component: () => import('@/views/company/CompanyFeedbackView.vue'),
          meta: { title: 'Feedback' },
        },
        {
          path: 'internships',
          name: 'CompanyInternships',
          component: () => import('@/views/company/CompanyInternshipInfoView.vue'),
          meta: { title: 'Internship Information' },
        },
        {
          path: 'profile',
          name: 'CompanyProfile',
          component: () => import('@/views/company/CompanyFormView.vue'),
          meta: { title: 'Company Profile' },
        },
      ],
    },

    // ── Catch-all ──
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404',
    },
  ],
})

// ── Global Navigation Guard ──────────────────────────────────

router.beforeEach(async (to, _from, next) => {
  const store = useAuthStore()
  const meta = to.meta as AppRouteMeta
  const isGuest = isGuestRoute(meta, to.path)

  // 1. Boot the auth store if needed
  await ensureBooted()

  // 2. Guest-only routes — redirect authenticated users to their dashboard
  if (isGuest && store.isLoggedIn && store.userRole) {
    next(getDashboardForRole(store.userRole))
    return
  }

  // 3. All other routes require authentication
  if (!PUBLIC_ROUTES.includes(to.fullPath) && !store.isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // 4. Role-based access
  if (to.meta?.roles && !store.hasAnyRole(...(to.meta.roles as UserRole[]))) {
    const fallback = ROLE_ROUTES[store.userRole as UserRole] || '/login'
    next(fallback)
    return
  }

  next()
})

export default router
