<template>
  <div class="space-y-6">
    <router-link to="/admin/tutors"
      class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-800 mb-4">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m7-7l-7 7 7 7" />
      </svg>
      {{ $t('tutors.backToList') }}
    </router-link>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <p class="text-sm text-slate-500">{{ $t('tutors.loading') }}</p>
    </div>

    <template v-else-if="data">
      <div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div class="flex items-start gap-5">
          <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-xl font-bold text-blue-600">
            {{ initials }}
          </div>
          <div class="flex-1 min-w-0">
            <h1 class="text-xl font-bold text-slate-900">{{ data.tutor.name }}</h1>
            <p class="text-sm text-slate-500">{{ data.tutor.email }}</p>
            <p class="mt-1 text-sm font-semibold text-primary-600">{{ data.tutor.students_count }} {{ data.tutor.students_count === 1 ? $t('tutors.student_singular') : $t('tutors.student_plural') }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p class="text-xs text-slate-400 uppercase tracking-wider font-semibold">{{ $t('tutors.worklogStats') }}</p>
          <div class="mt-3 flex gap-3 text-sm">
            <span class="rounded-full bg-amber-50 px-3 py-1 font-bold text-amber-700">{{ data.worklog_stats.submitted }} {{ $t('tutors.submitted') }}</span>
            <span class="rounded-full bg-emerald-50 px-3 py-1 font-bold text-emerald-700">{{ data.worklog_stats.approved }} {{ $t('tutors.approved') }}</span>
            <span class="rounded-full bg-rose-50 px-3 py-1 font-bold text-rose-700">{{ data.worklog_stats.rejected }} {{ $t('tutors.rejected') }}</span>
          </div>
        </div>
        <div class="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p class="text-xs text-slate-400 uppercase tracking-wider font-semibold">{{ $t('tutors.issues') }}</p>
          <p class="mt-3 text-2xl font-bold text-slate-900">{{ data.issues.length }}</p>
        </div>
        <div class="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p class="text-xs text-slate-400 uppercase tracking-wider font-semibold">{{ $t('tutors.assignments') }}</p>
          <p class="mt-3 text-2xl font-bold text-slate-900">{{ data.assignments.length }}</p>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h2 class="text-base font-bold text-slate-900 mb-4">{{ $t('tutors.assignedStudents') }} ({{ data.students.length }})</h2>
        <div v-if="data.students.length > 0" class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th class="py-3 pr-4 font-medium">{{ $t('tutors.nameCol') }}</th>
                <th class="py-3 pr-4 font-medium">{{ $t('tutors.codeCol') }}</th>
                <th class="py-3 pr-4 font-medium">{{ $t('tutors.batchCol') }}</th>
                <th class="py-3 pr-4 font-medium">{{ $t('tutors.worklogsCol') }}</th>
                <th class="py-3 pr-4 font-medium">{{ $t('tutors.issuesCol') }}</th>
                <th class="py-3 pr-4 font-medium">{{ $t('tutors.statusCol') }}</th>
                <th class="py-3 text-right font-medium"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <template v-for="s in data.students" :key="s.id">
                <tr @click="toggleStudent(s.id)" class="cursor-pointer hover:bg-slate-50/50">
                  <td class="py-3 pr-4 font-semibold text-slate-900">{{ s.name }}</td>
                  <td class="py-3 pr-4 text-slate-500">{{ s.student_code }}</td>
                  <td class="py-3 pr-4 text-slate-500">{{ s.batch }}</td>
                  <td class="py-3 pr-4 text-slate-500">{{ s.worklogs_count }}</td>
                  <td class="py-3 pr-4 text-slate-500">{{ s.issues_count }}</td>
                  <td class="py-3 pr-4">
                    <span class="rounded-full px-2.5 py-0.5 text-xs font-bold"
                      :class="s.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'">
                      {{ s.status }}
                    </span>
                  </td>
                  <td class="py-3 text-right">
                    <svg class="ml-auto h-4 w-4 text-slate-400 transition-transform" :class="expanded.has(s.id) ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </td>
                </tr>
                <tr v-if="expanded.has(s.id)">
                  <td colspan="7" class="bg-slate-50/50 px-6 py-4">
                    <div v-if="!studentActivity[s.user_id]" class="text-sm text-slate-500">{{ $t('tutors.loadingTracking') }}</div>
                    <div v-else class="space-y-4">
                      <div class="flex gap-3 text-xs">
                        <span class="rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-700">{{ studentActivity[s.user_id].worklog_stats.submitted }} {{ $t('tutors.submitted') }}</span>
                        <span class="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">{{ studentActivity[s.user_id].worklog_stats.approved }} {{ $t('tutors.approved') }}</span>
                        <span class="rounded-full bg-rose-50 px-2.5 py-1 font-semibold text-rose-700">{{ studentActivity[s.user_id].worklog_stats.rejected }} {{ $t('tutors.rejected') }}</span>
                        <span class="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">{{ studentActivity[s.user_id].issues.length }} {{ $t('tutors.issues') }}</span>
                      </div>
                      <div v-if="studentActivity[s.user_id].assignment" class="text-xs text-slate-500">
                        <span class="font-semibold text-slate-700">{{ $t('tutors.internshipLabel') }}</span>
                        {{ studentActivity[s.user_id].assignment.company?.company_name }} — {{ studentActivity[s.user_id].assignment.position }}
                      </div>
                      <div v-if="studentActivity[s.user_id].average_score" class="text-xs text-slate-500">
                        <span class="font-semibold text-slate-700">{{ $t('tutors.avgScoreLabel') }}</span>
                        {{ studentActivity[s.user_id].average_score }}/10
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <p v-else class="text-sm text-slate-400">{{ $t('tutors.noStudents') }}</p>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 class="text-base font-bold text-slate-900 mb-4">{{ $t('tutors.issues') }}</h2>
          <div v-if="data.issues.length > 0" class="space-y-2">
            <div v-for="issue in data.issues" :key="issue.id"
              class="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-2.5 text-sm">
              <div class="min-w-0 flex-1">
                <p class="truncate font-semibold text-slate-700">{{ issue.title }}</p>
                <p class="text-xs text-slate-400">{{ issue.student?.name }} &middot; {{ formatDate(issue.created_at) }}</p>
              </div>
              <span class="ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-bold"
                :class="issue.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' : issue.status === 'Open' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'">
                {{ issue.status }}
              </span>
            </div>
          </div>
          <p v-else class="text-sm text-slate-400">{{ $t('tutors.noIssues') }}</p>
        </div>

        <div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 class="text-base font-bold text-slate-900 mb-4">{{ $t('tutors.supervisedAssignments') }}</h2>
          <div v-if="data.assignments.length > 0" class="space-y-2">
            <div v-for="a in data.assignments" :key="a.id"
              class="rounded-lg border border-slate-100 px-4 py-3 text-sm">
              <div class="flex items-center justify-between">
                <span class="font-semibold text-slate-700">{{ a.student?.name }}</span>
                <span class="rounded-full px-2 py-0.5 text-xs font-bold"
                  :class="a.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'">
                  {{ a.status }}
                </span>
              </div>
              <p class="mt-1 text-xs text-slate-500">{{ a.company?.name }} &middot; {{ a.position }} &middot; {{ a.start_date }} — {{ a.end_date }}</p>
            </div>
          </div>
          <p v-else class="text-sm text-slate-400">{{ $t('tutors.noAssignments') }}</p>
        </div>
      </div>
    </template>

    <div v-else-if="!loading" class="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
      <p class="text-sm text-slate-500">{{ $t('tutors.tutorNotFound') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const data = ref<any>(null)
const loading = ref(true)
const expanded = ref<Set<number>>(new Set())
const studentActivity = ref<Record<number, any>>({})

const initials = computed(() => {
  if (!data.value?.tutor?.name) return '?'
  return data.value.tutor.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
})

async function toggleStudent(studentId: number) {
  if (expanded.value.has(studentId)) {
    expanded.value.delete(studentId)
    return
  }
  expanded.value.add(studentId)

  const student = data.value?.students?.find((s: any) => s.id === studentId)
  if (!student || studentActivity.value[student.user_id]) return

  try {
    const res = await api.get(`/admin/students/${student.user_id}/activity`)
    studentActivity.value[student.user_id] = res.data
  } catch {
    studentActivity.value[student.user_id] = { worklog_stats: { submitted: 0, approved: 0, rejected: 0 }, issues: [], assignment: null, average_score: null }
  }
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—'
  const str = String(dateStr)
  const part0 = str.split('T')[0] ?? ''
  const raw = part0.split(' ')[0] ?? ''
  const parts = raw.split('-')
  if (parts.length === 3) {
    const year = parts[0]
    const month = parts[1]
    const day = parts[2]
    if (year && month && day) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const mIdx = parseInt(month, 10) - 1
      if (mIdx >= 0 && mIdx < 12 && months[mIdx]) {
        return `${parseInt(day, 10)} ${months[mIdx]} ${year}`
      }
    }
  }
  const d = new Date(dateStr)
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  return dateStr
}

onMounted(async () => {
  try {
    const res = await api.get(`/admin/tutors/${route.params.id}/activity`)
    data.value = res.data
  } catch (err) {
    console.error('Failed to load tutor profile:', err)
    data.value = null
  } finally {
    loading.value = false
  }
})
</script>
