<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Tutors</h1>
        <p class="mt-1 text-sm text-slate-500">
          Manage tutors and their assigned students.
        </p>
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
    <div class="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr
              class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              <th class="px-6 py-3.5 font-medium">First Name</th>
              <th class="px-6 py-3.5 font-medium">Last Name</th>
              <th class="px-6 py-3.5 font-medium">Email</th>
              <th class="px-6 py-3.5 font-medium">Assigned Students</th>
              <th class="px-6 py-3.5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <!-- Loading -->
            <tr v-if="store.loading && tutors.length === 0">
              <td colspan="5" class="px-6 py-16">
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <p class="mt-3 text-sm font-medium text-slate-500">Loading tutors...</p>
                </div>
              </td>
            </tr>

            <!-- Empty -->
            <tr v-else-if="tutors.length === 0">
              <td colspan="5" class="px-6 py-16">
                <div class="flex flex-col items-center justify-center text-center">
                  <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
                    <svg
                      class="h-7 w-7 text-slate-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                  <h3 class="mt-4 text-sm font-semibold text-slate-700">No tutors found</h3>
                  <p class="mt-1 text-xs text-slate-400">
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
              class="transition-colors hover:bg-slate-50/50"
            >
              <td class="whitespace-nowrap px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-600"
                  >
                    {{ getInitials(tutor.name) }}
                  </div>
                  <span class="font-semibold text-slate-900">{{ tutor.first_name }}</span>
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">
                {{ tutor.last_name }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-500">
                {{ tutor.email }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                {{ tutor.students_count ?? 0 }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button
                    @click="$emit('view', tutor.id)"
                    class="rounded-lg px-3 py-1.5 text-xs font-bold text-primary-600 transition-all hover:bg-primary-50 hover:text-primary-800"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDelete(tutor)"
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
              <h3 class="text-base font-semibold text-slate-900">Delete Tutor</h3>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTutorStore } from '@/stores/tutorStore'
import type { Student } from '@/types/student'

const emit = defineEmits<{
  view: [id: number]
  add: []
  delete: [id: number]
}>()

const store = useTutorStore()

const tutors = computed(() => store.tutors)
const searchQuery = ref('')

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
