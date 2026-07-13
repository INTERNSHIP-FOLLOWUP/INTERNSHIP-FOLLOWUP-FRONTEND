<template>
  <div class="flex flex-col gap-1">
    <div
      class="flex items-center gap-1"
      role="radiogroup"
      :aria-label="ariaLabel"
    >
      <button
        v-for="n in maxStars"
        :key="n"
        ref="starRefs"
        type="button"
        class="relative focus:outline-none"
        role="radio"
        :aria-checked="modelValue === n"
        :aria-disabled="isDisabled"
        :disabled="isDisabled"
        :tabindex="tabIndexFor(n)"
        :class="starButtonClass"
        @mouseenter="hoverValue = n"
        @mouseleave="hoverValue = 0"
        @focus="hoverValue = n"
        @blur="hoverValue = 0"
        @click="onSelect(n)"
        @keydown="onKeydown($event, n)"
      >
        <span class="sr-only">{{ n }} / {{ maxStars }}</span>
        <svg
          viewBox="0 0 24 24"
          :class="[starSvgClass, starClass(n)]"
          :aria-hidden="true"
          focusable="false"
        >
          <path
            d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>

    <p
      v-if="error"
      class="text-sm text-rose-600"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type StarSize = 'sm' | 'md' | 'lg'

const props = defineProps<{
  modelValue: number | null
  max?: number
  readonly?: boolean
  disabled?: boolean
  size?: StarSize
  ariaLabel?: string
  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const maxStars = computed(() => {
  const m = props.max ?? 5
  return Math.max(1, Math.floor(m))
})

const isDisabled = computed(() => !!props.disabled || !!props.readonly)

const hoverValue = ref(0)
const ariaLabel = computed(() => props.ariaLabel ?? 'Star rating')

const starSizeClasses = computed(() => {
  switch (props.size ?? 'md') {
    case 'sm':
      return 'h-5 w-5'
    case 'lg':
      return 'h-9 w-9'
    case 'md':
    default:
      return 'h-7 w-7'
  }
})

const starSvgClass = computed(() => {
  return ['transition-colors', starSizeClasses.value]
})

function shouldFill(n: number) {
  const current = props.modelValue ?? 0
  const preview = (hoverValue.value || current) ?? 0
  return preview >= n
}




const starButtonClass = computed(() => {
  return isDisabled.value
    ? 'cursor-not-allowed'
    : 'cursor-pointer'
})

function tabIndexFor(n: number) {
  // roving tabindex: only the currently selected star is tabbable
  return props.modelValue === n ? 0 : -1
}

function onSelect(n: number) {
  if (isDisabled.value) return
  const bounded = Math.min(maxStars.value, Math.max(1, n))
  emit('update:modelValue', bounded)
}

function onKeydown(e: KeyboardEvent, n: number) {
  if (isDisabled.value) return

  const key = e.key
  if (key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'ArrowUp' && key !== 'ArrowDown' && key !== 'Enter' && key !== ' ' && key !== 'Spacebar') {
    return
  }

  e.preventDefault()

  const current = clamp(n, 1, maxStars.value)

  if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
    onSelect(current)
    return
  }

  const delta = key === 'ArrowLeft' || key === 'ArrowDown' ? -1 : 1
  const next = clamp(current + delta, 1, maxStars.value)

  // move focus + update hover preview
  hoverValue.value = next
  emit('update:modelValue', next)

  // focus the button for accessibility
  // (no reliable ref list is kept; roving tabindex handles it on next render)
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

function starClass(n: number) {
  return shouldFill(n) ? 'text-amber-400' : 'text-gray-200'
}
</script>

