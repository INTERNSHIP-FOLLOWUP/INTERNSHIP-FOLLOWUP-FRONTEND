<template>
  <div class="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
    <div class="mx-auto max-w-7xl space-y-6">
      <header class="sticky top-0 z-20 rounded-[28px] border border-slate-200/80 bg-white/90 px-5 py-4 shadow-[0_16px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:px-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 class="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Worklogs</h1>
            <p class="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Review and manage student work submissions with a calm, focused dashboard.
            </p>
          </div>
        </div>
      </header>

      <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article class="group rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500">Total Worklogs</p>
              <p class="mt-3 text-3xl font-semibold text-slate-900">{{ stats.total }}</p>
            </div>
            <div class="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V4a2 2 0 012-2h7l5 5v13a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p class="mt-4 text-sm text-emerald-600">+12% this week</p>
        </article>

        <article class="group rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500">Pending Review</p>
              <p class="mt-3 text-3xl font-semibold text-slate-900">{{ stats.pending }}</p>
            </div>
            <div class="rounded-2xl bg-amber-50 p-3 text-amber-600">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="mt-4 text-sm text-amber-600">Needs attention</p>
        </article>

        <article class="group rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500">Reviewed</p>
              <p class="mt-3 text-3xl font-semibold text-slate-900">{{ stats.reviewed }}</p>
            </div>
            <div class="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p class="mt-4 text-sm text-emerald-600">Ready for next step</p>
        </article>

        <article class="group rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500">Overdue</p>
              <p class="mt-3 text-3xl font-semibold text-slate-900">{{ stats.overdue }}</p>
            </div>
            <div class="rounded-2xl bg-rose-50 p-3 text-rose-600">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
          </div>
          <p class="mt-4 text-sm text-rose-600">Needs follow-up</p>
        </article>
      </section>

      <section class="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 class="text-lg font-semibold text-slate-900">Review filters</h2>
            <p class="text-sm text-slate-500">Find students quickly and focus on the submissions that need attention.</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button type="button" class="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700" @click="applyFilters">
              Search
            </button>
            <button type="button" class="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" @click="resetFilters">
              Reset filters
            </button>
          </div>
        </div>

        <div class="mt-5 grid gap-4 lg:grid-cols-4 xl:grid-cols-6">
          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-600">Search</span>
            <input v-model="studentSearch" type="text" placeholder="Student name" class="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white" />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-600">Student ID</span>
            <input v-model.number="studentIdFilter" type="number" min="1" placeholder="ID" class="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white" />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-600">Week</span>
            <input v-model.number="weekFilter" type="number" min="1" placeholder="Week" class="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white" />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-600">Status</span>
            <select v-model="statusFilter" class="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white">
              <option value="">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Needs Revision">Needs Revision</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-600">From</span>
            <input v-model="dateFrom" type="date" class="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white" />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-600">To</span>
            <input v-model="dateTo" type="date" class="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white" />
          </label>
        </div>
      </section>

      <section class="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div v-if="store.loading" class="flex min-h-[280px] items-center justify-center">
          <div class="flex flex-col items-center gap-3 text-slate-500">
            <svg class="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p class="text-sm font-medium">Loading worklogs…</p>
          </div>
        </div>

        <div v-else-if="store.error" class="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
          <div class="rounded-3xl bg-rose-50 p-4 text-rose-600">
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p class="mt-4 text-sm font-semibold text-rose-600">{{ store.error }}</p>
          <p class="mt-1 text-sm text-slate-500">Please try again in a moment.</p>
        </div>

        <div v-else-if="filteredWorklogs.length === 0" class="flex min-h-[320px] flex-col items-center justify-center px-6 py-12 text-center">
          <div class="rounded-full bg-indigo-50 p-4 text-indigo-600">
            <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M9 17v-6m3 6V7m3 10v-2M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="mt-5 text-lg font-semibold text-slate-900">No worklogs to review</h3>
          <p class="mt-2 max-w-md text-sm text-slate-500">Student submissions will appear here once they are submitted.</p>
          <button type="button" class="mt-6 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700" @click="resetFilters">
            Refresh
          </button>
        </div>

        <div v-else>
          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3 p-4">
            <article v-for="worklog in filteredWorklogs" :key="worklog.id" class="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Week {{ worklog.week_number }}</p>
                  <h3 class="mt-2 text-base font-semibold text-slate-900">{{ worklog.description || 'Weekly submission' }}</h3>
                </div>
                <WorklogStatusBadge :status="worklog.status" />
              </div>

              <p class="mt-4 text-sm leading-6 text-slate-600 line-clamp-3">{{ worklog.description || 'No summary provided for this submission.' }}</p>

              <div class="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <div class="rounded-2xl bg-slate-50 p-3">
                  <p class="text-xs text-slate-400">Student</p>
                  <p class="mt-1 font-semibold text-slate-900">{{ worklog.student?.name || '—' }}</p>
                </div>
                <div class="rounded-2xl bg-slate-50 p-3">
                  <p class="text-xs text-slate-400">Submitted</p>
                  <p class="mt-1 font-semibold text-slate-900">{{ formatDate(worklog.submitted_at) }}</p>
                </div>
              </div>

              <div class="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
                <span>{{ (worklog.attachments || []).length }} attachments</span>
                <span class="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{{ getPriority(worklog) }}</span>
              </div>

              <div class="mt-4 flex gap-2">
                <router-link :to="`/tutor/worklogs/${worklog.id}`" class="flex-1 rounded-2xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
                  Review
                </router-link>
                <button type="button" class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Comment
                </button>
              </div>
            </article>
          </div>
        </div>

        <div v-if="store.tutorPagination" class="border-t border-slate-100 px-4 py-3 sm:px-6">
          <Pagination :meta="store.tutorPagination" @page-change="setPage" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWorklogStore } from '@/stores/worklogStore'
import { useAuthStore } from '@/stores/auth'
import Pagination from '@/components/ui/Pagination.vue'
import WorklogStatusBadge from '@/components/worklog/WorklogStatusBadge.vue'
import { usePagination } from '@/composables/usePagination'
import type { Worklog, WorklogStatus } from '@/types/worklog'

const store = useWorklogStore()
const authStore = useAuthStore()

const studentSearch = ref('')
const studentIdFilter = ref<number | null>(null)
const weekFilter = ref<number | null>(null)
const statusFilter = ref<WorklogStatus | ''>('')
const dateFrom = ref('')
const dateTo = ref('')
const courseFilter = ref('')
const activeFilters = ref({
  search: '',
  studentId: null as number | null,
  week: null as number | null,
  status: '' as WorklogStatus | '',
  dateFrom: '',
  dateTo: '',
  course: '',
})

const worklogs = computed<Worklog[]>(() => store.tutorWorklogs || [])
const initials = computed(() => initialsFor(authStore.userName || 'Tutor'))

const stats = computed(() => {
  const items = worklogs.value
  const pending = items.filter((item) => item.status === 'Pending').length
  const reviewed = items.filter((item) => item.status === 'Reviewed' || item.status === 'Approved').length
  const overdue = items.filter((item) => {
    if (item.status !== 'Pending' && item.status !== 'Needs Revision') return false
    const submitted = new Date(item.submitted_at)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24))
    return Number.isFinite(diffDays) && diffDays > 7
  }).length

  return {
    total: items.length,
    pending,
    reviewed,
    overdue,
  }
})

const filteredWorklogs = computed(() => {
  const query = activeFilters.value.search.trim().toLowerCase()
  const studentId = activeFilters.value.studentId
  const week = activeFilters.value.week
  const status = activeFilters.value.status
  const from = activeFilters.value.dateFrom
  const to = activeFilters.value.dateTo
  const course = activeFilters.value.course.trim().toLowerCase()

  return worklogs.value.filter((worklog) => {
    const studentName = (worklog.student?.name || '').toLowerCase()
    const studentCode = String((worklog.student as any)?.student_code || '').toLowerCase()
    const submittedAt = worklog.submitted_at ? new Date(worklog.submitted_at) : null

    const matchesSearch = !query || studentName.includes(query) || studentCode.includes(query)
    const matchesStudentId = !studentId || Number((worklog.student as any)?.id) === studentId || Number((worklog.student as any)?.student_code) === studentId
    const matchesWeek = !week || worklog.week_number === week
    const matchesStatus = !status || worklog.status === status
    const matchesCourse = !course || String((worklog.student as any)?.batch || '').toLowerCase().includes(course)
    const matchesDateFrom = !from || !submittedAt || submittedAt >= new Date(from)
    const matchesDateTo = !to || !submittedAt || submittedAt <= new Date(`${to}T23:59:59`)

    return matchesSearch && matchesStudentId && matchesWeek && matchesStatus && matchesCourse && matchesDateFrom && matchesDateTo
  })
})

function fetchPage({ page }: { page: number }) {
  store.fetchTutorWorklogs({
    page,
    student_id: studentIdFilter.value ?? undefined,
    status: statusFilter.value || undefined,
    search: studentSearch.value ? studentSearch.value : undefined,
  } as any)
}

const { setPage } = usePagination(fetchPage)

function applyFilters() {
  activeFilters.value = {
    search: studentSearch.value,
    studentId: studentIdFilter.value,
    week: weekFilter.value,
    status: statusFilter.value,
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
    course: courseFilter.value,
  }
  setPage(1)
}

function resetFilters() {
  studentSearch.value = ''
  studentIdFilter.value = null
  weekFilter.value = null
  statusFilter.value = ''
  dateFrom.value = ''
  dateTo.value = ''
  courseFilter.value = ''
  activeFilters.value = {
    search: '',
    studentId: null,
    week: null,
    status: '',
    dateFrom: '',
    dateTo: '',
    course: '',
  }
  setPage(1)
}

function formatDate(date?: string): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function initialsFor(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'S'
}

function getPriority(worklog: Worklog): 'High' | 'Medium' | 'Low' {
  if (worklog.status === 'Pending' || worklog.status === 'Needs Revision') return 'High'
  if (worklog.status === 'Reviewed') return 'Medium'
  return 'Low'
}

function priorityClass(priority: 'High' | 'Medium' | 'Low') {
  switch (priority) {
    case 'High': return 'bg-rose-50 text-rose-700'
    case 'Medium': return 'bg-amber-50 text-amber-700'
    default: return 'bg-emerald-50 text-emerald-700'
  }
}
</script>




