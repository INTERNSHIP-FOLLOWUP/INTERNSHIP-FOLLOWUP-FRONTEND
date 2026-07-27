<template>
  <div>
    <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div class="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 class="text-xl font-semibold text-gray-900">Internship Information</h1>
          <p class="mt-1 text-sm text-gray-500">View internship details for students assigned to your company.</p>
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-12">
        <svg class="h-6 w-6 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span class="ml-3 text-sm text-gray-500">Loading internship information…</span>
      </div>
      <div
        v-else-if="error"
        class="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3"
      >
        <p class="text-sm text-rose-600">{{ error }}</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm" v-if="internships.length">
          <thead>
            <tr
              class="border-b border-gray-100 text-xs font-medium uppercase tracking-wider text-gray-400"
            >
              <th class="px-4 py-3 font-medium">Student</th>
              <th class="px-4 py-3 font-medium">Tutor</th>
              <th class="px-4 py-3 font-medium">Intern Position</th>
              <th class="px-4 py-3 font-medium">Start Date</th>
              <th class="px-4 py-3 font-medium">End Date</th>
              <th class="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr
              v-for="item in internships"
              :key="item.id"
              class="transition-colors hover:bg-gray-50/50"
            >
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-3">
                  <UserAvatar
                    :avatar="item.studentPhoto"
                    :name="item.studentName"
                    size="sm"
                  />
                  <span class="font-medium text-gray-900">{{ item.studentName }}</span>
                </div>
              </td>
              <td class="px-4 py-3.5 text-gray-600">{{ item.tutorName }}</td>
              <td class="px-4 py-3.5 text-gray-600">{{ item.position }}</td>
              <td class="px-4 py-3.5 text-gray-600 whitespace-nowrap">{{ item.startDate }}</td>
              <td class="px-4 py-3.5 text-gray-600 whitespace-nowrap">{{ item.endDate }}</td>
              <td class="px-4 py-3.5">
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  :class="item.statusClass"
                >
                  {{ item.status }}
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
                  d="M21 13.255A23.893 23.893 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 class="mt-3 text-sm font-semibold text-gray-700">No internship information found</h3>
            <p class="mt-1 text-xs text-gray-400">
              Internship details for students assigned to your company will appear here.
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
import UserAvatar from '@/components/common/UserAvatar.vue'

const store = useCompanyStore()

const statusMap: Record<string, { text: string; class: string }> = {
  'Assigned': { text: 'Assigned', class: 'bg-blue-50 text-blue-700' },
  'In Progress': { text: 'In Progress', class: 'bg-amber-50 text-amber-700' },
  'Completed': { text: 'Completed', class: 'bg-emerald-50 text-emerald-700' },
  'Terminated': { text: 'Terminated', class: 'bg-red-50 text-red-700' },
}

interface InternshipRow {
  id: number
  studentName: string
  studentPhoto?: string | null
  tutorName: string
  position: string
  startDate: string
  endDate: string
  status: string
  statusClass: string
}

const internships = ref<InternshipRow[]>([])
const loading = ref(true)
const error = ref('')

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
    const rawData = await store.fetchStudents()
    internships.value = rawData.map((item) => ({
      id: Number(item?.id ?? 0),
      studentName: String(item?.student_name ?? ''),
      studentPhoto: item?.photo_url || item?.photo || item?.avatar || null,
      tutorName: String(item?.tutor_name ?? ''),
      position: String(item?.position ?? ''),
      startDate: formatDate(item?.start_date),
      endDate: formatDate(item?.end_date),
      status: String(item?.status ?? 'Assigned'),
      statusClass: statusClassFor(item),
    }))
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load internship information.'
    internships.value = []
  } finally {
    loading.value = false
  }
})
</script>
