<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">{{ $t('dashboard.tutor.title') }}</h1>
        <p class="text-sm text-slate-500">
          {{ $t('dashboard.tutor.subtitle') }}
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
        {{ $t('dashboard.tutor.refresh') }}
      </button>
    </div>

    <!-- Stats -->
    <div
      v-if="!store.loading && !store.error"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
    >
      <StatCard
        :label="$t('dashboard.tutor.assignedStudents')"
        :value="store.stats?.assigned_students ?? 0"
        colorClass="bg-indigo-500"
        :description="$t('dashboard.tutor.totalAssignedDesc')"
        href="/tutor/students"
      />
      <StatCard
        :label="$t('dashboard.tutor.pendingReviews')"
        :value="store.stats?.pending_reviews ?? 0"
        :colorClass="pendingColor"
        :description="$t('dashboard.tutor.pendingReviewsDesc')"
        :urgent="(store.stats?.pending_reviews ?? 0) > 0"
        href="/tutor/worklogs"
      />
      <StatCard
        :label="$t('dashboard.tutor.followupsDue')"
        :value="store.stats?.followups_due ?? 0"
        colorClass="bg-emerald-500"
        :description="$t('dashboard.tutor.followupsDueDesc')"
        href="/tutor/followups"
      />
      <StatCard
        :label="$t('dashboard.tutor.openIssues')"
        :value="store.stats?.open_issues ?? 0"
        :colorClass="issuesColor"
        :description="$t('dashboard.tutor.openIssuesDesc')"
        :urgent="(store.stats?.open_issues ?? 0) > 0"
        href="/tutor/issues"
      />
      <StatCard
        :label="$t('dashboard.tutor.inactiveStudents')"
        :value="store.stats?.inactive_students ?? 0"
        colorClass="bg-amber-500"
        :description="$t('dashboard.tutor.inactiveDesc')"
        :urgent="(store.stats?.inactive_students ?? 0) > 0"
        href="/tutor/students"
      />
    </div>

    <!-- Panels -->
    <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <!-- Recent Worklogs -->
      <Panel
        :title="$t('dashboard.tutor.recentWorklogs')"
        :loading="store.loading"
        :error="store.error"
        :emptyCheck="store.recentWorklogs"
        :empty-title="$t('dashboard.tutor.noRecentWorklogs')"
        :empty-message="$t('dashboard.tutor.noRecentWorklogsMessage')"
      >
        <template #default>
          <div class="divide-y divide-slate-100">
            <div
              v-for="w in store.recentWorklogs"
              :key="w.id"
              class="flex items-start gap-3 py-3 last:pb-0"
            >
              <div
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700"
              >
                {{ initials(w.student?.name) }}
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <p class="truncate text-sm font-semibold text-slate-900">
                    {{ w.student?.name ?? '' }}
                  </p>
                  <span class="text-xs text-slate-400">{{ $t('dashboard.tutor.week') }} {{ w.week_number }}</span>
                </div>
                <p class="mt-0.5 truncate text-xs text-slate-500">{{ w.description }}</p>
                <div class="mt-1 flex items-center gap-2">
                  <span
                    class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-700"
                  >
                    {{ worklogStatusLabel(w.status) }}
                  </span>
                  <span class="text-xs text-slate-400">
                    {{ formatDate(w.submission_date || w.submitted_at) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Panel>

      <!-- Upcoming Follow-ups -->
      <Panel
        :title="$t('dashboard.tutor.upcomingFollowups')"
        :loading="store.loading"
        :error="store.error"
        :emptyCheck="store.upcomingFollowups"
        :empty-title="$t('dashboard.tutor.noUpcomingFollowups')"
        :empty-message="$t('dashboard.tutor.noUpcomingFollowupsMessage')"
      >
        <template #default>
          <div class="divide-y divide-slate-100">
            <div
              v-for="f in store.upcomingFollowups"
              :key="f.id"
              class="flex items-start gap-3 py-3 last:pb-0"
            >
              <div
                class="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"
              >
                <span class="text-[11px] font-bold leading-none">{{ monthLabel(f.date_label) }}</span>
                <span class="text-md font-bold leading-tight">{{ dayLabel(f.date_label) }}</span>
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-slate-900">{{ f.student?.name ?? '' }}</p>
                <p class="text-xs text-slate-500">{{ f.type }} · {{ f.time_label }}</p>
                <span
                  class="mt-1 inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700"
                >{{ f.relative }}</span>
              </div>
            </div>
          </div>
        </template>
      </Panel>

      <!-- Open Issues -->
      <Panel
        :title="$t('dashboard.tutor.openIssuesPanel')"
        :loading="store.loading"
        :error="store.error"
        :emptyCheck="store.openIssues"
        :empty-title="$t('dashboard.tutor.noOpenIssues')"
        :empty-message="$t('dashboard.tutor.noOpenIssuesMessage')"
      >
        <template #default>
          <div class="divide-y divide-slate-100">
            <div
              v-for="issue in store.openIssues"
              :key="issue.id"
              class="flex items-start justify-between gap-3 py-3 last:pb-0"
            >
              <div>
                <p class="text-sm font-semibold text-slate-900">{{ issue.title }}</p>
                <p class="text-xs text-slate-500">{{ issue.student?.name ?? '' }}</p>
              </div>
              <span
                class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold"
                :class="priorityColor(issue.priority)"
              >
                {{ issuePriorityLabel(issue.priority) }}
              </span>
            </div>
          </div>
        </template>
      </Panel>

      <!-- Recent Activity -->
      <Panel
        :title="$t('dashboard.tutor.recentActivity')"
        :loading="store.loading"
        :error="store.error"
        :emptyCheck="store.recentActivity"
        :empty-title="$t('dashboard.tutor.noRecentActivity')"
        :empty-message="$t('dashboard.tutor.noRecentActivityMessage')"
      >
        <template #default>
          <div class="divide-y divide-slate-100">
            <div
              v-for="item in store.recentActivity"
              :key="(item.reference_id ?? 'no-ref') + '-' + (item.type ?? 'no-type') + '-' + item.message"
              class="flex items-start gap-3 py-3 last:pb-0"
            >
              <div
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600"
              >
                <svg
                  v-if="item.icon === 'worklog'"
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
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M5.625 3.75h13.5c1.036 0 1.875.84 1.875 1.875v13.5c0 1.036-.84 1.875-1.875 1.875h-13.5A1.875 1.875 0 013.75 19.125V5.625c0-1.036.84-1.875 1.875-1.875z"
                  />
                </svg>
                <svg
                  v-else-if="item.icon === 'issue'"
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <svg
                  v-else
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
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
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
import { useI18n } from 'vue-i18n'
import StatCard from '@/components/dashboard/StatCard.vue'
import Panel from '@/components/dashboard/Panel.vue'
import { useTutorDashboardStore } from '@/stores/tutorDashboard'

const { t: $t_script } = useI18n()
const store = useTutorDashboardStore()

const pendingColor = computed(() =>
  store.stats?.pending_reviews && store.stats.pending_reviews > 0 ? 'bg-rose-500' : 'bg-amber-500',
)
const issuesColor = computed(() =>
  store.stats?.open_issues && store.stats.open_issues > 0 ? 'bg-rose-500' : 'bg-indigo-500',
)

onMounted(() => {
  store.fetchDashboard()
})

function refresh() {
  store.fetchDashboard()
}

function formatDate(date?: string) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function initials(name?: string) {
  if (!name || typeof name !== 'string') return ''
  return name
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
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
    case 'Critical':
      return 'bg-rose-50 text-rose-700'
    case 'High':
      return 'bg-orange-50 text-orange-700'
    case 'Medium':
      return 'bg-indigo-50 text-indigo-700'
    case 'Low':
      return 'bg-slate-100 text-slate-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

function issuePriorityLabel(priority?: string): string {
  const map: Record<string, string> = {
    Critical: 'issues.critical',
    High: 'issues.high',
    Medium: 'issues.medium',
    Low: 'issues.low',
  }
  return $t_script(map[priority ?? ''] || 'common.noData')
}

function worklogStatusLabel(status?: string): string {
  const map: Record<string, string> = {
    Pending: 'worklogs.pending',
    Approved: 'worklogs.approved',
    Rejected: 'worklogs.rejected',
  }
  return $t_script(map[status ?? ''] || 'common.noData')
}

function relativeTimestamp(iso?: string) {
  if (!iso) return ''
  const timestamp = new Date(iso).getTime()
  if (Number.isNaN(timestamp)) return ''
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return seconds <= 0 ? $t_script('common.justNow') : $t_script('common.secondsAgo', { s: seconds })
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return $t_script('common.minutesAgo', { m: minutes })
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return $t_script('common.hoursAgo', { h: hours })
  const days = Math.floor(hours / 24)
  if (days < 7) return $t_script('common.daysAgo', { d: days })
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

