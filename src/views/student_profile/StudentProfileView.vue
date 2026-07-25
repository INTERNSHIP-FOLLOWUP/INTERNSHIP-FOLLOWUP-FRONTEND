<template>
  <div class="space-y-6">
    <div>
      <router-link to="/admin/students" class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-800 mb-4">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m7-7l-7 7 7 7" />
        </svg>
        {{ $t('studentProfile.backToList') }}
      </router-link>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <p class="text-sm text-slate-500">{{ $t('studentProfile.loading') }}</p>
    </div>

    <template v-else-if="profile">
      <div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div class="flex items-start gap-5">
          <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-xl font-bold text-primary-600">
            {{ initials }}
          </div>
          <div class="flex-1 min-w-0">
            <h1 class="text-xl font-bold text-slate-900">{{ profile.student.name }}</h1>
            <p class="text-sm text-slate-500">{{ profile.student.email }}</p>
            <div class="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
              <span v-if="profile.student.student_code">{{ $t('studentProfile.codeLabel') }} {{ profile.student.student_code }}</span>
              <span v-if="profile.student.phone">{{ $t('studentProfile.phoneLabel') }} {{ profile.student.phone }}</span>
              <span v-if="profile.student.batch">{{ $t('studentProfile.batchLabel') }} {{ profile.student.batch.name }}</span>
            </div>
          </div>
          <div class="text-right">
            <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
              :class="profile.student.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'">
              {{ profile.student.status }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="profile.assignment" class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h2 class="text-base font-bold text-slate-900 mb-3">{{ $t('studentProfile.internshipAssignment') }}</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p class="text-xs text-slate-400">{{ $t('studentProfile.companyLabel') }}</p>
            <p class="font-semibold text-slate-700">{{ profile.assignment.company?.name || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400">{{ $t('studentProfile.positionLabel') }}</p>
            <p class="font-semibold text-slate-700">{{ profile.assignment.position }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400">{{ $t('studentProfile.durationLabel') }}</p>
            <p class="font-semibold text-slate-700">{{ formatDate(profile.assignment.start_date) }} — {{ formatDate(profile.assignment.end_date) }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400">{{ $t('common.status') }}</p>
            <span class="inline-flex rounded-full px-2 py-0.5 text-xs font-bold"
              :class="profile.assignment.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'">
              {{ profile.assignment.status }}
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-base font-bold text-slate-900">{{ $t('studentProfile.worklogs') }}</h2>
            <div class="flex gap-2 text-xs">
              <span class="rounded-full bg-blue-50 px-2 py-0.5 font-semibold text-blue-700">{{ profile.worklog_stats.submitted }} {{ $t('studentProfile.submitted') }}</span>
              <span class="rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">{{ profile.worklog_stats.approved }} {{ $t('studentProfile.approved') }}</span>
              <span class="rounded-full bg-rose-50 px-2 py-0.5 font-semibold text-rose-700">{{ profile.worklog_stats.rejected }} {{ $t('studentProfile.rejected') }}</span>
            </div>
          </div>
          <div v-if="profile.worklogs.length > 0" class="space-y-2">
            <div v-for="wl in profile.worklogs.slice(0, 5)" :key="wl.id"
              class="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-2.5 text-sm">
              <div>
                <span class="font-semibold text-slate-700">{{ $t('studentProfile.weekLabel') }} {{ wl.week_number }}</span>
                <span class="ml-2 text-xs text-slate-400">{{ formatDate(wl.submission_date) }}</span>
              </div>
              <span class="rounded-full px-2 py-0.5 text-xs font-bold"
                :class="wl.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : wl.status === 'rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'">
                {{ wl.status }}
              </span>
            </div>
          </div>
          <p v-else class="text-sm text-slate-400">{{ $t('studentProfile.noWorklogs') }}</p>
        </div>

        <div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 class="text-base font-bold text-slate-900 mb-4">{{ $t('studentProfile.evaluations') }}</h2>
          <div v-if="profile.evaluations.length > 0" class="space-y-3">
            <div v-for="ev in profile.evaluations" :key="ev.id"
              class="rounded-lg border border-slate-100 px-4 py-3 text-sm">
              <div class="flex items-center justify-between">
                <span class="font-semibold text-slate-700">{{ ev.company?.name || $t('studentProfile.companyFallback') }}</span>
                <span class="text-lg font-bold text-primary-600">{{ ev.overall_score }}</span>
              </div>
              <div class="mt-2 flex gap-3 text-xs text-slate-500">
                <span>{{ $t('studentProfile.techLabel') }} {{ ev.technical_skill }}</span>
                <span>{{ $t('studentProfile.commLabel') }} {{ ev.communication }}</span>
                <span>{{ $t('studentProfile.profLabel') }} {{ ev.professionalism }}</span>
                <span>{{ $t('studentProfile.attLabel') }} {{ ev.attendance }}</span>
              </div>
            </div>
            <p v-if="profile.average_score" class="text-xs text-slate-500">
              {{ $t('studentProfile.avgScore') }} <span class="font-bold text-primary-600">{{ profile.average_score }}</span>
            </p>
          </div>
          <p v-else class="text-sm text-slate-400">{{ $t('studentProfile.noEvaluations') }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 class="text-base font-bold text-slate-900 mb-4">{{ $t('studentProfile.issues') }}</h2>
          <div v-if="profile.issues.length > 0" class="space-y-2">
            <div v-for="issue in profile.issues" :key="issue.id"
              class="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-2.5 text-sm">
              <div class="min-w-0 flex-1">
                <p class="truncate font-semibold text-slate-700">{{ issue.title }}</p>
                <p class="text-xs text-slate-400">{{ formatDate(issue.created_at) }}</p>
              </div>
              <span class="ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-bold"
                :class="issue.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' : issue.status === 'Open' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'">
                {{ issue.status }}
              </span>
            </div>
          </div>
          <p v-else class="text-sm text-slate-400">{{ $t('studentProfile.noIssues') }}</p>
        </div>
      </div>
    </template>

    <div v-else-if="!loading" class="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
      <p class="text-sm text-slate-500">{{ $t('studentProfile.studentNotFound') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'

interface StudentProfileData {
  student: {
    id?: number | null
    student_code?: string | null
    name: string
    email: string
    phone?: string | null
    photo?: string | null
    status?: string | null
    batch?: { id?: number | null; name?: string | null } | null
  }
  worklogs: Array<{ id: number; week_number: number; submission_date: string; status: string }>
  worklog_stats: { total: number; submitted: number; approved: number; rejected: number }
  evaluations: Array<{ id: number; company?: { name?: string | null } | null; overall_score: number; technical_skill: number; communication: number; professionalism: number; attendance: number }>
  average_score: number | null
  issues: Array<{ id: number; title: string; created_at: string; status: string }>
  assignment: {
    id?: number
    position?: string
    start_date?: string
    end_date?: string
    status?: string
    company?: { id?: number; name?: string | null } | null
  } | null
}

const route = useRoute()
const profile = ref<StudentProfileData | null>(null)
const loading = ref(true)

const initials = computed(() => {
  if (!profile.value?.student?.name) return '?'
  return profile.value.student.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
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

async function fetchProfile() {
  const studentId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
  if (!studentId) return

  loading.value = true
  try {
    const res = await api.get(`/admin/students/${studentId}/activity`)
    profile.value = res.data as StudentProfileData
  } catch (err) {
    console.error('Failed to load student profile:', err)
    profile.value = null
  } finally {
    loading.value = false
  }
}

onMounted(fetchProfile)
watch(() => route.params.id, fetchProfile)
</script>
