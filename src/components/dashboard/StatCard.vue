<template>
  <div
    class="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
  >
    <!-- Background subtle gradient circle -->
    <div
      class="absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-5 transition-transform duration-500 group-hover:scale-110"
      :class="gradientColor"
    />

    <div class="flex items-center justify-between">
      <div class="space-y-1.5">
        <p class="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {{ label }}
        </p>
        <h3 class="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
          {{ value }}
        </h3>
      </div>

      <div
        class="flex h-12 w-12 items-center justify-center rounded-xl shadow-sm text-white"
        :class="colorClass"
      >
        <slot name="icon">
          <component :is="icon" class="h-6 w-6" v-if="icon" />
        </slot>
      </div>
    </div>

    <!-- Trend Indicator -->
    <div class="mt-4 flex items-center gap-1.5" v-if="trend || description">
      <span
        v-if="trend"
        class="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium"
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
      <span class="text-xs text-slate-500 dark:text-slate-400">
        {{ description || 'vs last batch' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    value: string | number
    trend?: string
    description?: string
    colorClass?: string // e.g. 'bg-gradient-to-br from-indigo-500 to-purple-600'
    icon?: any
  }>(),
  {
    colorClass: 'bg-gradient-to-br from-primary-600 to-primary-500',
  },
)

const isTrendPositive = computed(() => props.trend?.startsWith('+') ?? false)
const isTrendNegative = computed(() => props.trend?.startsWith('-') ?? false)

const trendClass = computed(() => {
  if (isTrendPositive.value) {
    return 'bg-emerald-50/80 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
  }
  if (isTrendNegative.value) {
    return 'bg-rose-50/80 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400'
  }
  return 'bg-slate-50/80 text-slate-600 dark:bg-slate-800/30 dark:text-slate-400'
})

const gradientColor = computed(() => {
  // Infer a matching subtle gradient/background indicator based on colorClass
  if (props.colorClass.includes('indigo') || props.colorClass.includes('primary')) {
    return 'bg-indigo-500'
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
