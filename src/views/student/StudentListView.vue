<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Students</h1>
        <p class="mt-1 text-sm text-slate-500">
          View and manage all enrolled students across batches.
        </p>
      </div>
      <router-link
        to="/admin/users/create"
        class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-500/20 transition-all duration-200 hover:from-primary-700 hover:to-primary-600 hover:shadow-md active:scale-95"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Student
      </router-link>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-3">
      <DebouncedInput
        v-model="searchQuery"
        placeholder="Search by name, code or email..."
        class="min-w-0 flex-1 basis-[200px]"
        @change="onSearch"
      />

      <select
        v-model="batchFilter"
        @change="onFilterChange"
        class="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
      >
        <option value="">All Batches</option>
        <option v-if="batchStore.loading" disabled>Loading...</option>
        <option v-for="b in batchStore.batches" :key="b.id" :value="b.id">
          {{ b.batch_name || b.name }}
        </option>
      </select>

      <select
        v-model="tutorFilter"
        @change="onFilterChange"
        class="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
      >
        <option value="">All Tutors</option>
        <option v-if="tutorStore.loading" disabled>Loading...</option>
        <option v-for="t in tutorStore.tutors" :key="t.id" :value="t.id">{{ t.name }}</option>
      </select>

      <select
        v-model="statusFilter"
        @change="onFilterChange"
        class="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="graduated">Graduated</option>
        <option value="suspended">Suspended</option>
      </select>

      <button
        v-if="hasActiveFilters"
        @click="clearFilters"
        class="flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
      >
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        Clear
      </button>
    </div>

    <ActiveFilters :filters="activeFilterList" @remove="removeFilter" @clear-all="clearFilters" />

    <!-- Error -->
    <div
      v-if="store.error"
      role="alert"
      class="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
    >
      <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <span>{{ store.error }}</span>
      <button
        @click="store.clearError()"
        class="ml-auto rounded-md p-1 transition-colors hover:bg-rose-100"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Content -->
    <div class="rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <!-- Loading Skeleton -->
      <div v-if="store.loading && store.students.length === 0" class="divide-y divide-slate-50">
        <div v-for="n in 5" :key="n" class="flex items-center gap-4 px-6 py-4 animate-pulse">
          <div class="h-8 w-8 rounded-full bg-slate-200" />
          <div class="flex-1 space-y-2">
            <div class="h-3 w-1/3 rounded bg-slate-200" />
            <div class="h-3 w-1/4 rounded bg-slate-100" />
          </div>
          <div class="h-3 w-16 rounded bg-slate-200" />
          <div class="h-3 w-20 rounded bg-slate-200" />
          <div class="h-5 w-16 rounded-full bg-slate-200" />
          <div class="flex gap-2">
            <div class="h-8 w-12 rounded-lg bg-slate-200" />
            <div class="h-8 w-14 rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>

      <!-- Desktop Table -->
      <div v-else-if="store.students.length > 0" class="hidden md:block">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr
                class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400"
              >
                <th class="px-6 py-3.5 font-medium">Student</th>
                <th class="px-6 py-3.5 font-medium">Code</th>
                <th class="px-6 py-3.5 font-medium">Email</th>
                <th class="px-6 py-3.5 font-medium">Batch</th>
                <th class="px-6 py-3.5 font-medium">Tutor</th>
                <th class="px-6 py-3.5 font-medium">Status</th>
                <th class="px-6 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr
                v-for="student in store.students"
                :key="student.id"
                class="transition-colors hover:bg-slate-50/50"
              >
                <td class="whitespace-nowrap px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-600"
                    >
                      {{ getInitials(student.name) }}
                    </div>
                    <span class="font-semibold text-slate-900">{{ student.name }}</span>
                  </div>
                </td>
                <td
                  class="whitespace-nowrap px-6 py-4 font-mono text-xs font-medium text-slate-500"
                >
                  {{ student.student_code || '—' }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 font-medium text-slate-500">
                  {{ student.email }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span
                    v-if="student.batch"
                    class="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600"
                  >
                    {{ student.batch.batch_name || student.batch.name || student.batch }}
                  </span>
                  <span v-else class="text-slate-300">—</span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                  {{ student.tutor?.name || student.tutor || '—' }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
                    :class="statusClass(student.status)"
                  >
                    <span
                      class="h-1.5 w-1.5 rounded-full"
                      :class="statusDotClass(student.status)"
                    />
                    {{ formatStatus(student.status) }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <router-link
                      :to="`/admin/users/${student.id}`"
                      class="rounded-lg px-3 py-1.5 text-xs font-bold text-primary-600 transition-all hover:bg-primary-50 hover:text-primary-800"
                    >
                      Edit
                    </router-link>
                    <button
                      @click="deleteStudent(student.id)"
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
      </div>

      <!-- Mobile Card List -->
      <div v-else-if="store.students.length > 0" class="divide-y divide-slate-100 md:hidden">
        <div
          v-for="student in store.students"
          :key="student.id"
          class="p-4 transition-colors hover:bg-slate-50/50"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary-600"
              >
                {{ getInitials(student.name) }}
              </div>
              <div>
                <p class="font-semibold text-slate-900">{{ student.name }}</p>
                <p class="mt-0.5 text-xs text-slate-500">{{ student.email }}</p>
              </div>
            </div>
            <span
              class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold"
              :class="statusClass(student.status)"
            >
              <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(student.status)" />
              {{ formatStatus(student.status) }}
            </span>
          </div>
          <div class="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
            <div>
              <span class="font-medium text-slate-700">Code:</span>
              {{ student.student_code || '—' }}
            </div>
            <div>
              <span class="font-medium text-slate-700">Batch:</span>
              {{ student.batch?.batch_name || student.batch?.name || student.batch || '—' }}
            </div>
            <div>
              <span class="font-medium text-slate-700">Tutor:</span>
              {{ student.tutor?.name || student.tutor || '—' }}
            </div>
          </div>
          <div class="mt-3 flex items-center gap-2">
            <router-link
              :to="`/admin/users/${student.id}`"
              class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Edit
            </router-link>
            <button
              @click="deleteStudent(student.id)"
              class="flex-1 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
          <svg class="h-7 w-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
        </div>
        <h3 class="mt-4 text-sm font-semibold text-slate-700">No students found</h3>
        <p class="mt-1 text-xs text-slate-400">
          {{
            hasActiveFilters
              ? 'Try adjusting your search or filters.'
              : 'No students have been enrolled yet.'
          }}
        </p>
      </div>

      <!-- Pagination -->
      <BasePagination
        v-if="store.pagination && store.pagination.last_page > 1"
        :meta="store.pagination"
        @page-change="setPage"
      />
    </div>

    <!-- Delete Confirmation -->
    <ConfirmDialog
      :show="dialog.show.value"
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
import { ref, computed, onMounted } from 'vue'
import { useStudentStore } from '@/stores/student'
import { useBatchStore } from '@/stores/batchStore'
import { useTutorStore } from '@/stores/tutorStore'
import { useToastStore } from '@/stores/toast'
import { usePagination } from '@/composables/usePagination'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import BasePagination from '@/components/ui/BasePagination.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import DebouncedInput from '@/components/ui/DebouncedInput.vue'
import ActiveFilters from '@/components/ui/ActiveFilters.vue'
import type { ActiveFilter } from '@/components/ui/ActiveFilters.vue'

const store = useStudentStore()
const batchStore = useBatchStore()
const tutorStore = useTutorStore()
const dialog = useConfirmDialog()
const toast = useToastStore()

const searchQuery = ref('')
const batchFilter = ref('')
const tutorFilter = ref('')
const statusFilter = ref('')
let deleteTargetId: number | null = null

const hasActiveFilters = computed(
  () => !!searchQuery.value || !!batchFilter.value || !!tutorFilter.value || !!statusFilter.value,
)

const activeFilterList = computed<ActiveFilter[]>(() => {
  const list: ActiveFilter[] = []
  if (searchQuery.value) list.push({ key: 'search', label: 'Search', value: searchQuery.value })
  if (batchFilter.value) {
    const batch = batchStore.batches.find((b) => String(b.id) === batchFilter.value)
    const batchName = batch?.batch_name
      ? String(batch.batch_name)
      : batch?.name
        ? String(batch.name)
        : batchFilter.value
    list.push({ key: 'batch', label: 'Batch', value: batchName })
  }
  if (tutorFilter.value) {
    const tutor = tutorStore.tutors.find((t) => String(t.id) === tutorFilter.value)
    list.push({ key: 'tutor', label: 'Tutor', value: tutor?.name ?? tutorFilter.value })
  }
  if (statusFilter.value) list.push({ key: 'status', label: 'Status', value: statusFilter.value })
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

function statusClass(status?: string): string {
  switch (status) {
    case 'active':
      return 'bg-emerald-50 text-emerald-700'
    case 'inactive':
      return 'bg-slate-100 text-slate-600'
    case 'graduated':
      return 'bg-blue-50 text-blue-700'
    case 'suspended':
      return 'bg-rose-50 text-rose-700'
    default:
      return 'bg-slate-50 text-slate-600'
  }
}

function statusDotClass(status?: string): string {
  switch (status) {
    case 'active':
      return 'bg-emerald-500'
    case 'inactive':
      return 'bg-slate-400'
    case 'graduated':
      return 'bg-blue-500'
    case 'suspended':
      return 'bg-rose-500'
    default:
      return 'bg-slate-400'
  }
}

function formatStatus(status?: string): string {
  if (!status) return 'Unknown'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function fetchPage({ page }: { page: number }): void {
  const params: Record<string, string | number> = { page, per_page: 15 }
  if (searchQuery.value) params.search = searchQuery.value
  if (batchFilter.value) params.batch_id = batchFilter.value
  if (tutorFilter.value) params.tutor_id = tutorFilter.value
  if (statusFilter.value) params.status = statusFilter.value
  store.fetchStudents(params as { per_page?: number; page?: number; search?: string })
}

const { setPage, resetPage } = usePagination(fetchPage, {
  search: searchQuery,
  batch: batchFilter,
  tutor: tutorFilter,
  status: statusFilter,
})

function onSearch(): void {
  resetPage()
}
function onFilterChange(): void {
  resetPage()
}

function removeFilter(key: string): void {
  if (key === 'search') searchQuery.value = ''
  if (key === 'batch') batchFilter.value = ''
  if (key === 'tutor') tutorFilter.value = ''
  if (key === 'status') statusFilter.value = ''
  resetPage()
}

function clearFilters(): void {
  searchQuery.value = ''
  batchFilter.value = ''
  tutorFilter.value = ''
  statusFilter.value = ''
  resetPage()
}

async function deleteStudent(id: number): Promise<void> {
  deleteTargetId = id
  const confirmed = await dialog.open({
    title: 'Delete Student',
    message: 'Are you sure you want to delete this student? This action cannot be undone.',
  })
  if (!confirmed) return
  await handleConfirm()
}

async function handleConfirm(): Promise<void> {
  if (deleteTargetId === null) return
  await dialog.confirmAsync(async () => {
    await store.deleteStudent(deleteTargetId!)
    toast.success('Student deleted successfully.')
  })
}

onMounted(() => {
  batchStore.fetchBatches()
  tutorStore.fetchTutors()
})
</script>
