<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">{{ $t('tutorStudent.title') }}</h1>
        <p class="text-sm text-slate-500">{{ student?.name || $t('common.loading') }}</p>
      </div>
      <div class="flex items-center gap-2">
        <router-link
          to="/tutor/students"
          class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
          >{{ $t('common.back') }}</router-link
        >
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-2 border-b border-slate-100">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        @click="active = tab.key"
        class="px-4 py-2.5 text-sm font-semibold transition"
        :class="
          active === tab.key
            ? 'border-b-2 border-indigo-600 text-indigo-700'
            : 'text-slate-500 hover:text-slate-700'
        "
      >
        {{ $t(tab.labelKey) }}
      </button>
    </div>

    <!-- Overview -->
    <div v-if="active === 'overview'" class="space-y-6">
      <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 class="text-sm font-bold text-slate-900">{{ $t('tutorStudent.internshipStatus') }}</h3>
        <div class="mt-4 flex flex-wrap items-center gap-3">
          <span
            class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
            :class="statusColor(student?.assignment_status)"
            >{{ formatStatus(student?.assignment_status) }}</span
          >
          <select
            v-model="nextStatus"
            class="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option v-for="opt in statusOptions" :key="opt" :value="opt">{{ $t('internships.status' + opt.replace(/ /g, '')) }}</option>
          </select>
          <button
            type="button"
            @click="confirmStatus"
            :disabled="!nextStatus || nextStatus === student?.assignment_status"
            class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {{ $t('tutorStudent.updateStatus') }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 class="text-sm font-bold text-slate-900">{{ $t('tutorStudent.studentSection') }}</h3>
          <div class="mt-3 space-y-2 text-sm text-slate-700">
            <p>
              <span class="text-xs font-semibold text-slate-500">{{ $t('tutorStudent.fieldName') }}</span> {{ student?.name }}
            </p>
            <p>
              <span class="text-xs font-semibold text-slate-500">{{ $t('tutorStudent.fieldEmail') }}</span> {{ student?.email }}
            </p>
            <p>
              <span class="text-xs font-semibold text-slate-500">{{ $t('tutorStudent.fieldPhone') }}</span>
              {{ student?.phone || '—' }}
            </p>
            <p>
              <span class="text-xs font-semibold text-slate-500">{{ $t('tutorStudent.fieldCode') }}</span>
              {{ student?.student_code || '—' }}
            </p>
          </div>
        </div>
        <div class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 class="text-sm font-bold text-slate-900">{{ $t('tutorStudent.internshipSection') }}</h3>
          <div class="mt-3 space-y-2 text-sm text-slate-700">
            <p>
              <span class="text-xs font-semibold text-slate-500">{{ $t('tutorStudent.fieldCompany') }}</span>
              {{ student?.company_name || '—' }}
            </p>
            <p>
              <span class="text-xs font-semibold text-slate-500">{{ $t('tutorStudent.fieldPosition') }}</span>
              {{ student?.position || '—' }}
            </p>
            <p>
              <span class="text-xs font-semibold text-slate-500">{{ $t('tutorStudent.fieldBatch') }}</span>
              {{ student?.batch?.batch_name || student?.batch?.name || '—' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Placeholder tabs: wire these to lazy-load endpoints later -->
    <div
      v-if="active !== 'overview'"
      class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
    >
      <p class="text-sm text-slate-500">
        {{ $t('tutorStudent.placeholderTab') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useTutorStudentStore } from '@/stores/tutorStudent'
import { useToastStore } from '@/stores/toast'

const { t: $t_script } = useI18n()

const route = useRoute()
const store = useTutorStudentStore()
const toast = useToastStore()

const active = ref('overview')
const student = ref<any>(null)
const nextStatus = ref('')
const confirmed = ref(false)
const statusText = ref('')

const tabs = [
  { key: 'overview', labelKey: 'tutorStudent.tabOverview' },
  { key: 'worklogs', labelKey: 'tutorStudent.tabWorklogs' },
  { key: 'followups', labelKey: 'tutorStudent.tabFollowUps' },
  { key: 'issues', labelKey: 'tutorStudent.tabIssues' },
]

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
      return 'bg-slate-100 text-slate-700'
  }
}

function formatStatus(status?: string) {
  if (!status) return $t_script('tutorStudent.unknown')
  return $t_script('internships.status' + status.replace(/\s+/g, '')) || String(status)
}

async function load() {
  confirmed.value = false
  statusText.value = ''
  const data = await store.fetchStudent(Number(route.params.id))
  student.value = data || null
  nextStatus.value = student.value?.assignment_status || ''
}

function confirmStatus() {
  if (!nextStatus.value) return
  confirmed.value = true
  statusText.value = $t_script('tutorStudent.updateStatusTo', { status: nextStatus.value })
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
