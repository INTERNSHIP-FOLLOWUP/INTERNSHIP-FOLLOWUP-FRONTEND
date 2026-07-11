<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Assignments</h1>
        <p class="mt-1 text-sm text-slate-500">
          Manage internship assignments across students, companies, and tutors.
        </p>
      </div>
      <button
        @click="$emit('add')"
        class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-500/20 transition-all duration-200 hover:from-primary-700 hover:to-primary-600 hover:shadow-md hover:shadow-primary-500/25 active:scale-95"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
        </svg>
        New Assignment
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="rounded-lg border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total</p>
        <p class="mt-1 text-2xl font-bold text-slate-900">{{ store.assignmentCount }}</p>
      </div>
      <div class="rounded-lg border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Active</p>
        <p class="mt-1 text-2xl font-bold text-emerald-600">{{ activeCount }}</p>
      </div>
      <div class="rounded-lg border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Pending</p>
        <p class="mt-1 text-2xl font-bold text-amber-600">{{ pendingCount }}</p>
      </div>
      <div class="rounded-lg border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Completed</p>
        <p class="mt-1 text-2xl font-bold text-slate-600">{{ completedCount }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-3">
      <!-- Search -->
      <div class="relative min-w-0 flex-1 basis-[200px]">
        <svg
          class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by student, company, or tutor..."
          class="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>

      <!-- Status Filter -->
      <select
        v-model="filters.status"
        class="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 transition-colors focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
      >
        <option value="">All Statuses</option>
        <option value="assigned">Active</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="terminated">Terminated</option>
      </select>

      <!-- Company Filter -->
      <select
        v-model="filters.company_id"
        class="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 transition-colors focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
      >
        <option value="">All Companies</option>
        <option v-for="c in companies" :key="c.id" :value="String(c.id)">
          {{ c.name }}
        </option>
      </select>

      <!-- Clear Filters -->
      <button
        v-if="hasActiveFilters"
        @click="clearFilters"
        class="flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
      >
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Clear
      </button>
    </div>

    <!-- Error Banner -->
    <div
      v-if="localError"
      class="flex items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
    >
      <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <span>{{ localError }}</span>
      <button @click="localError = ''" class="ml-auto rounded-md p-1 transition-colors hover:bg-rose-100">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th class="px-6 py-3.5 font-medium">Student</th>
              <th class="px-6 py-3.5 font-medium">Company</th>
              <th class="px-6 py-3.5 font-medium">Tutor</th>
              <th class="px-6 py-3.5 font-medium">Status</th>
              <th class="px-6 py-3.5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <!-- Loading -->
            <tr v-if="store.loading && filteredAssignments.length === 0">
              <td colspan="5" class="px-6 py-16">
                <div class="flex flex-col items-center justify-center text-center">
                  <svg class="h-8 w-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p class="mt-3 text-sm font-medium text-slate-500">Loading assignments...</p>
                </div>
              </td>
            </tr>

            <!-- Empty -->
            <tr v-else-if="filteredAssignments.length === 0">
              <td colspan="5" class="px-6 py-16">
                <div class="flex flex-col items-center justify-center text-center">
                  <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
                    <svg class="h-7 w-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h3 class="mt-4 text-sm font-semibold text-slate-700">No assignments found</h3>
                  <p class="mt-1 text-xs text-slate-400">
                    {{ hasActiveFilters ? 'Try adjusting your filters.' : 'No internship assignments have been created yet.' }}
                  </p>
                </div>
              </td>
            </tr>

            <!-- Rows -->
            <tr
              v-for="assignment in filteredAssignments"
              :key="assignment.id"
              class="transition-colors hover:bg-slate-50/50"
            >
              <td class="whitespace-nowrap px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-600"
                  >
                    {{ getInitials(assignment.student_name) }}
                  </div>
                  <span class="font-semibold text-slate-900">{{ assignment.student_name }}</span>
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-500">
                {{ assignment.company_name }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                {{ assignment.tutor_name }}
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  :class="statusBadgeClass(assignment.status)"
                >
                  {{ formatStatus(assignment.status) }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button
                    @click="$emit('edit', assignment.id)"
                    class="rounded-lg px-3 py-1.5 text-xs font-bold text-primary-600 transition-all hover:bg-primary-50 hover:text-primary-800"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDelete(assignment)"
                    class="rounded-lg px-3 py-1.5 text-xs font-bold text-rose-600 transition-all hover:bg-rose-50 hover:text-rose-800"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="store.pagination && store.pagination.last_page > 1"
        class="flex items-center justify-between border-t border-slate-100 px-6 py-3"
      >
        <p class="text-xs font-medium text-slate-500">
          Showing
          <span class="font-semibold text-slate-700">{{ store.pagination.from }}</span>
          to
          <span class="font-semibold text-slate-700">{{ store.pagination.to }}</span>
          of
          <span class="font-semibold text-slate-700">{{ store.pagination.total }}</span>
          assignments
        </p>

        <div class="flex items-center gap-1.5">
          <button
            @click="goToPage(store.pagination.current_page - 1)"
            :disabled="store.pagination.current_page <= 1"
            class="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <template v-for="page in visiblePages" :key="page">
            <span v-if="page === '...'" class="px-1 text-xs text-slate-400">...</span>
            <button
              v-else
              @click="goToPage(page as number)"
              class="flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2 text-xs font-bold transition-colors"
              :class="
                page === store.pagination.current_page
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-100'
              "
            >
              {{ page }}
            </button>
          </template>

          <button
            @click="goToPage(store.pagination.current_page + 1)"
            :disabled="store.pagination.current_page >= store.pagination.last_page"
            class="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <transition name="fade">
      <div
        v-if="deletingTarget"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        @click="deletingTarget = null"
      >
        <div class="w-[92%] max-w-md rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl" @click.stop>
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50">
              <svg class="h-5 w-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-semibold text-slate-900">Delete Assignment</h3>
              <p class="mt-0.5 text-sm text-slate-500">
                Are you sure you want to delete the assignment for <span class="font-semibold text-slate-700">{{ deletingTarget.student_name }}</span>? This action cannot be undone.
              </p>
            </div>
          </div>
          <div class="mt-5 flex items-center justify-end gap-3">
            <button
              @click="deletingTarget = null"
              :disabled="deleting"
              class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              @click="handleDelete"
              :disabled="deleting"
              class="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg v-if="deleting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAssignmentStore } from '@/stores/assignment'
import api from '@/services/api'
import type { Assignment } from '@/types/assignment'
import type { User } from '@/types/auth'

defineEmits<{
  edit: [id: number]
  add: []
}>()

const store = useAssignmentStore()

const deletingTarget = ref<Assignment | null>(null)
const deleting = ref(false)
const localError = ref('')
const searchQuery = ref('')
const companies = ref<User[]>([])
const filters = ref({
  status: '',
  company_id: '',
})

const hasActiveFilters = computed(
  () => !!searchQuery.value || !!filters.value.status || !!filters.value.company_id,
)

const filteredAssignments = computed(() => {
  let list = store.assignments

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (a: Assignment) =>
        a.student_name.toLowerCase().includes(q) ||
        a.company_name.toLowerCase().includes(q) ||
        a.tutor_name.toLowerCase().includes(q),
    )
  }

  if (filters.value.status) {
    list = list.filter((a: Assignment) => a.status === filters.value.status)
  }

  if (filters.value.company_id) {
    list = list.filter((a: Assignment) => a.company_id === Number(filters.value.company_id))
  }

  return list
})

const activeCount = computed(() => store.assignments.filter((a: Assignment) => a.status === 'assigned').length)
const pendingCount = computed(() => store.assignments.filter((a: Assignment) => a.status === 'in_progress').length)
const completedCount = computed(() => store.assignments.filter((a: Assignment) => a.status === 'completed').length)

const visiblePages = computed(() => {
  const pagination = store.pagination
  if (!pagination) return []

  const pages: (number | string)[] = []
  const current = pagination.current_page
  const last = pagination.last_page

  if (last <= 7) {
    for (let i = 1; i <= last; i++) pages.push(i)
    return pages
  }

  pages.push(1)
  if (current > 3) pages.push('...')

  const start = Math.max(2, current - 1)
  const end = Math.min(last - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  if (current < last - 2) pages.push('...')
  pages.push(last)

  return pages
})

function formatStatus(status: string): string {
  const map: Record<string, string> = {
    assigned: 'Assigned',
    in_progress: 'In Progress',
    completed: 'Completed',
    terminated: 'Terminated',
  }
  return map[status] ?? status
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function statusBadgeClass(status?: string): string {
  switch (status) {
    case 'assigned':
      return 'bg-emerald-50 text-emerald-700'
    case 'in_progress':
      return 'bg-amber-50 text-amber-700'
    case 'completed':
      return 'bg-slate-100 text-slate-600'
    default:
      return 'bg-rose-50 text-rose-700'
  }
}

function confirmDelete(assignment: Assignment): void {
  deletingTarget.value = assignment
}

async function handleDelete(): Promise<void> {
  if (!deletingTarget.value) return
  deleting.value = true
  try {
    await store.deleteAssignment(deletingTarget.value.id)
    deletingTarget.value = null
  } finally {
    deleting.value = false
  }
}

function goToPage(page: number): void {
  if (page < 1 || page > (store.pagination?.last_page ?? 1)) return
  localError.value = ''
  store.fetchAssignments({ page, per_page: 15 }).catch((err: unknown) => {
    localError.value = err instanceof Error ? err.message : 'Failed to load assignments.'
  })
}

function clearFilters(): void {
  searchQuery.value = ''
  filters.value = { status: '', company_id: '' }
}

function fetchAssignments(): void {
  localError.value = ''
  store.fetchAssignments({ per_page: 15 }).catch((err: unknown) => {
    localError.value = err instanceof Error ? err.message : 'Failed to load assignments.'
  })
}

watch(filters, () => {
  // Client-side filtering is handled reactively by filteredAssignments
}, { deep: true })

onMounted(() => {
  companies.value = []
  api.get('/admin/users', { params: { role: 'company', per_page: 200 } }).then((r) => {
    companies.value = r.data.data ?? r.data
  }).catch(() => {
    companies.value = []
  })

  fetchAssignments()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
