<template>
  <div class="space-y-6">
    <!-- Welcome Header -->
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Welcome back, Admin!</h1>
        <p class="text-sm text-slate-500">
          Monitor your internship activities, student placements, and supervisor updates in
          real-time.
        </p>
      </div>

    </div>

    <!-- Overview Statistics Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Students"
        :value="dashboardData.totalStudents"
        :trend="dashboardData.studentTrend"
        description="from last semester"
        color-class="bg-gradient-to-br from-primary-500 to-primary-600 shadow-primary-500/20"
      >
        <template #icon>
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 14l9-5-9-5-9 5 9 5z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            />
          </svg>
        </template>
      </StatCard>

      <StatCard
        label="Total Companies"
        :value="dashboardData.totalCompanies"
        :trend="companyTrendLabel"
        description="new partners added"
        color-class="bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/20"
      >
        <template #icon>
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2H5a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </template>
      </StatCard>

      <StatCard
        label="Active Internships"
        :value="dashboardData.activeInternships"
        :trend="placementTrendLabel"
        description="placement rate"
        color-class="bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/20"
      >
        <template #icon>
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </template>
      </StatCard>

      <StatCard
        label="Pending Issues"
        :value="dashboardData.pendingIssues"
        trend="-3"
        description="resolved today"
        color-class="bg-gradient-to-br from-rose-500 to-rose-600 shadow-rose-500/20"
      >
        <template #icon>
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </template>
      </StatCard>
    </div>

    <!-- Multi-Column Layout for Reports & Visuals -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Placement Distribution (Students per Company) -->
      <div :class="[panelClass, 'lg:col-span-2']">
        <div class="mb-5 flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-950">Placement Distribution</h3>
            <p class="text-xs text-slate-500">Student count by company placements</p>
          </div>
          <router-link
            to="/admin/companies"
            class="text-xs font-semibold text-primary-600 transition-colors hover:text-primary-800"
          >
            Manage Companies →
          </router-link>
        </div>

        <div class="space-y-4" v-if="dashboardData.companyPlacements.length > 0">
          <div
            v-for="placement in dashboardData.companyPlacements"
            :key="placement.name"
            class="group rounded-lg border border-slate-100 bg-slate-50/40 p-3 transition-colors hover:bg-slate-50"
          >
            <div
              class="mb-2 flex items-center justify-between text-xs font-semibold text-slate-800"
            >
              <span class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-primary-500"></span>
                {{ placement.name }}
              </span>
              <span>{{ placement.count }} Students ({{ getPercentage(placement.count) }}%)</span>
            </div>
            <!-- Progress Bar -->
            <div class="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                class="h-full rounded-full bg-gradient-to-r from-primary-500 to-sky-500 transition-all duration-1000"
                :style="{ width: `${getPercentage(placement.count)}%` }"
              ></div>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-10 text-center">
          <svg
            class="mx-auto h-8 w-8 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2H5a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <p class="mt-2 text-xs font-semibold text-slate-400">
            No company placement records found.
          </p>
        </div>
      </div>

      <!-- Batch Enrollment (Students per Batch) -->
      <div :class="panelClass">
        <div class="mb-5 flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-950">Batch Statistics</h3>
            <p class="text-xs text-slate-500">Student metrics per cohort batch</p>
          </div>
          <router-link
            to="/admin/batches"
            class="text-xs font-semibold text-primary-600 transition-colors hover:text-primary-800"
          >
            Details →
          </router-link>
        </div>

        <div class="space-y-3.5" v-if="dashboardData.batchEnrollments.length > 0">
          <div
            v-for="batch in dashboardData.batchEnrollments"
            :key="batch.name"
            class="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/60 p-3 transition-colors hover:bg-slate-50"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div>
                <h4 class="text-xs font-bold text-slate-900">{{ batch.name }}</h4>
                <p class="text-[10px] font-semibold text-slate-400">{{ batch.duration }}</p>
              </div>
            </div>
            <div class="text-right">
              <span
                class="inline-flex items-center rounded-md bg-primary-50 px-2.5 py-0.5 text-xs font-bold text-primary-700"
              >
                {{ batch.count }} Students
              </span>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-10 text-center">
          <svg
            class="mx-auto h-8 w-8 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p class="mt-2 text-xs font-semibold text-slate-400">No batches registered.</p>
        </div>
      </div>
    </div>

    <!-- Tutors Assignment & Monitoring -->
    <div :class="panelClass">
      <div class="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 class="text-base font-bold text-slate-950">Academic Tutors</h3>
          <p class="text-xs text-slate-500">Supervisors tracking current internship progress</p>
        </div>
        <button
          @click="handleQuickAction('assign-tutors')"
          class="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary-50 px-3 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100"
        >
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Assign Tutor
        </button>
      </div>

      <!-- Tutors Table -->
      <div class="overflow-x-auto" v-if="dashboardData.tutors.length > 0">
        <table class="w-full border-collapse text-left text-sm">
          <thead>
            <tr
              class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-400"
            >
              <th class="px-4 py-3">Tutor Name</th>
              <th class="px-4 py-3">Email Address</th>
              <th class="px-4 py-3">Assigned Students</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr
              v-for="tutor in dashboardData.tutors"
              :key="tutor.id"
              class="hover:bg-slate-50/30 transition-colors"
            >
              <td class="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600 text-xs"
                  >
                    {{ getInitials(tutor.name) }}
                  </div>
                  {{ tutor.name }}
                </div>
              </td>
              <td class="whitespace-nowrap px-4 py-3 text-slate-500 font-medium max-w-[200px] truncate">
                {{ tutor.email }}
              </td>
              <td class="whitespace-nowrap px-4 py-3">
                <div class="flex items-center gap-2">
                  <span
                    class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary-50 text-xs font-bold text-primary-700"
                  >
                    {{ tutor.studentsCount }}
                  </span>
                  <span class="text-xs text-slate-400">students supervised</span>
                </div>
              </td>
              <td class="whitespace-nowrap px-4 py-3 text-right">
                <button
                  @click="handleTutorManage()"
                  class="rounded-lg px-2.5 py-1.5 text-xs font-bold text-primary-600 transition-all hover:bg-primary-50 hover:text-primary-800"
                >
                  Manage Assignments
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-else
        class="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-10 text-center"
      >
        <svg
          class="mx-auto h-10 w-10 text-slate-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
        <p class="mt-2 text-xs font-semibold text-slate-500">No academic tutors assigned yet.</p>
      </div>
    </div>

    <!-- Recent Activity Trail -->
    <div :class="panelClass">
      <div class="mb-5">
        <h3 class="text-base font-bold text-slate-950">Recent System Activity</h3>
        <p class="text-xs text-slate-500">
          Live timeline of actions across company placements and logs
        </p>
      </div>

      <!-- Activities Timeline -->
      <div
        class="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100"
        v-if="dashboardData.recentActivity.length > 0"
      >
        <div
          v-for="activity in dashboardData.recentActivity"
          :key="activity.id"
          class="relative flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
        >
          <!-- Bullet Point -->
          <div
            class="absolute -left-6 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white ring-4 ring-white"
          >
            <div class="h-2 w-2 rounded-full" :class="getActivityColor(activity.type)"></div>
          </div>

          <div class="space-y-0.5">
            <p class="text-xs text-slate-700 font-semibold">
              <span class="font-bold text-slate-900">{{ activity.actor }}</span>
              {{ activity.action }}
              <span class="font-bold text-slate-900" v-if="activity.target">{{
                activity.target
              }}</span>
            </p>
            <p class="text-[10px] text-slate-400 font-semibold">{{ activity.time }}</p>
          </div>

          <div>
            <span
              class="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase"
              :class="getActivityBadgeClass(activity.type)"
            >
              {{ activity.type }}
            </span>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center py-10 text-center">
        <svg
          class="mx-auto h-8 w-8 text-slate-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="mt-2 text-xs font-semibold text-slate-400">No recent system activities found.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import StatCard from '@/components/dashboard/StatCard.vue'

const router = useRouter()

const loading = ref(false)
const panelClass =
  'rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm ring-1 ring-white/70 transition-shadow duration-200 hover:shadow-md'

interface DashboardData {
  totalStudents: number
  totalCompanies: number
  activeInternships: number
  pendingIssues: number
  placementRate: number
  studentTrend: string
  companyTrend: number
  companyPlacements: Array<{ name: string; count: number }>
  batchEnrollments: Array<{ name: string; duration: string; count: number }>
  tutors: Array<{ id: number; name: string; email: string; studentsCount: number }>
  recentActivity: Array<{
    id: number
    actor: string
    action: string
    target?: string
    time: string
    type: 'assignment' | 'worklog' | 'issue' | 'evaluation'
  }>
}

const dashboardData = ref<DashboardData>({
  totalStudents: 0,
  totalCompanies: 0,
  activeInternships: 0,
  pendingIssues: 0,
  placementRate: 0,
  studentTrend: '',
  companyTrend: 0,
  companyPlacements: [],
  batchEnrollments: [],
  tutors: [],
  recentActivity: [],
})

const companyTrendLabel = computed(() => {
  const trend = dashboardData.value.companyTrend
  if (trend > 0) return '+' + trend
  if (trend < 0) return String(trend)
  return '0'
})

const placementTrendLabel = computed(() => {
  return dashboardData.value.placementRate + '%'
})

const getPercentage = (count: number) => {
  if (dashboardData.value.totalStudents === 0) return 0
  return Math.round((count / dashboardData.value.totalStudents) * 100)
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getActivityColor = (type: string) => {
  switch (type) {
    case 'assignment':
      return 'bg-primary-500'
    case 'worklog':
      return 'bg-emerald-500'
    case 'issue':
      return 'bg-rose-500'
    case 'evaluation':
      return 'bg-amber-500'
    default:
      return 'bg-slate-400'
  }
}

const getActivityBadgeClass = (type: string) => {
  switch (type) {
    case 'assignment':
      return 'bg-primary-50 text-primary-700'
    case 'worklog':
      return 'bg-emerald-50 text-emerald-700'
    case 'issue':
      return 'bg-rose-50 text-rose-700'
    case 'evaluation':
      return 'bg-amber-50 text-amber-700'
    default:
      return 'bg-slate-50 text-slate-700'
  }
}

const handleQuickAction = (action: string) => {
  router.push(action)
}

const handleTutorManage = () => {
  router.push('/admin/tutors')
}

async function fetchDashboardData() {
  loading.value = true
  try {
    const response = await api.get('/admin/dashboard')
    dashboardData.value = response.data
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.animate-spin-slow {
  animation: spin 3s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
