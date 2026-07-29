<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold dark:text-slate-100 text-slate-900">Student Details</h1>
        <p class="text-sm dark:dark:text-slate-500 text-slate-400 text-slate-500">{{ student?.name || 'Loading...' }}</p>
      </div>
      <div class="flex items-center gap-2">
        <router-link
          to="/tutor/students"
          class="inline-flex items-center gap-2 rounded-xl border dark:border-slate-600 border-slate-200 dark:bg-slate-800 bg-white px-4 py-2.5 text-sm font-bold dark:text-slate-200 text-slate-700 hover:dark:bg-slate-700 bg-slate-50 transition"
          >Back</router-link
        >
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-2 border-b dark:border-slate-700 border-slate-100">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        @click="active = tab.key"
        class="px-4 py-2.5 text-sm font-semibold transition"
        :class="
          active === tab.key
            ? 'border-b-2 border-indigo-600 text-indigo-700'
            : 'dark:dark:text-slate-500 text-slate-400 text-slate-500 hover:dark:text-slate-200 text-slate-700'
        "
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Overview -->
    <div v-if="active === 'overview'" class="space-y-6">
      <div class="rounded-2xl border dark:border-slate-700 border-slate-100 dark:bg-slate-800 bg-white p-6 shadow-sm">
        <h3 class="text-sm font-bold dark:text-slate-100 text-slate-900">Internship Status</h3>
        <div class="mt-4 flex flex-wrap items-center gap-3">
          <span
            class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
            :class="statusColor(student?.assignment_status)"
            >{{ formatStatus(student?.assignment_status) }}</span
          >
          <select
            v-model="nextStatus"
            class="h-9 rounded-xl border dark:border-slate-600 border-slate-200 dark:bg-slate-800 bg-white px-3 text-sm dark:text-slate-200 text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option v-for="opt in statusOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
          <button
            type="button"
            @click="confirmStatus"
            :disabled="!nextStatus || nextStatus === student?.assignment_status"
            class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            Update Status
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="rounded-2xl border dark:border-slate-700 border-slate-100 dark:bg-slate-800 bg-white p-5 shadow-sm">
          <h3 class="text-sm font-bold dark:text-slate-100 text-slate-900">Student</h3>
          <div class="mt-3 space-y-2 text-sm dark:text-slate-200 text-slate-700">
            <p>
              <span class="text-xs font-semibold dark:dark:text-slate-500 text-slate-400 text-slate-500">Name:</span> {{ student?.name }}
            </p>
            <p class="truncate max-w-[300px]">
              <span class="text-xs font-semibold dark:dark:text-slate-500 text-slate-400 text-slate-500">Email:</span> {{ student?.email }}
            </p>
            <p>
              <span class="text-xs font-semibold dark:dark:text-slate-500 text-slate-400 text-slate-500">Phone:</span>
              {{ student?.phone || '—' }}
            </p>
            <p>
              <span class="text-xs font-semibold dark:dark:text-slate-500 text-slate-400 text-slate-500">Code:</span>
              {{ student?.student_code || '—' }}
            </p>
          </div>
        </div>
        <div class="rounded-2xl border dark:border-slate-700 border-slate-100 dark:bg-slate-800 bg-white p-5 shadow-sm">
          <h3 class="text-sm font-bold dark:text-slate-100 text-slate-900">Internship</h3>
          <div class="mt-3 space-y-2 text-sm dark:text-slate-200 text-slate-700">
            <p>
              <span class="text-xs font-semibold dark:dark:text-slate-500 text-slate-400 text-slate-500">Company:</span>
              {{ student?.company_name || '—' }}
            </p>
            <p>
              <span class="text-xs font-semibold dark:dark:text-slate-500 text-slate-400 text-slate-500">Position:</span>
              {{ student?.position || '—' }}
            </p>
            <p>
              <span class="text-xs font-semibold dark:dark:text-slate-500 text-slate-400 text-slate-500">Batch:</span>
              {{ student?.batch?.batch_name || student?.batch?.name || '—' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Company Evaluation -->
    <div v-if="active === 'evaluation'" class="space-y-4">
      <div v-if="loadingEvaluations" class="rounded-2xl border dark:border-slate-700 border-slate-100 dark:bg-slate-800 bg-white p-6 text-center shadow-sm">
        <p class="text-sm dark:text-slate-500 text-slate-500">Loading evaluations…</p>
      </div>
      <div
        v-else-if="evaluations.length === 0"
        class="rounded-2xl border dark:border-slate-700 border-slate-100 dark:bg-slate-800 bg-white p-6 text-center shadow-sm"
      >
        <p class="text-sm dark:text-slate-500 text-slate-500">
          The company hasn't submitted an evaluation for this student yet.
        </p>
      </div>
      <div
        v-for="evalItem in evaluations"
        :key="evalItem.id"
        class="rounded-2xl border dark:border-slate-700 border-slate-100 dark:bg-slate-800 bg-white p-6 shadow-sm"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h3 class="text-sm font-bold dark:text-slate-100 text-slate-900">
            {{ evalItem.supervisor?.company?.company_name || 'Company' }}
          </h3>
          <span class="text-xs dark:text-slate-500 text-slate-400">{{ formatDate(evalItem.created_at) }}</span>
        </div>
        <div class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div v-for="metric in evaluationMetrics(evalItem)" :key="metric.label">
            <p class="text-xs font-semibold dark:text-slate-500 text-slate-500">{{ metric.label }}</p>
            <p class="mt-1 text-lg font-bold dark:text-slate-100 text-slate-900">{{ metric.value }}</p>
          </div>
        </div>
        <div v-if="evalItem.feedback" class="mt-4 rounded-xl dark:bg-slate-700/50 bg-slate-50 p-4">
          <p class="text-xs font-semibold dark:text-slate-500 text-slate-500">Feedback</p>
          <p class="mt-1 text-sm dark:text-slate-200 text-slate-700">{{ evalItem.feedback }}</p>
        </div>
      </div>
    </div>

    <!-- Placeholder tabs: wire these to lazy-load endpoints later -->
    <div
      v-if="active !== 'overview' && active !== 'evaluation'"
      class="rounded-2xl border dark:border-slate-700 border-slate-100 dark:bg-slate-800 bg-white p-6 shadow-sm"
    >
      <p class="text-sm dark:dark:text-slate-500 text-slate-400 text-slate-500">
        This tab will be lazy-loaded from the backend in the next phase.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTutorStudentStore } from '@/stores/tutorStudent'
import { useToastStore } from '@/stores/toast'
import api from '@/services/api'

const route = useRoute()
const store = useTutorStudentStore()
const toast = useToastStore()

const active = ref(typeof route.query.tab === 'string' ? route.query.tab : 'overview')
const student = ref<any>(null)
const nextStatus = ref('')
const confirmed = ref(false)
const statusText = ref('')

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'worklogs', label: 'Worklogs' },
  { key: 'followups', label: 'Follow-ups' },
  { key: 'issues', label: 'Issues' },
  { key: 'evaluation', label: 'Evaluation' },
]

const evaluations = ref<any[]>([])
const loadingEvaluations = ref(false)

function evaluationMetrics(evalItem: Record<string, unknown>) {
  return [
    { label: 'Technical', value: evalItem.technical_skill },
    { label: 'Communication', value: evalItem.communication },
    { label: 'Professionalism', value: evalItem.professionalism },
    { label: 'Attendance', value: evalItem.attendance },
    { label: 'Overall', value: evalItem.overall_score },
  ]
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}

async function fetchEvaluations() {
  loadingEvaluations.value = true
  try {
    const res = await api.get('/tutor/evaluations', { params: { student_id: route.params.id } })
    evaluations.value = res.data?.data ?? []
  } catch {
    evaluations.value = []
  } finally {
    loadingEvaluations.value = false
  }
}

const statusOptions = ['Assigned', 'In Progress', 'Completed', 'Terminated']

function statusColor(status?: string) {
  switch (status) {
    case 'Assigned':
      return 'bg-indigo-50 text-indigo-700'
    case 'In Progress':
      return 'bg-blue-50 text-blue-700'
    case 'Completed':
      return 'bg-emerald-50 text-emerald-700'
    case 'Terminated':
      return 'bg-rose-50 text-rose-700'
    default:
      return 'dark:bg-slate-600 bg-slate-100 dark:text-slate-200 text-slate-700'
  }
}

function formatStatus(status?: string) {
  if (!status) return 'Unknown'
  return String(status)
}

async function load() {
  confirmed.value = false
  statusText.value = ''
  const data = await store.fetchStudent(Number(route.params.id))
  student.value = data || null
  nextStatus.value = student.value?.assignment_status || ''
  fetchEvaluations()
}

function confirmStatus() {
  if (!nextStatus.value) return
  confirmed.value = true
  statusText.value = `Update status to "${nextStatus.value}"?`
}

async function applyStatus() {
  if (!nextStatus.value || !student.value) return
  const updated = await store.updateStudentStatus(student.value.id, nextStatus.value)
  if (updated) {
    student.value = { ...student.value, ...updated, assignment_status: updated }
  }
  confirmed.value = false
}

onMounted(() => {
  load()
})

watch(
  () => route.params.id,
  () => {
    load()
  },
)
</script>
