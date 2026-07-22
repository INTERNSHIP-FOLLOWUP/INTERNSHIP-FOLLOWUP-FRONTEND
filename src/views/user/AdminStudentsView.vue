<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Students</h1>
        <p class="mt-1 text-sm text-slate-500">{{ totalStudents }} registered student{{ totalStudents !== 1 ? 's' : '' }}</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="showImportModal = true"
          class="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-primary-200 hover:bg-primary-50">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Import Excel
        </button>
        <button @click="exportPdf"
          class="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-primary-200 hover:bg-primary-50">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Export PDF
        </button>
        <button @click="exportExcel"
          class="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-primary-200 hover:bg-primary-50">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Excel
        </button>
        <button @click="selectMode ? clearSelection() : enterSelectMode()"
          class="flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold shadow-sm transition-all"
          :class="selectMode
            ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-rose-200 hover:bg-rose-50'">
          <svg v-if="selectMode" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {{ selectMode ? 'Cancel' : 'Select All' }}
        </button>
        <button @click="openCreateModal"
          class="flex h-10 items-center gap-2 rounded-xl bg-primary-600 px-4 text-sm font-semibold text-white shadow-md shadow-primary-200 transition-all hover:bg-primary-700">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Student
        </button>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <div class="relative min-w-0 flex-1 basis-[200px]">
        <svg class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="searchQuery" type="text" placeholder="Search students..."
          class="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100" />
      </div>
      <select v-model="sortOrder"
        class="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100">
        <option value="">Newest</option>
        <option value="name_asc">Name A-Z</option>
        <option value="name_desc">Name Z-A</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>

    <div class="rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <!-- Loading skeleton -->
      <div v-if="loading" class="space-y-0 divide-y divide-slate-50">
        <div v-for="n in 3" :key="n" class="flex items-center gap-4 px-6 py-4 animate-pulse">
          <div class="h-4 w-4 rounded bg-slate-200" />
          <div class="flex-1 space-y-2">
            <div class="h-3 w-1/3 rounded bg-slate-200" />
            <div class="h-3 w-1/4 rounded bg-slate-100" />
          </div>
          <div class="h-5 w-16 rounded-full bg-slate-200" />
          <div class="flex gap-2">
            <div class="h-8 w-20 rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>

      <div v-else-if="students.length > 0">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th v-if="selectMode" class="px-4 py-3.5 w-10">
                  <input type="checkbox" :checked="isAllSelected" :indeterminate="isIndeterminate"
                    @change="toggleSelectAll"
                    class="h-4 w-4 rounded border-slate-300 cursor-pointer accent-rose-600" />
                </th>
                <th class="px-6 py-3.5 font-medium">First Name</th>
                <th class="px-6 py-3.5 font-medium">Last Name</th>
                <th class="px-6 py-3.5 font-medium">Student Code</th>
                <th class="px-6 py-3.5 font-medium">Email</th>
                <th class="px-6 py-3.5 font-medium">Status</th>
                <th class="px-6 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="student in students" :key="student.id"
                class="transition-colors hover:bg-slate-50/50"
                :class="{ 'bg-rose-50/40': selectedIds.has(student.id) }">
                <td v-if="selectMode" class="px-4 py-4 w-10">
                  <input type="checkbox" :checked="selectedIds.has(student.id)"
                    @change="toggleSelect(student.id)"
                    class="h-4 w-4 rounded border-slate-300 cursor-pointer accent-rose-600" />
                </td>
                <td class="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">{{ student.first_name }}</td>
                <td class="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">{{ student.last_name }}</td>
                <td class="whitespace-nowrap px-6 py-4 font-mono text-xs font-medium text-slate-500">{{ student.student_profile?.student_code || student.student_code || '—' }}</td>
                <td class="whitespace-nowrap px-6 py-4 text-slate-500">{{ student.email }}</td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
                    :class="student.deleted_at ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'">
                    <span class="h-1.5 w-1.5 rounded-full" :class="student.deleted_at ? 'bg-rose-500' : 'bg-emerald-500'" />
                    {{ student.deleted_at ? 'Deactivated' : 'Active' }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <button type="button" @click.stop="goToProfile(student.id)" title="View Profile"
                      class="flex h-8 w-8 items-center justify-center rounded-lg text-primary-600 transition-all hover:bg-primary-50 hover:text-primary-700">
                      <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button type="button" @click.stop="editStudent(student.id)" title="Edit Student"
                      class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900">
                      <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button type="button" @click.stop="deleteStudent(student)" title="Delete Student"
                      class="flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 transition-all hover:bg-rose-50 hover:text-rose-700">
                      <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.last_page > 1" class="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-xs font-medium text-slate-500">
            Showing <span class="font-semibold text-slate-700">{{ pagination.from }}</span> – <span class="font-semibold text-slate-700">{{ pagination.to }}</span> of <span class="font-semibold text-slate-700">{{ pagination.total }}</span>
          </p>
          <div class="flex items-center gap-1">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage <= 1"
              class="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-slate-600 transition-all hover:bg-slate-100 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-30">&lsaquo;</button>
            <template v-for="p in visiblePages" :key="p">
              <span v-if="p === '...'" class="px-1 text-xs font-bold text-slate-400">...</span>
              <button v-else @click="goToPage(Number(p))"
                class="flex h-9 min-w-[36px] items-center justify-center rounded-lg px-3 text-xs font-bold transition-all"
                :class="p === currentPage ? 'bg-primary-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-primary-600'">{{ p }}</button>
            </template>
            <button @click="goToPage(currentPage + 1)" :disabled="currentPage >= (pagination?.last_page || 1)"
              class="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-slate-600 transition-all hover:bg-slate-100 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-30">&rsaquo;</button>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center px-6 py-16 text-center">
        <h3 class="text-base font-bold text-slate-900">No students found</h3>
        <p class="mt-1 text-sm text-slate-500">No registered students yet.</p>
      </div>
    </div>

    <!-- ── Floating Bulk Action Bar ── -->
    <transition name="slide-up">
      <div v-if="selectedIds.size > 0"
        class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        <div class="flex items-center gap-3 rounded-2xl border border-rose-200 bg-white px-5 py-3 shadow-2xl shadow-rose-100 ring-1 ring-rose-100">
          <span class="flex h-7 min-w-[28px] items-center justify-center rounded-full bg-rose-600 px-2 text-xs font-bold text-white">
            {{ selectedIds.size }}
          </span>
          <span class="text-sm font-semibold text-slate-700">
            student{{ selectedIds.size !== 1 ? 's' : '' }} selected
          </span>
          <div class="mx-1 h-5 w-px bg-slate-200" />
          <button @click="bulkDelete" :disabled="bulkDeleting"
            class="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-rose-700 disabled:opacity-60 active:scale-95">
            <svg v-if="bulkDeleting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {{ bulkDeleting ? 'Deleting...' : 'Delete Selected' }}
          </button>
          <button @click="clearSelection"
            class="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-95">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
        </div>
      </div>
    </transition>

    <!-- ── Bulk Confirm Modal ── -->
    <transition name="fade">
      <div v-if="showBulkConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="showBulkConfirm = false">
        <div class="w-[92%] max-w-md rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50">
              <svg class="h-5 w-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-semibold text-slate-900">Delete {{ selectedIds.size }} Student{{ selectedIds.size !== 1 ? 's' : '' }}</h3>
              <p class="mt-0.5 text-sm text-slate-500">This action is permanent and cannot be undone.</p>
            </div>
          </div>
          <div v-if="bulkError" class="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{{ bulkError }}</div>
          <div class="mt-5 flex items-center justify-end gap-3">
            <button @click="showBulkConfirm = false" :disabled="bulkDeleting"
              class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
              Cancel
            </button>
            <button @click="confirmBulkDelete" :disabled="bulkDeleting"
              class="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:opacity-60">
              <svg v-if="bulkDeleting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {{ bulkDeleting ? 'Deleting...' : `Delete ${selectedIds.size}` }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Import Modal -->
    <ImportStudentsModal :show="showImportModal" @close="handleImportModalClose" />

    <!-- Add/Edit Student Modal -->
    <transition name="fade">
      <div v-if="showFormModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8" @click.self="closeFormModal">
        <div class="w-[92%] max-w-2xl rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl my-8">
          <StudentForm :student-id="editingStudentId" @saved="onStudentSaved" @cancel="closeFormModal" />
        </div>
      </div>
    </transition>

    <ConfirmDialog
      :show="confirmShow"
      :title="confirmTitle"
      :message="confirmMessage"
      :confirm-text="confirmButtonText"
      cancel-text="Cancel"
      :loading="confirmLoading"
      :error="confirmError"
      @confirm="handleConfirmAction"
      @cancel="confirmCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { studentService } from '@/services/student'
import api from '@/services/api'
import StudentForm from '@/components/student/StudentForm.vue'
import ImportStudentsModal from '@/components/admin/ImportStudentsModal.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

interface Role { id: number; name: string }
interface Batch { id: number; batch_name: string; year: string }
interface StudentProfile {
  id: number
  student_code: string | null
  batch_id: number | null
}
interface Student {
  id: number                    // This is the user ID
  user_id: number
  first_name: string
  last_name: string
  name: string
  email: string
  student_code: string | null
  role: Role | null
  batch: Batch | null
  student_profile?: StudentProfile
  deleted_at: string | null
}
interface PaginationMeta { current_page: number; last_page: number; per_page: number; total: number; from: number; to: number }

const students = ref<Student[]>([])
const loading = ref(false)
const searchQuery = ref('')
const sortOrder = ref('')
const totalStudents = ref(0)
const currentPage = ref(1)
const pagination = ref<PaginationMeta | null>(null)
const showImportModal = ref(false)
const showFormModal = ref(false)
const editingStudentId = ref<number | undefined>(undefined)
const router = useRouter()
const toast = useToastStore()
const { show: confirmShow, loading: confirmLoading, error: confirmError, open: confirmOpen, cancel: confirmCancel, confirmAsync: confirmAsyncFn } = useConfirmDialog()
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmButtonText = ref('Confirm')
type ActionType = 'delete'
const pendingAction = ref<{ type: ActionType; student: Student } | null>(null)

// ── Bulk select state ──
const selectMode = ref(false)
const selectedIds = ref<Set<number>>(new Set())
const showBulkConfirm = ref(false)
const bulkDeleting = ref(false)
const bulkError = ref('')

function enterSelectMode() {
  selectMode.value = true
}

const isAllSelected = computed(() =>
  students.value.length > 0 && students.value.every(s => selectedIds.value.has(s.id))
)
const isIndeterminate = computed(() =>
  students.value.some(s => selectedIds.value.has(s.id)) && !isAllSelected.value
)

function toggleSelect(id: number) {
  const next = new Set(selectedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selectedIds.value = next
}

function toggleSelectAll() {
  if (isAllSelected.value) {
    const next = new Set(selectedIds.value)
    students.value.forEach(s => next.delete(s.id))
    selectedIds.value = next
  } else {
    const next = new Set(selectedIds.value)
    students.value.forEach(s => next.add(s.id))
    selectedIds.value = next
  }
}

function clearSelection() {
  selectedIds.value = new Set()
  selectMode.value = false
}

function bulkDelete() {
  bulkError.value = ''
  showBulkConfirm.value = true
}

async function confirmBulkDelete() {
  bulkDeleting.value = true
  bulkError.value = ''
  try {
    const ids = Array.from(selectedIds.value)
    const response = await api.delete('/admin/users/bulk-delete', { data: { ids } })
    toast.success(`Deleted ${ids.length} student${ids.length !== 1 ? 's' : ''} successfully.`)
    showBulkConfirm.value = false
    clearSelection()
    fetchStudents()
  } catch (err: unknown) {
    const errorData = (err as { response?: { data?: { message?: string; errors?: string[] } } })?.response?.data
    if (errorData?.errors && errorData.errors.length > 0) {
      bulkError.value = errorData.errors.join('; ')
    } else {
      bulkError.value = errorData?.message || 'Bulk delete failed.'
    }
  } finally {
    bulkDeleting.value = false
  }
}

const visiblePages = computed(() => {
  const total = pagination.value?.last_page || 1
  const current = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | string)[] = []
  if (current > 3) pages.push(1, '...')
  const start = Math.max(1, current - 1)
  const end = Math.min(total, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < total - 2) pages.push('...', total)
  return pages
})

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
  fetchStudents()
  toast.success('Student saved successfully.')
}
function handleImportModalClose() {
  showImportModal.value = false
  fetchStudents()
}
function goToProfile(userId: number) {
  router.push(`/admin/student-profile/${userId}`)
}

async function confirmAction(type: ActionType, student: Student) {
  pendingAction.value = { type, student }
  if (type === 'delete') {
    confirmTitle.value = 'Delete Student'
    confirmMessage.value = `Are you sure you want to permanently delete ${student.first_name} ${student.last_name}?`
    confirmButtonText.value = 'Delete'
  }
  const confirmed = await confirmOpen({ title: confirmTitle.value, message: confirmMessage.value })
  if (!confirmed) return
  await handleConfirmAction()
}

async function handleConfirmAction() {
  if (!pendingAction.value) return
  const { type, student } = pendingAction.value
  await confirmAsyncFn(async () => {
    if (type === 'delete') {
      await api.delete(`/admin/users/${student.id}`)
      toast.success(`Student "${student.first_name} ${student.last_name}" deleted.`)
    }
    pendingAction.value = null
    fetchStudents()
  })
}

function deleteStudent(student: Student) { confirmAction('delete', student) }
function goToPage(page: number) {
  if (page < 1 || (pagination.value && page > pagination.value.last_page)) return
  currentPage.value = page
  fetchStudents()
}

async function exportPdf() {
  try {
    const blob = await studentService.exportPdf()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `students-${new Date().toISOString().slice(0, 10)}.pdf`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('PDF exported successfully.')
  } catch {
    toast.error('Failed to export PDF.')
  }
}

async function exportExcel() {
  try {
    const blob = await studentService.exportExcel()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `students-${new Date().toISOString().slice(0, 10)}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Excel exported successfully.')
  } catch {
    toast.error('Failed to export Excel.')
  }
}

async function fetchStudents() {
  loading.value = true
  try {
    const params: Record<string, string | number> = { role: 'student', per_page: 10, page: currentPage.value }
    if (searchQuery.value) params.search = searchQuery.value
    if (sortOrder.value) params.sort = sortOrder.value
    const res = await api.get('/admin/users', { params })
    students.value = res.data.data ?? []
    pagination.value = res.data.meta ?? null
    totalStudents.value = res.data.meta?.total ?? 0
  } catch { /* ignore */ }
  finally { loading.value = false }
}

let timeout: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, () => {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => { currentPage.value = 1; fetchStudents() }, 300)
})
watch(sortOrder, () => { currentPage.value = 1; fetchStudents() })

onMounted(fetchStudents)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active { transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
.slide-up-leave-active { transition: all 0.2s ease-in; }
.slide-up-enter-from  { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.95); }
.slide-up-leave-to    { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.95); }
</style>
