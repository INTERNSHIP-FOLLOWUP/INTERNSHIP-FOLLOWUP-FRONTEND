<template>
  <article
    class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
  >
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-semibold text-gray-900">
            {{ worklog.student?.name ?? '—' }}
          </h3>
          <span
            class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
            :class="statusClass"
          >
            {{ worklog.status }}
          </span>
        </div>

        <p class="mt-2 text-xs text-gray-600">
          {{ displayDate }}
        </p>
      </div>

      <div class="shrink-0 text-right">
        <p class="text-lg font-bold text-primary-600">{{ worklog.hours_worked ?? worklog.hoursWorked ?? 0 }}h</p>
        <p class="text-xs text-gray-500">logged</p>
      </div>
    </div>

    <p v-if="worklog.summary" class="mt-3 line-clamp-3 text-sm text-gray-700">
      {{ worklog.summary }}
    </p>

    <div class="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
      <div class="flex items-center gap-2 text-xs text-gray-500">
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{{ createdDate }}</span>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100"
          @click="$emit('view', worklog.id)"
        >
          View
        </button>
        <button
          class="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-primary-600 transition-colors hover:bg-primary-50"
          @click="$emit('edit', worklog.id)"
        >
          Edit
        </button>
        <button
          class="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-error transition-colors hover:bg-error/10"
          @click="$emit('delete', worklog.id)"
        >
          Delete
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface WorklogSummary {
  id: number
  student?: { id: number; name: string } | null
  student_id?: number | null
  summary?: string
  hours_worked?: number
  hoursWorked?: number
  date?: string | null
  status?: string
  created_at?: string | null
  createdAt?: string | null
}

const props = defineProps<{
  worklog: WorklogSummary
}>()

defineEmits<{
  view: [id: number]
  edit: [id: number]
  delete: [id: number]
}>()

const statusClass = computed(() => {
  switch (props.worklog.status) {
    case 'approved':
      return 'bg-success/10 text-success'
    case 'rejected':
      return 'bg-error/10 text-error'
    case 'submitted':
      return 'bg-primary/10 text-primary-700'
    case 'draft':
    default:
      return 'bg-slate-100 text-slate-600'
  }
})

const displayDate = computed(() => {
  const d = props.worklog.date ?? props.worklog.created_at ?? props.worklog.createdAt
  if (!d) return '—'
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
})

const createdDate = computed(() => {
  const d = props.worklog.created_at ?? props.worklog.createdAt
  if (!d) return '—'
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return '—'
  return `Created ${date.toLocaleDateString()}`
})
</script>
