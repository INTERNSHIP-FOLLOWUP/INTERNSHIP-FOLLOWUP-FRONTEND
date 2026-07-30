<template>
  <span class="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
    {{ count > 99 ? '99+' : count }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  count: number;
}>();
</script>