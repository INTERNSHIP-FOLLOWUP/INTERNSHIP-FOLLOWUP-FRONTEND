<template>
  <div class="space-y-6">
    <div>
      <router-link to="/admin/tutors" class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-800 mb-4">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m7-7l-7 7 7 7" />
        </svg>
        Back to Tutors
      </router-link>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <p class="text-sm text-slate-500">Loading profile...</p>
    </div>

    <template v-else-if="profile">
      <div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div class="flex items-start gap-5">
          <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-xl font-bold text-primary-600">
            {{ initials }}
          </div>
          <div class="flex-1 min-w-0">
            <h1 class="text-xl font-bold text-slate-900">{{ profile.tutor.name }}</h1>
            <p class="text-sm text-slate-500 truncate max-w-[250px]">{{ profile.tutor.email }}</p>
            <p class="mt-1 text-sm font-semibold text-primary-600">{{ profile.tutor.students_count }} assigned student{{ profile.tutor.students_count !== 1 ? 's' : '' }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Worklogs</p>
          <div class="mt-3 flex gap-3 text-sm">
            <span class="rounded-full bg-amber-50 px-3 py-1 font-bold text-amber-700">{{ profile.worklog_stats.submitted }} Submitted</span>
            <span class="rounded-full bg-emerald-50 px-3 py-1 font-bold text-emerald-700">{{ profile.worklog_stats.approved }} Approved</span>
            <span class="rounded-full bg-rose-50 px-3 py-1 font-bold text-rose-700">{{ profile.worklog_stats.rejected }} Rejected</span>
          </div>
        </div>
        <div class="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Issues</p>
          <p class="mt-3 text-2xl font-bold text-slate-900">{{ profile.issues.length }}</p>
        </div>
        <div class="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Assignments</p>
          <p class="mt-3 text-2xl font-bold text-slate-900">{{ profile.assignments.length }}</p>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h2 class="text-base font-bold text-slate-900 mb-4">Assigned Students ({{ profile.students.length }})</h2>
        <div v-if="profile.students.length > 0" class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th class="py-3 pr-4 font-medium">Name</th>
                <th class="py-3 pr-4 font-medium">Student ID</th>
                <th class="py-3 pr-4 font-medium">Batch</th>
                <th class="py-3 pr-4 font-medium">Worklogs</th>
                <th class="py-3 pr-4 font-medium">Issues</th>
                <th class="py-3 pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="s in profile.students" :key="s.id" @click="viewStudent(s.user_id)" class="cursor-pointer hover:bg-slate-50/50">
                <td class="py-3 pr-4 font-semibold text-slate-900">{{ s.name }}</td>
                <td class="py-3 pr-4 text-slate-500">{{ formatStudentId(s.student_code, s.batch) }}</td>
                <td class="py-3 pr-4 text-slate-500">{{ s.batch }}</td>
                <td class="py-3 pr-4 text-slate-500">{{ s.worklogs_count }}</td>
                <td class="py-3 pr-4 text-slate-500">{{ s.issues_count }}</td>
                <td class="py-3">
                  <span class="rounded-full px-2.5 py-0.5 text-xs font-bold"
                    :class="s.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'">
                    {{ s.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-sm text-slate-400">No students assigned.</p>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 class="text-base font-bold text-slate-900 mb-4">Issues</h2>
          <div v-if="profile.issues.length > 0" class="space-y-2">
            <div v-for="issue in profile.issues" :key="issue.id"
              class="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-2.5 text-sm">
              <div class="min-w-0 flex-1">
                <p class="truncate font-semibold text-slate-700">{{ issue.title }}</p>
                <p class="text-xs text-slate-400">{{ issue.student?.name }} &middot; {{ formatDate(issue.created_at) }}</p>
              </div>
              <span class="ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-bold"
                :class="issue.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' : issue.status === 'Open' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'">
                {{ issue.status }}
              </span>
            </div>
          </div>
          <p v-else class="text-sm text-slate-400">No issues assigned.</p>
        </div>

        <div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 class="text-base font-bold text-slate-900 mb-4">Supervised Assignments</h2>
          <div v-if="profile.assignments.length > 0" class="space-y-2">
            <div v-for="a in profile.assignments" :key="a.id"
              class="rounded-lg border border-slate-100 px-4 py-3 text-sm">
              <div class="flex items-center justify-between">
                <span class="font-semibold text-slate-700">{{ a.student?.name }}</span>
                <span class="rounded-full px-2 py-0.5 text-xs font-bold"
                  :class="a.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'">
                  {{ a.status }}
                </span>
              </div>
              <p class="mt-1 text-xs text-slate-500">{{ a.company?.name }} &middot; {{ a.position }} &middot; {{ formatDate(a.start_date) }} — {{ formatDate(a.end_date) }}</p>
            </div>
          </div>
          <p v-else class="text-sm text-slate-400">No supervised assignments.</p>
        </div>
      </div>
    </template>

    <div v-else-if="!loading" class="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
      <p class="text-sm text-slate-500">Tutor not found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { formatStudentId } from '@/utils/studentUtils'

interface TutorProfileData {
  tutor: {
    id?: number | null
    name: string
    email: string
    students_count: number
  }
  students: Array<{
    id: number
    student_code?: string | null
    name: string
    email?: string | null
    phone?: string | null
    status?: string | null
    batch?: string | null
    worklogs_count: number
    issues_count: number
    user_id: number
  }>
  worklog_stats: { total: number; submitted: number; approved: number; rejected: number }
  issues: Array<{ id: number; title: string; status: string; created_at: string; student?: { name?: string | null } | null }>
  assignments: Array<{ id: number; status?: string | null; position?: string | null; start_date?: string | null; end_date?: string | null; company?: { name?: string | null } | null; student?: { name?: string | null } | null }>
}

const route = useRoute()
const router = useRouter()
const profile = ref<TutorProfileData | null>(null)
const loading = ref(true)

const initials = computed(() => {
  if (!profile.value?.tutor?.name) return '?'
  return profile.value.tutor.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
})

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—'
  const str = String(dateStr)
  const part0 = str.split('T')[0] ?? ''
  const raw = part0.split(' ')[0] ?? ''
  const parts = raw.split('-')
  if (parts.length === 3) {
    const year = parts[0]
    const month = parts[1]
    const day = parts[2]
    if (year && month && day) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const mIdx = parseInt(month, 10) - 1
      if (mIdx >= 0 && mIdx < 12 && months[mIdx]) {
        return `${parseInt(day, 10)} ${months[mIdx]} ${year}`
      }
    }
  }
  const d = new Date(dateStr)
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  return dateStr
}

function viewStudent(userId: number | null | undefined) {
  if (!userId) return
  router.push(`/admin/student-profile/${userId}`)
}

async function fetchProfile() {
  const tutorId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
  if (!tutorId) return

  loading.value = true
  try {
    const res = await api.get(`/admin/tutors/${tutorId}/activity`)
    profile.value = res.data as TutorProfileData
  } catch (err) {
    console.error('Failed to load tutor profile:', err)
    profile.value = null
  } finally {
    loading.value = false
  }
}

onMounted(fetchProfile)
watch(() => route.params.id, fetchProfile)
</script>
