<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Worklog Review</h1>
        <p class="text-sm text-slate-500">Review and provide feedback on student worklogs.</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div class="grid gap-3 md:grid-cols-4">
        <div>
          <label class="text-xs font-semibold text-slate-500">Student</label>
          <select
            v-model="filters.studentId"
            @change="changed"
            class="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Students</option>
            <option v-for="s in students" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-semibold text-slate-500">Week</label>
          <input
            v-model.number="filters.week"
            type="number"
            min="1"
            :placeholder="$t('common.weekPlaceholder')"
            class="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div>
          <label class="text-xs font-semibold text-slate-500">Status</label>
          <select
            v-model="filters.status"
            @change="changed"
            class="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All</option>
            <option>Pending</option>
            <option>Reviewed</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>
        <div class="flex items-end gap-2">
          <button
            type="button"
            @click="changed"
            class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition"
          >
            Search
          </button>
          <button
            type="button"
            @click="reset"
            class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div v-if="store.loading" class="divide-y divide-slate-50">
        <div v-for="n in 6" :key="n" class="flex items-center gap-4 px-6 py-4 animate-pulse">
          <div class="h-8 w-8 rounded-full bg-slate-200" />
          <div class="flex-1 space-y-2">
            <div class="h-3 w-1/3 rounded bg-slate-200" />
            <div class="h-3 w-1/4 rounded bg-slate-100" />
          </div>
          <div class="h-5 w-16 rounded-full bg-slate-200" />
          <div class="h-5 w-16 rounded-full bg-slate-200" />
          <div class="h-8 w-24 rounded-xl bg-slate-200" />
        </div>
      </div>

      <div
        v-else-if="store.error"
        class="flex flex-col items-center justify-center py-16 text-center"
      >
        <div class="rounded-full bg-red-50 p-3 text-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <p class="mt-3 text-sm font-semibold text-red-600">Unable to load worklogs.</p>
        <button
          type="button"
          @click="load"
          class="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 transition"
        >
          Retry
        </button>
      </div>

      <div
        v-else-if="!store.list.length"
        class="flex flex-col items-center justify-center px-6 py-16 text-center"
      >
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7 text-slate-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M5.625 3.75h13.5c1.036 0 1.875.84 1.875 1.875v13.5c0 1.036-.84 1.875-1.875 1.875h-13.5A1.875 1.875 0 013.75 19.125V5.625c0-1.036.84-1.875 1.875-1.875z"
            />
          </svg>
        </div>
        <h3 class="mt-4 text-sm font-semibold text-slate-700">No worklogs found</h3>
        <p class="text-xs text-slate-400">Try adjusting your search or filters.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr
              class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              <th class="px-6 py-3.5">Student</th>
              <th class="px-6 py-3.5">Week</th>
              <th class="px-6 py-3.5">Submitted</th>
              <th class="px-6 py-3.5">Attachments</th>
              <th class="px-6 py-3.5">Status</th>
              <th class="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr
              v-for="w in store.list"
              :key="w.id"
              class="transition-colors hover:bg-slate-50/50"
              :class="{ 'border-l-4 border-l-rose-500': isStale(w) }"
            >
              <td class="whitespace-nowrap px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700"
                  >
                    {{ w.student?.name ? initials(w.student.name) : '??' }}
                  </div>
                  <span class="font-semibold text-slate-900">{{ w.student?.name || '—' }}</span>
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                Week {{ w.week_number }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                {{ submittedLabel(w) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-xs text-slate-600">
                {{ (w.attachments || []).length }}
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold"
                  :class="statusBadge(w.status)"
                  >{{ w.status }}</span
                >
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right">
                <button
                  type="button"
                  @click="review(w)"
                  class="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition"
                >
                  Review
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTutorWorklogStore } from '@/stores/tutorWorklog'
import type { TutorWorklog } from '@/types/tutorWorklogs'

const store = useTutorWorklogStore()
const students = ref<Array<{ id: number; name: string }>>([])
const filters = ref({ studentId: '', week: '', status: '' })

onMounted(() => {
  load()
})

async function load() {
  await store.fetchList({
    student_id: filters.value.studentId ? Number(filters.value.studentId) : undefined,
    week: filters.value.week ? Number(filters.value.week) : undefined,
    status: filters.value.status || undefined,
  })
}

function changed() {
  load()
}

function reset() {
  filters.value = { studentId: '', week: '', status: '' }
  load()
}

function initials(name: string) {
  return name
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function isStale(w: TutorWorklog) {
  const submitted = w.submitted_at ? new Date(w.submitted_at).getTime() : NaN
  if (Number.isNaN(submitted)) return false
  return Date.now() - submitted > 5 * 24 * 60 * 60 * 1000
}

function submittedLabel(w: TutorWorklog) {
  const d = w.submission_date || w.submitted_at
  return d
    ? new Date(d).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'
}

function statusBadge(status: string) {
  switch (status) {
    case 'Pending':
      return 'bg-amber-50 text-amber-700'
    case 'Reviewed':
      return 'bg-indigo-50 text-indigo-700'
    case 'Approved':
      return 'bg-emerald-50 text-emerald-700'
    case 'Rejected':
      return 'bg-rose-50 text-rose-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

function review(w: TutorWorklog) {
  window.location.href = `/tutor/worklogs/${w.id}`
}
</script>
