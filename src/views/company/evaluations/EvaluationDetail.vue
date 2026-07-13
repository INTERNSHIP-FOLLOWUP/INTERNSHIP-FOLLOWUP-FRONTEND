<template>
    <div class="mx-auto max-w-4xl px-4 py-6">
        <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 class="text-xl font-semibold text-gray-900">Evaluation Details</h1>
                    <p class="mt-1 text-sm text-gray-500">Read-only view of the student evaluation.</p>
                </div>

                <router-link :to="{ name: 'CompanyEvaluations' }"
                    class="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                    Back to List
                </router-link>
            </div>

            <div v-if="store.loading" class="py-10">
                <div class="flex items-center justify-center">
                    <div class="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-primary-600" />
                </div>
            </div>

            <div v-else>
                <div class="grid gap-4 lg:grid-cols-3">
                    <!-- Student Info -->
                    <section class="lg:col-span-1 rounded-2xl bg-gray-50 p-4">
                        <h2 class="text-sm font-semibold text-gray-900">Student Information</h2>
                        <div class="mt-3 space-y-2 text-sm text-gray-700">
                            <div>
                                <p class="text-xs font-medium text-gray-500">Name</p>
                                <p class="font-semibold text-gray-900">{{ student?.name ?? '—' }}</p>
                            </div>
                            <div>
                                <p class="text-xs font-medium text-gray-500">Email</p>
                                <p>{{ student?.email ?? '—' }}</p>
                            </div>
                            <div>
                                <p class="text-xs font-medium text-gray-500">University</p>
                                <p>{{ student?.university ?? '—' }}</p>
                            </div>
                            <div>
                                <p class="text-xs font-medium text-gray-500">Internship Position</p>
                                <p>{{ student?.internship_position ?? '—' }}</p>
                            </div>
                        </div>
                    </section>

                    <!-- Evaluation -->
                    <section class="lg:col-span-2">
                        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h2 class="text-sm font-semibold text-gray-900">Evaluation</h2>
                            <ScoreBadge :score="overallScore" />
                        </div>

                        <div class="grid gap-4 sm:grid-cols-2">
                            <div class="rounded-2xl border border-gray-100 p-4">
                                <p class="text-xs font-semibold text-gray-600">Technical Skill</p>
                                <div class="mt-2">
                                    <StarRating :modelValue="technical" disabled aria-label="Technical skill" />
                                </div>
                                <p class="mt-2 text-sm font-semibold text-gray-900">{{ technical }}/5</p>
                            </div>

                            <div class="rounded-2xl border border-gray-100 p-4">
                                <p class="text-xs font-semibold text-gray-600">Communication</p>
                                <div class="mt-2">
                                    <StarRating :modelValue="communication" disabled aria-label="Communication" />
                                </div>
                                <p class="mt-2 text-sm font-semibold text-gray-900">{{ communication }}/5</p>
                            </div>

                            <div class="rounded-2xl border border-gray-100 p-4">
                                <p class="text-xs font-semibold text-gray-600">Professionalism</p>
                                <div class="mt-2">
                                    <StarRating :modelValue="professionalism" disabled aria-label="Professionalism" />
                                </div>
                                <p class="mt-2 text-sm font-semibold text-gray-900">{{ professionalism }}/5</p>
                            </div>

                            <div class="rounded-2xl border border-gray-100 p-4">
                                <p class="text-xs font-semibold text-gray-600">Attendance</p>
                                <div class="mt-2">
                                    <StarRating :modelValue="attendance" disabled aria-label="Attendance" />
                                </div>
                                <p class="mt-2 text-sm font-semibold text-gray-900">{{ attendance }}/5</p>
                            </div>
                        </div>

                        <div class="mt-4 rounded-2xl border border-gray-100 p-4">
                            <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p class="text-xs font-semibold text-gray-600">Feedback</p>
                                    <p class="mt-2 whitespace-pre-wrap text-sm text-gray-800">
                                        {{ feedback || '—' }}
                                    </p>
                                </div>
                                <div class="text-right">
                                    <p class="text-xs font-semibold text-gray-600">Evaluation Date</p>
                                    <p class="mt-2 text-sm font-semibold text-gray-900">
                                        {{ formatDate(store.evaluation?.evaluation_date || store.evaluation?.created_at)
                                        }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import StarRating from '@/components/evaluation/StarRating.vue'
import ScoreBadge from '@/components/evaluation/ScoreBadge.vue'
import { useEvaluationStore } from '@/stores/evaluationStore'

const route = useRoute()
const store = useEvaluationStore()

const id = Number(route.params.id)

onMounted(async () => {
    if (!Number.isFinite(id)) return
    await store.fetchEvaluation(id)
})

const student = computed(() => store.evaluation?.student ?? null)

const technical = computed(() => Number(store.evaluation?.technical_skill ?? 0))
const communication = computed(() => Number(store.evaluation?.communication ?? 0))
const professionalism = computed(() => Number(store.evaluation?.professionalism ?? 0))
const attendance = computed(() => Number(store.evaluation?.attendance ?? 0))

const overallScore = computed(() => Number(store.evaluation?.overall_score ?? 0))
const feedback = computed(() => store.evaluation?.feedback ?? '')

function formatDate(v?: string | null) {
    if (!v) return '—'
    const d = new Date(v)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleDateString()
}
</script>
