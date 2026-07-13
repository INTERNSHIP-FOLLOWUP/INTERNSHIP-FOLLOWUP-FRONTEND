<template>
  <div
    class="group relative overflow-hidden rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm ring-1 ring-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md"
  >
    <div class="absolute inset-x-0 top-0 h-1 opacity-90" :class="accentColor" />

    <div class="flex items-center justify-between">
      <div class="min-w-0 space-y-1">
        <p class="truncate text-xs font-semibold uppercase tracking-wide text-slate-500">
          {{ label }}
        </p>
        <h3 class="text-3xl font-bold leading-tight tracking-tight text-slate-950">
          {{ value }}
        </h3>
      </div>

      <div
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white shadow-sm transition-transform duration-200 group-hover:scale-105"
        :class="colorClass"
      >
        <slot name="icon">
          <component :is="icon" class="h-6 w-6" v-if="icon" />
        </slot>
      </div>
    </div>

    <!-- Trend Indicator -->
    <div class="mt-4 flex flex-wrap items-center gap-1.5" v-if="trend || description">
      <span
        v-if="trend"
        class="inline-flex items-center gap-0.5 rounded-md px-2 py-0.5 text-xs font-semibold"
        :class="trendClass"
      >
        <svg
          v-if="isTrendPositive"
          class="h-3 w-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
        <svg
          v-else-if="isTrendNegative"
          class="h-3 w-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
        {{ trend }}
      </span>
      <span class="text-xs font-medium text-slate-500">
        {{ description || 'vs last batch' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    value: string | number
    trend?: string
    description?: string
    colorClass?: string
    icon?: Component
  }>(),
  {
    colorClass: 'bg-gradient-to-br from-primary-600 to-primary-500',
  },
)

const isTrendPositive = computed(() => props.trend?.startsWith('+') ?? false)
const isTrendNegative = computed(() => props.trend?.startsWith('-') ?? false)

const trendClass = computed(() => {
  if (isTrendPositive.value) {
    return 'bg-emerald-50/80 text-emerald-600'
  }
  if (isTrendNegative.value) {
    return 'bg-rose-50/80 text-rose-600'
  }
  return 'bg-slate-50/80 text-slate-600'
})

const accentColor = computed(() => {
  if (props.colorClass.includes('indigo') || props.colorClass.includes('primary')) {
    return 'bg-primary-500'
  }
  if (props.colorClass.includes('purple')) {
    return 'bg-purple-500'
  }
  if (props.colorClass.includes('emerald') || props.colorClass.includes('success')) {
    return 'bg-emerald-500'
  }
  if (props.colorClass.includes('rose') || props.colorClass.includes('error')) {
    return 'bg-rose-500'
  }
  if (props.colorClass.includes('amber')) {
    return 'bg-amber-500'
  }
  return 'bg-primary-500'
})
</script>
