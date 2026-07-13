<!-- src/components/followup/MeetingTypeBadge.vue -->
<template>
  <span
    class="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
    :class="badgeClass"
  >
    {{ type }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MeetingType } from '@/types/followup'

const props = defineProps<{ type: MeetingType }>()

const badgeClass = computed(() => {
  switch (props.type) {
    case 'Monthly':
      return 'bg-blue-100 text-blue-700'
    case 'Quarterly':
      return 'bg-purple-100 text-purple-700'
    case 'Annual':
      return 'bg-amber-100 text-amber-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
})
</script>