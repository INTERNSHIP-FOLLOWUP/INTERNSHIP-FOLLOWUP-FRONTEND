<template>
    <article class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <h3 class="text-sm font-semibold text-gray-900">{{ studentName }}</h3>
                <p class="mt-1 text-xs text-gray-500">{{ metaLine }}</p>
            </div>
            <ScoreBadge :score="overallScore" />
        </div>

        <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div class="text-xs">
                <p class="font-medium text-gray-700">Technical</p>
                <div class="mt-1">
                    <StarRating :modelValue="technical" disabled readonly />
                </div>
            </div>
            <div class="text-xs">
                <p class="font-medium text-gray-700">Communication</p>
                <div class="mt-1">
                    <StarRating :modelValue="communication" disabled class="pointer-events-none" />
                </div>
            </div>
            <div class="text-xs">
                <p class="font-medium text-gray-700">Professionalism</p>
                <div class="mt-1">
                    <StarRating :modelValue="professionalism" disabled class="pointer-events-none" />
                </div>
            </div>
            <div class="text-xs">
                <p class="font-medium text-gray-700">Attendance</p>
                <div class="mt-1">
                    <StarRating :modelValue="attendance" disabled class="pointer-events-none" />
                </div>
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StarRating from './StarRating.vue'
import ScoreBadge from './ScoreBadge.vue'

const props = defineProps<{
    studentName: string
    technical: number
    communication: number
    professionalism: number
    attendance: number
    overallScore: number
    createdAt?: string | null
}>()

const metaLine = computed(() => {
    const v = props.createdAt ? new Date(props.createdAt) : null
    if (!v || Number.isNaN(v.getTime())) return '—'
    return `Evaluated on ${v.toLocaleDateString()}`
})
</script>
