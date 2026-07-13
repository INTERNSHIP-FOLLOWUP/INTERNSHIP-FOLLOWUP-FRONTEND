<template>
  <span
    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
    :class="badgeClass"
    aria-label="Issue priority"
  >
    {{ priority }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IssuePriority } from '@/stores/issueStore'

const props = defineProps<{ priority: IssuePriority | string }>()

const badgeClass = computed(() => {
  const p = String(props.priority)
  switch (p) {
    case 'Low':
      return 'bg-green-100 text-green-800'
    case 'Medium':
      return 'bg-yellow-100 text-yellow-900'
    case 'High':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-700'
  }
})
</script>

