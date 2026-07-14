<!-- src/views/tutor/TutorList.vue -->
<template>
  <div class="p-6">
    <h1 class="text-xl font-semibold mb-4">Tutors</h1>

    <div v-if="tutorStore.workloadLoading" class="text-gray-500 flex items-center gap-2">
      <LoadingSpinner size="sm" color="primary" /> Loading tutors...
    </div>

    <div v-if="tutorStore.workloadError" class="text-red-600 text-sm mb-4">
      {{ tutorStore.workloadError }}
    </div>

    <table v-if="!tutorStore.workloadLoading" class="w-full border-collapse">
      <thead>
        <tr class="border-b text-left">
          <th class="py-2">Name</th>
          <th class="py-2">Email</th>
          <th class="py-2">Assigned Students</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tutor in tutorStore.workload" :key="tutor.id" class="border-b">
          <td class="py-2">{{ tutor.name }}</td>
          <td class="py-2">{{ tutor.email }}</td>
          <td class="py-2">{{ tutor.students_count }}</td>
        </tr>
        <tr v-if="tutorStore.workload.length === 0">
          <td colspan="3" class="text-center text-gray-400 py-4">No tutors found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTutorStore } from '@/stores/tutorStore'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const tutorStore = useTutorStore()

// "Updates when navigated to" — always fetch fresh, every time this view mounts
onMounted(() => {
  tutorStore.fetchWorkload()
})
</script>
