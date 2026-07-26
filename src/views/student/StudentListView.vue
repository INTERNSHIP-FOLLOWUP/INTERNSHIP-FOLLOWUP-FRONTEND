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
      <div class="flex items-center gap-2">
        <button @click="showImportModal = true"
          class="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-indigo-200 hover:bg-slate-50">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Import
        </button>
        <button @click="exportPdf"
          class="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-indigo-200 hover:bg-slate-50">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          PDF
        </button>
        <button @click="exportExcel"
          class="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-emerald-200 hover:bg-emerald-50">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Excel
        </button>
        <button @click="showFormModal = true"
          class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-500/20 transition-all duration-200 hover:from-primary-700 hover:to-primary-600 hover:shadow-md active:scale-95">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Add Student
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-3">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name, code or email..."
        class="h-10 w-full min-w-0 flex-1 basis-[200px] rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 placeholder-slate-400 transition-colors focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
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
        <option value="deactivated">Deactivated</option>
      </select>

      <select
        v-model="genderFilter"
        @change="onFilterChange"
        class="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
      >
        <option value="">All Genders</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
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
              <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th class="px-6 py-3.5 font-medium">Photo</th>
                <th class="px-6 py-3.5 font-medium">First Name</th>
                <th class="px-6 py-3.5 font-medium">Last Name</th>
                <th class="px-6 py-3.5 font-medium">Student ID</th>
                <th class="px-6 py-3.5 font-medium">Email</th>
                <th class="px-6 py-3.5 font-medium">Batch</th>
                <th class="px-6 py-3.5 font-medium">Tutor Assigned</th>
                <th class="px-6 py-3.5 font-medium">Status</th>
                <th class="px-6 py-3.5 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="(student, index) in store.students" :key="student.id" class="transition-colors hover:bg-slate-50/50">
                <td class="whitespace-nowrap px-6 py-4">
                  <img
                    v-if="getStudentPhoto(student) && !failedStudentPhotos.has(student.id)"
                    :src="getStudentPhoto(student)!"
                    :alt="student.name"
                    @error="failedStudentPhotos.add(student.id)"
                    class="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow-xs"
                  />
                  <div
                    v-else
                    class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-100 to-teal-50 text-xs font-bold text-emerald-700 ring-2 ring-white shadow-xs"
                  >
                    {{ getInitials(student.name) }}
                  </div>
                </td>
                <td class="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">
                  {{ firstName(student.name) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">
                  {{ lastName(student.name) }}
                </td>
                <td
                  class="whitespace-nowrap px-6 py-4 font-mono text-xs font-medium text-slate-500"
                >
                  {{ formatStudentId(student.student_code, student.batch) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 font-medium text-slate-500 max-w-[200px] truncate">
                  {{ student.email }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span v-if="student.batch" class="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    {{ getBatchDisplay(student.batch) }}
                  </span>
                  <span v-else class="text-slate-300">—</span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                  {{ getTutorDisplay(student.tutor) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
                    :class="statusClass(student.user?.status || student.status)"
                  >
                    <span
                      class="h-1.5 w-1.5 rounded-full"
                      :class="statusDotClass(student.user?.status || student.status)"
                    />
                    {{ formatStatus(student.user?.status || student.status) }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-center">
                  <button type="button" @click.stop="toggleKebab(student, $event)" title="Actions"
                    class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 active:scale-95 mx-auto">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
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
              <div class="min-w-0">
                <p class="font-semibold text-slate-900 truncate">{{ firstName(student.name) }} {{ lastName(student.name) }}</p>
                <p class="mt-0.5 text-xs text-slate-500 truncate max-w-[200px]">{{ student.email }}</p>
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
            <div><span class="font-medium text-slate-700">Code:</span> {{ student.student_code || '—' }}</div>
            <div><span class="font-medium text-slate-700">Batch:</span> {{ getBatchDisplay(student.batch) }}</div>
            <div><span class="font-medium text-slate-700">Tutor:</span> {{ getTutorDisplay(student.tutor) }}</div>
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
    <ConfirmDialog :show="dialog.show.value" :title="dialog.title.value" :message="dialog.message.value" :confirm-text="dialog.confirmText.value" :cancel-text="dialog.cancelText.value" :loading="dialog.loading.value" :error="dialog.error.value" @confirm="handleConfirm" @cancel="dialog.cancel()" />

    <!-- Import Students Modal -->
    <ImportStudentsModal :show="showImportModal" @close="showImportModal = false; fetchPage({ page: 1 })" />

    <!-- Add / Edit Student Modal -->
    <transition name="fade">
      <div v-if="showFormModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8" @click.self="closeFormModal">
        <div class="w-[92%] max-w-2xl rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl my-8">
          <StudentForm :student-id="editingStudentId" @saved="onStudentSaved" @cancel="closeFormModal" />
        </div>
      </div>
    </transition>

    <!-- Teleported Floating Action Menu (Guaranteed No Clipping) -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="openKebabId && selectedStudentForKebab"
          class="fixed z-[9999] w-44 rounded-xl border border-slate-200 bg-white py-1.5 shadow-2xl ring-1 ring-black/5 focus:outline-none text-left"
          :style="{ top: kebabPos.top + 'px', right: kebabPos.right + 'px' }"
          @click.stop>
          <router-link v-if="selectedStudentForKebab" :to="selectedStudentProfileUrl" @click.stop="closeKebab()"
            class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors">
            <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Profile
          </router-link>

          <button type="button" @click.stop="handleKebabEdit"
            class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors">
            <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Student
          </button>

          <button v-if="!isSelectedStudentInactive" type="button" @click.stop="handleKebabDeactivate"
            class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 transition-colors">
            <svg class="h-4 w-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            Deactivate
          </button>

          <button v-if="isSelectedStudentInactive" type="button" @click.stop="handleKebabActivate"
            class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors">
            <svg class="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Reactivate
          </button>

          <div class="my-1 border-t border-slate-100"></div>

          <button type="button" @click.stop="handleKebabDelete"
            class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import api from '@/services/api'
import { formatStudentId } from '@/utils/studentUtils'
import type { Student } from '@/types/student'



import { useStudentStore } from '@/stores/student'
import { useBatchStore } from '@/stores/batchStore'
import { useTutorStore } from '@/stores/tutorStore'
import { useToastStore } from '@/stores/toast'
import { usePagination } from '@/composables/usePagination'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { studentService } from '@/services/student'
import BasePagination from '@/components/ui/BasePagination.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

import ActiveFilters from '@/components/ui/ActiveFilters.vue'
import StudentForm from '@/components/student/StudentForm.vue'
import ImportStudentsModal from '@/components/admin/ImportStudentsModal.vue'
import type { ActiveFilter } from '@/components/ui/ActiveFilters.vue'

const store = useStudentStore()
const batchStore = useBatchStore()
const tutorStore = useTutorStore()
const dialog = useConfirmDialog()
const toast = useToastStore()

const searchQuery = ref('')
const batchFilter = ref('')
const tutorFilter = ref('')
const openKebabId = ref<number | null>(null)
const selectedStudentForKebab = ref<Student | null>(null)
const kebabPos = ref<{ top: number; right: number }>({ top: 0, right: 0 })

const selectedStudentProfileUrl = computed(() => {
  if (!selectedStudentForKebab.value) return '#'
  const id = selectedStudentForKebab.value.user_id || selectedStudentForKebab.value.id
  return `/admin/student-profile/${id}`
})

const isSelectedStudentInactive = computed(() => {
  if (!selectedStudentForKebab.value) return false
  const status = selectedStudentForKebab.value.user?.status || selectedStudentForKebab.value.status
  return status === 'inactive' || status === 'deactivated'
})
const statusFilter = ref('')
const genderFilter = ref('')
let deleteTargetId: number | null = null

const hasActiveFilters = computed(
  () => {
    // Requirements: don’t count very short search terms as an “active search”.
    const hasSearch = searchQuery.value.trim().length >= 2
    return hasSearch || !!batchFilter.value || !!tutorFilter.value || !!statusFilter.value || !!genderFilter.value
  },
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
  if (genderFilter.value) list.push({ key: 'gender', label: 'Gender', value: genderFilter.value })
  return list
})

function firstName(name: string): string {
  return (name || '').split(' ')[0] || ''
}

function lastName(name: string): string {
  const parts = (name || '').split(' ')
  return parts.slice(1).join(' ') || ''
}

const failedStudentPhotos = ref<Set<number>>(new Set())

function getStudentPhoto(student: any): string | null {
  if (!student) return null
  return student.photo_url || student.photo || student.avatar_url || student.avatar || student.user?.photo_url || student.user?.avatar_url || student.user?.avatar || student.student_profile?.photo || null
}

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

function getBatchDisplay(batch: string | { batch_name?: string; name?: string } | undefined): string {
  if (typeof batch === 'object' && batch !== null) return batch.batch_name ?? batch.name ?? '—'
  return batch || '—'
}

function getTutorDisplay(tutor: string | { name?: string } | undefined): string {
  if (typeof tutor === 'object' && tutor !== null) return tutor.name ?? '—'
  return tutor || '—'
}

function formatStatus(status?: string): string {
  if (!status) return 'Unknown'
  if (status.toLowerCase() === 'inactive' || status.toLowerCase() === 'deactivated') return 'Deactivated'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

async function fetchPage({ page }: { page: number }): Promise<void> {
  const params: Record<string, string | number> = { page, per_page: 15 }
  if (searchQuery.value) params.search = searchQuery.value
  if (batchFilter.value) params.batch_id = batchFilter.value
  if (tutorFilter.value) params.tutor_id = tutorFilter.value
  if (statusFilter.value) params.status = statusFilter.value
  if (genderFilter.value) params.gender = genderFilter.value
  try {
    await store.fetchStudents(params)
  } catch {
  }
}


const { setPage, resetPage } = usePagination(fetchPage, {
  batch: batchFilter,
  tutor: tutorFilter,
  status: statusFilter,
  gender: genderFilter,
})

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const isSearchActive = computed(() => searchQuery.value.trim().length >= 2)

function onSearchQueryChanged(): void {

if (searchTimeout) clearTimeout(searchTimeout)

  searchTimeout = setTimeout(() => {
    const q = searchQuery.value.trim()

    if (!q) {
      resetPage()
      return
    }

    if (q.length >= 2) {
      resetPage()
    }
  }, 250)
}


watch(searchQuery, () => {
  onSearchQueryChanged()
})

function onFilterChange(): void {
  resetPage()
}




function removeFilter(key: string): void {
  if (key === 'search') searchQuery.value = ''
  if (key === 'batch') batchFilter.value = ''
  if (key === 'tutor') tutorFilter.value = ''
  if (key === 'status') statusFilter.value = ''
  if (key === 'gender') genderFilter.value = ''
  resetPage()
}

function clearFilters(): void {
  searchQuery.value = ''
  batchFilter.value = ''
  tutorFilter.value = ''
  statusFilter.value = ''
  genderFilter.value = ''
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

const showImportModal = ref(false)
const showFormModal = ref(false)
const editingStudentId = ref<number | undefined>(undefined)

function editStudent(id: number) {
  editingStudentId.value = id
  showFormModal.value = true
}

function closeFormModal() {
  showFormModal.value = false
  editingStudentId.value = undefined
}

function onStudentSaved() {
  closeFormModal()
  toast.success(editingStudentId.value ? 'Student updated successfully.' : 'Student created successfully.')
  // Force-refresh tutor counts — student's tutor assignment may have changed
  tutorStore.fetchTutors({}, true)
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

function toggleKebab(student: Student, event: MouseEvent) {
  if (openKebabId.value === student.id) {
    closeKebab()
    return
  }
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const menuHeight = 160
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

function handleKebabEdit() {
  if (!selectedStudentForKebab.value) return
  const id = selectedStudentForKebab.value.id
  closeKebab()
  editStudent(id)
}

function handleKebabDeactivate() {
  if (!selectedStudentForKebab.value) return
  const s = selectedStudentForKebab.value
  closeKebab()
  confirmAction('deactivate', s)
}

function handleKebabActivate() {
  if (!selectedStudentForKebab.value) return
  const s = selectedStudentForKebab.value
  closeKebab()
  confirmAction('activate', s)
}

function handleKebabDelete() {
  if (!selectedStudentForKebab.value) return
  const s = selectedStudentForKebab.value
  closeKebab()
  confirmAction('delete', s)
}

const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmButtonText = ref('Confirm')
type ActionType = 'delete' | 'deactivate' | 'activate'
const pendingAction = ref<{ type: ActionType; student: Student } | null>(null)

async function confirmAction(type: ActionType, student: Student) {
  pendingAction.value = { type, student }
  const displayName = student.name || `${student.last_name || ''} ${student.first_name || ''}`.trim() || 'Student'
  if (type === 'delete') {
    confirmTitle.value = 'Delete Student'
    confirmMessage.value = `Are you sure you want to permanently delete ${displayName}?`
    confirmButtonText.value = 'Delete'
  } else if (type === 'deactivate') {
    confirmTitle.value = 'Deactivate Student'
    confirmMessage.value = `Are you sure you want to deactivate ${displayName}?`
    confirmButtonText.value = 'Deactivate'
  } else if (type === 'activate') {
    confirmTitle.value = 'Activate Student'
    confirmMessage.value = `Are you sure you want to activate ${displayName}?`
    confirmButtonText.value = 'Activate'
  }
  const confirmed = await dialog.open({ title: confirmTitle.value, message: confirmMessage.value })
  if (!confirmed) return
  await handleConfirmAction()
}

async function handleConfirmAction() {
  if (!pendingAction.value) return
  const { type, student } = pendingAction.value
  const targetId = student.user_id || student.id
  const displayName = student.name || `${student.last_name || ''} ${student.first_name || ''}`.trim() || 'Student'
  await dialog.confirmAsync(async () => {
    if (type === 'delete') {
      await store.deleteStudent(student.id)
      toast.success(`Student "${displayName}" deleted.`)
    } else if (type === 'deactivate') {
      await api.put(`/admin/users/${targetId}/deactivate`)
      toast.success(`Student "${displayName}" deactivated successfully.`)
    } else if (type === 'activate') {
      await api.put(`/admin/users/${targetId}/activate`)
      toast.success(`Student "${displayName}" activated successfully.`)
    }
    pendingAction.value = null
    resetPage()
    // Refresh tutor counts after any student status/assignment change
    tutorStore.fetchTutors({}, true)
  })
}

onMounted(() => {
  batchStore.fetchBatches()
  tutorStore.fetchTutors()
  window.addEventListener('click', closeKebab)
  window.addEventListener('scroll', closeKebab, true)
})

onUnmounted(() => {
  window.removeEventListener('click', closeKebab)
  window.removeEventListener('scroll', closeKebab, true)
})
</script>
