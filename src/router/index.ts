import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/tutor',
      component: () => import('@/layouts/TutorLayout.vue'),
      meta: { requiresAuth: true, role: 'tutor' },
      children: [
        {
          path: '',
          name: 'tutor-dashboard',
          component: () => import('@/views/dashboard/TutorDashboardView.vue'),
          meta: { title: 'Dashboard' },
        },
        {
          path: 'students',
          name: 'tutor-students',
          component: () => import('@/views/student/StudentDashboardView.vue'),
          meta: { title: 'My Students' },
        },
        {
          path: 'worklogs',
          name: 'tutor-worklogs',
          component: () => import('@/views/worklog/WorklogSubmissionView.vue'),
          meta: { title: 'Worklogs' },
        },
        {
          path: 'followups',
          name: 'tutor-followups',
          component: () => import('@/views/followup/FollowupListView.vue'),
          meta: { title: 'Follow-ups' },
        },
        {
          path: 'issues',
          name: 'tutor-issues',
          component: () => import('@/views/issue/IssueTrackerView.vue'),
          meta: { title: 'Issues' },
        },
        {
          path: 'profile',
          name: 'tutor-profile',
          component: () => import('@/views/profile/ProfileView.vue'),
          meta: { title: 'Profile' },
        },
      ],
    },
  ],
})

router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore()

  if (auth.token && !auth.user) {
    await auth.fetchUser()
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
    if (role === 'admin') return next({ path: '/admin' })
    if (role === 'student') return next({ path: '/student' })
    if (role === 'company') return next({ path: '/company' })
  }

  next()
})

export default router
