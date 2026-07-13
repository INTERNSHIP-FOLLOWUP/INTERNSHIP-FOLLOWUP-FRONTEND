<template>
    <div class="flex flex-col gap-1">
        <div class="flex items-center gap-1" role="radiogroup" :aria-label="ariaLabel">
            <button v-for="n in 5" :key="n" type="button" class="relative focus:outline-none" role="radio"
                :aria-checked="modelValue === n" :disabled="disabled" :tabindex="modelValue === n ? 0 : -1"
                @mouseenter="hovered = n" @mouseleave="hovered = 0" @focus="hovered = n" @blur="hovered = 0"
                @click="onSelect(n)">
                <span class="sr-only">{{ n }} stars</span>
                <svg viewBox="0 0 24 24" class="h-7 w-7 transition-colors" :class="starClass(n)" aria-hidden="true">
                    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                        fill="currentColor" />
                </svg>
            </button>
        </div>

        <p v-if="error" class="text-sm text-rose-600" role="alert">
            {{ error }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
    modelValue: number | null
    disabled?: boolean
    ariaLabel?: string
    error?: string
}>()

const emit = defineEmits<{ (e: 'update:modelValue', value: number | null): void }>()

const hovered = ref(0)

function onSelect(n: number) {
    if (props.disabled) return
    emit('update:modelValue', n)
}

function starClass(n: number) {
    const active = hovered.value ? hovered.value >= n : (props.modelValue ?? 0) >= n
    return active
        ? 'text-amber-400'
        : 'text-gray-200 hover:text-amber-300'
}

const ariaLabel = computed(() => props.ariaLabel ?? 'Star rating')
</script>
