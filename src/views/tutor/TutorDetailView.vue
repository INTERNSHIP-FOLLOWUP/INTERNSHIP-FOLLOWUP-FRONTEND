<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3 text-sm mb-4">
      <router-link
        to="/admin/tutors"
        class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 dark:text-slate-400 text-slate-600 transition-colors hover:dark:bg-slate-600 bg-slate-100 hover:dark:text-slate-100 text-slate-900"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Tutors
      </router-link>
      <span class="dark:text-slate-500 text-slate-300">/</span>
      <span class="font-medium dark:text-slate-100 text-slate-900">Tutor Profile</span>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <p class="text-sm dark:dark:text-slate-500 text-slate-400 text-slate-500">Loading...</p>
    </div>

    <template v-else-if="data">
      <div class="rounded-2xl border dark:border-slate-600 border-slate-200/80 dark:bg-slate-800 bg-white p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="flex items-center gap-5">
          <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-100 to-blue-100 text-xl font-bold text-primary-700 shadow-xs ring-2 ring-white">
            {{ initials }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-xl font-bold dark:text-slate-100 text-slate-900">{{ data.tutor.name }}</h1>
              <span
                class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
                :class="(data.tutor.status || data.tutor.user?.status) === 'active' ? 'bg-emerald-50 text-emerald-700' : 'dark:bg-slate-600 bg-slate-100 dark:text-slate-400 text-slate-600'"
              >
                <span class="h-1.5 w-1.5 rounded-full" :class="(data.tutor.status || data.tutor.user?.status) === 'active' ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                {{ data.tutor.status || data.tutor.user?.status || 'active' }}
              </span>
              <span
                v-if="data.tutor.gender || data.tutor.user?.gender"
                class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium"
                :class="(data.tutor.gender || data.tutor.user?.gender) === 'Female' ? 'bg-pink-50 text-pink-700' : 'bg-blue-50 text-blue-700'"
              >
                {{ data.tutor.gender || data.tutor.user?.gender }}
              </span>
            </div>
            <p class="mt-1 text-sm dark:dark:text-slate-500 text-slate-400 text-slate-500 flex items-center gap-2 flex-wrap">
              <span>{{ data.tutor.email }}</span>
              <span class="dark:text-slate-500 text-slate-300">&middot;</span>
              <span>{{ data.tutor.phone || data.tutor.user?.phone || 'No phone' }}</span>
            </p>
            <p class="mt-1.5 text-sm font-semibold text-primary-600">
              {{ data.tutor.students_count }} assigned student{{ data.tutor.students_count !== 1 ? 's' : '' }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <router-link
            :to="`/admin/tutors/${data.tutor.id}/edit`"
            class="inline-flex items-center gap-1.5 rounded-xl border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-100"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Tutor Profile
          </router-link>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div class="rounded-xl border dark:border-slate-600 border-slate-200/80 dark:bg-slate-800 bg-white p-5 shadow-sm flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <p class="text-xs dark:text-slate-500 text-slate-400 uppercase tracking-wider font-semibold">Assigned Students</p>
            <p class="text-2xl font-bold dark:text-slate-100 text-slate-900 mt-0.5">{{ data.students.length }}</p>
          </div>
        </div>
        <div class="rounded-xl border dark:border-slate-600 border-slate-200/80 dark:bg-slate-800 bg-white p-5 shadow-sm flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p class="text-xs dark:text-slate-500 text-slate-400 uppercase tracking-wider font-semibold">Supervised Assignments</p>
            <p class="text-2xl font-bold dark:text-slate-100 text-slate-900 mt-0.5">{{ data.assignments.length }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-2xl border dark:border-slate-600 border-slate-200/80 dark:bg-slate-800 bg-white p-6 shadow-sm">
        <h2 class="text-base font-bold dark:text-slate-100 text-slate-900 mb-4">Assigned Students ({{ data.students.length }})</h2>
        <div v-if="data.students.length > 0" class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b dark:border-slate-700 border-slate-100 text-xs font-semibold uppercase tracking-wider dark:text-slate-500 text-slate-400">
                <th class="py-3 pr-4 font-medium">Name</th>
                <th class="py-3 pr-4 font-medium">Student ID</th>
                <th class="py-3 pr-4 font-medium">Batch</th>
                <th class="py-3 pr-4 font-medium">Worklogs</th>
                <th class="py-3 pr-4 font-medium">Issues</th>
                <th class="py-3 pr-4 font-medium">Status</th>
                <th class="py-3 text-right font-medium"></th>
              </tr>
            </thead>
            <tbody class="divide-y dark:divide-slate-700 divide-slate-50">
              <template v-for="s in data.students" :key="s.id">
                <tr @click="toggleStudent(s.id)" class="cursor-pointer hover:dark:bg-slate-700 bg-slate-50/50">
                  <td class="py-3 pr-4 font-semibold dark:text-slate-100 text-slate-900">{{ s.name }}</td>
                  <td class="py-3 pr-4 dark:dark:text-slate-500 text-slate-400 text-slate-500">{{ formatStudentId(s.student_code, s.batch) }}</td>
                  <td class="py-3 pr-4 dark:dark:text-slate-500 text-slate-400 text-slate-500">{{ s.batch }}</td>
                  <td class="py-3 pr-4 dark:dark:text-slate-500 text-slate-400 text-slate-500">{{ s.worklogs_count }}</td>
                  <td class="py-3 pr-4 dark:dark:text-slate-500 text-slate-400 text-slate-500">{{ s.issues_count }}</td>
                  <td class="py-3 pr-4">
                    <span
                      class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
                      :class="(s.user?.status || s.status || 'active') === 'active' ? 'bg-emerald-50 text-emerald-700' : 'dark:bg-slate-600 bg-slate-100 dark:text-slate-400 text-slate-600'"
                    >
                      <span class="h-1.5 w-1.5 rounded-full" :class="(s.user?.status || s.status || 'active') === 'active' ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                      {{ s.user?.status || s.status || 'active' }}
                    </span>
                  </td>
                  <td class="py-3 text-right">
                    <svg class="ml-auto h-4 w-4 dark:text-slate-500 text-slate-400 transition-transform" :class="expanded.has(s.id) ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </td>
                </tr>
                <tr v-if="expanded.has(s.id)">
                  <td colspan="7" class="dark:bg-slate-700 bg-slate-50/50 px-6 py-4">
                    <div v-if="!studentActivity[s.user_id]" class="text-sm dark:dark:text-slate-500 text-slate-400 text-slate-500">Loading tracking data...</div>
                    <div v-else class="space-y-2">
                      <div v-if="studentActivity[s.user_id].assignment" class="text-xs dark:dark:text-slate-500 text-slate-400 text-slate-500">
                        <span class="font-semibold dark:text-slate-200 text-slate-700">Internship:</span>
                        {{ studentActivity[s.user_id].assignment.company?.company_name }} — {{ studentActivity[s.user_id].assignment.position }}
                      </div>
                      <div v-if="studentActivity[s.user_id].average_score" class="text-xs dark:dark:text-slate-500 text-slate-400 text-slate-500">
                        <span class="font-semibold dark:text-slate-200 text-slate-700">Avg Score:</span>
                        {{ studentActivity[s.user_id].average_score }}/10
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <p v-else class="text-sm dark:text-slate-500 text-slate-400">No students assigned.</p>
      </div>
    </template>

    <div v-else-if="!loading" class="rounded-xl border dark:border-slate-600 border-slate-200 dark:bg-slate-800 bg-white px-6 py-12 text-center">
      <p class="text-sm dark:dark:text-slate-500 text-slate-400 text-slate-500">Tutor not found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import { formatStudentId } from '@/utils/studentUtils'

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

async function fetchTutorDetail() {
  const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
  if (!id) return
  loading.value = true
  try {
    const res = await api.get(`/admin/tutors/${id}/activity`)
    data.value = res.data
  } catch (err) {
    console.error('Failed to load tutor profile:', err)
    data.value = null
  } finally {
    loading.value = false
  }
}

onMounted(fetchTutorDetail)
watch(() => route.params.id, fetchTutorDetail)
</script>
