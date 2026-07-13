<template>
    <div class="mx-auto max-w-6xl px-4 py-6">
        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-xl font-semibold text-gray-900">Evaluation History</h1>
                <p class="mt-1 text-sm text-gray-500">Search, filter, and review evaluations submitted by your company.
                </p>
            </div>

            <div class="flex gap-2">
                <router-link :to="{ name: 'CompanyEvaluationsCreate' }"
                    class="inline-flex items-center justify-center rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700">
                    Create Evaluation
                </router-link>
            </div>
        </div>

        <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <!-- Controls -->
            <div class="grid gap-3 md:grid-cols-12">
                <div class="md:col-span-5">
                    <label class="block text-xs font-medium text-gray-600">Search</label>
                    <input v-model="search" type="text" placeholder="Student name"
                        class="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>

                <div class="md:col-span-3">
                    <label class="block text-xs font-medium text-gray-600">Filter by</label>
                    <select v-model="filterStudentId"
                        class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                        <option value="">All students</option>
                        <option v-for="s in store.students" :key="s.id" :value="s.id">
                            {{ s.name }}
                        </option>
                    </select>
                </div>

                <div class="md:col-span-4">
                    <label class="block text-xs font-medium text-gray-600">Filter score</label>
                    <select v-model="scoreFilter"
                        class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                        <option value="">Any score</option>
                        <option value="4.5">4.5+ </option>
                        <option value="3.5">3.5+ </option>
                        <option value="2.5">2.5+ </option>
                        <option value="0">0+ </option>
                    </select>
                </div>
            </div>

            <div class="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div class="text-xs text-gray-500">
                    Showing <span class="font-semibold text-gray-700">{{ paged.length }}</span> of
                    <span class="font-semibold text-gray-700">{{ filteredSorted.length }}</span>
                </div>

                <div class="flex items-center gap-2">
                    <label class="text-xs font-medium text-gray-600">Sort</label>
                    <select v-model="sortKey"
                        class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                        <option value="student">Student</option>
                        <option value="overall_score_desc">Overall Score (high → low)</option>
                        <option value="overall_score_asc">Overall Score (low → high)</option>
                        <option value="date_desc">Date (new → old)</option>
                    </select>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="store.loading" class="py-10">
                <div class="flex items-center justify-center">
                    <div class="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-primary-600" />
                </div>
            </div>

            <!-- Table -->
            <div v-else class="mt-4 overflow-x-auto">
                <table class="min-w-full text-left text-sm">
                    <thead class="border-b bg-gray-50 text-xs font-semibold uppercase text-gray-600">
                        <tr>
                            <th class="px-4 py-3">Student Name</th>
                            <th class="px-4 py-3">Technical</th>
                            <th class="px-4 py-3">Communication</th>
                            <th class="px-4 py-3">Professionalism</th>
                            <th class="px-4 py-3">Attendance</th>
                            <th class="px-4 py-3">Overall Score</th>
                            <th class="px-4 py-3">Created Date</th>
                            <th class="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="e in paged" :key="e.id" class="border-b last:border-b-0 hover:bg-gray-50/40">
                            <td class="px-4 py-3 font-medium text-gray-900">
                                {{ studentName(e) }}
                            </td>
                            <td class="px-4 py-3">{{ e.technical_skill }}</td>
                            <td class="px-4 py-3">{{ e.communication }}</td>
                            <td class="px-4 py-3">{{ e.professionalism }}</td>
                            <td class="px-4 py-3">{{ e.attendance }}</td>
                            <td class="px-4 py-3">
                                <ScoreBadge :score="e.overall_score" />
                            </td>
                            <td class="px-4 py-3 text-gray-600">
                                {{ formatDate(e.created_at || e.evaluation_date) }}
                            </td>
                            <td class="px-4 py-3 text-right">
                                <router-link :to="{ name: 'CompanyEvaluationsDetail', params: { id: e.id } }"
                                    class="inline-flex items-center rounded-lg px-3 py-2 text-xs font-semibold text-primary-700 hover:bg-primary-50">
                                    View Details
                                </router-link>
                            </td>
                        </tr>
                        <tr v-if="paged.length === 0">
                            <td colspan="8" class="px-4 py-10 text-center text-sm text-gray-500">
                                No evaluations found.
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Pagination -->
                <div v-if="pageCount > 1"
                    class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50"
                        :disabled="page === 1" @click="page--">
                        Previous
                    </button>

                    <div class="flex flex-wrap items-center gap-2">
                        <button v-for="p in pageNumbers" :key="p"
                            class="rounded-xl border px-3 py-2 text-sm font-semibold"
                            :class="p === page ? 'border-primary-200 bg-primary-50 text-primary-800' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'"
                            @click="page = p">
                            {{ p }}
                        </button>
                    </div>

                    <button
                        class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50"
                        :disabled="page === pageCount" @click="page++">
                        Next
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useEvaluationStore } from '@/stores/evaluationStore'
import ScoreBadge from '@/components/evaluation/ScoreBadge.vue'

const store = useEvaluationStore()

const search = ref('')
const filterStudentId = ref<string | number | ''>('')
const scoreFilter = ref<string>('')
const sortKey = ref('date_desc')

const pageSize = 8
const page = ref(1)

function studentName(e: unknown): string {
    const record = e as Record<string, unknown>
    const student = record?.student as Record<string, unknown> | undefined
    return (
        String(student?.name ?? '') ||
        store.students.find((s) => s.id === Number(record?.student_id ?? 0))?.name ||
        String(record?.student_name ?? '') ||
        '—'
    )
}

function formatDate(v?: string | null): string {
    if (!v) return '—'
    const d = new Date(v)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleDateString()
}

const filteredSorted = computed(() => {
    const q = search.value.trim().toLowerCase()
    const studentId = filterStudentId.value === '' ? null : Number(filterStudentId.value)
    const minScore = scoreFilter.value === '' ? null : Number(scoreFilter.value)

    const list = store.evaluations
        .filter((e) => {
            if (studentId != null) {
                const sid = Number(e.student_id ?? e?.student?.id ?? 0)
                if (sid !== studentId) return false
            }
            if (minScore != null) {
                if (Number(e.overall_score) < minScore) return false
            }
            if (q) {
                return studentName(e).toLowerCase().includes(q)
            }
            return true
        })

    const sorted = [...list].sort((a, b) => {
        if (sortKey.value === 'student') {
            return studentName(a).localeCompare(studentName(b))
        }
        if (sortKey.value === 'overall_score_desc') return b.overall_score - a.overall_score
        if (sortKey.value === 'overall_score_asc') return a.overall_score - b.overall_score
        // date
        const da = new Date(a.created_at || a.evaluation_date || 0).getTime()
        const db = new Date(b.created_at || b.evaluation_date || 0).getTime()
        return db - da
    })

    return sorted
})

const pageCount = computed(() => Math.max(1, Math.ceil(filteredSorted.value.length / pageSize)))
const paged = computed(() => {
    const start = (page.value - 1) * pageSize
    return filteredSorted.value.slice(start, start + pageSize)
})

const pageNumbers = computed(() => {
    const max = pageCount.value
    const current = page.value
    const nums: number[] = []

    const start = Math.max(1, current - 2)
    const end = Math.min(max, current + 2)
    for (let i = start; i <= end; i++) nums.push(i)
    return nums
})

async function load() {
    await store.fetchStudents()
    await store.fetchEvaluations()
}

onMounted(load)

// reset to page 1 when filters change
;[search, filterStudentId, scoreFilter, sortKey].forEach((r: unknown) => (r as { value: number }).value)
</script>
