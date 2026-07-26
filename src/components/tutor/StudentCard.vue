<template>
  <div
    class="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
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
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <h3 class="text-sm font-bold text-slate-900 truncate">
              {{ student.name }}
            </h3>
            <p class="text-xs text-slate-500 truncate max-w-[200px]">
              {{ student.email }}
            </p>
          </div>
          <!-- Status Badge -->
          <span
            class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap"
            :class="statusBadgeClass"
          >
            <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass" />
            {{ displayStatus }}
          </span>
        </div>

        <!-- Details Grid -->
        <div class="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <!-- Student Code -->
          <div v-if="student.student_code" class="flex items-center gap-1.5 text-slate-500">
            <svg class="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
            <span class="font-medium text-slate-600">{{ student.student_code }}</span>
          </div>

          <!-- Company -->
          <div v-if="student.company_name" class="flex items-center gap-1.5 text-slate-500">
            <svg class="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span class="font-medium text-slate-600 truncate">{{ student.company_name }}</span>
          </div>

          <!-- Phone -->
          <div v-if="student.phone" class="flex items-center gap-1.5 text-slate-500">
            <svg class="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span class="font-medium text-slate-600">{{ student.phone }}</span>
          </div>

          <!-- Last Worklog -->
          <div class="flex items-center gap-1.5 text-slate-500">
            <svg class="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="font-medium text-slate-600">
              {{ formatDate(student.last_worklog_at) || '—' }}
            </span>
          </div>
        </div>

        <!-- Stats Row -->
        <div class="mt-3 flex flex-wrap items-center gap-3">
          <!-- Worklog count -->
          <div class="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {{ student.total_worklogs ?? 0 }} worklogs
          </div>

          <!-- Open Issues -->
          <div
            v-if="(student.open_issues_count ?? 0) > 0"
            class="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700"
          >
            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            {{ student.open_issues_count }} issues
          </div>

          <!-- Next Follow-up -->
          <div
            v-if="student.next_followup"
            class="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700"
          >
            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ formatFollowup(student.next_followup) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Actions Divider -->
    <hr class="my-4 border-slate-100" />

    <!-- Action Buttons -->
    <div class="flex flex-wrap items-center gap-2">
      <button
        type="button"
        @click="$emit('viewProfile', student.id)"
        class="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 transition-all hover:bg-indigo-100 hover:shadow-sm"
      >
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Profile
      </button>
      <button
        type="button"
        @click="$emit('viewWorklogs', student.id)"
        class="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition-all hover:bg-slate-200 hover:shadow-sm"
      >
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Worklogs
      </button>
      <button
        type="button"
        @click="$emit('viewFollowups', student.id)"
        class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-all hover:bg-emerald-100 hover:shadow-sm"
      >
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Follow-ups
      </button>
      <button
        type="button"
        @click="$emit('viewIssues', student.id)"
        class="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 transition-all hover:bg-amber-100 hover:shadow-sm"
      >
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        Issues
      </button>
      <button
        type="button"
        @click="$emit('viewEvaluation', student.id)"
        class="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700 transition-all hover:bg-purple-100 hover:shadow-sm"
      >
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        Evaluation
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UserAvatar from '@/components/common/UserAvatar.vue'
import type { TutorMyStudent } from '@/types/tutorMyStudents'

const props = defineProps<{
  student: TutorMyStudent
}>()

defineEmits<{
  viewProfile: [id: number]
  viewWorklogs: [id: number]
  viewFollowups: [id: number]
  viewIssues: [id: number]
  viewEvaluation: [id: number]
}>()

/** Derive a display-friendly status from the assignment_status */
const displayStatus = computed(() => {
  if (!props.student.assignment_status) return 'Unknown'
  return props.student.assignment_status
})

/** Top accent bar color based on status */
const statusAccent = computed(() => {
  switch (props.student.assignment_status) {
    case 'Assigned':
      return 'bg-indigo-500'
    case 'In Progress':
      return 'bg-blue-500'
    case 'Completed':
      return 'bg-emerald-500'
    case 'Terminated':
      return 'bg-rose-500'
    default:
      return 'bg-slate-400'
  }
})

/** Badge background/text colors */
const statusBadgeClass = computed(() => {
  switch (props.student.assignment_status) {
    case 'Assigned':
      return 'bg-indigo-50 text-indigo-700'
    case 'In Progress':
      return 'bg-blue-50 text-blue-700'
    case 'Completed':
      return 'bg-emerald-50 text-emerald-700'
    case 'Terminated':
      return 'bg-rose-50 text-rose-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
})

/** Dot indicator color */
const statusDotClass = computed(() => {
  switch (props.student.assignment_status) {
    case 'Assigned':
      return 'bg-indigo-500'
    case 'In Progress':
      return 'bg-blue-500'
    case 'Completed':
      return 'bg-emerald-500'
    case 'Terminated':
      return 'bg-rose-500'
    default:
      return 'bg-slate-400'
  }
})

function formatDate(date?: string | null): string {
  if (!date) return ''
  try {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

function formatFollowup(followup: NonNullable<TutorMyStudent['next_followup']>): string {
  const date = followup.date_label || ''
  const time = followup.time_label || ''
  return `${date}${time ? ` · ${time}` : ''}`
}
</script>
