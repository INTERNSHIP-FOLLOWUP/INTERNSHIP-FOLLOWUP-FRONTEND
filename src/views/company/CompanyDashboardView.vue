<template>
  <div class="space-y-6">
    <!-- Welcome Header -->
    <div
      v-motion
      :initial="{ opacity: 0, y: -16, scale: 0.98 }"
      :enter="{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 25 } }"
      class="dashboard-hero flex flex-col gap-2 overflow-hidden rounded-xl border border-slate-200/70 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
    >
      <div class="relative z-10">
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">
          Welcome back, {{ displayName }}!
        </h1>
        <p class="text-sm text-slate-500">
          Manage your assigned interns, submit evaluations, and track internship progress in real-time.
        </p>
      </div>
      <div class="hero-lines" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>

    <!-- Overview Statistics Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="(card, index) in statCardConfigs"
        :key="card.label"
        v-motion
        :initial="{ opacity: 0, y: 30, scale: 0.93 }"
        :enter="{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 22, delay: index * 80 } }"
        :hover="{ scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 15 } }"
      >
        <StatCard
          :label="card.label"
          :value="card.value"
          :description="card.description"
          :color-class="card.colorClass"
        >
          <template #icon>
            <component :is="card.icon" class="h-6 w-6" />
          </template>
        </StatCard>
      </div>
    </div>

    <!-- Quick Actions Module -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24, delay: 200 } }"
      :class="panelClass"
    >
      <h3 class="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Quick Actions</h3>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <button
          v-for="(action, index) in quickActions"
          :key="action.label"
          v-motion
          :initial="{ opacity: 0, y: 16, scale: 0.95 }"
          :enter="{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 22, delay: 250 + index * 60 } }"
          :hover="{ scale: 1.04, y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }"
          @click="handleQuickAction(action.route)"
          class="group flex min-h-28 flex-col items-center justify-center rounded-lg border border-slate-200/70 bg-slate-50/60 p-4 text-center transition-all duration-200 hover:border-primary-200 hover:bg-primary-50/50 hover:shadow-sm"
        >
          <div
            class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition-all duration-200 group-hover:scale-110 group-hover:bg-white group-hover:text-primary-600 group-hover:shadow-sm"
            :class="action.bgColor"
          >
            <component :is="action.icon" class="h-5 w-5" />
          </div>
          <span class="text-xs font-semibold leading-snug text-slate-700 group-hover:text-slate-900">{{ action.label }}</span>
        </button>
      </div>
    </div>

    <!-- Multi-Column Layout -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Assigned Students -->
      <div
        v-motion
        :initial="{ opacity: 0, x: -20 }"
        :enter="{ opacity: 1, x: 0, transition: { type: 'spring', stiffness: 240, damping: 24, delay: 350 } }"
        :class="[panelClass, 'lg:col-span-2']"
      >
        <div class="mb-5 flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-950">Assigned Students</h3>
            <p class="text-xs text-slate-500">Interns currently assigned to your company</p>
          </div>
          <router-link to="/company/students" class="text-xs font-semibold text-primary-600 transition-colors hover:text-primary-800">
            View All &rarr;
          </router-link>
        </div>

        <div class="overflow-x-auto" v-if="assignedStudents.length > 0">
          <table class="w-full border-collapse text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-400">
                <th class="px-4 py-3">Student Name</th>
                <th class="px-4 py-3">Program</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr
                v-for="(student, index) in assignedStudents"
                :key="student.id"
                v-motion
                :initial="{ opacity: 0, y: 10 }"
                :enter="{ opacity: 1, y: 0, transition: { delay: 400 + index * 60, type: 'spring', stiffness: 300, damping: 26 } }"
                class="hover:bg-slate-50/30 transition-colors"
              >
                <td class="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                  <div class="flex items-center gap-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600 text-xs">
                      {{ getInitials(student.student_name || student.name) }}
                    </div>
                    {{ student.student_name || student.name }}
                  </div>
                </td>
                <td class="whitespace-nowrap px-4 py-3 text-slate-500 font-medium">
                  {{ student.batch || student.program || 'N/A' }}
                </td>
                <td class="whitespace-nowrap px-4 py-3">
                  <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold" :class="getStatusClass(student.status)">
                    {{ student.status || 'Assigned' }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-4 py-3 text-right">
                  <router-link to="/company/evaluations" class="rounded-lg px-2.5 py-1.5 text-xs font-bold text-primary-600 transition-all hover:bg-primary-50 hover:text-primary-800">
                    Evaluate
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-10 text-center">
          <svg class="mx-auto h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p class="mt-2 text-xs font-semibold text-slate-500">No students assigned yet.</p>
        </div>
      </div>

      <!-- Recent Evaluations -->
      <div
        v-motion
        :initial="{ opacity: 0, x: 20 }"
        :enter="{ opacity: 1, x: 0, transition: { type: 'spring', stiffness: 240, damping: 24, delay: 400 } }"
        :class="panelClass"
      >
        <div class="mb-5 flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-950">Recent Evaluations</h3>
            <p class="text-xs text-slate-500">Latest submitted evaluation records</p>
          </div>
          <router-link to="/company/evaluations" class="text-xs font-semibold text-primary-600 transition-colors hover:text-primary-800">
            View All &rarr;
          </router-link>
        </div>

        <div class="space-y-3.5" v-if="recentEvaluations.length > 0">
          <div
            v-for="(evalItem, index) in recentEvaluations"
            :key="evalItem.id"
            v-motion
            :initial="{ opacity: 0, y: 12 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 450 + index * 80, type: 'spring', stiffness: 280, damping: 24 } }"
            class="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/60 p-3 transition-colors hover:bg-slate-50"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 class="text-xs font-bold text-slate-900">Student #{{ evalItem.student_id }}</h4>
                <p class="text-[10px] font-semibold text-slate-400">Rating: {{ evalItem.rating }}/5</p>
              </div>
            </div>
            <div class="text-right">
              <span class="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                {{ formatDate(evalItem.created_at) }}
              </span>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-10 text-center">
          <svg class="mx-auto h-8 w-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="mt-2 text-xs font-semibold text-slate-400">No evaluations submitted yet.</p>
        </div>
      </div>
    </div>

    <!-- Company Profile Summary -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 24, delay: 500 } }"
      :class="panelClass"
    >
      <div class="mb-5 flex items-center justify-between">
        <div>
          <h3 class="text-base font-bold text-slate-950">Company Profile</h3>
          <p class="text-xs text-slate-500">Your registered company information</p>
        </div>
        <router-link to="/company/profile" class="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary-50 px-3 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100">
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Profile
        </router-link>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="space-y-1">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Company Name</p>
          <p class="text-sm font-semibold text-slate-900">{{ companyProfile.name || 'N/A' }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Industry</p>
          <p class="text-sm font-semibold text-slate-900">{{ companyProfile.industry || 'N/A' }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Contact Person</p>
          <p class="text-sm font-semibold text-slate-900">{{ companyProfile.contactPerson || 'N/A' }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</p>
          <p class="text-sm font-semibold text-slate-900">{{ companyProfile.phone || 'N/A' }}</p>
        </div>
      </div>

      <div v-if="companyLogoUrl" class="mt-4 flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
        <img :src="companyLogoUrl" alt="Company Logo" class="h-16 w-16 rounded-xl object-cover shadow-sm ring-2 ring-white" />
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Company Logo</p>
          <p class="text-sm font-medium text-slate-700">Uploaded brand logo</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useCompanyStore } from '@/stores/company'
import StatCard from '@/components/dashboard/StatCard.vue'

const router = useRouter()
const store = useCompanyStore()

const loading = ref(false)
const panelClass =
  'rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm ring-1 ring-white/70 transition-shadow duration-200 hover:shadow-md'

const displayName = ref('Company')

const companyProfile = ref({
  name: '', industry: '', contactPerson: '', phone: '', logoUrl: '',
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

const createActionIcon = (path: string) => {
  return defineComponent({
    setup() {
      return () =>
        h('svg', { class: 'h-5 w-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': 2, d: path }),
        ])
    },
  })
}

const statCardConfigs = computed(() => [
  {
    label: 'Active Internships', value: stats.value.activeInternships,
    description: 'Currently running program slots',
    colorClass: 'bg-gradient-to-br from-primary-500 to-primary-600 shadow-primary-500/20',
    icon: createActionIcon('M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'),
  },
  {
    label: 'Assigned Students', value: stats.value.assignedStudents,
    description: 'Across all active batches',
    colorClass: 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/20',
    icon: createActionIcon('M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'),
  },
  {
    label: 'Evaluations Submitted', value: stats.value.evaluationsSubmitted,
    description: 'Total evaluations recorded',
    colorClass: 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/20',
    icon: createActionIcon('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'),
  },
  {
    label: 'Pending Reviews', value: stats.value.pendingReviews,
    description: 'Awaiting evaluation action',
    colorClass: 'bg-gradient-to-br from-rose-500 to-rose-600 shadow-rose-500/20',
    icon: createActionIcon('M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'),
  },
])

const quickActions = [
  {
    label: 'View Students', route: '/company/students', bgColor: 'bg-primary-50/80',
    icon: createActionIcon('M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'),
  },
  {
    label: 'Submit Evaluation', route: '/company/evaluations', bgColor: 'bg-purple-50/50',
    icon: createActionIcon('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'),
  },
  {
    label: 'Provide Feedback', route: '/company/feedback', bgColor: 'bg-indigo-50/50',
    icon: createActionIcon('M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'),
  },
  {
    label: 'Internships', route: '/company/internships', bgColor: 'bg-emerald-50/50',
    icon: createActionIcon('M21 13.255A23.893 23.893 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'),
  },
  {
    label: 'Edit Profile', route: '/company/profile', bgColor: 'bg-amber-50/50',
    icon: createActionIcon('M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'),
  },
]

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function getStatusClass(status?: string) {
  switch ((status || '').toLowerCase()) {
    case 'active': case 'assigned': return 'bg-emerald-50 text-emerald-700'
    case 'in_progress': case 'in progress': return 'bg-blue-50 text-blue-700'
    case 'completed': return 'bg-slate-50 text-slate-700'
    case 'terminated': return 'bg-rose-50 text-rose-700'
    default: return 'bg-slate-50 text-slate-700'
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

function handleQuickAction(action: string) { router.push(action) }

async function load() {
  loading.value = true
  try {
    const [studentsData, evaluationsData] = await Promise.all([
      store.fetchStudents(),
      store.fetchEvaluations(),
    ])
    try { await store.fetchProfile() } catch { /* ignore */ }

    const raw = store.currentCompany
    if (raw) {
      displayName.value = raw.name || 'Company'
      companyProfile.value = {
        name: raw.name || '', industry: raw.industry || '',
        contactPerson: raw.contactPerson || '', phone: raw.phone || '', logoUrl: '',
      }
    }

    assignedStudents.value = Array.isArray(studentsData) ? studentsData : []
    recentEvaluations.value = (Array.isArray(evaluationsData) ? evaluationsData : []).slice(-5).reverse()

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
      pendingReviews: 0,
    }
  } catch { /* keep dashboard visible if secondary APIs fail */ }
  finally { loading.value = false }
}

onMounted(load)
</script>

<style scoped>
.dashboard-hero {
  position: relative;
  isolation: isolate;
  background:
    radial-gradient(circle at 12% 18%, rgba(14, 165, 233, 0.14), transparent 26%),
    radial-gradient(circle at 88% 12%, rgba(16, 185, 129, 0.12), transparent 28%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.9));
}

.dashboard-hero::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  content: '';
  background: linear-gradient(115deg, transparent 0%, rgba(255, 255, 255, 0.38) 38%, rgba(255, 255, 255, 0.78) 48%, rgba(255, 255, 255, 0.34) 58%, transparent 100%);
  transform: translateX(-115%);
  animation: heroShine 5.8s ease-in-out infinite;
}

.hero-lines { position: absolute; inset: 0; z-index: -1; overflow: hidden; pointer-events: none; }
.hero-lines span {
  position: absolute; right: -8%; width: 34%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.2), transparent);
  transform: rotate(-18deg); animation: lineDrift 7s ease-in-out infinite;
}
.hero-lines span:nth-child(1) { top: 22%; }
.hero-lines span:nth-child(2) { top: 48%; animation-delay: 900ms; }
.hero-lines span:nth-child(3) { top: 74%; animation-delay: 1.8s; }

@keyframes heroShine {
  0%, 48% { transform: translateX(-115%); }
  72%, 100% { transform: translateX(115%); }
}

@keyframes lineDrift {
  0%, 100% { opacity: 0.22; transform: translateX(0) rotate(-18deg); }
  50% { opacity: 0.68; transform: translateX(-24px) rotate(-18deg); }
}

@media (prefers-reduced-motion: reduce) {
  .dashboard-hero::before, .hero-lines span { animation: none; }
}
</style>
