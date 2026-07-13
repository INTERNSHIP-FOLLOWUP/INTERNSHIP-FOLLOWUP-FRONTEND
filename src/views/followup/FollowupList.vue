<template>
  <div class="p-6">
    <h1 class="text-xl font-semibold mb-4">Follow-ups</h1>

    <ErrorAlert :message="followupStore.error" />

    <div v-if="followupStore.loading" class="flex items-center gap-2 text-gray-500 py-2">
      <Spinner /> Loading follow-ups...
    </div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <FollowupCard
        v-for="f in followupStore.followups"
        :key="f.id"
        :followup="f"
        :student-name="studentName(f.student_id)"
        @view="openEditForm"
      />
      <p
        v-if="followupStore.followups.length === 0"
        class="text-sm text-gray-400 py-2 md:col-span-2 lg:col-span-3"
      >
        No follow-ups found.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useFollowupStore } from '@/stores/followupStore'
import type { Followup } from '@/types/followup'
import Spinner from '@/components/ui/LoadingSpinner.vue'
import ErrorAlert from '@/components/common/ErrorAlert.vue'
import FollowupCard from '@/components/followup/FollowupCard.vue'

const followupStore = useFollowupStore()

const studentMap = new Map<number, string>()

function studentName(studentId: number): string {
  return studentMap.get(studentId) || `Student #${studentId}`
}

function openEditForm(followup: Followup) {
  console.log('Open follow-up detail/edit form', followup)
}

onMounted(() => {
  followupStore.fetchFollowups()
})
</script>
