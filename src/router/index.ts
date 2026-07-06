import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Auth Routes wrapped in AuthLayout
    {
      path: '/auth',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/LoginView.vue')
        }
      ]
    },
    // Admin Routes wrapped in AdminLayout
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('@/views/dashboard/AdminDashboardView.vue')
        }
      ]
    },
    // Student Routes wrapped in StudentLayout
    {
      path: '/student',
      component: () => import('@/layouts/StudentLayout.vue'),
      children: [
        {
          path: 'dashboard',
          name: 'student-dashboard',
          component: () => import('@/views/student/StudentDashboardView.vue')
        }
      ]
    },
    // Tutor Routes wrapped in TutorLayout
    {
      path: '/tutor',
      component: () => import('@/layouts/TutorLayout.vue'),
      children: [
        {
          path: 'dashboard',
          name: 'tutor-dashboard',
          component: () => import('@/views/dashboard/TutorDashboardView.vue')
        }
      ]
    },
    // Fallback redirecting root path to login page
    {
      path: '/',
      redirect: '/auth/login'
    },
    // Catch-all route for 404 handling
    {
      path: '/:pathMatch(.*)*',
      redirect: '/auth/login'
    }
  ],
})

export default router
