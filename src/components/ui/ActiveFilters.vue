<template>
  <div v-if="filters.length > 0" class="flex flex-wrap items-center gap-2">
    <span class="text-xs font-semibold text-slate-500">Filters:</span>
    <span
      v-for="f in filters"
      :key="f.label"
      class="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
    >
      {{ f.label }}: {{ f.value }}
      <button
        @click="$emit('remove', f.key)"
        class="inline-flex items-center justify-center rounded-full p-0.5 transition-colors hover:bg-indigo-100"
        :aria-label="`Remove ${f.label} filter`"
      >
        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
    <button
      @click="$emit('clearAll')"
      class="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors"
    >
      Clear all
    </button>
  </div>
</template>

<script setup lang="ts">
export interface ActiveFilter {
  key: string
  label: string
  value: string
}

defineProps<{
  filters: ActiveFilter[]
}>()

defineEmits<{
  remove: [key: string]
  clearAll: []
}>()
</script>
