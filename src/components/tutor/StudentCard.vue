<template>
  <div
    class="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-700"
  >
    <!-- Top accent bar -->
    <div
      class="absolute inset-x-0 top-0 h-1"
      :class="statusAccent"
    />

    <div class="flex items-start gap-4">
      <!-- Avatar -->
      <UserAvatar :avatar="student.avatar || student.photo" :name="student.name" size="md" />

      <!-- Main Info -->
      <div class="min-w-0 flex-1">
        <h3 class="truncate text-base font-bold text-slate-900 dark:text-slate-100">
          {{ student.name || `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Unnamed Student' }}
        </h3>
        <p class="truncate text-sm text-slate-500 dark:text-slate-400">{{ student.email }}</p>

        <!-- Chips Row -->
        <div class="mt-3 flex flex-wrap items-center gap-1.5">
          <!-- Batch Chip -->
          <span
            v-if="(student as any).batch_name"
            class="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400"
          >
            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m9 0h-3m-4 0h-3" />
            </svg>
            {{ (student as any).batch_name }}
          </span>

          <!-- Status Badge -->
          <span
            class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold"
            :class="statusBadgeClass"
          >
            <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass" />
            {{ displayStatus(student.status) }}
          </span>
        </div>
      </div>

      <!-- Chevron -->
      <svg class="mt-1 h-5 w-5 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UserAvatar from '@/components/common/UserAvatar.vue'
import type { TutorStudent } from '@/types/tutorStudent'

const props = defineProps<{
  student: TutorStudent
}>()

const emit = defineEmits<{
  click: [student: TutorStudent]
}>()

function displayStatus(status?: string): string {
  if (!status) return 'Unknown'
  if (status.toLowerCase() === 'inactive' || status.toLowerCase() === 'deactivated') return 'Deactivated'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const statusAccent = computed(() => {
  switch (props.student.status) {
    case 'active': return 'bg-emerald-500'
    case 'inactive':
    case 'deactivated': return 'bg-slate-400'
    case 'graduated': return 'bg-blue-500'
    case 'suspended': return 'bg-rose-500'
    default: return 'bg-emerald-500'
  }
})

const statusBadgeClass = computed(() => {
  switch (props.student.status) {
    case 'active': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
    case 'inactive':
    case 'deactivated': return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
    case 'graduated': return 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
    case 'suspended': return 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'
    default: return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
  }
})

const statusDotClass = computed(() => {
  switch (props.student.status) {
    case 'active': return 'bg-emerald-500'
    case 'inactive':
    case 'deactivated': return 'bg-slate-400'
    case 'graduated': return 'bg-blue-500'
    case 'suspended': return 'bg-rose-500'
    default: return 'bg-emerald-500'
  }
})
</script>
