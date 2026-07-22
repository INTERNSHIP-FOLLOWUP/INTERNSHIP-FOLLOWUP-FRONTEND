<template>
  <div>
    <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div class="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 class="text-xl font-semibold text-gray-900">Assigned Students</h1>
          <p class="mt-1 text-sm text-gray-500">Students assigned to your company.</p>
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-12">
        <svg class="h-6 w-6 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span class="ml-3 text-sm text-gray-500">Loading students…</span>
      </div>
      <div
        v-else-if="error"
        class="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3"
      >
        <p class="text-sm text-rose-600">{{ error }}</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm" v-if="students.length">
          <thead>
            <tr
              class="border-b border-gray-100 text-xs font-medium uppercase tracking-wider text-gray-400"
            >
              <th class="px-4 py-3 font-medium">Student</th>
              <th class="px-4 py-3 font-medium">Email</th>
              <th class="px-4 py-3 font-medium">Batch</th>
              <th class="px-4 py-3 font-medium">Position</th>
              <th class="px-4 py-3 font-medium">Tutor</th>
              <th class="px-4 py-3 font-medium">Period</th>
              <th class="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr
              v-for="student in students"
              :key="student.id"
              class="transition-colors hover:bg-gray-50/50"
            >
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                    :class="student.avatarColor"
                  >
                    {{ student.initials }}
                  </div>
                  <span class="font-medium text-gray-900">{{ student.name }}</span>
                </div>
              </td>
              <td class="px-4 py-3.5 text-gray-600">{{ student.email }}</td>
              <td class="px-4 py-3.5 text-gray-600">{{ student.batch }}</td>
              <td class="px-4 py-3.5 text-gray-600">{{ student.position }}</td>
              <td class="px-4 py-3.5 text-gray-600">{{ student.tutorName }}</td>
              <td class="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                <span class="text-xs text-slate-400">{{ student.startDate }}</span>
                <span v-if="student.startDate && student.endDate" class="text-xs text-slate-300 mx-1">→</span>
                <span v-if="student.endDate" class="text-xs text-slate-400">{{ student.endDate }}</span>
              </td>
              <td class="px-4 py-3.5">
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  :class="student.statusClass"
                >
                  {{ student.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-else class="px-4 py-12 text-center">
          <div class="flex flex-col items-center">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
              <svg
                class="h-6 w-6 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857"
                />
              </svg>
            </div>
            <h3 class="mt-3 text-sm font-semibold text-gray-700">No assigned students yet</h3>
            <p class="mt-1 text-xs text-gray-400">
              Students assigned to your company will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCompanyStore } from '@/stores/company'

const store = useCompanyStore()

const avatarColors = ['bg-indigo-500', 'bg-emerald-500', 'bg-violet-500', 'bg-rose-500', 'bg-amber-500', 'bg-cyan-500']
const statusMap: Record<string, { text: string; class: string }> = {
  'Assigned': { text: 'Assigned', class: 'bg-blue-50 text-blue-700' },
  'In Progress': { text: 'In Progress', class: 'bg-amber-50 text-amber-700' },
  'Completed': { text: 'Completed', class: 'bg-emerald-50 text-emerald-700' },
  'Terminated': { text: 'Terminated', class: 'bg-red-50 text-red-700' },
}

interface StudentRow {
  id: number
  name: string
  initials: string
  email: string
  batch: string
  position: string
  tutorName: string
  startDate: string
  endDate: string
  status: string
  avatarColor: string
  statusClass: string
}

const students = ref<StudentRow[]>([])
const loading = ref(true)
const error = ref('')

function initialsFrom(name: string | undefined | null): string {
  const text = name?.trim()
  if (!text) return '?'
  const parts = text.split(' ')
  const first = parts[0]?.[0] ?? ''
  const last = parts[parts.length - 1]?.[0] || ''
  return `${first}${last}`.toUpperCase()
}

function colorFor(id: number | undefined | null): string {
  const idx = Math.abs(Number(id ?? 0)) % avatarColors.length
  const colorValue = avatarColors[idx]
  if (typeof colorValue === 'string') {
    return colorValue
  }
  return 'bg-indigo-500'
}

function statusClassFor(rawItem: { status?: string }): string {
  const statusKey = String(rawItem?.status ?? 'Assigned')
  const matched = statusMap[statusKey] || statusMap['Assigned']
  const matchedClass = matched?.class
  return typeof matchedClass === 'string'
    ? matchedClass
    : 'bg-blue-50 text-blue-700'
}

function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const rawStudents = await store.fetchStudents()
    students.value = rawStudents.map((item) => ({
      id: Number(item?.id ?? 0),
      name: String(item?.student_name ?? 'Student'),
      initials: initialsFrom(String(item?.student_name ?? '')),
      email: String(item?.student_email ?? ''),
      batch: String(item?.batch ?? ''),
      position: String(item?.position ?? ''),
      tutorName: String(item?.tutor_name ?? ''),
      startDate: formatDate(item?.start_date),
      endDate: formatDate(item?.end_date),
      status: String(item?.status ?? 'Assigned'),
      avatarColor: colorFor(item?.id),
      statusClass: statusClassFor(item),
    }))
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load assigned students.'
    students.value = []
  } finally {
    loading.value = false
  }
})
</script>
