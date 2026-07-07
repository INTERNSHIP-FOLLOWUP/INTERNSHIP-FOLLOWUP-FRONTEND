import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Login.vue'),
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('@/views/auth/Login.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/tutor/dashboard',
    name: 'TutorDashboard',
    component: () => import('@/views/auth/Login.vue'),
    meta: { requiresAuth: true, role: 'tutor' },
  },
  {
    path: '/student/dashboard',
    name: 'StudentDashboard',
    component: () => import('@/views/auth/Login.vue'),
    meta: { requiresAuth: true, role: 'student' },
  },
  {
    path: '/company/dashboard',
    name: 'CompanyDashboard',
    component: () => import('@/views/auth/Login.vue'),
    meta: { requiresAuth: true, role: 'company' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
