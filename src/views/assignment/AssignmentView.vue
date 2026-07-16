<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Internship Assignments
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Manage student internship assignments to companies.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <select
          v-model="statusFilter"
          @change="onFilterChange"
          class="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          <option value="">All Statuses</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Terminated">Terminated</option>
        </select>
        <button
          @click="openCreate"
          class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-600 active:scale-95"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          New Assignment
        </button>
      </div>
    </div>

    <div
      class="rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="border-b border-slate-100 px-5 py-3 dark:border-slate-800">
        <div class="relative max-w-xs">
          <svg
            class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
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
            class="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
          />
        </div>
      </div>

      <div v-if="store.loading && store.assignments.length === 0" class="flex items-center justify-center py-16">
        <svg class="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>

      <div v-else-if="store.error && store.assignments.length === 0" class="flex flex-col items-center justify-center py-16 text-center px-4">
        <svg class="h-10 w-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p class="mt-3 text-sm font-semibold text-red-500">{{ store.error }}</p>
        <button @click="fetchPage({ page: 1 })" class="mt-3 rounded-lg bg-indigo-50 px-3.5 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition-colors">
          Try Again
        </button>
      </div>

      <div v-else-if="filteredAssignments.length === 0">
        <div v-if="searchQuery || statusFilter" class="flex flex-col items-center justify-center py-16 text-center px-4">
          <svg class="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p class="mt-3 text-sm font-semibold text-slate-400">No assignments match your filters.</p>
          <button @click="clearFilters" class="mt-2 text-xs font-medium text-indigo-500 hover:text-indigo-600 transition-colors">
            Clear filters
          </button>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-16 text-center px-4">
          <svg class="h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <p class="mt-4 text-sm font-semibold text-slate-400">No assignments created yet.</p>
          <p class="mt-1 text-xs text-slate-400">Get started by creating a new internship assignment.</p>
          <button
            @click="openCreate"
            class="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            New Assignment
          </button>
        </div>
      </div>

      <div v-else>
        <div class="overflow-x-auto">
          <table class="hidden w-full border-collapse text-left text-sm md:table">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
                <th class="px-5 py-3.5">Student</th>
                <th class="px-5 py-3.5">Company</th>
                <th class="px-5 py-3.5">Tutor</th>
                <th class="px-5 py-3.5">Position</th>
                <th class="px-5 py-3.5">Duration</th>
                <th class="px-5 py-3.5">Status</th>
                <th class="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
              <tr
                v-for="a in filteredAssignments"
                :key="a.id"
                class="hover:bg-slate-50/30 transition-colors dark:hover:bg-slate-800/30"
              >
                <td class="whitespace-nowrap px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                      {{ getInitials(a.student_name) }}
                    </div>
                    <span class="font-semibold text-slate-900 dark:text-white">{{ a.student_name }}</span>
                  </div>
                </td>
                <td class="whitespace-nowrap px-5 py-4 font-medium text-slate-500 dark:text-slate-400">{{ a.company_name }}</td>
                <td class="whitespace-nowrap px-5 py-4 text-slate-500 dark:text-slate-400">{{ a.tutor_name }}</td>
                <td class="whitespace-nowrap px-5 py-4 text-slate-500 dark:text-slate-400">{{ a.position }}</td>
                <td class="whitespace-nowrap px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                  {{ formatDate(a.start_date) }} &ndash; {{ formatDate(a.end_date) }}
                </td>
                <td class="whitespace-nowrap px-5 py-4">
                  <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold" :class="statusBadgeClass(a.status)">
                    <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(a.status)" />
                    {{ a.status }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-right">
                  <button
                    @click="openEdit(a)"
                    class="rounded-lg px-2.5 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-all dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteAssignment(a)"
                    class="ml-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-all dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
          <div
            v-for="a in filteredAssignments"
            :key="a.id"
            class="px-4 py-4 hover:bg-slate-50/30 transition-colors dark:hover:bg-slate-800/30"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  {{ getInitials(a.student_name) }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-slate-900 truncate dark:text-white">{{ a.student_name }}</p>
                  <p class="text-xs text-slate-500 truncate dark:text-slate-400">{{ a.company_name }} &middot; {{ a.position }}</p>
                </div>
              </div>
              <span class="shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold" :class="statusBadgeClass(a.status)">
                <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(a.status)" />
                {{ a.status === 'In Progress' ? 'Active' : a.status }}
              </span>
            </div>
            <div class="mt-2 flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
              <span>Tutor: {{ a.tutor_name }}</span>
              <span>{{ formatDate(a.start_date) }} &ndash; {{ formatDate(a.end_date) }}</span>
            </div>
            <div class="mt-3 flex items-center gap-2">
              <button
                @click="openEdit(a)"
                class="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Edit
              </button>
              <button
                @click="deleteAssignment(a)"
                class="flex-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <BasePagination :meta="store.pagination" @page-change="setPage" />
    </div>

    <AssignmentForm
      :show="showForm"
      :assignment-id="editingId"
      @close="closeForm"
      @saved="onSaved"
    />

    <ConfirmDialog
      :show="confirm.show.value"
      :title="confirm.title.value"
      :message="confirm.message.value"
      :confirm-text="confirm.confirmText.value"
      :cancel-text="confirm.cancelText.value"
      :loading="confirm.loading.value"
      :error="confirm.error.value"
      @confirm="handleConfirmDelete"
      @cancel="confirm.cancel()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAssignmentStore } from '@/stores/assignment'
import { useToastStore } from '@/stores/toast'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import type { Assignment } from '@/types/assignment'
import AssignmentForm from '@/components/assignment/AssignmentForm.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const route = useRoute()
const router = useRouter()
const store = useAssignmentStore()
const toast = useToastStore()
const confirm = useConfirmDialog()

const searchQuery = ref('')
const statusFilter = ref('')
const showForm = ref(false)
const editingId = ref<number | undefined>(undefined)

let deleteTarget: Assignment | null = null

const filteredAssignments = computed(() => {
  let list = store.assignments

  if (statusFilter.value) {
    list = list.filter((a) => a.status === statusFilter.value)
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(
      (a) =>
        a.student_name.toLowerCase().includes(q) ||
        a.company_name.toLowerCase().includes(q) ||
        a.tutor_name.toLowerCase().includes(q) ||
        a.position.toLowerCase().includes(q),
    )
  }

  return list
})

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(date?: string): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case 'Assigned':
      return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
    case 'In Progress':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    case 'Completed':
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'Terminated':
      return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    default:
      return 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
  }
}

function statusDotClass(status: string): string {
  switch (status) {
    case 'Assigned':
      return 'bg-indigo-500'
    case 'In Progress':
      return 'bg-amber-500'
    case 'Completed':
      return 'bg-emerald-500'
    case 'Terminated':
      return 'bg-red-500'
    default:
      return 'bg-slate-400'
  }
}

function fetchPage({ page }: { page: number }) {
  store.fetchAssignments({ page, status: statusFilter.value || undefined })
}

function setPage(page: number) {
  fetchPage({ page })
  router.replace({ query: { page: page > 1 ? String(page) : undefined } })
}

function onFilterChange() {
  setPage(1)
}

function clearFilters() {
  searchQuery.value = ''
  statusFilter.value = ''
  setPage(1)
}

function openCreate() {
  router.push({ name: 'AdminAssignmentsCreate' })
}

function openEdit(assignment: Assignment) {
  router.push({ name: 'AdminAssignmentsEdit', params: { id: assignment.id } })
}

function closeForm() {
  showForm.value = false
  editingId.value = undefined
  router.push({ name: 'AdminAssignments' })
}

function onSaved() {
  closeForm()
  toast.success('Assignment saved successfully.')
}

async function deleteAssignment(assignment: Assignment) {
  deleteTarget = assignment
  const confirmed = await confirm.open({
    title: 'Delete Assignment',
    message: `Are you sure you want to delete the assignment for "${assignment.student_name}"? This action cannot be undone.`,
  })
  if (!confirmed) return
  await handleConfirmDelete()
}

async function handleConfirmDelete() {
  if (!deleteTarget) return
  await confirm.confirmAsync(async () => {
    await store.deleteAssignment(deleteTarget!.id)
    if (!store.error) {
      toast.success(`Assignment for "${deleteTarget!.student_name}" deleted successfully.`)
    }
  })
}

watch(
  () => route.name,
  (name) => {
    if (name === 'AdminAssignmentsCreate') {
      editingId.value = undefined
      showForm.value = true
    } else if (name === 'AdminAssignmentsEdit') {
      const id = Number(route.params.id)
      if (!isNaN(id)) {
        editingId.value = id
        showForm.value = true
      }
    } else {
      showForm.value = false
      editingId.value = undefined
    }
  },
  { immediate: true },
)

onMounted(() => {
  const page = Number(route.query.page) || 1
  store.fetchAssignments({ page })
})
</script>
