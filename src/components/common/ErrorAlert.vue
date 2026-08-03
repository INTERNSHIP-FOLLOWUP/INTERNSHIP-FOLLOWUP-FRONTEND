<!-- src/components/common/ErrorAlert.vue -->
<template>
  <div
    v-if="message"
    class="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/60 p-4 dark:border-red-900/50 dark:bg-red-950/30"
    role="alert"
  >
    <svg
      class="h-5 w-5 shrink-0 text-red-500 dark:text-red-400 mt-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
    <div class="text-sm font-medium text-red-800 dark:text-red-400">{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ message?: string | null }>()
</script>
