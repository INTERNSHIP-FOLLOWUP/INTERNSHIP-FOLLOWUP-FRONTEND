<template>
  <div class="animate-fade-in">
    <!-- Header -->
    <div class="mb-6 flex flex-col gap-0.5">
      <h1 class="text-2xl font-bold text-gray-900">Welcome back, {{ firstName }}!</h1>
      <p class="text-sm text-gray-500">Here's an overview of your company's internship program.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
      >
        <!-- Subtle background gradient circle -->
        <div
          class="absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-[0.06] transition-transform duration-500 group-hover:scale-125"
          :class="stat.gradientBg"
        />
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs font-medium uppercase tracking-wider text-gray-500">
              {{ stat.label }}
            </p>
            <p class="text-3xl font-bold tracking-tight text-gray-900">{{ stat.value }}</p>
          </div>
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl shadow-sm text-white transition-transform duration-300 group-hover:scale-110"
            :class="stat.color"
          >
            <component :is="stat.icon" class="h-5 w-5" />
          </div>
        </div>
        <div class="mt-3 flex items-center gap-1.5">
          <span
            class="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium"
            :class="stat.trendClass"
          >
            <svg
              v-if="stat.trend.startsWith('+')"
              class="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
            <svg
              v-else-if="stat.trend.startsWith('-')"
              class="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
            {{ stat.trend }}
          </span>
          <span class="text-xs text-gray-400">vs last batch</span>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Recent Intern Activity -->
      <div class="lg:col-span-2 rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 class="text-base font-semibold text-gray-900">Recent Intern Activity</h2>
          <button
            class="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
          >
            View all
          </button>
        </div>

        <div class="divide-y divide-gray-50">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-gray-50/50"
          >
            <div
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
              :class="activity.avatarColor"
            >
              {{ activity.initials }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-900">
                {{ activity.student }}
                <span class="font-normal text-gray-500">{{ activity.action }}</span>
              </p>
              <p class="mt-0.5 text-sm text-gray-400">{{ activity.detail }}</p>
            </div>
            <div class="shrink-0 text-xs text-gray-400">{{ activity.time }}</div>
          </div>

          <!-- Empty state -->
          <div
            v-if="recentActivities.length === 0"
            class="flex flex-col items-center py-12 text-center"
          >
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
              <svg
                class="h-7 w-7 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 class="mt-4 text-sm font-semibold text-gray-700">No recent activity</h3>
            <p class="mt-1 text-xs text-gray-400">
              Intern activity will appear here once students start submitting worklogs.
            </p>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Upcoming Follow-ups -->
        <div class="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 class="text-base font-semibold text-gray-900">Upcoming Follow-ups</h2>
            <button
              class="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
            >
              Schedule
            </button>
          </div>

          <div class="divide-y divide-gray-50">
            <div
              v-for="followup in upcomingFollowups"
              :key="followup.id"
              class="flex items-start gap-3 px-6 py-4 transition-colors hover:bg-gray-50/50"
            >
              <div
                class="flex h-2 w-2 mt-1.5 shrink-0 rounded-full"
                :class="
                  followup.priority === 'high'
                    ? 'bg-rose-500'
                    : followup.priority === 'medium'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                "
              />
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ followup.student }}</p>
                <p class="mt-0.5 text-xs text-gray-400">{{ followup.topic }}</p>
                <p class="mt-1 text-xs font-medium" :class="followup.dueClass">
                  {{ followup.due }}
                </p>
              </div>
            </div>

            <!-- Empty state -->
            <div
              v-if="upcomingFollowups.length === 0"
              class="flex flex-col items-center py-10 text-center"
            >
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
                <svg
                  class="h-6 w-6 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 class="mt-3 text-sm font-semibold text-gray-700">No follow-ups scheduled</h3>
              <p class="mt-1 text-xs text-gray-400">
                Create a follow-up to track student progress.
              </p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 class="text-base font-semibold text-gray-900">Quick Actions</h2>
          <div class="mt-3 grid grid-cols-2 gap-3">
            <button
              v-for="action in quickActions"
              :key="action.label"
              class="group flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-gray-50/50 p-4 text-center transition-all duration-200 hover:border-primary-100 hover:bg-primary-50/50 hover:shadow-sm"
            >
              <div
                class="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm transition-transform duration-200 group-hover:scale-110"
                :class="action.iconBg"
              >
                <component :is="action.icon" class="h-5 w-5" :class="action.iconColor" />
              </div>
              <span class="text-xs font-medium text-gray-600 group-hover:text-gray-900">
                {{ action.label }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom: Current Interns Table Preview -->
    <div class="mt-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h2 class="text-base font-semibold text-gray-900">Current Interns</h2>
        <button
          class="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
        >
          Manage interns
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr
              class="border-b border-gray-50 text-xs font-medium uppercase tracking-wider text-gray-400"
            >
              <th class="px-6 py-3 font-medium">Name</th>
              <th class="px-6 py-3 font-medium">University</th>
              <th class="px-6 py-3 font-medium">Department</th>
              <th class="px-6 py-3 font-medium">Start Date</th>
              <th class="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr
              v-for="intern in currentInterns"
              :key="intern.id"
              class="transition-colors hover:bg-gray-50/50"
            >
              <td class="px-6 py-3.5">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                    :class="intern.avatarColor"
                  >
                    {{ intern.initials }}
                  </div>
                  <span class="font-medium text-gray-900">{{ intern.name }}</span>
                </div>
              </td>
              <td class="px-6 py-3.5 text-gray-500">{{ intern.university }}</td>
              <td class="px-6 py-3.5 text-gray-500">{{ intern.department }}</td>
              <td class="px-6 py-3.5 text-gray-500">{{ intern.startDate }}</td>
              <td class="px-6 py-3.5">
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  :class="
                    intern.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : intern.status === 'pending'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-gray-50 text-gray-500'
                  "
                >
                  {{
                    intern.status === 'active'
                      ? 'Active'
                      : intern.status === 'pending'
                        ? 'Pending'
                        : 'Completed'
                  }}
                </span>
              </td>
            </tr>

            <!-- Empty state -->
            <tr v-if="currentInterns.length === 0">
              <td colspan="5" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center">
                  <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
                    <svg
                      class="h-6 w-6 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 class="mt-3 text-sm font-semibold text-gray-700">No interns assigned yet</h3>
                  <p class="mt-1 text-xs text-gray-400">
                    Interns assigned to your company will appear here.
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, defineComponent } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const firstName = computed(() => {
  const name = auth.user?.name
  if (!name) return 'Company'
  return name.split(' ')[0] || 'Company'
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

const stats = [
  {
    label: 'Active Internships',
    value: 0,
    trend: '+2',
    trendClass: 'bg-emerald-50 text-emerald-600',
    gradientBg: 'bg-emerald-500',
    color: 'bg-gradient-to-br from-emerald-500 to-green-600',
    icon: createIcon(
      'M21 13.255A23.893 23.893 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    ),
  },
  {
    label: 'Assigned Students',
    value: 0,
    trend: 'No data yet',
    trendClass: 'bg-gray-50 text-gray-500',
    gradientBg: 'bg-blue-500',
    color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    icon: createIcon(
      'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
    ),
  },
  {
    label: 'Pending Reviews',
    value: 0,
    trend: 'No data yet',
    trendClass: 'bg-amber-50 text-amber-600',
    gradientBg: 'bg-amber-500',
    color: 'bg-gradient-to-br from-amber-500 to-orange-600',
    icon: createIcon(
      'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    ),
  },
  {
    label: 'Open Issues',
    value: 0,
    trend: 'No data yet',
    trendClass: 'bg-rose-50 text-rose-600',
    gradientBg: 'bg-rose-500',
    color: 'bg-gradient-to-br from-rose-500 to-pink-600',
    icon: createIcon(
      'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
    ),
  },
]

const recentActivities = [] as Array<{
  id: number
  student: string
  initials: string
  avatarColor: string
  action: string
  detail: string
  time: string
}>

const upcomingFollowups = [] as Array<{
  id: number
  student: string
  topic: string
  due: string
  dueClass: string
  priority: 'high' | 'medium' | 'low'
}>

const quickActions = [
  {
    label: 'New Internship',
    icon: createIcon('M12 4v16m8-8H4'),
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    label: 'View Students',
    icon: createIcon(
      'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857',
    ),
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    label: 'Review Worklogs',
    icon: createIcon(
      'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    ),
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    label: 'Schedule Follow-up',
    icon: createIcon(
      'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    ),
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
]

const currentInterns = [] as Array<{
  id: number
  name: string
  initials: string
  avatarColor: string
  university: string
  department: string
  startDate: string
  status: 'active' | 'pending' | 'completed'
}>
</script>
