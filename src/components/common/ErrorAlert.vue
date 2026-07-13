<template>
  <div
    v-if="message"
    class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
  >
    {{ message }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string | null
}>()
</script>
