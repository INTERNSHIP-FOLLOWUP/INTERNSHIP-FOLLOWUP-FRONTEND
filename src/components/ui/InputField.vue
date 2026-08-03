<template>
  <div class="space-y-1.5">
    <label :for="inputId" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>

    <div class="relative">
      <span
        v-if="icon"
        class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 dark:text-slate-500"
        aria-hidden="true"
      >
        <component :is="icon" class="h-5 w-5" />
      </span>

      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :aria-invalid="!!error"
        :aria-describedby="error ? errorId : undefined"
        v-bind="$attrs"
        class="block w-full rounded-xl border px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 transition-all duration-200 ease-in-out outline-none font-normal dark:text-slate-100 dark:placeholder-slate-500"
        :class="[
          icon ? 'pl-11' : 'pl-4',
          error
            ? 'border-red-300 bg-red-50/50 ring-1 ring-red-400/20 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-700 dark:bg-red-950/30 dark:ring-red-800/30'
            : 'border-blue-100/60 bg-[#EDF4FE] focus:bg-white focus:border-[#21BAEA] focus:ring-2 focus:ring-[#21BAEA]/20 dark:border-slate-600 dark:bg-slate-700 dark:focus:bg-slate-700 dark:focus:border-[#3B82F6]',
        ]"
        @input="onInput"
        @blur="emit('blur')"
      />
    </div>

    <p
      v-if="error"
      :id="errorId"
      class="text-sm text-error flex items-center gap-1 mt-1 dark:text-red-400"
      role="alert"
    >
      <svg class="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
          clip-rule="evenodd"
        />
      </svg>
      <span>{{ error }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label: string
    type?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    error?: string
    icon?: object
    autocomplete?: string
  }>(),
  {
    type: 'text',
    placeholder: '',
    required: false,
    disabled: false,
    error: '',
    icon: undefined,
    autocomplete: 'off',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

const inputId = computed(() => `input-${props.label.toLowerCase().replace(/\s+/g, '-')}`)
const errorId = computed(() => `${inputId.value}-error`)

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
