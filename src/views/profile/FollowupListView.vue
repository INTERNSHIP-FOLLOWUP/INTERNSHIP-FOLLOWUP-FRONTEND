<!-- src/views/profile/FollowupListView.vue -->
<template>
  <div class="animate-fade-in">
    <div class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900">My Follow-ups</h1>
      <p class="mt-1 text-sm text-slate-500">
        Tutor follow-up meetings, notes, and next actions for your students.
      </p>
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

    <div
      v-else-if="store.followups.length === 0"
      class="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm"
    >
      <p class="text-sm text-slate-500">No follow-up records found.</p>
    </div>

    <div v-else class="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <table class="w-full border-collapse text-left text-sm">
        <thead>
          <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-400">
            <th class="px-5 py-3.5">Student</th>
            <th class="px-5 py-3.5">Meeting Type</th>
            <th class="px-5 py-3.5">Meeting Date</th>
            <th class="px-5 py-3.5">Next Follow-up</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr
            v-for="f in store.followups"
            :key="f.id"
            class="hover:bg-slate-50/30 transition-colors"
          >
            <td class="whitespace-nowrap px-5 py-4 text-slate-700">
              {{ studentName(f.student_id) }}
            </td>
            <td class="whitespace-nowrap px-5 py-4 text-slate-600">{{ f.meeting_type }}</td>
            <td class="whitespace-nowrap px-5 py-4 text-slate-600">
              {{ formatDate(f.meeting_date) }}
            </td>
            <td class="whitespace-nowrap px-5 py-4 text-slate-600">
              {{ f.next_followup ? formatDate(f.next_followup) : '—' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useFollowupStore } from '@/stores/followupStore'
import { useStudentStore } from '@/stores/student'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const store = useFollowupStore()
const studentStore = useStudentStore()

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

onMounted(() => {
  store.fetchFollowups()
  if (studentStore.students.length === 0) {
    studentStore.fetchStudents().catch(() => {
      // error displayed through student store if needed
    })
  }
})
</script>
