<template>
  <div class="space-y-6">
<<<<<<< HEAD
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Tutors</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
=======
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Tutors</h1>
        <p class="mt-1 text-sm text-slate-500">
>>>>>>> sprint-2
          Manage tutors and review their workload.
        </p>
      </div>
      <router-link
<<<<<<< HEAD
        to="/tutors/create"
        class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-600 active:scale-95"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
=======
        to="/admin/tutors/create"
        class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-500/20 transition-all duration-200 hover:from-primary-700 hover:to-primary-600 hover:shadow-md active:scale-95"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
>>>>>>> sprint-2
        </svg>
        Add Tutor
      </router-link>
    </div>

<<<<<<< HEAD
=======
    <!-- Filters -->
>>>>>>> sprint-2
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <DebouncedInput
        v-model="searchQuery"
        placeholder="Search by name or email..."
        class="flex-1 max-w-xs"
        @change="onSearch"
      />
<<<<<<< HEAD
    </div>
    <ActiveFilters :filters="activeFilterList" @remove="removeFilter" @clear-all="clearFilters" />

    <div
      class="rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div v-if="store.loading" class="flex items-center justify-center py-16">
        <svg class="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
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
      </div>
      <div
        v-else-if="store.error"
        class="flex flex-col items-center justify-center py-16 text-center"
      >
        <svg class="h-10 w-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <p class="mt-3 text-sm font-semibold text-red-500">{{ store.error }}</p>
      </div>
      <TutorList
        v-else
        :tutors="tutors"
        @view="handleView"
        @add="handleAdd"
        @delete="onDelete"
      />
    </div>

=======
    </div>

    <ActiveFilters :filters="activeFilterList" @remove="removeFilter" @clear-all="clearFilters" />

    <!-- Error -->
    <div
      v-if="store.error"
      role="alert"
      class="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
    >
      <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <span>{{ store.error }}</span>
      <button @click="store.clearError()" class="ml-auto rounded-md p-1 transition-colors hover:bg-rose-100">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Content -->
    <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <!-- Loading Skeleton -->
      <div v-if="store.loading && store.tutors.length === 0" class="divide-y divide-slate-50">
        <div v-for="n in 5" :key="n" class="flex items-center gap-4 px-2 py-4 animate-pulse">
          <div class="h-8 w-8 rounded-full bg-slate-200" />
          <div class="flex-1 space-y-2">
            <div class="h-3 w-1/3 rounded bg-slate-200" />
            <div class="h-3 w-1/4 rounded bg-slate-100" />
          </div>
          <div class="h-3 w-16 rounded bg-slate-200" />
          <div class="flex gap-2">
            <div class="h-7 w-14 rounded-lg bg-slate-200" />
            <div class="h-7 w-14 rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>

      <!-- Desktop Table -->
      <div v-else-if="store.tutors.length > 0" class="hidden md:block">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th class="px-4 py-3.5 font-medium">Name</th>
                <th class="px-4 py-3.5 font-medium">Email</th>
                <th class="px-4 py-3.5 font-medium">Assigned Students</th>
                <th class="px-4 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="tutor in store.tutors" :key="tutor.id" class="transition-colors hover:bg-slate-50/50">
                <td class="whitespace-nowrap px-4 py-4">
                  <div class="flex items-center gap-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-600">
                      {{ getInitials(tutor.name) }}
                    </div>
                    <span class="font-semibold text-slate-900">{{ tutor.name }}</span>
                  </div>
                </td>
                <td class="whitespace-nowrap px-4 py-4 font-medium text-slate-500">
                  {{ tutor.email }}
                </td>
                <td class="whitespace-nowrap px-4 py-4 text-sm text-slate-500">
                  {{ tutor.students_count ?? 0 }}
                </td>
                <td class="whitespace-nowrap px-4 py-4 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <router-link :to="`/admin/tutors/${tutor.id}`" class="rounded-lg px-3 py-1.5 text-xs font-bold text-primary-600 transition-all hover:bg-primary-50 hover:text-primary-800">
                      Edit
                    </router-link>
                    <button @click="confirmDelete(tutor)" class="rounded-lg px-3 py-1.5 text-xs font-bold text-rose-600 transition-all hover:bg-rose-50 hover:text-rose-800">
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
        <div v-for="tutor in store.tutors" :key="tutor.id" class="p-4 transition-colors hover:bg-slate-50/50">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary-600">
                {{ getInitials(tutor.name) }}
              </div>
              <div>
                <p class="font-semibold text-slate-900">{{ tutor.name }}</p>
                <p class="mt-0.5 text-xs text-slate-500">{{ tutor.email }}</p>
              </div>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-2">
            <router-link :to="`/admin/tutors/${tutor.id}`" class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50">
              Edit
            </router-link>
            <button @click="confirmDelete(tutor)" class="flex-1 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50">
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
          <svg class="h-7 w-7 text-slate-300" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
        <h3 class="mt-4 text-sm font-semibold text-slate-700">No tutors found</h3>
        <p class="mt-1 text-xs text-slate-400">
          {{ hasActiveFilters ? 'Try adjusting your search.' : 'No tutors have been added yet.' }}
        </p>
      </div>
    </div>

    <!-- Delete Confirmation -->
>>>>>>> sprint-2
    <ConfirmDialog
      :show="dialog.show.value"
      :title="dialog.title.value"
      :message="dialog.message.value"
      :confirm-text="dialog.confirmText.value"
      :cancel-text="dialog.cancelText.value"
      :loading="dialog.loading.value"
      :error="dialog.error.value"
<<<<<<< HEAD
      @confirm="handleConfirm"
=======
      @confirm="handleConfirmDelete"
>>>>>>> sprint-2
      @cancel="dialog.cancel()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
<<<<<<< HEAD
import { useRouter } from 'vue-router'
import { useTutorStore } from '@/stores/tutorStore'
import { useToastStore } from '@/stores/toast'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import TutorList from '@/components/tutor/TutorList.vue'
=======
import { useTutorStore } from '@/stores/tutorStore'
import { useToastStore } from '@/stores/toast'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
>>>>>>> sprint-2
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import DebouncedInput from '@/components/ui/DebouncedInput.vue'
import ActiveFilters from '@/components/ui/ActiveFilters.vue'
import type { ActiveFilter } from '@/components/ui/ActiveFilters.vue'

<<<<<<< HEAD
const router = useRouter()
const store = useTutorStore()
const dialog = useConfirmDialog()
const toast = useToastStore()
const searchQuery = ref('')
let deleteTargetId: number | null = null

const tutors = computed(() => store.tutors)

const activeFilterList = computed<ActiveFilter[]>(() => {
  const list: ActiveFilter[] = []
  if (searchQuery.value) list.push({ key: 'search', label: 'Search', value: searchQuery.value })
  return list
=======
const store = useTutorStore()
const toast = useToastStore()
const dialog = useConfirmDialog()

const searchQuery = ref('')
const searchTimeout = ref<number | null>(null)

const hasActiveFilters = computed(() => !!searchQuery.value)

const activeFilterList = computed<ActiveFilter[]>(() => {
  const list: ActiveFilter[] = []
  if (searchQuery.value) list.push({ key: 'search', label: 'Search', value: searchQuery.value })
  return list
})

let deleteTargetId: number | null = null

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function onSearch(): void {
  const q = searchQuery.value.trim()

  if (searchTimeout.value) clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(async () => {
    if (q) {
      store.tutors = store.tutors.filter(
        (t) =>
          t.name.toLowerCase().includes(q.toLowerCase()) ||
          t.email.toLowerCase().includes(q.toLowerCase()),
      )
    } else {
      await store.fetchTutors(true)
    }
  }, 300)
}

function removeFilter(key: string): void {
  if (key === 'search') {
    searchQuery.value = ''
    store.fetchTutors(true)
  }
}

function clearFilters(): void {
  searchQuery.value = ''
  store.fetchTutors(true)
}

function confirmDelete(tutor: { id: number; name: string }): void {
  deleteTargetId = tutor.id
  dialog.open({
    title: 'Delete Tutor',
    message: `Are you sure you want to delete <span class="font-semibold text-slate-700">${tutor.name}</span>? This action cannot be undone.`,
  })
}

async function handleConfirmDelete(): Promise<void> {
  if (deleteTargetId === null) return
  await dialog.confirmAsync(async () => {
    await store.deleteTutor(deleteTargetId!)
    toast.success('Tutor deleted successfully.')
    deleteTargetId = null
  })
}

onMounted(() => {
  store.fetchTutors()
>>>>>>> sprint-2
})

onMounted(() => {
  store.fetchTutors()
})

function onSearch() {
  store.fetchTutors({ search: searchQuery.value || undefined })
}

function removeFilter(key: string) {
  if (key === 'search') searchQuery.value = ''
  store.fetchTutors({ search: searchQuery.value || undefined })
}

function clearFilters() {
  searchQuery.value = ''
  store.fetchTutors({ search: undefined })
}

function handleView(id: number): void {
  router.push({ name: 'AdminTutorsEdit', params: { id } })
}

function handleAdd(): void {
  router.push({ name: 'AdminTutorsCreate' })
}

function onDelete(id: number): void {
  deleteTutor(id)
}

async function deleteTutor(id: number) {
  deleteTargetId = id
  const confirmed = await dialog.open({
    title: 'Delete Tutor',
    message: 'Are you sure you want to delete this tutor? This action cannot be undone.',
  })
  if (!confirmed) return
  await handleConfirm()
}

async function handleConfirm() {
  if (deleteTargetId === null) return
  await dialog.confirmAsync(async () => {
    await store.deleteTutor(deleteTargetId!)
    toast.success('Tutor deleted successfully.')
  })
}
</script>
