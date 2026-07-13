<template>
    <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold" :class="badgeClass"
        aria-label="Overall score">
        {{ formatted }}
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ score: number }>()

const formatted = computed(() => {
    const n = Number.isFinite(props.score) ? props.score : 0
    return n.toFixed(2)
})

const badgeClass = computed(() => {
    const s = Number(props.score)
    if (s >= 4.5) return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
    if (s >= 3.5) return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
    if (s >= 2.5) return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
    return 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
})
</script>
