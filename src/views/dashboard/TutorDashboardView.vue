<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      v-motion
      :initial="{ opacity: 0, y: -16, scale: 0.98 }"
      :enter="{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 25 } }"
      class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
    >
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Tutor Dashboard</h1>
        <p class="text-sm text-slate-500">
          Overview of your assigned students, reviews, and follow-ups.
        </p>
      </div>
      <button
        type="button"
        @click="refresh"
        :disabled="store.loading"
        class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.023 9.348c4.183.626 6.977 3.26 6.977 7.053A7.5 7.5 0 119.75 1.5c4.232 0 7.273 2.527 7.273 5.848z"
          />
        </svg>
        Refresh
      </button>
    </div>

    <!-- Stats - Staggered Entrance -->
    <div
      v-if="!store.loading && !store.error"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
    >
      <div
        v-for="(card, index) in statCards"
        :key="card.label"
        v-motion
        :initial="{ opacity: 0, y: 30, scale: 0.93 }"
        :enter="{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 22, delay: index * 80 } }"
        :hover="{ scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 15 } }"
      >
        <StatCard
          :label="card.label"
          :value="card.value"
          :color-class="card.colorClass"
          :description="card.description"
        />
      </div>
    </div>

    <!-- Panels -->
    <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <!-- Recent Worklogs -->
      <Panel
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 24, delay: 200 } }"
        title="Recent Worklogs"
        :loading="store.loading"
        :error="store.error"
        :emptyCheck="store.recentWorklogs"
        empty-title="No recent worklogs"
        empty-message="Once your students submit worklogs, they will appear here."
      >
        <template #default>
          <div class="divide-y divide-slate-100">
            <div
              v-for="(w, index) in store.recentWorklogs"
              :key="w.id"
              v-motion
              :initial="{ opacity: 0, x: -10 }"
              :enter="{ opacity: 1, x: 0, transition: { delay: 250 + index * 60, type: 'spring', stiffness: 260, damping: 24 } }"
              class="flex items-start gap-3 py-3 last:pb-0"
            >
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">
                {{ initials(w.student?.name) }}
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <p class="truncate text-sm font-semibold text-slate-900">{{ w.student?.name ?? '' }}</p>
                  <span class="text-xs text-slate-400">Week {{ w.week_number }}</span>
                </div>
                <p class="mt-0.5 truncate text-xs text-slate-500">{{ w.description }}</p>
                <div class="mt-1 flex items-center gap-2">
                  <span class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-700">
                    {{ w.status }}
                  </span>
                  <span class="text-xs text-slate-400">{{ formatDate(w.submission_date || w.submitted_at) }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Panel>

      <!-- Upcoming Follow-ups -->
      <Panel
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 24, delay: 300 } }"
        title="Upcoming Follow-ups"
        :loading="store.loading"
        :error="store.error"
        :emptyCheck="store.upcomingFollowups"
        empty-title="No upcoming follow-ups"
        empty-message="Schedule follow-ups with your students to stay aligned."
      >
        <template #default>
          <div class="divide-y divide-slate-100">
            <div
              v-for="(f, index) in store.upcomingFollowups"
              :key="f.id"
              v-motion
              :initial="{ opacity: 0, y: 10 }"
              :enter="{ opacity: 1, y: 0, transition: { delay: 350 + index * 60, type: 'spring', stiffness: 280, damping: 24 } }"
              class="flex items-start gap-3 py-3 last:pb-0"
            >
              <div class="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <span class="text-[11px] font-bold leading-none">{{ monthLabel(f.date_label) }}</span>
                <span class="text-md font-bold leading-tight">{{ dayLabel(f.date_label) }}</span>
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-slate-900">{{ f.student?.name ?? '' }}</p>
                <p class="text-xs text-slate-500">{{ f.type }} · {{ f.time_label }}</p>
                <span class="mt-1 inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700">{{ f.relative }}</span>
              </div>
            </div>
          </div>
        </template>
      </Panel>

      <!-- Open Issues -->
      <Panel
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 24, delay: 400 } }"
        title="Open Issues"
        :loading="store.loading"
        :error="store.error"
        :emptyCheck="store.openIssues"
        empty-title="No open issues"
        empty-message="When issues are opened, they will show up here."
      >
        <template #default>
          <div class="divide-y divide-slate-100">
            <div
              v-for="(issue, index) in store.openIssues"
              :key="issue.id"
              v-motion
              :initial="{ opacity: 0, x: -10 }"
              :enter="{ opacity: 1, x: 0, transition: { delay: 450 + index * 60, type: 'spring', stiffness: 260, damping: 24 } }"
              class="flex items-start justify-between gap-3 py-3 last:pb-0"
            >
              <div>
                <p class="text-sm font-semibold text-slate-900">{{ issue.title }}</p>
                <p class="text-xs text-slate-500">{{ issue.student?.name ?? '' }}</p>
              </div>
              <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold" :class="priorityColor(issue.priority)">
                {{ issue.priority }}
              </span>
            </div>
          </div>
        </template>
      </Panel>

      <!-- Recent Activity -->
      <Panel
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 24, delay: 500 } }"
        title="Recent Activity"
        :loading="store.loading"
        :error="store.error"
        :emptyCheck="store.recentActivity"
        empty-title="No recent activity"
        empty-message="Actions like submissions, issues, and follow-ups will appear here."
      >
        <template #default>
          <div class="divide-y divide-slate-100">
            <div
              v-for="(item, index) in store.recentActivity"
              :key="(item.reference_id ?? 'no-ref') + '-' + (item.type ?? 'no-type') + '-' + item.message"
              v-motion
              :initial="{ opacity: 0, x: -10 }"
              :enter="{ opacity: 1, x: 0, transition: { delay: 550 + index * 60, type: 'spring', stiffness: 260, damping: 24 } }"
              class="flex items-start gap-3 py-3 last:pb-0"
            >
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <svg v-if="item.icon === 'worklog'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M5.625 3.75h13.5c1.036 0 1.875.84 1.875 1.875v13.5c0 1.036-.84 1.875-1.875 1.875h-13.5A1.875 1.875 0 013.75 19.125V5.625c0-1.036.84-1.875 1.875-1.875z" />
                </svg>
                <svg v-else-if="item.icon === 'issue'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm text-slate-700">{{ item.message }}</p>
                <p class="text-xs text-slate-400">{{ relativeTimestamp(item.timestamp) }}</p>
              </div>
            </div>
          </div>
        </template>
      </Panel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import Panel from '@/components/dashboard/Panel.vue'
import { useTutorDashboardStore } from '@/stores/tutorDashboard'

const store = useTutorDashboardStore()

const pendingColor = computed(() =>
  store.stats?.pending_reviews && store.stats.pending_reviews > 0 ? 'bg-rose-500' : 'bg-amber-500',
)
const issuesColor = computed(() =>
  store.stats?.open_issues && store.stats.open_issues > 0 ? 'bg-rose-500' : 'bg-indigo-500',
)

const statCards = computed(() => [
  {
    label: 'Assigned Students',
    value: store.stats?.assigned_students ?? 0,
    colorClass: 'bg-indigo-500',
    description: 'Total students assigned to you',
  },
  {
    label: 'Pending Reviews',
    value: store.stats?.pending_reviews ?? 0,
    colorClass: pendingColor.value,
    description: 'Worklogs awaiting your feedback',
  },
  {
    label: 'Follow-ups Due',
    value: store.stats?.followups_due ?? 0,
    colorClass: 'bg-emerald-500',
    description: 'Scheduled in next 7–14 days',
  },
  {
    label: 'Open Issues',
    value: store.stats?.open_issues ?? 0,
    colorClass: issuesColor.value,
    description: 'Unresolved issues',
  },
  {
    label: 'Inactive Students',
    value: store.stats?.inactive_students ?? 0,
    colorClass: 'bg-amber-500',
    description: 'No worklog in 2+ weeks',
  },
])

onMounted(() => {
  store.fetchDashboard()
})

function refresh() {
  store.fetchDashboard()
}

function formatDate(date?: string) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function initials(name?: string) {
  if (!name || typeof name !== 'string') return ''
  return name.trim().split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

function monthLabel(label?: string) {
  if (!label) return ''
  return new Date(label).toLocaleString('en-US', { month: 'short' })
}

function dayLabel(label?: string) {
  if (!label) return ''
  return new Date(label).getDate().toString()
}

function priorityColor(priority?: string) {
  switch (priority) {
    case 'Critical': return 'bg-rose-50 text-rose-700'
    case 'High': return 'bg-orange-50 text-orange-700'
    case 'Medium': return 'bg-indigo-50 text-indigo-700'
    case 'Low': return 'bg-slate-100 text-slate-700'
    default: return 'bg-slate-100 text-slate-700'
  }
}

function relativeTimestamp(iso?: string) {
  if (!iso) return ''
  const timestamp = new Date(iso).getTime()
  if (Number.isNaN(timestamp)) return ''
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return seconds <= 0 ? 'just now' : `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>
