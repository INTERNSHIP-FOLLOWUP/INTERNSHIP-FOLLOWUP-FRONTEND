<template>
  <div class="space-y-1.5">
    <label v-if="label" :for="id" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
      {{ label }}
      <span v-if="required" class="text-error">*</span>
    </label>
    <slot />
    <p v-if="error" :id="errorId" class="text-sm text-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

const props = defineProps<{
  label?: string
  error?: string
  required?: boolean
}>()

const id = useId()
const errorId = computed(() => (props.error ? `${id}-error` : undefined))
</script>
