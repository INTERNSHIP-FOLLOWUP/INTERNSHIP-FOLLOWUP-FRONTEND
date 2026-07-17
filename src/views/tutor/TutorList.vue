<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Tutors</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Manage tutors and review their workload.
        </p>
      </div>
      <router-link
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
        </svg>
        Add Tutor
      </router-link>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <DebouncedInput
        v-model="searchQuery"
        placeholder="Search by name or email..."
        class="flex-1 max-w-xs"
        @change="onSearch"
      />
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
import { useRouter } from 'vue-router'
import { useTutorStore } from '@/stores/tutorStore'
import { useToastStore } from '@/stores/toast'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import TutorList from '@/components/tutor/TutorList.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import DebouncedInput from '@/components/ui/DebouncedInput.vue'
import ActiveFilters from '@/components/ui/ActiveFilters.vue'
import type { ActiveFilter } from '@/components/ui/ActiveFilters.vue'

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
