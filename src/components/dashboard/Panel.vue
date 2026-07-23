<template>
  <div
    v-motion
    :initial="{ opacity: 0, y: 20, scale: 0.97 }"
    :visible="{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 25, mass: 0.8 } }"
    class="premium-card rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
  >
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-base font-bold text-slate-900">{{ title }}</h2>
      <slot name="action" />
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="n in 4" :key="n" class="flex items-start gap-3">
        <div class="skeleton-shimmer h-8 w-8 rounded-full bg-slate-200" />
        <div class="flex-1 space-y-2">
          <div class="skeleton-shimmer h-3 w-1/3 rounded bg-slate-200" />
          <div class="skeleton-shimmer h-3 w-2/3 rounded bg-slate-100" />
        </div>
      </div>
    </div>

    <div v-else-if="error" class="flex flex-col items-center justify-center py-10 text-center">
      <div class="rounded-full bg-red-50 p-3 text-red-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <p class="mt-3 text-sm font-semibold text-red-600">Unable to load.</p>
      <button
        type="button"
        class="mt-3 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition"
        @click="$emit('retry')"
      >
        Retry
      </button>
    </div>

    <div
      v-else-if="emptyCheck === null || emptyCheck === undefined || (Array.isArray(emptyCheck) && emptyCheck.length === 0)"
      class="flex flex-col items-center justify-center py-10 text-center"
    >
      <div class="rounded-2xl bg-slate-50 p-3 text-slate-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-5"
          />
        </svg>
      </div>
      <p class="mt-3 text-sm font-semibold text-slate-500">{{ emptyTitle }}</p>
      <p class="text-xs text-slate-400">{{ emptyMessage }}</p>
    </div>

    <slot v-else name="default" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    loading?: boolean
    error?: string | null
    emptyTitle?: string
    emptyMessage?: string
    emptyCheck?: unknown
  }>(),
  {
    loading: false,
    error: '',
    emptyTitle: 'Nothing here yet',
    emptyMessage: 'There is nothing to show at the moment.',
    emptyCheck: undefined,
  },
)

defineEmits<{
  retry: []
}>()
</script>
