<template>
  <div class="relative">
    <svg
      class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
    <input
      :value="modelValue"
      @input="onInput"
      type="text"
      :placeholder="placeholder"
      class="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      :class="clearable && modelValue ? 'pr-10' : 'pr-4'"
    />
    <button
      v-if="clearable && modelValue"
      type="button"
      class="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
      @click="onClear"
      :aria-label="'Clear search'"
    >
      <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
let timeout: ReturnType<typeof setTimeout>

const props = defineProps<{
  modelValue: string
  placeholder?: string
  delay?: number
}>()

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  delay?: number
  clearable?: boolean
}>(), {
  clearable: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  clear: []
}>()

function onInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  emit('update:modelValue', value)
  clearTimeout(timeout)
  timeout = setTimeout(() => emit('change', value), props.delay ?? 350)
}

function onClear() {
  emit('update:modelValue', '')
  emit('clear')
}
</script>
