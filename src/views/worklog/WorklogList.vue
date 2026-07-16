<template>
  <div class="space-y-6 p-4 sm:p-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-slate-900">Worklogs</h1>
        <p class="mt-1 text-sm text-slate-500">Track your weekly internship progress.</p>
      </div>

      <router-link
        to="/student/worklogs/create"
        class="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Create Worklog
      </router-link>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div v-for="card in summaryCards" :key="card.label" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500">{{ card.label }}</p>
            <p class="mt-2 text-2xl font-semibold text-slate-900">{{ card.value }}</p>
          </div>
          <div class="rounded-2xl p-3" :class="card.iconClass">
            <component :is="card.icon" class="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div class="flex-1">
          <label class="block text-sm font-medium text-slate-700">Search</label>
          <div class="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by week or description..."
              class="h-11 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div class="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div>
            <label class="block text-sm font-medium text-slate-700">Status Filter</label>
            <select v-model="statusFilter" class="mt-2 h-11 min-w-[150px] rounded-2xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100">
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Needs Revision">Needs Revision</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700">Week Filter</label>
            <select v-model="weekFilter" class="mt-2 h-11 min-w-[140px] rounded-2xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100">
              <option value="">All Weeks</option>
              <option v-for="week in weeks" :key="week" :value="String(week)">Week {{ week }}</option>
            </select>
          </div>

          <div class="flex gap-2 sm:ml-2">
            <button type="button" class="h-11 rounded-2xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700" @click="onSearch">
              Search
            </button>
            <button type="button" class="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" @click="resetFilters">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div v-if="store.loading" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div v-for="index in 6" :key="index" class="animate-pulse rounded-2xl border border-slate-200 p-4">
          <div class="h-3 w-20 rounded bg-slate-200"></div>
          <div class="mt-3 h-4 w-3/4 rounded bg-slate-200"></div>
          <div class="mt-3 h-4 w-full rounded bg-slate-100"></div>
          <div class="mt-3 h-4 w-2/3 rounded bg-slate-100"></div>
          <div class="mt-4 h-10 rounded-2xl bg-slate-100"></div>
        </div>
      </div>

      <div v-else-if="store.error" class="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 px-6 py-16 text-center">
        <svg class="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p class="mt-4 text-sm font-semibold text-red-700">{{ store.error }}</p>
      </div>

      <div v-else-if="filteredWorklogs.length === 0" class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-6 py-16 text-center">
        <svg class="h-16 w-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 class="mt-4 text-lg font-semibold text-slate-900">No Worklogs Yet</h3>
        <p class="mt-2 max-w-md text-sm text-slate-500">Start documenting your internship by submitting your first weekly worklog.</p>
        <router-link to="/student/worklogs/create" class="mt-5 inline-flex items-center rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
          Create Worklog
        </router-link>
      </div>

      <div v-else class="space-y-5">
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article v-for="worklog in filteredWorklogs" :key="worklog.id" class="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Week {{ worklog.week_number }}</p>
                <h3 class="mt-2 text-base font-semibold text-slate-900">{{ worklog.description.slice(0, 70) }}{{ worklog.description.length > 70 ? '…' : '' }}</h3>
              </div>
              <WorklogStatusBadge :status="worklog.status" />
            </div>

            <div class="mt-4 space-y-2 text-sm text-slate-600">
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Submission</span>
                <span class="font-medium text-slate-700">{{ formatDate(worklog.submitted_at) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Description</span>
                <span class="font-medium text-slate-700">{{ previewText(worklog.description) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Challenges</span>
                <span class="font-medium text-slate-700">{{ previewText(worklog.challenges || '—') }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Attachments</span>
                <span class="font-medium text-slate-700">{{ (worklog.attachments || []).length }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Updated</span>
                <span class="font-medium text-slate-700">{{ formatDate(worklog.updated_at || worklog.submitted_at) }}</span>
              </div>
            </div>

            <div class="mt-5 flex flex-wrap gap-2">
              <router-link :to="`/student/worklogs/${worklog.id}`" class="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                View
              </router-link>
              <router-link v-if="isEditable(worklog)" :to="`/student/worklogs/${worklog.id}/edit`" class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100">
                Edit
              </router-link>
              <button v-if="canDelete(worklog)" type="button" class="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100" @click="handleDelete(worklog.id)">
                Delete
              </button>
            </div>
          </article>
        </div>

        <div class="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-slate-500">
            Showing {{ paginationMeta.from || 0 }}–{{ paginationMeta.to || 0 }} of {{ paginationMeta.total || 0 }} worklogs
          </p>
          <Pagination v-if="store.pagination" :meta="store.pagination" @page-change="handlePageChange" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useWorklogStore } from '@/stores/worklogStore'
import Pagination from '@/components/ui/Pagination.vue'
import WorklogStatusBadge from '@/components/worklog/WorklogStatusBadge.vue'
import type { Worklog, WorklogStatus } from '@/types/worklog'
import { ClipboardListIcon, ClockIcon, CheckCircleIcon, AlertTriangleIcon } from 'lucide-vue-next'

const store = useWorklogStore()

const weeks = Array.from({ length: 52 }, (_, i) => i + 1)
const weekFilter = ref('')
const statusFilter = ref('')
const searchQuery = ref('')
const currentPage = ref(1)

const summaryCards = computed(() => {
  const worklogs = store.worklogs || []
  const pending = worklogs.filter((item) => item.status === 'Pending').length
  const approved = worklogs.filter((item) => item.status === 'Approved').length
  const needsRevision = worklogs.filter((item) => item.status === 'Needs Revision').length

  return [
    { label: 'Total Worklogs', value: worklogs.length, icon: ClipboardListIcon, iconClass: 'bg-blue-50 text-blue-600' },
    { label: 'Pending Review', value: pending, icon: ClockIcon, iconClass: 'bg-amber-50 text-amber-600' },
    { label: 'Approved', value: approved, icon: CheckCircleIcon, iconClass: 'bg-green-50 text-green-600' },
    { label: 'Needs Revision', value: needsRevision, icon: AlertTriangleIcon, iconClass: 'bg-red-50 text-red-600' },
  ]
})

const filteredWorklogs = computed(() => store.worklogs || [])
const paginationMeta = computed(() => store.pagination || { from: 0, to: 0, total: 0 })

async function loadWorklogs(page = 1) {
  currentPage.value = page
  await store.fetchWorklogs({
    page,
    week: weekFilter.value ? Number(weekFilter.value) : undefined,
    status: normalizeStatus(statusFilter.value),
    search: searchQuery.value.trim() || undefined,
  })
}

function normalizeStatus(value: string): WorklogStatus | undefined {
  if (!value) return undefined
  return value as WorklogStatus
}

function onSearch() {
  loadWorklogs(1)
}

function resetFilters() {
  searchQuery.value = ''
  weekFilter.value = ''
  statusFilter.value = ''
  loadWorklogs(1)
}

function handlePageChange(page: number) {
  loadWorklogs(page)
}

function previewText(value: string): string {
  if (!value || value === '—') return '—'
  return value.length > 18 ? `${value.slice(0, 18)}…` : value
}

function formatDate(date?: string): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function isEditable(worklog: Worklog): boolean {
  if (typeof worklog.can_edit === 'boolean') return worklog.can_edit
  return worklog.status === 'Pending' || worklog.status === 'Reviewed'
}

function canDelete(worklog: Worklog): boolean {
  return Boolean(worklog.can_delete)
}

async function handleDelete(id: number) {
  if (!window.confirm('Delete this worklog?')) return
  try {
    await store.deleteWorklog(id)
  } catch {
    // handled by the store error state
  }
}

onMounted(() => {
  loadWorklogs(1)
})
</script>

