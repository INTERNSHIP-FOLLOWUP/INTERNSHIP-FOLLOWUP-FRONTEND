<template>
  <div class="space-y-6">
    <!-- Welcome Header -->
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight dark:text-slate-100 text-slate-900">
          Welcome back, {{ displayName }}!
        </h1>
        <p class="text-sm dark:dark:text-slate-500 text-slate-400 text-slate-500">
          Manage your assigned interns, submit evaluations, and track internship progress in
          real-time.
        </p>
      </div>
    </div>

    <!-- Overview Statistics Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Active Internships"
        :value="stats.activeInternships"
        description="Currently running program slots"
        color-class="bg-gradient-to-br from-primary-500 to-primary-600 shadow-primary-500/20"
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
        label="Assigned Students"
        :value="stats.assignedStudents"
        description="Across all active batches"
        color-class="bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/20"
      >
        <template #icon>
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
        </template>
      </StatCard>

      <StatCard
        label="Evaluations Submitted"
        :value="stats.evaluationsSubmitted"
        description="Total evaluations recorded"
        color-class="bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/20"
      >
        <template #icon>
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </template>
      </StatCard>

      <StatCard
        label="Pending Reviews"
        :value="stats.pendingReviews"
        description="Awaiting evaluation action"
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

    <!-- Multi-Column Layout -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Assigned Students -->
      <div :class="[panelClass, 'lg:col-span-2']">
        <div class="mb-5 flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-950 dark:text-slate-100">Assigned Students</h3>
            <p class="text-xs dark:dark:text-slate-500 text-slate-400 text-slate-500">Interns currently assigned to your company</p>
          </div>
          <router-link
            to="/company/students"
            class="text-xs font-semibold text-primary-600 transition-colors hover:text-primary-800"
          >
            View All &rarr;
          </router-link>
        </div>

        <div class="overflow-x-auto" v-if="assignedStudents.length > 0">
          <table class="w-full border-collapse text-left text-sm">
            <thead>
              <tr
                class="border-b dark:border-slate-700 border-slate-100 dark:bg-slate-700 bg-slate-50/50 text-xs font-semibold dark:text-slate-500 text-slate-400"
              >
                <th class="px-4 py-3">Student Name</th>
                <th class="px-4 py-3">Program</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y dark:divide-slate-700 divide-slate-50">
              <tr
                v-for="student in assignedStudents"
                :key="student.id"
                class="hover:dark:bg-slate-700 bg-slate-50/30 transition-colors"
              >
                <td class="whitespace-nowrap px-4 py-3 font-semibold dark:text-slate-100 text-slate-900">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-8 w-8 items-center justify-center rounded-full dark:bg-slate-600 bg-slate-100 font-bold dark:text-slate-400 text-slate-600 text-xs"
                    >
                      {{ getInitials(student.student_name || student.name) }}
                    </div>
                    {{ student.student_name || student.name }}
                  </div>
                </td>
                <td class="whitespace-nowrap px-4 py-3 dark:dark:text-slate-500 text-slate-400 text-slate-500 font-medium">
                  {{ student.batch || student.program || 'N/A' }}
                </td>
                <td class="whitespace-nowrap px-4 py-3">
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold"
                    :class="getStatusClass(student.status)"
                  >
                    {{ student.status || 'Assigned' }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-4 py-3 text-right">
                  <router-link
                    :to="'/company/evaluations'"
                    class="rounded-lg px-2.5 py-1.5 text-xs font-bold text-primary-600 transition-all hover:bg-primary-50 hover:text-primary-800"
                  >
                    Evaluate
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          v-else
          class="flex flex-col items-center justify-center rounded-lg border border-dashed dark:border-slate-600 border-slate-200 py-10 text-center"
        >
          <svg
            class="mx-auto h-10 w-10 dark:text-slate-500 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p class="mt-2 text-xs font-semibold dark:dark:text-slate-500 text-slate-400 text-slate-500">No students assigned yet.</p>
        </div>
      </div>

      <!-- Recent Evaluations -->
      <div :class="panelClass">
        <div class="mb-5 flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-950 dark:text-slate-100">Recent Evaluations</h3>
            <p class="text-xs dark:dark:text-slate-500 text-slate-400 text-slate-500">Latest submitted evaluation records</p>
          </div>
          <router-link
            to="/company/evaluations"
            class="text-xs font-semibold text-primary-600 transition-colors hover:text-primary-800"
          >
            View All &rarr;
          </router-link>
        </div>

        <div class="space-y-3.5" v-if="recentEvaluations.length > 0">
          <div
            v-for="evalItem in recentEvaluations"
            :key="evalItem.id"
            class="flex items-center justify-between rounded-lg border dark:border-slate-700 border-slate-100 dark:bg-slate-700 bg-slate-50/60 p-3 transition-colors hover:dark:bg-slate-700 bg-slate-50"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 class="text-xs font-bold dark:text-slate-100 text-slate-900">{{ evaluationStudentName(evalItem) }}</h4>
                <p class="text-[10px] font-semibold dark:text-slate-500 text-slate-400">
                  Rating: {{ evalItem.rating }}/5
                </p>
              </div>
            </div>
            <div class="text-right">
              <span
                class="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700"
              >
                {{ formatDate(evalItem.created_at) }}
              </span>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-10 text-center">
          <svg
            class="mx-auto h-8 w-8 dark:text-slate-500 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p class="mt-2 text-xs font-semibold dark:text-slate-500 text-slate-400">No evaluations submitted yet.</p>
        </div>
      </div>
    </div>

    <!-- Company Profile Summary -->
    <div :class="panelClass">
      <div class="mb-5 flex items-center justify-between">
        <div>
          <h3 class="text-base font-bold text-slate-950 dark:text-slate-100">Company Profile</h3>
          <p class="text-xs dark:dark:text-slate-500 text-slate-400 text-slate-500">Your registered company information</p>
        </div>
        <router-link
          to="/company/profile"
          class="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary-50 px-3 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100"
        >
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit Profile
        </router-link>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="space-y-1">
          <p class="text-xs font-semibold uppercase tracking-wide dark:text-slate-500 text-slate-400">Company Name</p>
          <p class="text-sm font-semibold dark:text-slate-100 text-slate-900">{{ companyProfile.name || 'N/A' }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold uppercase tracking-wide dark:text-slate-500 text-slate-400">Industry</p>
          <p class="text-sm font-semibold dark:text-slate-100 text-slate-900">{{ companyProfile.industry || 'N/A' }}</p>
        </div>
      </div>

      <!-- Company Logo Section -->
      <div v-if="companyLogoUrl" class="mt-4 flex items-center gap-4 rounded-xl border dark:border-slate-700 border-slate-100 dark:bg-slate-700 bg-slate-50/50 p-4">
        <img
          :src="companyLogoUrl"
          alt="Company Logo"
          class="h-16 w-16 rounded-xl object-cover shadow-sm ring-2 ring-white"
        />
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide dark:text-slate-500 text-slate-400">Company Logo</p>
          <p class="text-sm font-medium dark:text-slate-200 text-slate-700">Uploaded brand logo</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCompanyStore } from '@/stores/company'
import StatCard from '@/components/dashboard/StatCard.vue'

const store = useCompanyStore()

const loading = ref(false)
const panelClass =
  'rounded-lg border dark:border-slate-600 border-slate-200/80 dark:bg-slate-800 bg-white p-5 shadow-sm ring-1 ring-white/70 transition-shadow duration-200 hover:shadow-md'

const displayName = ref('Company')

const companyProfile = ref({
  name: '',
  industry: '',
  logoUrl: '',
})

const companyLogoUrl = computed(() => companyProfile.value.logoUrl || null)

const stats = ref({
  activeInternships: 0,
  assignedStudents: 0,
  evaluationsSubmitted: 0,
  pendingReviews: 0,
})

const assignedStudents = ref<any[]>([])
const recentEvaluations = ref<any[]>([])

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getStatusClass(status?: string) {
  switch ((status || '').toLowerCase()) {
    case 'active':
    case 'assigned':
      return 'bg-emerald-50 text-emerald-700'
    case 'in_progress':
    case 'in progress':
      return 'bg-blue-50 text-blue-700'
    case 'completed':
      return 'dark:bg-slate-700 bg-slate-50 dark:text-slate-200 text-slate-700'
    case 'terminated':
      return 'bg-rose-50 text-rose-700'
    default:
      return 'dark:bg-slate-700 bg-slate-50 dark:text-slate-200 text-slate-700'
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return 'N/A'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return dateStr.slice(0, 10)
  }
}

function studentDisplayName(item: unknown) {
  const raw = item as Record<string, unknown> | null
  if (!raw) return 'Student'

  const nestedStudent = raw.student as Record<string, unknown> | undefined
  const firstName = String(raw.first_name ?? nestedStudent?.first_name ?? '').trim()
  const lastName = String(raw.last_name ?? nestedStudent?.last_name ?? '').trim()
  const fullName = `${firstName} ${lastName}`.trim()

  return (
    String(nestedStudent?.name ?? '').trim() ||
    String(raw.student_name ?? '').trim() ||
    String(raw.name ?? '').trim() ||
    fullName ||
    'Student'
  )
}

function studentRecordId(item: unknown) {
  const raw = item as Record<string, unknown> | null
  return Number(raw?.student_id ?? raw?.id ?? 0)
}

function evaluationStudentName(evalItem: unknown) {
  const raw = evalItem as Record<string, unknown>
  const directName = studentDisplayName(raw)
  if (directName !== 'Student') return directName

  const studentId = Number(raw.student_id ?? 0)
  const student = assignedStudents.value.find((item) => studentRecordId(item) === studentId)
  return student ? studentDisplayName(student) : 'Student'
}

async function load() {
  loading.value = true
  try {
    const [studentsData, evaluationsData] = await Promise.all([
      store.fetchStudents(),
      store.fetchEvaluations(),
    ])

    try {
      await store.fetchProfile()
    } catch {
      // profile fetch might throw; use empty state
    }

    const raw = store.currentCompany
    if (raw) {
      displayName.value = raw.name || 'Company'
      companyProfile.value = {
        name: raw.name || '',
        industry: raw.industry || '',
        logoUrl: '',
      }
    }

    assignedStudents.value = Array.isArray(studentsData) ? studentsData : []
    recentEvaluations.value = (Array.isArray(evaluationsData) ? evaluationsData : [])
      .slice(-5)
      .reverse()

    const activeInternships = Array.isArray(studentsData)
      ? studentsData.filter((s: any) => {
          const st = (s.status || '').toLowerCase()
          return st === 'assigned' || st === 'active' || st === 'in_progress'
        }).length
      : 0

    stats.value = {
      activeInternships,
      assignedStudents: Array.isArray(studentsData) ? studentsData.length : 0,
      evaluationsSubmitted: Array.isArray(evaluationsData) ? evaluationsData.length : 0,
      pendingReviews: Array.isArray(evaluationsData) ? 0 : 0,
    }
  } catch {
    // keep dashboard visible if secondary APIs fail
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
