<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Students</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">View and manage all enrolled students across batches.</p>
      </div>
      <router-link to="/admin/users/create" class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-600 active:scale-95">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        Add Student
      </router-link>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <DebouncedInput v-model="searchQuery" placeholder="Search by name or email..." class="flex-1 max-w-xs" @change="onSearch" />
      <select v-model="batchFilter" @change="onFilterChange" class="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
        <option value="">All Batches</option>
        <option v-for="b in batches" :key="b" :value="b">{{ b }}</option>
      </select>
      <select v-model="statusFilter" @change="onFilterChange" class="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
        <option value="">All Statuses</option>
        <option value="Active">Active</option>
        <option value="Placed">Placed</option>
        <option value="Pending">Pending</option>
      </select>
    </div>
    <ActiveFilters :filters="activeFilterList" @remove="removeFilter" @clear-all="clearFilters" />

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
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-400">
                <th class="px-5 py-3.5">Name</th>
                <th class="px-5 py-3.5">Email</th>
                <th class="px-5 py-3.5">Batch</th>
                <th class="px-5 py-3.5">Tutor</th>
                <th class="px-5 py-3.5">Status</th>
                <th class="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="student in store.students" :key="student.id" class="hover:bg-slate-50/30 transition-colors">
                <td class="whitespace-nowrap px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">{{ getInitials(student.name) }}</div>
                    <span class="font-semibold text-slate-900">{{ student.name }}</span>
                  </div>
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-slate-500 font-medium">{{ student.email }}</td>
                <td class="whitespace-nowrap px-5 py-4"><span class="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">{{ student.batch || '—' }}</span></td>
                <td class="whitespace-nowrap px-5 py-4 text-slate-500">{{ student.tutor || '—' }}</td>
                <td class="whitespace-nowrap px-5 py-4">
                  <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold" :class="statusClass(student.status)">
                    <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(student.status)" />
                    {{ student.status || 'Active' }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-right">
                  <button class="rounded-lg px-2.5 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-all">Edit</button>
                  <button @click="deleteStudent(student.id)" class="ml-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-all">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="store.students.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
          <svg class="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <p class="mt-3 text-sm font-semibold text-slate-400">{{ searchQuery || batchFilter || statusFilter ? 'No students match your filters.' : 'No students enrolled yet.' }}</p>
        </div>
        <Pagination :meta="store.pagination" @page-change="setPage" />
      </div>
    </div>

    <ConfirmDialog
      :show="dialog.show"
      :title="dialog.title.value"
      :message="dialog.message.value"
      :confirm-text="dialog.confirmText.value"
      :cancel-text="dialog.cancelText.value"
      :loading="dialog.loading.value"
      :error="dialog.error.value"
      @confirm="handleConfirm"
      @cancel="dialog.cancel()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStudentStore } from '@/stores/student'
import { usePagination } from '@/composables/usePagination'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import Pagination from '@/components/ui/Pagination.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import DebouncedInput from '@/components/ui/DebouncedInput.vue'
import ActiveFilters from '@/components/ui/ActiveFilters.vue'
import type { ActiveFilter } from '@/components/ui/ActiveFilters.vue'

const store = useStudentStore()
const dialog = useConfirmDialog()
const searchQuery = ref('')
const batchFilter = ref('')
const statusFilter = ref('')
let deleteTargetId: number | null = null

const batches = ['Batch 2026-A', 'Batch 2026-B', 'Batch 2025-A', 'Batch 2025-B']

const activeFilterList = computed<ActiveFilter[]>(() => {
  const list: ActiveFilter[] = []
  if (searchQuery.value) list.push({ key: 'search', label: 'Search', value: searchQuery.value })
  if (batchFilter.value) list.push({ key: 'batch', label: 'Batch', value: batchFilter.value })
  if (statusFilter.value) list.push({ key: 'status', label: 'Status', value: statusFilter.value })
  return list
})

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function statusClass(status?: string): string {
  switch (status) {
    case 'Active': return 'bg-emerald-50 text-emerald-700'
    case 'Placed': return 'bg-blue-50 text-blue-700'
    case 'Pending': return 'bg-amber-50 text-amber-700'
    default: return 'bg-slate-50 text-slate-600'
  }
}

function statusDotClass(status?: string): string {
  switch (status) {
    case 'Active': return 'bg-emerald-500'
    case 'Placed': return 'bg-blue-500'
    case 'Pending': return 'bg-amber-500'
    default: return 'bg-slate-400'
  }
}

function fetchPage({ page }: { page: number }) {
  store.fetchStudents({
    page,
    per_page: 15,
    search: searchQuery.value || undefined,
  })
}

const { setPage, resetPage } = usePagination(fetchPage, { search: searchQuery, batch: batchFilter, status: statusFilter })

function onSearch() {
  resetPage()
}

function onFilterChange() {
  resetPage()
}

function removeFilter(key: string) {
  if (key === 'search') searchQuery.value = ''
  if (key === 'batch') batchFilter.value = ''
  if (key === 'status') statusFilter.value = ''
  resetPage()
}

function clearFilters() {
  searchQuery.value = ''
  batchFilter.value = ''
  statusFilter.value = ''
  resetPage()
}

async function deleteStudent(id: number) {
  deleteTargetId = id
  const confirmed = await dialog.open({
    title: 'Delete Student',
    message: 'Are you sure you want to delete this student? This action cannot be undone.',
  })
  if (!confirmed) return
  await handleConfirm()
}

async function handleConfirm() {
  if (deleteTargetId === null) return
  await dialog.confirmAsync(() => store.deleteStudent(deleteTargetId!))
}
</script>
