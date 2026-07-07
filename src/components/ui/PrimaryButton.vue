<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="w-full h-[48px] inline-flex items-center justify-center rounded-xl font-semibold text-[15px] text-white transition-all duration-300 ease-out outline-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2"
    :class="[
      disabled || loading
        ? 'opacity-60 cursor-not-allowed'
        : 'hover:shadow-lg hover:shadow-primary-500/25 active:scale-[0.98]',
      'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600',
    ]"
    v-bind="$attrs"
  >
    <span class="inline-flex items-center justify-center gap-2">
      <LoadingSpinner v-if="loading" size="sm" color="white" />
      <slot />
    </span>
  </button>
</template>
<script setup lang="ts">
import LoadingSpinner from './LoadingSpinner.vue'

withDefaults(
  defineProps<{
    type?: 'button' | 'submit'
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    type: 'submit',
    disabled: false,
    loading: false,
  },
)
</script>
