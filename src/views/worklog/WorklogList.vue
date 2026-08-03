<template>
  <div class="p-6 space-y-6">
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Worklogs</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Student worklog history.</p>
      </div>

      <router-link
        to="/student/worklogs/create"
        class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-600 active:scale-95"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Create Worklog
      </router-link>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <select
        v-model="statusFilter"
        @change="onFilterChange"
        class="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      >
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Reviewed">Reviewed</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>
    </div>

    <div class="rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div v-if="store.loading" class="flex items-center justify-center py-16">
        <svg class="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>

      <div v-else-if="store.error" class="flex flex-col items-center justify-center py-16 text-center">
        <svg class="h-10 w-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p class="mt-3 text-sm font-semibold text-red-500">{{ store.error }}</p>
      </div>

      <div v-else>
        <!-- Desktop table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full border-collapse text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-500">
                <th class="px-5 py-3.5">Date</th>
                <th class="px-5 py-3.5">Work Activities</th>
                <th class="px-5 py-3.5">Status</th>
                <th class="px-5 py-3.5">Submitted</th>
                <th class="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
              <tr
                v-for="w in store.worklogs"
                :key="w.id"
                class="hover:bg-slate-50/30 transition-colors dark:hover:bg-slate-800/30"
              >
                <td class="whitespace-nowrap px-5 py-4">{{ w.work_date ? formatDate(w.work_date) + ' ' + formatTimeRange(w.work_time) : '—' }}</td>
                <td class="whitespace-nowrap px-5 py-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                  {{ w.work_activities || w.description || '—' }}
                </td>
                <td class="whitespace-nowrap px-5 py-4">
                  <WorklogStatusBadge :status="w.status" />
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-slate-500 text-xs dark:text-slate-400">
                  {{ formatDate(w.submitted_at || w.created_at) }}
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-right">
                  <div class="inline-flex items-center gap-1.5">
                    <router-link
                      :to="`/student/worklogs/${w.id}`"
                      class="rounded-lg px-2.5 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-all dark:text-indigo-400 dark:hover:bg-indigo-950/30"
                    >View</router-link>
                    <router-link
                      v-if="isEditable(w)"
                      :to="`/student/worklogs/${w.id}/edit`"
                      class="rounded-lg px-2.5 py-1.5 text-xs font-bold text-amber-600 hover:bg-amber-50 transition-all dark:text-amber-400 dark:hover:bg-amber-950/30"
                    >Edit</router-link>
                    <button
                      v-if="isEditable(w)"
                      type="button"
                      class="rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-all dark:text-red-400 dark:hover:bg-red-950/30"
                      @click="promptDelete(w)"
                    >
                      <svg class="mr-0.5 inline-block h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile cards -->
        <div class="md:hidden space-y-4 px-4 py-4">
          <div v-if="store.worklogs.length === 0" class="hidden" />
          <div v-for="w in store.worklogs" :key="w.id" class="rounded-2xl border border-slate-100 p-4 bg-white dark:border-slate-700 dark:bg-slate-800">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-xs font-semibold text-slate-500 dark:text-slate-400">Date</p>
                <p class="text-sm font-bold text-slate-900 dark:text-slate-100">{{ w.work_date ? formatDate(w.work_date) + ' ' + formatTimeRange(w.work_time) : '—' }}</p>
              </div>
              <WorklogStatusBadge :status="w.status" />
            </div>
            <p class="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{{ w.work_activities || w.description || '—' }}</p>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Submitted: {{ formatDate(w.submitted_at || w.created_at) }}</p>

            <div class="mt-4 flex items-center gap-2">
              <router-link
                :to="`/student/worklogs/${w.id}`"
                class="inline-flex flex-1 items-center justify-center rounded-xl bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-400 dark:hover:bg-indigo-900/40"
              >View</router-link>
              <router-link
                v-if="isEditable(w)"
                :to="`/student/worklogs/${w.id}/edit`"
                class="inline-flex flex-1 items-center justify-center rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:hover:bg-amber-900/40"
              >Edit</router-link>
              <button
                v-if="isEditable(w)"
                type="button"
                class="inline-flex flex-1 items-center justify-center rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/40"
                @click="promptDelete(w)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div v-if="store.worklogs.length === 0" class="flex flex-col items-center justify-center py-16 text-center px-6">
          <svg class="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p class="mt-3 text-sm font-semibold text-slate-400">No worklogs found.</p>
        </div>

        <div v-if="store.pagination" class="mt-2">
          <Pagination :meta="store.pagination" @page-change="setPage" />
        </div>
      </div>
    </div>
    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      :show="confirmDelete"
      title="Delete Worklog"
      message="Are you sure you want to delete this worklog? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      :loading="deleting"
      :error="deleteError"
      @confirm="handleDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWorklogStore } from '@/stores/worklogStore'
import { useToastStore } from '@/stores/toast'
import { usePagination } from '@/composables/usePagination'
import Pagination from '@/components/ui/BasePagination.vue'
import WorklogStatusBadge from '@/components/worklog/WorklogStatusBadge.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import type { Worklog, WorklogStatus } from '@/types/worklog'

const store = useWorklogStore()
const toast = useToastStore()

const statusFilter = ref<string>('')

// ── Delete state ──
const worklogToDelete = ref<Worklog | null>(null)
const confirmDelete = ref(false)
const deleting = ref(false)
const deleteError = ref<string | null>(null)

function promptDelete(w: Worklog) {
  worklogToDelete.value = w
  confirmDelete.value = true
  deleteError.value = null
}

function cancelDelete() {
  confirmDelete.value = false
  worklogToDelete.value = null
  deleteError.value = null
}

async function handleDelete() {
  if (!worklogToDelete.value) return
  deleting.value = true
  deleteError.value = null
  try {
    await store.deleteWorklog(worklogToDelete.value.id)
    toast.success('Worklog deleted.', 'Deleted')
    confirmDelete.value = false
    worklogToDelete.value = null
  } catch (err: unknown) {
    deleteError.value = (err as any)?.response?.data?.message || 'Failed to delete worklog. Please try again.'
  } finally {
    deleting.value = false
  }
}

function fetchPage({ page }: { page: number }) {
  store.fetchWorklogs({
    page,
    status: statusFilter.value ? (statusFilter.value as WorklogStatus) : undefined,
  })
}

const { setPage, resetPage } = usePagination(fetchPage)

function onFilterChange() {
  resetPage()
}

function formatTimeRange(time?: string): string {
  if (!time) return ''
  const parts = time.split(' to ')
  return parts.map((t) => {
    const [h, m] = t.trim().split(':')
    if (!h || !m) return t.trim()
    const hour = parseInt(h, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${m} ${ampm}`
  }).join(' to ')
}

function formatDate(date?: string): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function isEditable(w: { status: WorklogStatus; can_edit?: boolean }): boolean {
  if (typeof w.can_edit === 'boolean') return w.can_edit
  return w.status === 'Pending' || w.status === 'Reviewed'
}
</script>

