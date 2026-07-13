<!-- src/views/followup/FollowupList.vue -->
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Follow-up Records</h1>
      <button
        @click="openCreateForm"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + New Follow-up
      </button>
    </div>

    <ErrorAlert :message="followupStore.error" />

    <div v-if="followupStore.loading" class="flex items-center gap-2 text-gray-500 py-4">
      <Spinner /> Loading follow-ups...
    </div>

    <table v-else class="w-full border-collapse">
      <thead>
        <tr class="border-b text-left">
          <th class="py-2">Student</th>
          <th class="py-2">Meeting Type</th>
          <th class="py-2">Meeting Date</th>
          <th class="py-2">Next Follow-up</th>
          <th class="py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="f in followupStore.followups" :key="f.id" class="border-b align-top">
          <td class="py-2">{{ studentName(f.student_id) }}</td>
          <td class="py-2">{{ f.meeting_type }}</td>
          <td class="py-2">{{ formatDate(f.meeting_date) }}</td>
          <td class="py-2">{{ f.next_followup ? formatDate(f.next_followup) : '-' }}</td>
          <td class="py-2">
            <button @click="openEditForm(f)" class="text-blue-600 hover:underline">
              Edit
            </button>
          </td>
        </tr>
        <tr v-if="followupStore.followups.length === 0">
          <td colspan="5" class="text-center text-gray-400 py-4">No follow-up records found.</td>
        </tr>
      </tbody>
    </table>

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
import Spinner from '@/components/ui/LoadingSpinner.vue'
import ErrorAlert from '@/components/common/ErrorAlert.vue'
import FollowupForm from './FollowupForm.vue'

const followupStore = useFollowupStore()
const studentStore = useStudentStore() // assumes this exists from your teammate's Sprint 2 work

const showForm = ref(false)
const editingFollowup = ref<Followup | null>(null)

function studentName(id: number): string {
  const student = studentStore.students.find((s) => s.id === id)
  return student?.name ?? `#${id}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString()
}

function openCreateForm() {
  editingFollowup.value = null
  showForm.value = true
}

function openEditForm(followup: Followup) {
  editingFollowup.value = followup
  showForm.value = true
}

function onSaved() {
  showForm.value = false
  followupStore.fetchFollowups().catch(() => {})
}

onMounted(() => {
  followupStore.fetchFollowups()
  if (studentStore.students.length === 0) studentStore.fetchStudents?.()
})
</script>