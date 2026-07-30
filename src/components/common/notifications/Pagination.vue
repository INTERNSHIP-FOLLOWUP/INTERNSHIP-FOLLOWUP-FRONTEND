<template>
  <div class="flex items-center justify-between px-4 py-3 border-t border-gray-200">
    <div class="text-sm text-gray-700">
      Showing {{ meta.from || 0 }} to {{ meta.to || 0 }} of {{ meta.total }} results
    </div>
    <div class="flex items-center gap-2">
      <button
        @click="$emit('prev')"
        :disabled="meta.current_page <= 1"
        class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span class="text-sm text-gray-700">
        Page {{ meta.current_page }} of {{ meta.last_page }}
      </span>
      <button
        @click="$emit('next')"
        :disabled="meta.current_page >= meta.last_page"
        class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  meta: {
    total: number;
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
  };
}>();

defineEmits<{
  prev: [];
  next: [];
}>();
</script>