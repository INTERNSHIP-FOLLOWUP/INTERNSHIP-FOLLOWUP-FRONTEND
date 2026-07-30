<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
    :class="{
      'bg-green-100 text-green-800': priority === 'low',
      'bg-yellow-100 text-yellow-800': priority === 'medium',
      'bg-orange-100 text-orange-800': priority === 'high',
      'bg-red-100 text-red-800': priority === 'critical',
    }"
  >
    {{ priority }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  priority: string;
}>();
</script>