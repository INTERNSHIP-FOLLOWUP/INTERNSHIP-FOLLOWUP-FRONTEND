<template>
  <svg
    class="animate-spin"
    :class="[currentSizeClass, currentColorClass]"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
    <path
      class="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 1. Capture the props into a variable
const props = withDefaults(
  defineProps<{
    size?: 'xs' | 'sm' | 'md' | 'lg'
    color?: 'white' | 'primary'
  }>(),
  {
    size: 'md',
    color: 'white',
  },
)

// 2. Class dictionaries
const sizeMap: Record<string, string> = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4', // Perfect for your 15px button text!
  md: 'h-5 w-5',
  lg: 'h-8 w-8',
}

const colorMap: Record<string, string> = {
  white: 'text-white dark:text-white',
  primary: 'text-primary-600 dark:text-primary-400',
}

// 3. Use computed properties to reactively return the string based on the prop value
const currentSizeClass = computed(() => sizeMap[props.size])
const currentColorClass = computed(() => colorMap[props.color])
</script>
