<template>
  <div class="space-y-1.5">
    <label :for="inputId" class="block text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="text-error ml-0.5">*</span>
    </label>

    <div class="relative">
      <input
        :id="inputId"
        :type="showPassword ? 'text' : 'password'"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :aria-invalid="!!error"
        :aria-describedby="error ? errorId : undefined"
        class="block w-full rounded-xl border bg-white px-4 py-3 pr-11 text-[15px] text-slate-900 placeholder-slate-400 transition-all duration-200 ease-in-out outline-none"
        :class="[
          error
            ? 'border-error ring-1 ring-error/20 focus:border-error focus:ring-2 focus:ring-error/30'
            : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        ]"
        @input="onInput"
        @blur="emit('blur')"
      />

      <button
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus:text-primary-600"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
        @click="togglePasswordVisibility"
      >
        <svg
          v-if="!showPassword"
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
          />
        </svg>
      </button>
    </div>

    <p
      v-if="error"
      :id="errorId"
      class="text-sm text-error flex items-center gap-1 mt-1"
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
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    error?: string
    autocomplete?: string
  }>(),
  {
    placeholder: 'Enter your password',
    required: false,
    disabled: false,
    error: '',
    autocomplete: 'current-password',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

const showPassword = ref(false)
const inputId = computed(() => `input-${props.label.toLowerCase().replace(/\s+/g, '-')}`)
const errorId = computed(() => `${inputId.value}-error`)

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
