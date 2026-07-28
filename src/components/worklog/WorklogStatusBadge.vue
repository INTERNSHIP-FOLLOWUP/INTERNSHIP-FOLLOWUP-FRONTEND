<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
    :class="badgeClass"
  >
    <span class="h-1.5 w-1.5 rounded-full" :class="dotClass" />
    {{ status }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WorklogStatus } from '@/types/worklog'

const props = withDefaults(
  defineProps<{
    status?: WorklogStatus | undefined
  }>(),
  {
    status: 'Pending',
  },
)

const badgeClass = computed(() => {
  switch (props.status) {
    case 'Pending':
      return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400'
    case 'Reviewed':
      return 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
    case 'Approved':
      return 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
    case 'Rejected':
      return 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
    default:
      return 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
  }
})

const dotClass = computed(() => {
  switch (props.status) {
    case 'Pending':
      return 'bg-yellow-500'
    case 'Reviewed':
      return 'bg-blue-500'
    case 'Approved':
      return 'bg-green-500'
    case 'Rejected':
      return 'bg-red-500'
    default:
      return 'bg-slate-400'
  }
})
</script>
