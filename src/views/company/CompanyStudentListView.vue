<template>
  <div>
    <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div class="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 class="text-xl font-semibold text-gray-900">Assigned Students</h1>
          <p class="mt-1 text-sm text-gray-500">Students assigned to your company.</p>
        </div>
      </div>

      <div v-if="store.loading" class="py-12">
        <div class="flex items-center justify-center">
          <div class="text-sm text-gray-600">Loading students…</div>
        </div>
      </div>
      <div v-else-if="store.error" class="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3">
        <p class="text-sm text-rose-600">{{ store.error }}</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm" v-if="students.length">
          <thead>
            <tr class="border-b border-gray-100 text-xs font-medium uppercase tracking-wider text-gray-400">
              <th class="px-4 py-3 font-medium">Student</th>
              <th class="px-4 py-3 font-medium">Email</th>
              <th class="px-4 py-3 font-medium">Batch</th>
              <th class="px-4 py-3 font-medium">Assigned Date</th>
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
              <td class="px-4 py-3.5 text-gray-600">{{ student.assignedDate }}</td>
              <td class="px-4 py-3.5">
                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" :class="student.statusClass">
                  {{ student.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-else class="px-4 py-12 text-center">
          <div class="flex flex-col items-center">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
              <svg class="h-6 w-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857" />
              </svg>
            </div>
            <h3 class="mt-3 text-sm font-semibold text-gray-700">No assigned students yet</h3>
            <p class="mt-1 text-xs text-gray-400">Students assigned to your company will appear here.</p>
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

const avatarColors = ['bg-primary-500', 'bg-primary-600', 'bg-primary-700']
const statusMap: Record<string, { text: string; class: string }> = {
  assigned: { text: 'Assigned', class: 'rounded-full bg-primary-500/10 text-primary-700' },
  active: { text: 'Active', class: 'rounded-full bg-emerald-500/10 text-emerald-700' },
  completed: { text: 'Completed', class: 'rounded-full bg-gray-500/10 text-gray-700' },
}

interface StudentRow {
  id: number
  name: string
  initials: string
  email: string
  batch: string
  assignedDate: string
  status: string
  avatarColor: string
  statusClass: string
}

const students = ref<StudentRow[]>([])

function initialsFrom(name: string | undefined | null): string {
  const text = name?.trim()
  if (!text) return 'U'
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
  return 'bg-primary-500'
}

function statusClassFor(rawItem: unknown): string {
  const record = rawItem as Record<string, unknown>
  const statusKey = String(record.status ?? 'assigned')
  const matched = statusMap[statusKey] || statusMap['assigned']
  const matchedClass = matched?.class
  return typeof matchedClass === 'string' ? matchedClass : 'rounded-full bg-primary-500/10 text-primary-700'
}

onMounted(async () => {
  try {
    const rawStudents: unknown[] = Array.isArray(await store.fetchStudents()) ? (await store.fetchStudents()) as unknown[] : []
    students.value = rawStudents.map((item) => {
      const record = item as Record<string, unknown>
      return {
        id: Number(record.id ?? 0),
        name: String(record.name ?? record.student_name ?? 'Student'),
        initials: initialsFrom(String(record.name ?? record.student_name ?? '')),
        email: String(record.email ?? record.student_email ?? ''),
        batch: String(record.batch ?? record.program ?? ''),
        assignedDate: String(record.assignedDate ?? record.created_at ?? ''),
        status: String(record.status ?? 'assigned'),
        avatarColor: colorFor(Number(record.id ?? 0)),
        statusClass: statusClassFor(record),
      }
    })
  } catch {
    students.value = []
  }
})
</script>
