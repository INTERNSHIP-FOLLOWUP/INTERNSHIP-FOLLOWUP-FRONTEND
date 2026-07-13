<template>
  <span
    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
    :class="badgeClass"
    aria-label="Issue status"
  >
    {{ status }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IssueStatus } from '@/stores/issueStore'

const props = defineProps<{ status: IssueStatus | string }>()

const badgeClass = computed(() => {
  const s = String(props.status)
  switch (s) {
    case 'Open':
      return 'bg-blue-100 text-blue-800'
    case 'In Progress':
      return 'bg-yellow-100 text-yellow-900'
    case 'Resolved':
      return 'bg-green-100 text-green-800'
    case 'Closed':
      return 'bg-gray-200 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
})
</script>

