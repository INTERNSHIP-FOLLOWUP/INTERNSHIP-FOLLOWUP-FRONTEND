<template>
  <div class="space-y-6">
    <!-- Welcome Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 p-6 sm:p-8">
      <!-- Background pattern -->
      <div class="pointer-events-none absolute -right-4 -top-4 opacity-10">
        <svg class="h-40 w-40" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="80" stroke="white" stroke-width="2" />
          <circle cx="100" cy="100" r="50" stroke="white" stroke-width="1.5" />
          <circle cx="100" cy="100" r="20" stroke="white" stroke-width="1" />
        </svg>
      </div>
      <div class="pointer-events-none absolute -bottom-6 -left-6 opacity-5">
        <svg class="h-32 w-32" viewBox="0 0 200 200" fill="none">
          <path d="M20 180L100 20L180 180H20Z" stroke="white" stroke-width="2" />
        </svg>
      </div>

      <div class="relative z-10">
        <div class="flex items-start justify-between">
          <div class="space-y-1">
            <p class="text-sm font-medium text-indigo-200">{{ greeting }}</p>
            <h1 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Welcome back{{ firstName ? `, ${firstName}` : '' }}!
            </h1>
            <p class="max-w-xl text-sm text-indigo-200">
              Here's your internship overview and recent activity.
            </p>
          </div>
          <div class="hidden sm:flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
            <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
        </div>

        <!-- Quick info chips -->
        <div class="mt-5 flex flex-wrap items-center gap-3">
          <div class="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-indigo-100 backdrop-blur-sm">
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {{ companyName }}
          </div>
          <div class="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-indigo-100 backdrop-blur-sm">
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.893 23.893 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {{ positionText }}
          </div>
          <div class="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-indigo-100 backdrop-blur-sm">
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ internshipStatus }}
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <template v-if="loading">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="n in 4" :key="n" class="animate-pulse rounded-2xl border border-slate-100 bg-white p-5">
          <div class="flex items-center justify-between">
            <div class="space-y-2">
              <div class="h-3 w-20 rounded bg-slate-100" />
              <div class="h-7 w-12 rounded bg-slate-100" />
            </div>
            <div class="h-10 w-10 rounded-lg bg-slate-100" />
          </div>
          <div class="mt-3 h-3 w-24 rounded bg-slate-100" />
        </div>
      </div>
    </template>

    <!-- Error State -->
    <template v-else-if="error">
      <div class="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 py-16 text-center px-6">
        <div class="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <svg class="h-7 w-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p class="mt-4 text-sm font-semibold text-red-600">Failed to load dashboard</p>
        <p class="mt-1 text-sm text-red-500">{{ error }}</p>
        <button
          @click="init"
          class="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700 active:scale-95"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Retry
        </button>
      </div>
    </template>

    <!-- Dashboard Content -->
    <template v-else>
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-slate-200"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">{{ stat.label }}</p>
              <p class="mt-1.5 text-2xl font-bold" :class="stat.valueColor || 'text-slate-900'">
                {{ stat.value }}
              </p>
            </div>
            <div
              class="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
              :class="stat.bgColor"
            >
              <component :is="stat.icon" class="h-5.5 w-5.5 text-white" />
            </div>
          </div>
          <p class="mt-2 text-xs" :class="stat.trendColor || 'text-slate-400'">
            {{ stat.trend }}
          </p>
          <!-- Bottom accent bar -->
          <div class="absolute bottom-0 left-0 right-0 h-0.5" :class="stat.accentColor" />
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Recent Worklogs -->
        <div class="rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div class="flex items-center gap-2.5">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 class="text-sm font-bold text-slate-900">Recent Worklogs</h2>
            </div>
            <router-link
              to="/student/worklogs"
              class="text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
            >
              View all
            </router-link>
          </div>

          <div v-if="worklogsLoading" class="p-5">
            <div class="space-y-3">
              <div v-for="n in 3" :key="n" class="animate-pulse rounded-xl bg-slate-50 p-3">
                <div class="h-3 w-16 rounded bg-slate-200" />
                <div class="mt-2 h-3 w-full rounded bg-slate-100" />
                <div class="mt-1 h-3 w-3/4 rounded bg-slate-100" />
              </div>
            </div>
          </div>

          <div v-else-if="recentWorklogs.length === 0" class="flex flex-col items-center justify-center py-10 text-center px-5">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
              <svg class="h-6 w-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p class="mt-3 text-sm font-semibold text-slate-600">No worklogs yet</p>
            <p class="mt-1 text-xs text-slate-400">Start logging your weekly progress.</p>
            <router-link
              to="/student/worklogs/create"
              class="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700 transition-all hover:bg-indigo-100"
            >
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create Worklog
            </router-link>
          </div>

          <div v-else class="divide-y divide-slate-50">
            <div
              v-for="wl in recentWorklogs"
              :key="wl.id"
              class="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50/50"
            >
              <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-50 text-xs font-bold text-slate-500">
                W{{ wl.week_number }}
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-2">
                  <p class="text-sm font-medium text-slate-900 line-clamp-1">{{ wl.description }}</p>
                  <WorklogStatusBadge :status="wl.status" />
                </div>
                <p class="mt-0.5 text-xs text-slate-400">
                  <span class="flex items-center gap-1">
                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ formatDate(wl.submitted_at) }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tutor Feedback -->
        <div class="rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div class="flex items-center gap-2.5">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h2 class="text-sm font-bold text-slate-900">Tutor Feedback</h2>
            </div>
          </div>

          <div v-if="feedbackLoading" class="p-5">
            <div class="space-y-3">
              <div v-for="n in 2" :key="n" class="animate-pulse rounded-xl bg-slate-50 p-4">
                <div class="h-3 w-24 rounded bg-slate-200" />
                <div class="mt-3 h-3 w-full rounded bg-slate-100" />
                <div class="mt-1 h-3 w-2/3 rounded bg-slate-100" />
              </div>
            </div>
          </div>

          <div v-else-if="feedbackItems.length === 0" class="flex flex-col items-center justify-center py-10 text-center px-5">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
              <svg class="h-6 w-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p class="mt-3 text-sm font-semibold text-slate-600">No feedback yet</p>
            <p class="mt-1 text-xs text-slate-400">Submit worklogs to get feedback from your tutor.</p>
          </div>

          <div v-else class="divide-y divide-slate-50">
            <div
              v-for="fb in feedbackItems"
              :key="fb.id"
              class="px-5 py-4 transition-colors hover:bg-slate-50/50"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2">
                  <div class="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-500 text-[10px] font-bold text-white shadow-sm">
                    {{ tutorInitials(fb.tutor_name) }}
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-slate-900">{{ fb.tutor_name }}</p>
                    <p class="text-xs text-slate-400">Week {{ fb.week_number }}</p>
                  </div>
                </div>
                <WorklogStatusBadge :status="fb.status" />
              </div>
              <p class="mt-2.5 text-sm leading-relaxed text-slate-600 line-clamp-3">
                {{ fb.feedback }}
              </p>
              <p class="mt-1.5 text-xs text-slate-400">
                <span class="flex items-center gap-1">
                  <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ formatDate(fb.reviewed_at) }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div class="flex items-center gap-2.5 mb-4">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 class="text-sm font-bold text-slate-900">Quick Actions</h2>
        </div>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <router-link
            to="/student/worklogs/create"
            class="group flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-emerald-200 hover:bg-emerald-50/50 active:scale-[0.98]"
          >
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-transform group-hover:scale-110">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <span class="text-xs font-semibold text-slate-700 group-hover:text-emerald-700">New Worklog</span>
          </router-link>

          <router-link
            to="/student/internship"
            class="group flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-indigo-200 hover:bg-indigo-50/50 active:scale-[0.98]"
          >
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 transition-transform group-hover:scale-110">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.893 23.893 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="text-xs font-semibold text-slate-700 group-hover:text-indigo-700">My Internship</span>
          </router-link>

          <router-link
            to="/student/issues"
            class="group flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-amber-200 hover:bg-amber-50/50 active:scale-[0.98]"
          >
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 transition-transform group-hover:scale-110">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <span class="text-xs font-semibold text-slate-700 group-hover:text-amber-700">Report Issue</span>
          </router-link>

          <router-link
            to="/student/profile"
            class="group flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-purple-200 hover:bg-purple-50/50 active:scale-[0.98]"
          >
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 transition-transform group-hover:scale-110">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span class="text-xs font-semibold text-slate-700 group-hover:text-purple-700">My Profile</span>
          </router-link>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, h, defineComponent, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useWorklogStore } from '@/stores/worklogStore'
import { studentInternshipService } from '@/services/studentInternship'
import { issueService } from '@/services/issueService'
import WorklogStatusBadge from '@/components/worklog/WorklogStatusBadge.vue'
import type { Worklog, WorklogStatus } from '@/types/worklog'
import type { Assignment } from '@/types/assignment'

const auth = useAuthStore()
const worklogStore = useWorklogStore()

// ── Data state ──
const internship = ref<Assignment | null>(null)
const recentWorklogs = ref<Worklog[]>([])
const feedbackItems = ref<Array<{ id: number; week_number: number; tutor_name: string; feedback: string; status: WorklogStatus; reviewed_at: string }>>([])
const issueCount = ref(0)
const loading = ref(true)
const worklogsLoading = ref(true)
const feedbackLoading = ref(true)
const error = ref<string | null>(null)

// ── Computed ──
const firstName = computed(() => {
  const name = auth.user?.name
  if (!name) return ''
  return name.split(' ')[0] || ''
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning ☀️'
  if (hour < 17) return 'Good afternoon 🌤️'
  return 'Good evening 🌙'
})

const companyName = computed(() => {
  return internship.value?.company_name || 'Not assigned'
})

const positionText = computed(() => {
  return internship.value?.position || 'No position'
})

const internshipStatus = computed(() => {
  return internship.value?.status || 'Not started'
})

// ── Stats ──
const stats = computed(() => {
  const pendingReviews = recentWorklogs.value.filter(
    (w) => w.status === 'Pending'
  ).length

  return [
    {
      label: 'My Company',
      value: companyName.value.length > 18 ? companyName.value.slice(0, 18) + '…' : companyName.value,
      trend: internship.value ? `Status: ${internshipStatus.value}` : 'Waiting for assignment',
      trendColor: internship.value ? 'text-green-600' : 'text-slate-400',
      valueColor: internship.value ? 'text-emerald-600' : 'text-slate-600',
      bgColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      accentColor: 'bg-emerald-500',
      icon: createIcon('M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'),
    },
    {
      label: 'Worklogs Submitted',
      value: recentWorklogs.value.length,
      trend: `${recentWorklogs.value.length} total submission${recentWorklogs.value.length !== 1 ? 's' : ''}`,
      trendColor: recentWorklogs.value.length > 0 ? 'text-green-600' : 'text-slate-400',
      valueColor: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      accentColor: 'bg-blue-500',
      icon: createIcon('M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'),
    },
    {
      label: 'Pending Reviews',
      value: pendingReviews,
      trend: pendingReviews > 0
        ? `${pendingReviews} worklog${pendingReviews !== 1 ? 's' : ''} awaiting review`
        : 'All reviewed',
      trendColor: pendingReviews > 0 ? 'text-amber-600' : 'text-green-600',
      valueColor: pendingReviews > 0 ? 'text-amber-600' : 'text-slate-600',
      bgColor: 'bg-gradient-to-br from-amber-500 to-amber-600',
      accentColor: 'bg-amber-500',
      icon: createIcon('M15 12a3 3 0 11-6 0 3 3 0 016 0z'),
    },
    {
      label: 'Open Issues',
      value: issueCount.value,
      trend: issueCount.value > 0
        ? `${issueCount.value} open issue${issueCount.value !== 1 ? 's' : ''}`
        : 'No open issues',
      trendColor: issueCount.value > 0 ? 'text-rose-600' : 'text-green-600',
      valueColor: issueCount.value > 0 ? 'text-rose-600' : 'text-slate-600',
      bgColor: 'bg-gradient-to-br from-rose-500 to-rose-600',
      accentColor: 'bg-rose-500',
      icon: createIcon('M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'),
    },
  ]
})

// ── Helper functions ──
function createIcon(path: string) {
  return defineComponent({
    setup() {
      return () =>
        h(
          'svg',
          {
            class: 'h-5.5 w-5.5',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24',
          },
          [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              'stroke-width': 2,
              d: path,
            }),
          ],
        )
    },
  })
}

function formatDate(date?: string): string {
  if (!date) return '—'
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function tutorInitials(name: string): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// ─── Data fetching ───
async function fetchDashboardData() {
  loading.value = true
  error.value = null

  try {
    // Fetch internship info
    try {
      internship.value = await studentInternshipService.getMyInternship()
    } catch {
      internship.value = null
    }

    // Fetch worklogs
    worklogsLoading.value = true
    try {
      await worklogStore.fetchWorklogs()
      const allWorklogs = [...worklogStore.worklogs]
      recentWorklogs.value = allWorklogs.slice(0, 5)
    } catch {
      recentWorklogs.value = []
    } finally {
      worklogsLoading.value = false
    }

    // Fetch feedback from reviewed worklogs
    feedbackLoading.value = true
    try {
      await worklogStore.fetchWorklogs({ status: 'Reviewed' })
      const reviewed = [...worklogStore.worklogs]
      // Also fetch approved
      await worklogStore.fetchWorklogs({ status: 'Approved' })
      const approved = [...worklogStore.worklogs]
      const allReviewed = [...reviewed, ...approved]
        .filter((w) => w.tutor_review?.feedback)
        .slice(0, 3)

      feedbackItems.value = allReviewed.map((w) => ({
        id: w.id,
        week_number: w.week_number,
        tutor_name: w.tutor_review?.tutor_name || 'Tutor',
        feedback: w.tutor_review?.feedback || '',
        status: w.status,
        reviewed_at: w.tutor_review?.reviewed_at || w.submitted_at,
      }))
    } catch {
      feedbackItems.value = []
    } finally {
      feedbackLoading.value = false
    }

    // Fetch issue count
    try {
      const stats = await issueService.getIssueStats()
      issueCount.value = stats.open || 0
    } catch {
      issueCount.value = 0
    }
  } catch (err: unknown) {
    const e = err as { message?: string }
    error.value = e?.message || 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})

// Expose init for retry button
function init() {
  fetchDashboardData()
}
</script>
