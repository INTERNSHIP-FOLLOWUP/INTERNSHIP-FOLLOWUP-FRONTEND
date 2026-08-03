<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="w-full h-[48px] inline-flex items-center justify-center rounded-xl font-semibold text-[16px] text-white transition-all duration-200 ease-out outline-none focus:outline-none focus:ring-2 focus:ring-[#21BAEA]/50 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
    :class="[
      disabled || loading
        ? 'opacity-60 cursor-not-allowed'
        : 'hover:opacity-95 active:scale-[0.99] shadow-md shadow-[#21BAEA]/25 hover:shadow-lg hover:shadow-[#21BAEA]/35',
      'bg-gradient-to-r from-[#21BAEA] to-[#00A3D9]',
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
