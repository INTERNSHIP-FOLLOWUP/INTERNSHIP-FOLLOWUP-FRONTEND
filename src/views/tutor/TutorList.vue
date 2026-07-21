<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Tutors</h1>
        <p class="mt-1 text-sm text-slate-500">Manage tutors and their assigned students.</p>
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

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-3">
      <DebouncedInput
        v-model="searchQuery"
        placeholder="Search by name or email..."
        class="min-w-0 flex-1 basis-[200px]"
        @change="onSearch"
      />

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

    <!-- Content -->
    <div class="rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <!-- Loading Skeleton -->
      <div v-if="store.loading" class="divide-y divide-slate-50">
        <div v-for="n in 5" :key="n" class="flex items-center gap-4 px-6 py-4 animate-pulse">
          <div class="h-8 w-8 rounded-full bg-slate-200" />
          <div class="flex-1 space-y-2">
            <div class="h-3 w-1/3 rounded bg-slate-200" />
            <div class="h-3 w-1/4 rounded bg-slate-100" />
          </div>
          <div class="h-3 w-16 rounded bg-slate-200" />
          <div class="flex gap-2">
            <div class="h-8 w-12 rounded-lg bg-slate-200" />
            <div class="h-8 w-14 rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>

      <!-- Desktop Table -->
      <div v-else-if="store.tutors.length > 0" class="hidden md:block">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr
                class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400"
              >
                <th class="px-6 py-3.5 font-medium">Name</th>
                <th class="px-6 py-3.5 font-medium">Email</th>
                <th class="px-6 py-3.5 font-medium">Assigned Students</th>
                <th class="px-6 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr
                v-for="tutor in store.tutors"
                :key="tutor.id"
                class="transition-colors hover:bg-slate-50/50"
              >
                <td class="whitespace-nowrap px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-600"
                    >
                      {{ getInitials(tutor.name) }}
                    </div>
                    <span class="font-semibold text-slate-900">{{ tutor.name }}</span>
                  </div>
                </td>
                <td class="whitespace-nowrap px-6 py-4 font-medium text-slate-500">
                  {{ tutor.email }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                  {{ getTutorStudentCount(tutor.id) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <router-link
                      :to="`/admin/tutors/${tutor.id}/edit`"
                      class="rounded-lg px-3 py-1.5 text-xs font-bold text-primary-600 transition-all hover:bg-primary-50 hover:text-primary-800"
                    >
                      Edit
                    </router-link>
                    <button
                      @click="onDelete(tutor.id)"
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
      <div v-else-if="store.tutors.length > 0" class="divide-y divide-slate-100 md:hidden">
        <div
          v-for="tutor in store.tutors"
          :key="tutor.id"
          class="p-4 transition-colors hover:bg-slate-50/50"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary-600"
              >
                {{ getInitials(tutor.name) }}
              </div>
              <div>
                <p class="font-semibold text-slate-900">{{ tutor.name }}</p>
                <p class="mt-0.5 text-xs text-slate-500">{{ tutor.email }}</p>
              </div>
            </div>
          </div>
          <div class="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
            <div>
              <span class="font-medium text-slate-700">Students:</span>
              {{ getTutorStudentCount(tutor.id) }}
            </div>
          </div>
          <div class="mt-3 flex items-center gap-2">
            <router-link
              :to="`/admin/tutors/${tutor.id}/edit`"
              class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Edit
            </router-link>
            <button
              @click="onDelete(tutor.id)"
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 class="mt-4 text-sm font-semibold text-slate-700">No tutors found</h3>
        <p class="mt-1 text-xs text-slate-400">
          {{ hasActiveFilters ? 'Try adjusting your search.' : 'No tutors have been added yet.' }}
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
import { ref, computed, onMounted } from 'vue'
import { useTutorStore } from '@/stores/tutorStore'
import { useStudentStore } from '@/stores/student'
import { useToastStore } from '@/stores/toast'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import DebouncedInput from '@/components/ui/DebouncedInput.vue'
import ActiveFilters from '@/components/ui/ActiveFilters.vue'
import type { ActiveFilter } from '@/components/ui/ActiveFilters.vue'

const store = useTutorStore()
const studentStore = useStudentStore()
const dialog = useConfirmDialog()
const toast = useToastStore()

const searchQuery = ref('')
let deleteTargetId: number | null = null

const tutors = computed(() => store.tutors)

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

const studentCounts = computed(() => {
  const counts: Record<number, number> = {}
  for (const student of studentStore.students) {
    const tutorId =
      typeof student.tutor_id === 'number'
        ? student.tutor_id
        : typeof student.tutor === 'object' && student.tutor !== null
          ? (student.tutor as { id?: number }).id
          : undefined
    if (typeof tutorId === 'number' && Number.isFinite(tutorId)) {
      counts[tutorId] = (counts[tutorId] || 0) + 1
    }
  }
  return counts
})

function getTutorStudentCount(tutorId: number): number {
  return studentCounts.value[tutorId] || 0
}

const hasActiveFilters = computed(() => !!searchQuery.value)
const activeFilterList = computed<ActiveFilter[]>(() => {
  const list: ActiveFilter[] = []
  if (searchQuery.value) list.push({ key: 'search', label: 'Search', value: searchQuery.value })
  return list
})

onMounted(() => {
  store.fetchTutors()
  studentStore.fetchStudents({ per_page: 100 })
  // Refresh counts after students load
  studentStore.fetchStudents({ per_page: 100 }).then(() => {})
})

function onSearch(): void {
  store.fetchTutors({ search: searchQuery.value || undefined }, true)
}

function removeFilter(key: string): void {
  if (key === 'search') searchQuery.value = ''
  store.fetchTutors({ search: searchQuery.value || undefined }, true)
}

function clearFilters(): void {
  searchQuery.value = ''
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
