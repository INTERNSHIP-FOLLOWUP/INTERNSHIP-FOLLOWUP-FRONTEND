<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Tutors</h1>
        <p class="mt-1 text-sm text-slate-500">Manage academic tutors, their status, and student assignments.</p>
      </div>
      <router-link
        to="/admin/tutors/create"
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
        Add Tutor
      </router-link>
    </div>

    <!-- Summary Stats Bar -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div class="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Tutors</p>
            <p class="text-xl font-bold text-slate-900">{{ store.tutors.length }}</p>
          </div>
        </div>
      </div>
      <div class="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Tutors</p>
            <p class="text-xl font-bold text-slate-900">{{ activeTutorsCount }}</p>
          </div>
        </div>
      </div>
      <div class="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Students Assigned</p>
            <p class="text-xl font-bold text-slate-900">{{ totalStudentsAssigned }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-3">
      <DebouncedInput
        v-model="searchQuery"
        placeholder="Search by name, email, or phone..."
        class="min-w-0 flex-1 basis-[220px]"
        @change="onSearch"
      />

      <select
        v-model="selectedStatus"
        class="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm transition-colors focus:border-primary-500 focus:outline-none"
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="deactivated">Deactivated</option>
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

    <div
      v-if="store.error"
      class="flex items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
    >
      <span>{{ store.error }}</span>
      <button
        @click="store.clearError()"
        class="ml-auto rounded-md p-1 transition-colors hover:bg-rose-100"
      >
        &times;
      </button>
    </div>

    <!-- Content Table -->
    <div class="rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <!-- Loading Skeleton -->
      <div v-if="store.loading" class="divide-y divide-slate-50">
        <div v-for="n in 5" :key="n" class="flex items-center gap-4 px-6 py-4 animate-pulse">
          <div class="h-10 w-10 rounded-full bg-slate-200" />
          <div class="flex-1 space-y-2">
            <div class="h-3.5 w-1/3 rounded bg-slate-200" />
            <div class="h-3 w-1/4 rounded bg-slate-100" />
          </div>
          <div class="h-4 w-16 rounded bg-slate-200" />
          <div class="flex gap-2">
            <div class="h-8 w-16 rounded-lg bg-slate-200" />
            <div class="h-8 w-14 rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>

      <!-- Desktop Table -->
      <div v-else-if="filteredTutors.length > 0" class="hidden md:block">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr
                class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400"
              >
                <th class="px-6 py-3.5 font-medium">Photo</th>
                <th class="px-6 py-3.5 font-medium">Full name</th>
                <th class="px-6 py-3.5 font-medium">Contact</th>
                <th class="px-6 py-3.5 font-medium">Gender</th>
                <th class="px-6 py-3.5 font-medium">Status</th>
                <th class="px-6 py-3.5 font-medium">Assigned Students</th>
                <th class="px-6 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr
                v-for="(tutor, index) in filteredTutors"
                :key="tutor.id"
                class="group transition-colors hover:bg-slate-50/50"
              >
                <td class="whitespace-nowrap px-6 py-4">
                  <img
                    v-if="getTutorPhoto(tutor) && !failedPhotos.has(tutor.id)"
                    :src="getTutorPhoto(tutor)!"
                    :alt="tutor.name"
                    @error="failedPhotos.add(tutor.id)"
                    class="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-xs"
                  />
                  <div
                    v-else
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-primary-100 to-blue-50 text-xs font-bold text-primary-700 ring-2 ring-white shadow-xs"
                  >
                    {{ getInitials(tutor.name) }}
                  </div>
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <div>
                    <router-link
                      :to="`/admin/tutors/${tutor.id}`"
                      class="font-semibold text-slate-900 hover:text-primary-600 transition-colors"
                    >
                      {{ tutor.name }}
                    </router-link>
                    <p class="text-xs text-slate-500 truncate max-w-[200px]">{{ tutor.email }}</p>
                  </div>
                </td>
                <td class="whitespace-nowrap px-6 py-4 font-medium text-slate-600">
                  {{ tutor.phone || tutor.user?.phone || '—' }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span
                    v-if="tutor.gender || tutor.user?.gender"
                    class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium"
                    :class="(tutor.gender || tutor.user?.gender) === 'Female' ? 'bg-pink-50 text-pink-700' : 'bg-blue-50 text-blue-700'"
                  >
                    {{ tutor.gender || tutor.user?.gender }}
                  </span>
                  <span v-else class="text-slate-400">—</span>
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
                    :class="
                      (tutor.status || tutor.user?.status) === 'active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    "
                  >
                    <span
                      class="h-1.5 w-1.5 rounded-full"
                      :class="
                        (tutor.status || tutor.user?.status) === 'active'
                          ? 'bg-emerald-500'
                          : 'bg-slate-400'
                      "
                    ></span>
                    {{ tutor.status || tutor.user?.status || 'active' }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700"
                  >
                    <svg class="h-3.5 w-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {{ getTutorStudentCount(tutor.id) }} Students
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right">
                  <div class="relative inline-block text-left">
                    <button
                      type="button"
                      @click.stop="toggleKebab(tutor.id)"
                      title="Actions"
                      class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 active:scale-95"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>

                    <!-- Kebab Dropdown Menu -->
                    <transition name="fade">
                      <div
                        v-if="openKebabId === tutor.id"
                        class="absolute right-0 z-30 w-44 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none"
                        :class="index < 2 ? 'top-full mt-1 origin-top-right' : 'bottom-full mb-1 origin-bottom-right'"
                      >
                        <router-link
                          :to="`/admin/tutors/${tutor.id}`"
                          @click.stop="openKebabId = null"
                          class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors"
                        >
                          <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Details
                        </router-link>

                        <router-link
                          :to="`/admin/tutors/${tutor.id}/edit`"
                          @click.stop="openKebabId = null"
                          class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors"
                        >
                          <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Tutor
                        </router-link>

                        <div class="my-1 h-px bg-slate-100" />

                        <button
                          type="button"
                          @click.stop="openKebabId = null; onDelete(tutor.id)"
                          class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <svg class="h-4 w-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete Tutor
                        </button>
                      </div>
                    </transition>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Mobile Card List -->
      <div v-else-if="filteredTutors.length > 0" class="divide-y divide-slate-100 md:hidden">
        <div
          v-for="tutor in filteredTutors"
          :key="tutor.id"
          class="p-4 transition-colors hover:bg-slate-50/50 space-y-3"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <img
                v-if="getTutorPhoto(tutor) && !failedPhotos.has(tutor.id)"
                :src="getTutorPhoto(tutor)!"
                :alt="tutor.name"
                @error="failedPhotos.add(tutor.id)"
                class="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-xs"
              />
              <div
                v-else
                class="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary-600"
              >
                {{ getInitials(tutor.name) }}
              </div>
              <div>
                <router-link
                  :to="`/admin/tutors/${tutor.id}`"
                  class="font-semibold text-slate-900 hover:text-primary-600"
                >
                  {{ tutor.name }}
                </router-link>
                <p class="text-xs text-slate-500 truncate max-w-[200px]">{{ tutor.email }}</p>
              </div>
            </div>
            <span
              class="rounded-full px-2 py-0.5 text-[10px] font-bold"
              :class="
                (tutor.status || tutor.user?.status) === 'active'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-slate-100 text-slate-600'
              "
            >
              {{ tutor.status || tutor.user?.status || 'active' }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600">
            <div>
              <span class="font-medium text-slate-500">Phone:</span>
              {{ tutor.phone || tutor.user?.phone || '—' }}
            </div>
            <div>
              <span class="font-medium text-slate-500">Students:</span>
              <span class="font-bold text-indigo-600">{{ getTutorStudentCount(tutor.id) }}</span>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-1">
            <router-link
              :to="`/admin/tutors/${tutor.id}`"
              class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Details
            </router-link>
            <router-link
              :to="`/admin/tutors/${tutor.id}/edit`"
              class="flex-1 rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-center text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100"
            >
              Edit
            </router-link>
            <button
              @click="onDelete(tutor.id)"
              class="flex-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 class="mt-4 text-sm font-semibold text-slate-700">No tutors found</h3>
        <p class="mt-1 text-xs text-slate-400">
          {{ hasActiveFilters ? 'Try adjusting your search or filters.' : 'No tutors have been added yet.' }}
        </p>
      </div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTutorStore } from '@/stores/tutorStore'
import { useToastStore } from '@/stores/toast'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import DebouncedInput from '@/components/ui/DebouncedInput.vue'
import ActiveFilters from '@/components/ui/ActiveFilters.vue'
import type { ActiveFilter } from '@/components/ui/ActiveFilters.vue'

const store = useTutorStore()
const dialog = useConfirmDialog()
const toast = useToastStore()

const searchQuery = ref('')
const selectedStatus = ref('')
const openKebabId = ref<number | null>(null)
const failedPhotos = ref<Set<number>>(new Set())
let deleteTargetId: number | null = null

function getTutorPhoto(tutor: any): string | null {
  if (!tutor) return null
  return tutor.photo_url || tutor.photo || tutor.user?.avatar_url || tutor.user?.avatar || tutor.user?.photo_url || null
}

function toggleKebab(id: number) {
  openKebabId.value = openKebabId.value === id ? null : id
}

function handleWindowClick() {
  openKebabId.value = null
}

const tutors = computed(() => store.tutors)

const activeTutorsCount = computed(() => {
  return store.tutors.filter(
    (t: any) => (t.status || t.user?.status || 'active') === 'active'
  ).length
})

const totalStudentsAssigned = computed(() => {
  return store.tutors.reduce((sum: number, t: any) => sum + (t.students_count ?? 0), 0)
})

const filteredTutors = computed(() => {
  return store.tutors.filter((tutor: any) => {
    if (selectedStatus.value) {
      const status = (tutor.status || tutor.user?.status || 'active').toLowerCase()
      if (status !== selectedStatus.value.toLowerCase()) return false
    }
    return true
  })
})

function getInitials(name?: string): string {
  if (!name || typeof name !== 'string') return 'NA'
  return (
    name
      .trim()
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'NA'
  )
}

function getTutorStudentCount(tutorId: number): number {
  // Use students_count from backend (via withCount) if available; otherwise fall back to 0
  const tutor = store.tutors.find((t: any) => t.id === tutorId)
  return tutor?.students_count ?? 0
}

const hasActiveFilters = computed(() => !!searchQuery.value || !!selectedStatus.value)
const activeFilterList = computed<ActiveFilter[]>(() => {
  const list: ActiveFilter[] = []
  if (searchQuery.value) list.push({ key: 'search', label: 'Search', value: searchQuery.value })
  if (selectedStatus.value) list.push({ key: 'status', label: 'Status', value: selectedStatus.value })
  return list
})

onMounted(() => {
  store.fetchTutors()
  window.addEventListener('click', handleWindowClick)
})

onUnmounted(() => {
  window.removeEventListener('click', handleWindowClick)
})

function onSearch(): void {
  store.fetchTutors({ search: searchQuery.value || undefined }, true)
}

function removeFilter(key: string): void {
  if (key === 'search') searchQuery.value = ''
  if (key === 'status') selectedStatus.value = ''
  store.fetchTutors({ search: searchQuery.value || undefined }, true)
}

function clearFilters(): void {
  searchQuery.value = ''
  selectedStatus.value = ''
  store.fetchTutors({ search: undefined }, true)
}

function onDelete(id: number): void {
  deleteTutor(id)
}

async function deleteTutor(id: number): Promise<void> {
  deleteTargetId = id
  const confirmed = await dialog.open({
    title: 'Delete Tutor',
    message: 'Are you sure you want to delete this tutor? This action cannot be undone.',
  })
  if (!confirmed) return
  await handleConfirm()
}

async function handleConfirm(): Promise<void> {
  if (deleteTargetId === null) return
  await dialog.confirmAsync(async () => {
    await store.deleteTutor(deleteTargetId!)
    toast.success('Tutor deleted successfully.')
  })
}
</script>
