import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { UserRole } from '@/types/auth'
import type { AppRouteMeta } from './guards'
import { ensureBooted, isGuestRoute, getDashboardForRole } from './guards'
import { PUBLIC_ROUTES, ROLE_ROUTES } from '@/types/auth'
import { getRouteRoles, hasAnyRole, isAdminRole, routeRequiresAdmin } from '@/utils/permission'

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
      component: () => import('@/views/error/UnauthorizedView.vue'),
      meta: { requiresAuth: false, title: 'Forbidden' } as AppRouteMeta,
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
          meta: { title: 'Dashboard' } as AppRouteMeta,
        },
        {
          path: 'dashboard',
          redirect: { name: 'AdminDashboard' },
        },
        {
          path: 'all-users',
          name: 'AdminAllUsers',
          component: () => import('@/views/user/AdminAllUsersView.vue'),
          meta: { title: 'All Users' } as AppRouteMeta,
        },
        {
          path: 'users',
          redirect: { name: 'AdminAllUsers' },
        },
        {
          path: 'students',
          name: 'AdminStudents',
          component: () => import('@/views/user/AdminStudentsView.vue'),
          meta: { title: 'Students' } as AppRouteMeta,
        },
        {
          path: 'tutors',
          name: 'AdminTutors',
          component: () => import('@/views/user/AdminTutorsView.vue'),
          meta: { title: 'Tutors' } as AppRouteMeta,
        },
        {
          path: 'student-profile/:id',
          name: 'AdminStudentProfile',
          component: () => import('@/views/student_profile/StudentProfileView.vue'),
          meta: { title: 'Student Profile' } as AppRouteMeta,
        },
        {
          path: 'tutor-profile/:id',
          name: 'AdminTutorProfile',
          component: () => import('@/views/student_profile/TutorProfileView.vue'),
          meta: { title: 'Tutor Profile' } as AppRouteMeta,
        },
        {
          path: 'companies',
          name: 'AdminCompanies',
          component: () => import('@/views/company/CompanyListView.vue'),
          meta: { title: 'Companies' } as AppRouteMeta,
        },
        {
          path: 'companies/create',
          name: 'AdminCompaniesCreate',
          component: () => import('@/views/company/CompanyFormView.vue'),
          meta: { adminOnly: true, title: 'Create Company' } as AppRouteMeta,
        },
        {
          path: 'companies/:id/edit',
          name: 'AdminCompaniesEdit',
          component: () => import('@/views/company/CompanyFormView.vue'),
          meta: { adminOnly: true, title: 'Edit Company' } as AppRouteMeta,
        },
        {
          path: 'companies/:id',
          name: 'AdminCompaniesDetail',
          component: () => import('@/views/company/CompanyDetailView.vue'),
          meta: { title: 'Company Details' } as AppRouteMeta,
        },
        {
          path: 'batches',
          name: 'AdminBatches',
          component: () => import('@/views/batch/BatchListView.vue'),
          meta: { adminOnly: true, title: 'Batches' } as AppRouteMeta,
        },
        {
          path: 'assignments',
          name: 'AdminAssignments',
          component: () => import('@/views/assignment/AssignmentView.vue'),
          meta: { title: 'Internship Assignments' } as AppRouteMeta,
        },
        {
          path: 'assignments/create',
          name: 'AdminAssignmentsCreate',
          component: () => import('@/views/assignment/AssignmentView.vue'),
          meta: { adminOnly: true, title: 'New Assignment' } as AppRouteMeta,
        },
        {
          path: 'assignments/:id',
          name: 'AdminAssignmentsEdit',
          component: () => import('@/views/assignment/AssignmentView.vue'),
          meta: { adminOnly: true, title: 'Edit Assignment' } as AppRouteMeta,
        },
        {
          path: 'evaluations',
          name: 'AdminEvaluations',
          component: () => import('@/views/evaluation/AdminEvaluationView.vue'),
          meta: { title: 'Evaluations' } as AppRouteMeta,
        },
        {
          path: 'feedback',
          name: 'AdminFeedback',
          component: () => import('@/views/company/AdminCompanyFeedbackView.vue'),
          meta: { title: 'Company Feedback' } as AppRouteMeta,
        },
        {
          path: 'reports',
          name: 'AdminReports',
          component: () => import('@/views/report/ReportGenerationView.vue'),
          meta: { title: 'Reports' } as AppRouteMeta,
        },
        {
          path: 'reports/generate',
          name: 'AdminReportsGenerate',
          component: () => import('@/views/report/ReportGenerationView.vue'),
          meta: { title: 'Generate Report' } as AppRouteMeta,
        },
        {
          path: 'profile',
          name: 'AdminProfile',
          component: () => import('@/views/profile/ProfileView.vue'),
          meta: { title: 'Profile' } as AppRouteMeta,
        },
        {
          path: 'tutors/create',
          name: 'AdminTutorsCreate',
          component: () => import('@/views/tutor/TutorFormView.vue'),
          meta: { adminOnly: true, title: 'Add Tutor' } as AppRouteMeta,
        },
        {
          path: 'tutors/:id/edit',
          name: 'AdminTutorsEdit',
          component: () => import('@/views/tutor/TutorFormView.vue'),
          meta: { adminOnly: true, title: 'Edit Tutor' } as AppRouteMeta,
        },
      ],
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
          component: () => import('@/views/tutor/TutorStudentListView.vue'),
          meta: { title: 'My Students' },
        },
        {
          path: 'students/:id',
          name: 'TutorStudentDetail',
          component: () => import('@/views/tutor/TutorStudentDetailView.vue'),
          meta: { title: 'Student Details' },
        },
        {
          path: 'worklogs',
          name: 'TutorWorklogs',
          component: () => import('@/views/tutor/worklog/TutorWorklogList.vue'),
          meta: { title: 'Worklogs' },
        },
        {
          path: 'worklogs/:id',
          name: 'TutorWorklogDetail',
          component: () => import('@/views/worklog/TutorWorklogDetail.vue'),
          meta: { title: 'Review Worklog' },
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
          path: 'messages',
          name: 'TutorMessages',
          component: () => import('@/views/company/MessageView.vue'),
          meta: { title: 'Messages' },
        },
        {
          path: 'profile',
          name: 'TutorSelfProfile',
          component: () => import('@/views/profile/TutorProfileView.vue'),
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
          component: () => import('@/views/worklog/WorklogList.vue'),
          meta: { title: 'Worklogs' },
        },
        {
          path: 'worklogs/create',
          name: 'StudentWorklogsCreate',
          component: () => import('@/views/worklog/WorklogForm.vue'),
          meta: { title: 'Create Worklog' },
        },
        {
          path: 'worklogs/:id',
          name: 'StudentWorklogDetail',
          component: () => import('@/views/worklog/WorklogDetail.vue'),
          meta: { title: 'Worklog Detail' },
        },
        {
          path: 'worklogs/:id/edit',
          name: 'StudentWorklogEdit',
          component: () => import('@/views/worklog/WorklogForm.vue'),
          meta: { title: 'Edit Worklog' },
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
          name: 'StudentSelfProfile',
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
          path: 'messages',
          name: 'CompanyMessages',
          component: () => import('@/views/company/MessageView.vue'),
          meta: { title: 'Messages' },
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

  await ensureBooted()

  // Guest-only routes — redirect authenticated users to their dashboard
  if (isGuest && store.isLoggedIn && store.userRole) {
    next(getDashboardForRole(store.userRole))
    return
  }

  // Protected routes require authentication
  if (!PUBLIC_ROUTES.includes(to.fullPath) && !store.isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // Role-based access control — inherit parent route roles
  if (routeRequiresAdmin(to) && !isAdminRole(store.userRole)) {
    next({ name: 'Forbidden', query: { redirect: to.fullPath } })
    return
  }

  const requiredRoles = getRouteRoles(to)
  if (requiredRoles.length > 0) {
    if (!store.userRole) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
    if (!hasAnyRole(store.userRole, requiredRoles)) {
      const fallback = ROLE_ROUTES[store.userRole] || '/login'
      next(fallback)
      return
    }
  }

  next()
})

export default router
