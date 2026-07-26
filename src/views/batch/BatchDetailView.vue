<template>
  <div class="space-y-6" @click="openKebabId = null">
    <div class="flex items-center gap-3 text-sm">
      <router-link to="/admin/batches" class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Batches
      </router-link>
      <span class="text-slate-300 dark:text-slate-700">/</span>
      <span class="font-medium text-slate-900 dark:text-white">{{ stats?.batch_name || 'Batch Details' }}</span>
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
          <button type="button" @click="openCreateModal"
            class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-600 active:scale-95">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Add Student
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div class="rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p class="text-xs font-semibold text-slate-400">Total</p>
          <p class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{{ stats.total_students }}</p>
        </div>
        <div class="rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p class="text-xs font-semibold text-slate-400">Active</p>
          <p class="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ activeCount }}</p>
        </div>
        <div class="rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p class="text-xs font-semibold text-slate-400">Inactive</p>
          <p class="mt-1 text-2xl font-bold text-slate-500 dark:text-slate-400">{{ inactiveCount }}</p>
        </div>
        <div class="rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p class="text-xs font-semibold text-slate-400">Deactivated</p>
          <p class="mt-1 text-2xl font-bold text-rose-600 dark:text-rose-400">{{ deactivatedCount }}</p>
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
            <option value="deactivated">Deactivated</option>
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
          <table class="w-full border-collapse text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
                <th class="px-5 py-3.5">Student</th>
                <th class="px-5 py-3.5">Student ID</th>
                <th class="px-5 py-3.5">Email</th>
                <th class="px-5 py-3.5">Status</th>
                <th class="px-5 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
              <tr v-for="(student, index) in students" :key="student.id" @click="goToStudent(student.user_id || student.id)"
                class="cursor-pointer transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <td class="whitespace-nowrap px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">{{ getInitials(student.name) }}</div>
                    <router-link :to="`/admin/student-profile/${student.user_id || student.id}`" @click.stop class="font-semibold text-slate-900 hover:text-indigo-600 transition-colors dark:text-white dark:hover:text-indigo-400">
                      {{ student.name }}
                    </router-link>
                  </div>
                </td>
                <td class="whitespace-nowrap px-5 py-4 font-mono text-xs font-medium text-slate-500">{{ formatStudentId(student.student_code, stats?.batch_name) }}</td>
                <td class="whitespace-nowrap px-5 py-4 text-slate-500 dark:text-slate-400 max-w-[200px] truncate">{{ student.email }}</td>
                <td class="whitespace-nowrap px-5 py-4">
                  <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold" :class="statusClass(student.status)">
                    <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(student.status)" />
                    {{ formatStatus(student.status) }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-center">
                  <button
                    type="button"
                    @click.stop="toggleKebab(student, $event)"
                    title="Actions"
                    class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 active:scale-95 mx-auto dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
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

    <!-- Add / Edit Student Modal -->
    <transition name="fade">
      <div v-if="showFormModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8" @click.self="closeFormModal">
        <div class="w-[92%] max-w-2xl rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl my-8 dark:border-slate-800 dark:bg-slate-900">
          <StudentForm :student-id="editingStudentId" @saved="onStudentSaved" @cancel="closeFormModal" />
        </div>
      </div>
    </transition>

    <!-- Teleported Floating Action Menu (Guaranteed No Clipping) -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="openKebabId && selectedStudentForKebab"
          class="fixed z-[9999] w-44 rounded-xl border border-slate-200 bg-white py-1.5 shadow-2xl ring-1 ring-black/5 focus:outline-none text-left dark:border-slate-700 dark:bg-slate-800"
          :style="{ top: kebabPos.top + 'px', right: kebabPos.right + 'px' }"
          @click.stop
        >
          <router-link
            :to="'/admin/student-profile/' + (selectedStudentForKebab.user_id || selectedStudentForKebab.id)"
            @click.stop="closeKebab()"
            class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Profile
          </router-link>
          <button
            type="button"
            @click.stop="editStudentFromKebab"
            class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Student
          </button>
          <div class="my-1 border-t border-slate-100 dark:border-slate-700"></div>
          <button
            @click.stop="deleteStudentFromKebab"
            class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors dark:hover:bg-rose-900/20"
          >
            <svg class="h-4 w-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Student
          </button>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { batchService, type BatchStatistics } from '@/services/batch'
import { useStudentStore } from '@/stores/student'
import { useToastStore } from '@/stores/toast'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import BasePagination from '@/components/ui/BasePagination.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import StudentForm from '@/components/student/StudentForm.vue'
import { formatStudentId } from '@/utils/studentUtils'
import type { StudentPaginationMeta } from '@/types/student'

const route = useRoute()
const router = useRouter()
const studentStore = useStudentStore()
const toast = useToastStore()
const confirm = reactive(useConfirmDialog())

const batchId = computed(() => Number(route.params.id))

const stats = ref<BatchStatistics | null>(null)
const loading = ref(false)
const error = ref('')
const exporting = ref(false)
const openKebabId = ref<number | null>(null)
const selectedStudentForKebab = ref<any | null>(null)
const kebabPos = ref<{ top: number; right: number }>({ top: 0, right: 0 })

const students = computed(() => studentStore.students)
const studentsLoading = computed(() => studentStore.loading)
const pagination = computed<StudentPaginationMeta | null>(() => studentStore.pagination)

const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)

const showFormModal = ref(false)
const editingStudentId = ref<number | undefined>(undefined)

function openCreateModal() {
  editingStudentId.value = undefined
  showFormModal.value = true
}

function editStudent(studentId: number) {
  editingStudentId.value = studentId
  showFormModal.value = true
}

function closeFormModal() {
  showFormModal.value = false
  editingStudentId.value = undefined
}

function onStudentSaved() {
  closeFormModal()
  fetchData()
  toast.success('Student saved successfully.')
}

const hasActiveFilters = computed(() => !!searchQuery.value || !!statusFilter.value)

const activeCount = computed(() => {
  if (!stats.value) return 0
  const sb = stats.value.status_breakdown || {}
  const explicitActive = (sb.active || 0) + (sb.Active || 0)
  if (explicitActive > 0) return explicitActive
  // Fallback if users.status was null or defaulted
  const inactive = (sb.inactive || 0) + (sb.Inactive || 0)
  const deactivated = (sb.deactivated || 0) + (sb.Deactivated || 0) + (sb.suspended || 0) + (sb.Suspended || 0)
  return Math.max(0, stats.value.total_students - inactive - deactivated)
})

const inactiveCount = computed(() => {
  if (!stats.value) return 0
  const sb = stats.value.status_breakdown || {}
  return (sb.inactive || 0) + (sb.Inactive || 0)
})

const deactivatedCount = computed(() => {
  if (!stats.value) return 0
  const sb = stats.value.status_breakdown || {}
  return (sb.deactivated || 0) + (sb.Deactivated || 0) + (sb.suspended || 0) + (sb.Suspended || 0)
})

function toggleKebab(student: any, event: MouseEvent) {
  if (openKebabId.value === student.id) {
    closeKebab()
    return
  }
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const menuHeight = 135
  const spaceBelow = window.innerHeight - rect.bottom

  let top = rect.bottom + 4
  if (spaceBelow < menuHeight && rect.top > menuHeight) {
    top = rect.top - menuHeight - 4
  }

  kebabPos.value = {
    top,
    right: Math.max(8, window.innerWidth - rect.right)
  }
  openKebabId.value = student.id
  selectedStudentForKebab.value = student
}

function closeKebab() {
  openKebabId.value = null
  selectedStudentForKebab.value = null
}

function editStudentFromKebab() {
  if (!selectedStudentForKebab.value) return
  const id = selectedStudentForKebab.value.id
  closeKebab()
  editStudent(id)
}

function deleteStudentFromKebab() {
  if (!selectedStudentForKebab.value) return
  const id = selectedStudentForKebab.value.id
  closeKebab()
  deleteStudent(id)
}

function goToStudent(id: number) {
  router.push(`/admin/student-profile/${id}`)
}

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
  if (!name) return 'ST'
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function statusClass(status?: string): string {
  const st = (status || 'active').toLowerCase()
  switch (st) {
    case 'active': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'inactive': return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
    case 'deactivated':
    case 'suspended': return 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
    default: return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
  }
}

function statusDotClass(status?: string): string {
  const st = (status || 'active').toLowerCase()
  switch (st) {
    case 'active': return 'bg-emerald-500'
    case 'inactive': return 'bg-slate-400'
    case 'deactivated':
    case 'suspended': return 'bg-rose-500'
    default: return 'bg-emerald-500'
  }
}

function formatStatus(status?: string): string {
  if (!status) return 'Active'
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

onMounted(() => {
  fetchData()
  window.addEventListener('click', closeKebab)
  window.addEventListener('scroll', closeKebab, true)
})

onUnmounted(() => {
  window.removeEventListener('click', closeKebab)
  window.removeEventListener('scroll', closeKebab, true)
})
</script>
