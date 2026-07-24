<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Students</h1>
        <p class="mt-1 text-sm text-slate-500">
          Manage and monitor all enrolled students across batches.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="openImportModal"
          class="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-indigo-200 hover:bg-slate-50">
          <svg class="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Import Excel
        </button>
        <button @click="handleExportPdf"
          class="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-red-200 hover:bg-red-50">
          <svg class="h-4 w-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Export PDF
        </button>
        <button @click="handleExportExcel"
          class="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-emerald-200 hover:bg-emerald-50">
          <svg class="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Excel
        </button>
        <button type="button" @click="$emit('cancel')"
          class="rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">
          Cancel
        </button>
        <button
          @click="$emit('add')"
          class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-500/20 transition-all duration-200 hover:from-primary-700 hover:to-primary-600 hover:shadow-md hover:shadow-primary-500/25 active:scale-95"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Add Student
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="rounded-lg border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total</p>
        <p class="mt-1 text-2xl font-bold text-slate-900">{{ store.studentCount }}</p>
      </div>
      <div class="rounded-lg border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Active</p>
        <p class="mt-1 text-2xl font-bold text-emerald-600">{{ activeCount }}</p>
      </div>
      <div class="rounded-lg border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Graduated</p>
        <p class="mt-1 text-2xl font-bold text-blue-600">{{ graduatedCount }}</p>
      </div>
      <div class="rounded-lg border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Inactive</p>
        <p class="mt-1 text-2xl font-bold text-slate-600">{{ inactiveCount }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-3">
      <div class="relative min-w-0 flex-1 basis-[200px]">
        <svg
          class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name or email..."
          class="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>

      <select
        v-model="batchFilter"
        @change="fetchStudents"
        class="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 transition-colors focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
      >
        <option value="">All Batches</option>
        <option v-for="b in batches" :key="b.id" :value="b.id">
          {{ b.batch_name || b.name }}
        </option>
      </select>

      <select
        v-model="statusFilter"
        @change="fetchStudents"
        class="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 transition-colors focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <select
        v-model="genderFilter"
        @change="fetchStudents"
        class="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 transition-colors focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
      >
        <option value="">All Genders</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <button
        v-if="hasActiveFilters"
        @click="clearFilters"
        class="flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
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

    <!-- Error Banner -->
    <div
      v-if="localError"
      class="flex items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
    >
      <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <span>{{ localError }}</span>
      <button
        @click="localError = ''"
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
    <div class="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <!-- Loading -->
      <div v-if="store.loading && store.students.length === 0" class="px-6 py-16">
        <div class="flex flex-col items-center justify-center text-center">
          <svg class="h-8 w-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <p class="mt-3 text-sm font-medium text-slate-500">Loading students...</p>
        </div>
      </div>

      <!-- Table -->
      <div v-else-if="store.students.length > 0" class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th class="px-6 py-3.5 font-medium">First Name</th>
              <th class="px-6 py-3.5 font-medium">Last Name</th>
              <th class="px-6 py-3.5 font-medium">Email</th>
              <th class="px-6 py-3.5 font-medium">Batch</th>
              <th class="px-6 py-3.5 font-medium">Status</th>
              <th class="px-6 py-3.5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="(student, index) in store.students" :key="student.id" class="transition-colors hover:bg-slate-50/50">
              <td class="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">{{ student.first_name }}</td>
              <td class="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">{{ student.last_name }}</td>
              <td class="whitespace-nowrap px-6 py-4 font-medium text-slate-500">{{ student.email }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                {{ (student.batch && typeof student.batch === 'object') ? (student.batch.batch_name ?? student.batch.name ?? '—') : (student.batch || '—') }}
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
                  :class="statusBadgeClass(student.status)"
                >
                  <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(student.status)" />
                  {{ formatStatus(student.status) }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right">
                <div class="relative inline-block text-left">
                  <button type="button" @click.stop="toggleKebab(student.id)" title="Actions"
                    class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 active:scale-95">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>

                  <!-- Kebab Dropdown Menu (Smart positioning: Top rows pop DOWN, Bottom rows pop UP) -->
                  <transition name="fade">
                    <div v-if="openKebabId === student.id"
                      class="absolute right-0 z-30 w-44 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none"
                      :class="index < 2 ? 'top-full mt-1 origin-top-right' : 'bottom-full mb-1 origin-bottom-right'">
                      <router-link v-if="student.user_id" :to="`/admin/student-profile/${student.user_id}`" @click.stop="openKebabId = null"
                        class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors">
                        <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Profile
                      </router-link>

                      <button type="button" @click.stop="openKebabId = null; $emit('edit', student.id)"
                        class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors">
                        <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Student
                      </button>

                      <button v-if="student.status !== 'inactive' && student.status !== 'deactivated'" type="button" @click.stop="openKebabId = null; toggleStudentStatus(student)"
                        class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 transition-colors">
                        <svg class="h-4 w-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        Deactivate
                      </button>

                      <button v-else type="button" @click.stop="openKebabId = null; toggleStudentStatus(student)"
                        class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors">
                        <svg class="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Activate
                      </button>

                      <div class="my-1 h-px bg-slate-100" />

                      <button type="button" @click.stop="openKebabId = null; confirmDelete(student)"
                        class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
                        <svg class="h-4 w-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Student
                      </button>
                    </div>
                  </transition>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
      <div
        v-if="store.pagination && store.pagination.last_page > 1"
        class="flex items-center justify-between border-t border-slate-100 px-6 py-3"
      >
        <p class="text-xs font-medium text-slate-500">
          Showing <span class="font-semibold text-slate-700">{{ store.pagination.from }}</span> to
          <span class="font-semibold text-slate-700">{{ store.pagination.to }}</span> of
          <span class="font-semibold text-slate-700">{{ store.pagination.total }}</span> students
        </p>
        <div class="flex items-center gap-1.5">
          <button
            @click="goToPage(store.pagination.current_page - 1)"
            :disabled="store.pagination.current_page <= 1"
            class="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
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
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
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
        <div
          class="w-[92%] max-w-md rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl"
          @click.stop
        >
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50">
              <svg
                class="h-5 w-5 text-rose-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-semibold text-slate-900">Delete Student</h3>
              <p class="mt-0.5 text-sm text-slate-500">
                Are you sure you want to delete
                <span class="font-semibold text-slate-700">{{ deletingTarget.name }}</span
                >? This action cannot be undone.
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
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Import Excel Modal -->
    <ImportStudentsModal :show="showImportModal" @close="handleImportClose" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useStudentStore } from '@/stores/student'
import { useToastStore } from '@/stores/toast'
import { studentService } from '@/services/student'
import type { Student } from '@/types/student'
import api from '@/services/api'
import ImportStudentsModal from '@/components/admin/ImportStudentsModal.vue'

const emit = defineEmits<{
  view: [id: number]
  edit: [id: number]
  add: []
  cancel: []
  delete: [id: number]
  import: []
  'export-pdf': []
  'export-excel': []
}>()

const toast = useToastStore()
const showImportModal = ref(false)
const deletingTarget = ref<Student | null>(null)
const deleting = ref(false)
const openKebabId = ref<number | null>(null)

function openImportModal() {
  showImportModal.value = true
  emit('import')
}

function handleImportClose() {
  showImportModal.value = false
  fetchStudents()
}

async function handleExportPdf() {
  emit('export-pdf')
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

async function handleExportExcel() {
  emit('export-excel')
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

function toggleKebab(id: number) {
  openKebabId.value = openKebabId.value === id ? null : id
}

function handleWindowClick() {
  openKebabId.value = null
}

async function toggleStudentStatus(student: Student) {
  try {
    const isInactive = student.status === 'inactive' || student.status === 'deactivated'
    const endpoint = isInactive ? `/admin/users/${student.user_id || student.id}/activate` : `/admin/users/${student.user_id || student.id}/deactivate`
    await api.put(endpoint)
    fetchStudents()
  } catch {
    /* ignore */
  }
}

function confirmDelete(student: Student): void {
  deletingTarget.value = student
}

async function handleDelete(): Promise<void> {
  if (!deletingTarget.value) return
  deleting.value = true
  try {
    await store.deleteStudent(deletingTarget.value.id)
    emit('delete', deletingTarget.value.id)
    deletingTarget.value = null
  } finally {
    deleting.value = false
  }
}

interface BatchOption { id: number; batch_name: string; name?: string }

const store = useStudentStore()

const localError = ref('')
const searchQuery = ref('')
const statusFilter = ref('')
const batchFilter = ref('')
const genderFilter = ref('')
const batches = ref<BatchOption[]>([])
let searchTimeout: ReturnType<typeof setTimeout> | null = null

const hasActiveFilters = computed(() => !!searchQuery.value || !!statusFilter.value || !!batchFilter.value || !!genderFilter.value)

async function fetchBatches(): Promise<void> {
  try {
    const res = await api.get('/admin/batches')
    batches.value = res.data.data ?? res.data ?? []
  } catch { /* ignore */ }
}

const filteredStudents = computed(() => {
  let list = store.students
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (s: Student) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q),
    )
  }
  if (statusFilter.value) {
    list = list.filter((s: Student) => s.status === statusFilter.value)
  }
  if (batchFilter.value) {
    list = list.filter((s: Student) => String(s.batch_id || (typeof s.batch === 'object' && s.batch ? (s.batch as { id?: number }).id : '')) === String(batchFilter.value))
  }
  if (genderFilter.value) {
    list = list.filter((s: Student) => (s.gender || '').toLowerCase() === genderFilter.value.toLowerCase())
  }
  return list
})

const activeCount = computed(
  () => store.students.filter((s: Student) => s.status === 'active').length,
)
const graduatedCount = computed(
  () => store.students.filter((s: Student) => s.status === 'graduated').length,
)
const inactiveCount = computed(
  () =>
    store.students.filter((s: Student) => s.status === 'inactive' || s.status === 'suspended')
      .length,
)

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

function firstName(name: string): string {
  return (name || '').split(' ')[0] || ''
}

function lastName(name: string): string {
  const parts = (name || '').split(' ')
  return parts.slice(1).join(' ') || ''
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatStatus(status?: string): string {
  if (!status) return 'Unknown'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function statusBadgeClass(status?: string): string {
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
      return 'bg-emerald-50 text-emerald-700'
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
      return 'bg-emerald-500'
  }
}

function goToPage(page: number): void {
  if (page < 1 || page > (store.pagination?.last_page ?? 1)) return
  localError.value = ''
  store.fetchStudents({ page, per_page: 15 }).catch((err: unknown) => {
    localError.value = err instanceof Error ? err.message : 'Failed to load students.'
  })
}

function clearFilters(): void {
  searchQuery.value = ''
  statusFilter.value = ''
  batchFilter.value = ''
  genderFilter.value = ''
}

function fetchStudents(): void {
  localError.value = ''
  const params: { per_page: number; search?: string; status?: string; batch_id?: string; gender?: string } = { per_page: 15 }
  if (statusFilter.value) params.status = statusFilter.value
  if (batchFilter.value) params.batch_id = batchFilter.value
  if (genderFilter.value) params.gender = genderFilter.value
  store.fetchStudents(params).catch((err: unknown) => {
    localError.value = err instanceof Error ? err.message : 'Failed to load students.'
  })
}

watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchStudents()
  }, 300)
})

onMounted(() => {
  fetchBatches()
  fetchStudents()
  window.addEventListener('click', handleWindowClick)
})

onUnmounted(() => {
  window.removeEventListener('click', handleWindowClick)
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
