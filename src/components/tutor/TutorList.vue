<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Tutors</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage tutors and their assigned students.</p>
      </div>
      <button
        @click="$emit('add')"
        class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-500/20 transition-all duration-200 hover:from-primary-700 hover:to-primary-600 hover:shadow-md hover:shadow-primary-500/25 active:scale-95"
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
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr
              class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-500"
            >
              <th class="px-6 py-3.5 font-medium">First Name</th>
              <th class="px-6 py-3.5 font-medium">Last Name</th>
              <th class="px-6 py-3.5 font-medium">Email</th>
              <th class="px-6 py-3.5 font-medium">Students</th>
              <th class="px-6 py-3.5 font-medium">Status</th>
              <th class="px-6 py-3.5 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-700">
            <!-- Loading -->
              <tr v-if="store.loading && tutors.length === 0">
                <td colspan="6" class="px-6 py-16">
                <div class="flex flex-col items-center justify-center text-center">
                  <svg
                    class="h-8 w-8 animate-spin text-primary-500"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <p class="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Loading tutors...</p>
                </div>
              </td>
            </tr>

            <!-- Error -->
            <tr v-else-if="store.error">
              <td colspan="6" class="px-6 py-12">
                <div class="flex flex-col items-center justify-center text-center">
                  <div
                    class="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-500 dark:bg-rose-950/30 dark:text-rose-400"
                  >
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <p class="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Failed to load tutors</p>
                  <p class="mt-1 text-xs text-slate-400 dark:text-slate-500">{{ store.error }}</p>
                  <button
                    @click="store.fetchTutors()"
                    class="mt-4 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                  >
                    Try Again
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty -->
            <tr v-else-if="tutors.length === 0">
              <td colspan="6" class="px-6 py-12">
                <div class="flex flex-col items-center justify-center text-center">
                  <div
                    class="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500"
                  >
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <p class="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">No tutors found</p>
                  <p class="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    {{
                      searchQuery
                        ? 'Try adjusting your search or filters.'
                        : 'No tutors have been added yet.'
                    }}
                  </p>
                </div>
              </td>
            </tr>

            <!-- Rows -->
            <tr
              v-for="tutor in tutors"
              :key="tutor.id"
              @click="goToTutor(tutor)"
              class="cursor-pointer transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-700/50"
            >
              <td class="whitespace-nowrap px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-300"
                  >
                    {{ getInitials(tutor.name) }}
                  </div>
                  <span class="font-semibold text-slate-900 dark:text-slate-100">{{ tutor.first_name }}</span>
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">
                {{ tutor.last_name }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                {{ tutor.email }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                {{ tutor.students_count ?? 0 }}
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
                  :class="tutor.deleted_at ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'">
                  <span class="h-1.5 w-1.5 rounded-full" :class="tutor.deleted_at ? 'bg-rose-500' : 'bg-emerald-500'" />
                  {{ tutor.deleted_at ? 'Deactivated' : 'Active' }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-center" @click.stop>
                <div class="flex items-center justify-center gap-1">
                  <router-link :to="`/admin/tutors/${tutor.id || tutor.user_id}`" title="View Profile"
                    @click.stop
                    class="flex h-8 w-8 items-center justify-center rounded-lg text-indigo-600 transition-all hover:bg-indigo-50 hover:text-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-300">
                    <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </router-link>
                  <button
                    @click.stop="$emit('view', tutor.id)" title="Edit Tutor"
                    class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                  >
                    <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click.stop="confirmDelete(tutor)" title="Delete Tutor"
                    class="flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 transition-all hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-300"
                  >
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
          class="w-[92%] max-w-md rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
          @click.stop
        >
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/30">
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
              <h3 class="text-base font-semibold text-slate-900 dark:text-slate-100">Delete Tutor</h3>
              <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                Are you sure you want to delete
                <span class="font-semibold text-slate-700 dark:text-slate-200">{{ deletingTarget.name }}</span
                >? This action cannot be undone.
              </p>
            </div>
          </div>
          <div class="mt-5 flex items-center justify-end gap-3">
            <button
              @click="deletingTarget = null"
              :disabled="deleting"
              class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTutorStore } from '@/stores/tutorStore'
import type { Student } from '@/types/student'

const router = useRouter()

const emit = defineEmits<{
  view: [id: number]
  add: []
  delete: [id: number]
}>()

const store = useTutorStore()

const tutors = computed(() => store.tutors)
const searchQuery = ref('')

function goToTutor(tutor: any) {
  const id = tutor.id || tutor.user_id
  if (id) {
    router.push(`/admin/tutors/${id}`)
  }
}

const deletingTarget = ref<Student | null>(null)
const deleting = ref(false)

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function confirmDelete(tutor: Student): void {
  deletingTarget.value = tutor
}

async function handleDelete(): Promise<void> {
  if (!deletingTarget.value) return
  deleting.value = true
  try {
    await store.deleteTutor(deletingTarget.value.id)
    emit('delete', deletingTarget.value.id)
    deletingTarget.value = null
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
