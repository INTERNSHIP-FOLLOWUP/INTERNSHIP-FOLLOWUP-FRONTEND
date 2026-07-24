<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3 text-sm">
      <router-link to="/admin/batches" class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Batches
      </router-link>
      <span class="text-slate-300">/</span>
      <span class="font-medium text-slate-900">{{ stats?.batch_name || 'Batch Details' }}</span>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <svg class="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <div v-else-if="error" class="flex flex-col items-center justify-center py-20 text-center">
      <svg class="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <p class="mt-4 text-base font-semibold text-red-500">{{ error }}</p>
      <button @click="fetchData" class="mt-4 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-100">Try Again</button>
    </div>

    <template v-else-if="stats">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{{ stats.batch_name }}</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Year {{ stats.year }} &middot; {{ stats.total_students }} {{ stats.total_students === 1 ? 'student' : 'students' }} enrolled</p>
        </div>
        <div class="flex items-center gap-2">
          <button @click="exportPdf" :disabled="exporting"
            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 active:scale-95 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            {{ exporting ? 'Exporting...' : 'PDF' }}
          </button>
          <button @click="exportExcel" :disabled="exporting"
            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 active:scale-95 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel
          </button>
          <router-link :to="`/admin/users/create?batch_id=${batchId}`"
            class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-600 active:scale-95">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Add Student
          </router-link>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div class="rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p class="text-xs font-semibold text-slate-400">Total</p>
          <p class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{{ stats.total_students }}</p>
        </div>
        <div class="rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p class="text-xs font-semibold text-slate-400">Active</p>
          <p class="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ stats.status_breakdown.active || 0 }}</p>
        </div>
        <div class="rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p class="text-xs font-semibold text-slate-400">Graduated</p>
          <p class="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.status_breakdown.graduated || 0 }}</p>
        </div>
        <div class="rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p class="text-xs font-semibold text-slate-400">Inactive</p>
          <p class="mt-1 text-2xl font-bold text-slate-500 dark:text-slate-400">{{ stats.status_breakdown.inactive || 0 }}</p>
        </div>
        <div class="rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p class="text-xs font-semibold text-slate-400">Suspended</p>
          <p class="mt-1 text-2xl font-bold text-rose-600 dark:text-rose-400">{{ stats.status_breakdown.suspended || 0 }}</p>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-3 dark:border-slate-800">
          <div class="relative flex-1 min-w-0 basis-[200px]">
            <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input v-model="searchQuery" type="text" placeholder="Search students..."
              class="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
              @input="onSearch" />
          </div>
          <select v-model="statusFilter" @change="onFilterChange"
            class="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button v-if="hasActiveFilters" @click="clearFilters"
            class="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear
          </button>
        </div>

        <div v-if="studentsLoading && students.length === 0" class="flex items-center justify-center py-16">
          <svg class="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>

        <div v-else-if="students.length > 0" class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
                <th class="px-5 py-3.5 font-medium">Student</th>
                <th class="px-5 py-3.5 font-medium">Code</th>
                <th class="px-5 py-3.5 font-medium">Email</th>
                <th class="px-5 py-3.5 font-medium">Status</th>
                <th class="px-5 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
              <tr v-for="student in students" :key="student.id" class="transition-colors hover:bg-slate-50/30 dark:hover:bg-slate-800/30">
                <td class="whitespace-nowrap px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">{{ getInitials(student.name) }}</div>
                    <span class="font-semibold text-slate-900 dark:text-white">{{ student.name }}</span>
                  </div>
                </td>
                <td class="whitespace-nowrap px-5 py-4 font-mono text-xs font-medium text-slate-500">{{ student.student_code || '—' }}</td>
                <td class="whitespace-nowrap px-5 py-4 text-slate-500 dark:text-slate-400">{{ student.email }}</td>
                <td class="whitespace-nowrap px-5 py-4">
                  <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold" :class="statusClass(student.status)">
                    <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(student.status)" />
                    {{ formatStatus(student.status) }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <router-link :to="`/admin/users/${student.id}`" class="rounded-lg px-3 py-1.5 text-xs font-bold text-indigo-600 transition-all hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30">Edit</router-link>
                    <button @click="deleteStudent(student.id)" class="rounded-lg px-3 py-1.5 text-xs font-bold text-rose-600 transition-all hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800">
            <svg class="h-7 w-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 class="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-300">No students found</h3>
          <p class="mt-1 text-xs text-slate-400">{{ hasActiveFilters ? 'Try adjusting your search or filters.' : 'No students enrolled in this batch yet.' }}</p>
        </div>

        <BasePagination v-if="pagination && pagination.last_page > 1" :meta="pagination" @page-change="setPage" />
      </div>
    </template>

    <ConfirmDialog :show="confirm.show" title="Delete Student" message="Are you sure you want to delete this student? This action cannot be undone."
      confirm-text="Delete" cancel-text="Cancel" :loading="confirm.loading" :error="confirm.error"
      @confirm="handleConfirmDelete" @cancel="confirm.cancel()" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { batchService, type BatchStatistics } from '@/services/batch'
import { useStudentStore } from '@/stores/student'
import { useToastStore } from '@/stores/toast'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import BasePagination from '@/components/ui/BasePagination.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import type { StudentPaginationMeta } from '@/types/student'

const route = useRoute()
const studentStore = useStudentStore()
const toast = useToastStore()
const confirm = reactive(useConfirmDialog())

const batchId = computed(() => Number(route.params.id))

const stats = ref<BatchStatistics | null>(null)
const loading = ref(false)
const error = ref('')
const exporting = ref(false)

const students = computed(() => studentStore.students)
const studentsLoading = computed(() => studentStore.loading)
const pagination = computed<StudentPaginationMeta | null>(() => studentStore.pagination)

const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)

const hasActiveFilters = computed(() => !!searchQuery.value || !!statusFilter.value)

async function fetchStats() {
  loading.value = true
  error.value = ''
  try {
    const res = await batchService.getStatistics(batchId.value)
    stats.value = res.data
  } catch {
    error.value = 'Failed to load batch statistics.'
  } finally {
    loading.value = false
  }
}

async function fetchStudents() {
  const params: Record<string, string | number> = {
    page: currentPage.value,
    per_page: 15,
    batch_id: batchId.value,
  }
  if (searchQuery.value) params.search = searchQuery.value
  if (statusFilter.value) params.status = statusFilter.value
  await studentStore.fetchStudents(params as { per_page?: number; page?: number; search?: string })
}

function onSearch() { currentPage.value = 1; fetchStudents() }
function onFilterChange() { currentPage.value = 1; fetchStudents() }
function clearFilters() { searchQuery.value = ''; statusFilter.value = ''; currentPage.value = 1; fetchStudents() }
function setPage(page: number) { currentPage.value = page; fetchStudents() }

async function fetchData() {
  await fetchStats()
  await fetchStudents()
}

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename
  document.body.appendChild(a); a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

async function exportPdf() {
  exporting.value = true
  try {
    const blob = await batchService.exportPdf(batchId.value)
    downloadBlob(blob, `batch-${batchId.value}-students.pdf`)
    toast.success('PDF exported successfully')
  } catch {
    toast.error('Failed to export PDF')
  } finally {
    exporting.value = false
  }
}

async function exportExcel() {
  exporting.value = true
  try {
    const blob = await batchService.exportExcel(batchId.value)
    downloadBlob(blob, `batch-${batchId.value}-students.xlsx`)
    toast.success('Excel exported successfully')
  } catch {
    toast.error('Failed to export Excel')
  } finally {
    exporting.value = false
  }
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function statusClass(status?: string): string {
  switch (status) {
    case 'active': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'inactive': return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
    case 'graduated': return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'suspended': return 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
    default: return 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
  }
}

function statusDotClass(status?: string): string {
  switch (status) {
    case 'active': return 'bg-emerald-500'
    case 'inactive': return 'bg-slate-400'
    case 'graduated': return 'bg-blue-500'
    case 'suspended': return 'bg-rose-500'
    default: return 'bg-slate-400'
  }
}

function formatStatus(status?: string): string {
  if (!status) return 'Unknown'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

let deleteTargetId: number | null = null

async function deleteStudent(id: number) {
  deleteTargetId = id
  const confirmed = await confirm.open({
    title: 'Delete Student',
    message: 'Are you sure you want to delete this student? This action cannot be undone.',
  })
  if (!confirmed) return
  await handleConfirmDelete()
}

async function handleConfirmDelete() {
  if (deleteTargetId === null) return
  await confirm.confirmAsync(async () => {
    await studentStore.deleteStudent(deleteTargetId!)
    toast.success('Student deleted successfully.')
  })
}

onMounted(fetchData)
</script>
