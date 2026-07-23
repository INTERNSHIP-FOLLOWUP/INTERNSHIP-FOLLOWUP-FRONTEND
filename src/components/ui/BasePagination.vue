<template>
  <div
    v-if="meta && meta.last_page > 1"
    v-motion
    :initial="{ opacity: 0, y: 12 }"
    :enter="{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 26 } }"
    class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 px-5 py-3"
  >
    <p class="text-xs text-slate-500">
      Showing
      <span class="font-semibold text-slate-700">{{ meta.from }}</span>
      –
      <span class="font-semibold text-slate-700">{{ meta.to }}</span>
      of
      <span class="font-semibold text-slate-700">{{ meta.total }}</span>
      results
    </p>

    <nav class="flex items-center gap-1" aria-label="Pagination">
      <button
        :disabled="meta.current_page <= 1"
        :aria-label="`Go to page ${meta.current_page - 1}`"
        class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-all duration-200"
        :class="
          meta.current_page <= 1
            ? 'cursor-not-allowed text-slate-300'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 active:scale-90'
        "
        @click="goTo(meta.current_page - 1)"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <template v-for="(page, index) in visiblePages" :key="index">
        <span
          v-if="page === '...'"
          class="inline-flex h-8 w-8 items-center justify-center text-xs text-slate-400 select-none"
        >…</span>
        <button
          v-else
          :aria-label="`Go to page ${page}`"
          :aria-current="page === meta.current_page ? 'page' : undefined"
          class="inline-flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-2 text-sm font-medium transition-all duration-200"
          :class="
            page === meta.current_page
              ? 'bg-indigo-50 text-indigo-700 shadow-sm scale-105'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 active:scale-90'
          "
          @click="goTo(page as number)"
        >
          {{ page }}
        </button>
      </template>

      <button
        :disabled="meta.current_page >= meta.last_page"
        :aria-label="`Go to page ${meta.current_page + 1}`"
        class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-all duration-200"
        :class="
          meta.current_page >= meta.last_page
            ? 'cursor-not-allowed text-slate-300'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 active:scale-90'
        "
        @click="goTo(meta.current_page + 1)"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

const props = defineProps<{
  meta: PaginationMeta | null
}>()

const emit = defineEmits<{
  'page-change': [page: number]
}>()

function goTo(page: number) {
  if (page < 1 || page > props.meta!.last_page || page === props.meta!.current_page) return
  emit('page-change', page)
}

const visiblePages = computed(() => {
  const meta = props.meta
  if (!meta) return []
  const { current_page, last_page } = meta
  if (last_page <= 7) {
    return Array.from({ length: last_page }, (_, i) => i + 1)
  }
  const pages: (number | '...')[] = [1]
  if (current_page > 3) pages.push('...')
  const start = Math.max(2, current_page - 1)
  const end = Math.min(last_page - 1, current_page + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current_page < last_page - 2) pages.push('...')
  pages.push(last_page)
  return pages
})
</script>
