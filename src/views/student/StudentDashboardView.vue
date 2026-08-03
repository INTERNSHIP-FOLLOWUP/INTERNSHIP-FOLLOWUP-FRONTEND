<template>
  <div>
    <div v-if="loading" class="flex items-center justify-center py-20">
      <svg class="h-8 w-8 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <div v-else-if="error" class="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
      <p class="text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <div v-else>
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-slate-100">Welcome back, {{ firstName }}!</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-slate-400">
          Here's an overview of your internship progress and activities.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="stat in statCards"
          :key="stat.label"
          class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-slate-400">{{ stat.label }}</p>
              <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-slate-100">{{ stat.value }}</p>
            </div>
            <div class="flex h-10 w-10 items-center justify-center rounded-lg" :class="stat.color">
              <component :is="stat.icon" class="h-5 w-5 text-white" />
            </div>
          </div>
          <p class="mt-2 text-xs text-gray-400 dark:text-slate-500">
            {{ stat.trend }}
          </p>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 class="text-base font-semibold text-gray-900 dark:text-slate-100">Recent Worklogs</h2>
          <div v-if="dashboard?.worklogs.recent.length" class="mt-3 space-y-2">
            <div
              v-for="wl in dashboard.worklogs.recent"
              :key="wl.id"
              class="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-slate-700/50"
            >
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-slate-100">
                  {{ wl.title || 'Week ' + wl.week_number }}
                </p>
                <p class="text-xs text-gray-500 dark:text-slate-400">{{ formatDate(wl.created_at) }}</p>
              </div>
              <span
                class="rounded-full px-2 py-0.5 text-xs font-medium"
                :class="statusClass(wl.status)"
              >
                {{ wl.status }}
              </span>
            </div>
          </div>
          <p v-else class="mt-2 text-sm text-gray-500 dark:text-slate-400">
            You haven't submitted any worklogs yet. Start logging your weekly progress.
          </p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 class="text-base font-semibold text-gray-900 dark:text-slate-100">Tutor Feedback</h2>
          <div v-if="dashboard?.tutor_feedback.length" class="mt-3 space-y-2">
            <div
              v-for="fb in dashboard.tutor_feedback"
              :key="fb.id"
              class="rounded-lg bg-gray-50 p-3 dark:bg-slate-700/50"
            >
              <p class="text-xs text-gray-500 dark:text-slate-400">
                Week {{ fb.week_number }} &middot; {{ formatDate(fb.created_at) }}
              </p>
              <p class="mt-1 text-sm text-gray-700 dark:text-slate-300">{{ fb.feedback }}</p>
            </div>
          </div>
          <p v-else class="mt-2 text-sm text-gray-500 dark:text-slate-400">
            No feedback received yet. Submit worklogs to get feedback from your tutor.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h, defineComponent } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { studentDashboardService } from '@/services/studentDashboard'
import type { StudentDashboardData } from '@/types/studentDashboard'

const auth = useAuthStore()
const dashboard = ref<StudentDashboardData | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const firstName = computed(() => {
  const name = auth.user?.name
  if (!name) return 'Student'
  return name.split(' ')[0] || 'Student'
})

onMounted(async () => {
  try {
    dashboard.value = await studentDashboardService.getDashboard()
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Failed to load dashboard data.'
  } finally {
    loading.value = false
  }
})

function createIcon(path: string) {
  return defineComponent({
    setup() {
      return () =>
        h(
          'svg',
          {
            class: 'h-5 w-5',
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

const statCards = computed(() => [
  {
    label: 'My Company',
    value: dashboard.value?.internship?.company_name ?? 'Not assigned',
    trend: dashboard.value?.internship
      ? (dashboard.value.internship.status || 'Assigned')
      : 'Waiting for assignment',
    color: 'bg-emerald-500',
    icon: createIcon(
      'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    ),
  },
  {
    label: 'Worklogs Submitted',
    value: dashboard.value?.worklogs.total ?? 0,
    trend: `${dashboard.value?.worklogs.submitted ?? 0} pending review, ${dashboard.value?.worklogs.approved ?? 0} approved`,
    color: 'bg-blue-500',
    icon: createIcon(
      'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    ),
  },
  {
    label: 'Pending Reviews',
    value: dashboard.value?.pending_reviews ?? 0,
    trend: 'Evaluations awaiting review',
    color: 'bg-amber-500',
    icon: createIcon('M15 12a3 3 0 11-6 0 3 3 0 016 0z'),
  },
  {
    label: 'Open Issues',
    value: dashboard.value?.open_issues ?? 0,
    trend: dashboard.value?.open_issues ? 'Requires attention' : 'No open issues',
    color: 'bg-rose-500',
    icon: createIcon(
      'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
    ),
  },
])

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function statusClass(status: string): string {
  const map: Record<string, string> = {
    Draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    Submitted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }
  return map[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
}
</script>
