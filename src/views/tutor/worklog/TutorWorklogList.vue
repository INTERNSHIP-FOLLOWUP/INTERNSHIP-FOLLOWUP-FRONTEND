<template>
  <div class="p-6 space-y-6">
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Tutor Worklogs
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Review student submissions.</p>
      </div>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <select
        v-model="studentFilter"
        @change="onFilterChange"
        class="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      >
        <option value="">Student: All Students</option>
        <option value="1">Student A</option>
        <option value="2">Student B</option>
      </select>

      <select
        v-model="statusFilter"
        @change="onFilterChange"
        class="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      >
        <option value="">Status: All</option>
        <option value="Pending">Pending</option>
        <option value="Reviewed">Reviewed</option>
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
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <p class="mt-3 text-sm font-semibold text-red-500">{{ store.error }}</p>
      </div>

      <div v-else>
        <!-- Desktop table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full border-collapse text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-400">
                <th class="px-5 py-3.5">Student</th>
                <th class="px-5 py-3.5">Week</th>
                <th class="px-5 py-3.5">Description</th>
                <th class="px-5 py-3.5">Status</th>
                <th class="px-5 py-3.5">Submitted Date</th>
                <th class="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr
                v-for="w in store.worklogs"
                :key="w.id"
                class="hover:bg-slate-50/30 transition-colors"
              >
                <td class="whitespace-nowrap px-5 py-4 text-slate-600">{{ w.student?.name || '—' }}</td>
                <td class="whitespace-nowrap px-5 py-4">{{ w.week_number }}</td>
                <td class="whitespace-nowrap px-5 py-4 text-slate-600 max-w-[420px] truncate">
                  {{ w.description }}
                </td>
                <td class="whitespace-nowrap px-5 py-4"><WorklogStatusBadge :status="w.status" /></td>
                <td class="whitespace-nowrap px-5 py-4 text-slate-500 text-xs">{{ formatDate(w.submitted_at) }}</td>
                <td class="whitespace-nowrap px-5 py-4 text-right">
                  <router-link
                    :to="`/tutor/worklogs/${w.id}`"
                    class="rounded-lg px-2.5 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-all"
                  >
                    Review
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile cards -->
        <div class="md:hidden space-y-4 px-4 py-4">
          <div v-if="store.worklogs.length === 0" class="hidden" />
          <div
            v-for="w in store.worklogs"
            :key="w.id"
            class="rounded-2xl border border-slate-100 p-4 bg-white"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-xs font-semibold text-slate-500">Student</p>
                <p class="text-sm font-bold text-slate-900 truncate">{{ w.student?.name || '—' }}</p>
              </div>
              <WorklogStatusBadge :status="w.status" />
            </div>
            <div class="mt-3">
              <p class="text-xs font-semibold text-slate-500">Week</p>
              <p class="text-sm font-bold text-slate-900">{{ w.week_number }}</p>
            </div>
            <p class="mt-3 text-sm font-semibold text-slate-900 line-clamp-2">{{ w.description }}</p>
            <p class="mt-1 text-xs text-slate-500">Submitted: {{ formatDate(w.submitted_at) }}</p>

            <div class="mt-4 flex items-center gap-2">
              <router-link
                :to="`/tutor/worklogs/${w.id}`"
                class="inline-flex flex-1 items-center justify-center rounded-xl bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100"
              >
                Review
              </router-link>
            </div>
          </div>
        </div>

        <div
          v-if="store.worklogs.length === 0"
          class="flex flex-col items-center justify-center py-16 text-center px-6"
        >
          <svg class="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <p class="mt-3 text-sm font-semibold text-slate-400">No worklogs to review.</p>
        </div>

        <div v-if="store.pagination" class="mt-2">
          <Pagination :meta="store.pagination" @page-change="setPage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWorklogStore } from '@/stores/worklogStore'
import Pagination from '@/components/ui/BasePagination.vue'
import WorklogStatusBadge from '@/components/worklog/WorklogStatusBadge.vue'
import { usePagination } from '@/composables/usePagination'
import type { WorklogStatus } from '@/types/worklog'

const store = useWorklogStore()

const studentFilter = ref<string>('')
const statusFilter = ref<string>('')

function fetchPage({ page }: { page: number }) {
  store.fetchTutorWorklogs({
    page,
    student_id: studentFilter.value ? Number(studentFilter.value) : undefined,
    status: statusFilter.value ? (statusFilter.value as WorklogStatus) : undefined,
  })
}


const { setPage } = usePagination(fetchPage)

function onFilterChange() {
  setPage(1)
}

function formatDate(date?: string): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>


