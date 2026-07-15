<!-- src/views/followup/FollowupList.vue -->
<template>
  <div class="animate-fade-in">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Follow-up Records</h1>
        <p class="mt-1 text-sm text-slate-500">
          Tutor follow-up meetings, notes, and next actions.
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-500/20 transition-all hover:from-primary-700 hover:to-primary-600 active:scale-95"
        @click="openCreate"
      >
        + New Follow-up
      </button>
    </div>

    <div v-if="store.loading" class="flex items-center justify-center py-16">
      <LoadingSpinner size="lg" color="primary" />
    </div>

    <div
      v-else-if="store.error"
      class="flex flex-col items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm font-medium text-rose-700"
      role="alert"
    >
      {{ store.error }}
    </div>

    <div v-else-if="store.followups.length === 0" class="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <p class="text-sm text-slate-500">No follow-up records yet.</p>
    </div>

    <div v-else class="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <table class="w-full border-collapse text-left text-sm">
        <thead>
          <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-400">
            <th class="px-5 py-3.5">Student</th>
            <th class="px-5 py-3.5">Meeting Type</th>
            <th class="px-5 py-3.5">Meeting Date</th>
            <th class="px-5 py-3.5">Next Follow-up</th>
            <th class="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="f in store.followups" :key="f.id" class="hover:bg-slate-50/30 transition-colors">
            <td class="whitespace-nowrap px-5 py-4 text-slate-700">{{ studentName(f.student_id) }}</td>
            <td class="whitespace-nowrap px-5 py-4 text-slate-600">{{ f.meeting_type }}</td>
            <td class="whitespace-nowrap px-5 py-4 text-slate-600">{{ formatDate(f.meeting_date) }}</td>
            <td class="whitespace-nowrap px-5 py-4 text-slate-600">
              {{ f.next_followup ? formatDate(f.next_followup) : '—' }}
            </td>
            <td class="whitespace-nowrap px-5 py-4 text-right">
              <button
                class="rounded-lg px-2.5 py-1.5 text-xs font-bold text-primary-700 hover:bg-primary-50 transition-all"
                @click="openEdit(f)"
              >
                Edit
              </button>
              <button
                class="ml-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-all"
                @click="confirmDelete"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <FollowupForm
      v-if="showForm"
      :followup="editingFollowup"
      @saved="onSaved"
      @cancelled="showForm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFollowupStore } from '@/stores/followupStore'
import { useStudentStore } from '@/stores/student'
import type { Followup } from '@/types/followup'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import FollowupForm from '@/components/followup/FollowupForm.vue'

const store = useFollowupStore()
const studentStore = useStudentStore()

const showForm = ref(false)
const editingFollowup = ref<Followup | null>(null)

function studentName(id: number): string {
  const student = studentStore.students.find((s) => s.id === id)
  return student?.name ?? `#${id}`
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function openCreate(): void {
  editingFollowup.value = null
  showForm.value = true
}

function openEdit(followup: Followup): void {
  editingFollowup.value = followup
  showForm.value = true
}

function onSaved(): void {
  showForm.value = false
  store.fetchFollowups()
}

function confirmDelete(): void {
  // Delete action can be wired after confirmation dialog integration
}

onMounted(() => {
  store.fetchFollowups()
  if (studentStore.students.length === 0) {
    studentStore.fetchStudents().catch(() => {
      // error displayed through student store if needed
    })
  }
})
</script>
