import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/Login.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('@/views/auth/Login.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/tutor',
      component: () => import('@/layouts/TutorLayout.vue'),
      meta: { requiresAuth: true, role: 'tutor' },
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
    {
      path: '/admin/dashboard',
      name: 'AdminDashboard',
      component: () => import('@/views/auth/Login.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/student',
      component: () => import('@/layouts/StudentLayout.vue'),
      meta: { requiresAuth: true, role: 'student' },
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
    {
      path: '/company',
      component: () => import('@/layouts/CompanyLayout.vue'),
      meta: { requiresAuth: true, role: 'company' },
      children: [
        {
          path: '',
          name: 'CompanyDashboard',
          component: () => import('@/views/company/CompanyListView.vue'),
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
  ],
})

router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore()

  if (auth.token && !auth.user) {
    try {
      await auth.fetchUser()
    } catch {
      // fetchUser already clears token on failure
    }
  }

  if (to.meta.requiresAuth !== false) {
    if (!auth.token) {
      return next('/login')
    }
    const requiredRole = to.meta.role as string | undefined
    if (requiredRole && auth.user?.role !== requiredRole) {
      return next('/login')
    }
  }

  if (to.path === '/login' && auth.token && auth.user) {
    const role = auth.user.role
    if (role === 'tutor') return next('/tutor')
    if (role === 'admin') return next('/admin/dashboard')
    if (role === 'student') return next('/student')
    if (role === 'company') return next('/company/dashboard')
  }

  next()
})

export default router
