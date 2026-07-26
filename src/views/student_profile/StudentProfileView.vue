<template>
  <div class="space-y-6">

    <div class="flex items-center gap-3 text-sm">
      <router-link
        to="/admin/students"
        class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Students
      </router-link>
      <span class="text-slate-300">/</span>
      <span class="font-medium text-slate-900">Student Profile</span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-24 gap-3">
      <div class="h-8 w-8 animate-spin rounded-full border-[3px] border-primary-200 border-t-primary-600"></div>
      <p class="text-sm text-slate-400">Loading profile…</p>
    </div>

    <template v-else-if="profile">

      <!-- ── Header Card ── -->
      <div class="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div class="h-2 bg-gradient-to-r from-primary-500 via-indigo-500 to-violet-500"></div>
        <div class="flex flex-col sm:flex-row sm:items-center gap-5 p-6">

          <!-- Avatar -->
          <div class="relative shrink-0">
            <div v-if="profile.student.photo"
              class="h-20 w-20 rounded-2xl overflow-hidden ring-2 ring-primary-100">
              <img :src="profile.student.photo" :alt="profile.student.name" class="h-full w-full object-cover" />
            </div>
            <div v-else
              class="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-indigo-500 text-2xl font-bold text-white shadow-md shadow-primary-200">
              {{ initials }}
            </div>
            <!-- Status dot -->
            <span class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white"
              :class="profile.student.status === 'active' ? 'bg-emerald-400' : 'bg-slate-300'"></span>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 class="text-2xl font-bold tracking-tight text-slate-900">{{ profile.student.name }}</h1>
                <p class="mt-0.5 text-sm text-slate-400 truncate max-w-[250px]">{{ profile.student.email }}</p>
              </div>
              <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1"
                :class="profile.student.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                  : 'bg-slate-100 text-slate-500 ring-slate-200'">
                <span class="h-1.5 w-1.5 rounded-full"
                  :class="profile.student.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                {{ capitalize(profile.student.status || 'unknown') }}
              </span>
            </div>

            <!-- Meta chips -->
            <div class="mt-3 flex flex-wrap gap-2">
              <span v-if="profile.student.student_code"
                class="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-100">
                <svg class="h-3 w-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                {{ formatStudentId(profile.student.student_code, profile.student.batch) }}
              </span>
              <span v-if="profile.student.phone"
                class="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-100">
                <svg class="h-3 w-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {{ profile.student.phone }}
              </span>
              <span v-if="profile.student.batch"
                class="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 ring-1 ring-primary-100">
                <svg class="h-3 w-3 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {{ profile.student.batch.name }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-6 items-start">
        <!-- ── Internship Assignment ── -->
        <div v-if="profile.assignment" class="flex-1 w-full rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div class="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-50">
          <div class="flex items-center gap-2.5">
            <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50">
              <svg class="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <h2 class="text-base font-bold text-slate-900">Internship Assignment</h2>
          </div>
          <span class="rounded-full px-3 py-1 text-xs font-bold ring-1"
            :class="assignmentStatusClass(profile.assignment.status)">
            {{ profile.assignment.status || 'Unknown' }}
          </span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-slate-50 px-6 py-4">
          <div class="py-3 sm:py-2 sm:pr-6">
            <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Company</p>
            <p class="mt-1 text-sm font-semibold text-slate-800">{{ profile.assignment.company?.name || '—' }}</p>
          </div>
          <div class="py-3 sm:py-2 sm:px-6">
            <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Position</p>
            <p class="mt-1 text-sm font-semibold text-slate-800">{{ profile.assignment.position || '—' }}</p>
          </div>
          <div class="py-3 sm:py-2 sm:pl-6">
            <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Duration</p>
            <p class="mt-1 text-sm font-semibold text-slate-800">
              {{ formatDate(profile.assignment.start_date) }}
              <span class="text-slate-400 mx-1">→</span>
              {{ formatDate(profile.assignment.end_date) }}
            </p>
          </div>
        </div>
      </div>


      
      <!-- ── Total Worklogs Card ── -->
      <div class="flex-1 w-full rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col justify-between">
        <div class="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-50">
          <div class="flex items-center gap-2.5">
            <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50">
              <svg class="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
            <h2 class="text-base font-bold text-slate-900">Total Worklogs</h2>
          </div>
        </div>
        <div class="px-6 py-5 flex items-center justify-between">
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Total Submitted</p>
            <p class="mt-1 text-3xl font-extrabold text-slate-800">{{ profile.worklog_stats.submitted }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Worklogs ── -->
    <div class="rounded-2xl border border-slate-100 bg-white shadow-sm">

        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-4 px-6 pt-5 pb-4 border-b border-slate-50">
          <div class="flex items-center gap-2.5">
            <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50">
              <svg class="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
            <h2 class="text-base font-bold text-slate-900">Worklogs</h2>
          </div>


        </div>

        <!-- Progress bar -->
        <div v-if="profile.worklog_stats.submitted > 0" class="px-6 py-3 border-b border-slate-50">
          <div class="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Approval Progress</span>
            <span class="font-semibold text-slate-600">
              {{ profile.worklog_stats.approved }}/{{ profile.worklog_stats.submitted }}
            </span>
          </div>
          <div class="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div class="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
              :style="{ width: approvalPercent + '%' }"></div>
          </div>
        </div>

        <!-- Worklog list -->
        <div class="px-6 py-4">
          <div v-if="profile.worklogs.length > 0" class="space-y-2">
            <div v-for="wl in profile.worklogs" :key="wl.id"
              class="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 transition-all hover:border-slate-200 hover:bg-white hover:shadow-sm">
              <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                  :class="worklogWeekClass(wl.status)">
                  W{{ wl.week_number }}
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-700">Week {{ wl.week_number }}</p>
                  <p class="text-xs text-slate-400">{{ formatDate(wl.submission_date) }}</p>
                </div>
              </div>
              <span class="rounded-full px-2.5 py-0.5 text-xs font-bold ring-1"
                :class="worklogStatusClass(wl.status)">
                {{ capitalize(wl.status) }}
              </span>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else class="flex flex-col items-center justify-center py-12 gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
              <svg class="h-6 w-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p class="text-sm font-medium text-slate-400">No worklogs submitted yet</p>
          </div>
        </div>
      </div>

    </template>

    <!-- Not found -->
    <div v-else-if="!loading" class="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white py-20 gap-3 shadow-sm">
      <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
        <svg class="h-7 w-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <p class="text-sm font-semibold text-slate-400">Student not found</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import { formatStudentId } from '@/utils/studentUtils'

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



const pendingCount = computed(() => {
  if (!profile.value) return 0
  const { submitted, approved, rejected } = profile.value.worklog_stats
  return Math.max(0, submitted - approved - rejected)
})

const approvalPercent = computed(() => {
  const stats = profile.value?.worklog_stats
  if (!stats || stats.submitted === 0) return 0
  return Math.round((stats.approved / stats.submitted) * 100)
})

function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—'
  const str = String(dateStr)
  const raw = str.split('T')[0]?.split(' ')[0] ?? ''
  const parts = raw.split('-')
  if (parts.length === 3) {
    const [year, month, day] = parts
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

function assignmentStatusClass(status?: string): string {
  switch (status) {
    case 'In Progress': return 'bg-blue-50 text-blue-700 ring-blue-100'
    case 'Completed':   return 'bg-emerald-50 text-emerald-700 ring-emerald-100'
    case 'Terminated':  return 'bg-rose-50 text-rose-700 ring-rose-100'
    default:            return 'bg-indigo-50 text-indigo-700 ring-indigo-100'
  }
}

function worklogStatusClass(status: string): string {
  switch (status?.toLowerCase()) {
    case 'approved': return 'bg-emerald-50 text-emerald-700 ring-emerald-100'
    case 'rejected': return 'bg-rose-50 text-rose-700 ring-rose-100'
    default:         return 'bg-amber-50 text-amber-700 ring-amber-100'
  }
}

function worklogWeekClass(status: string): string {
  switch (status?.toLowerCase()) {
    case 'approved': return 'bg-emerald-100 text-emerald-700'
    case 'rejected': return 'bg-rose-100 text-rose-700'
    default:         return 'bg-amber-100 text-amber-700'
  }
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
