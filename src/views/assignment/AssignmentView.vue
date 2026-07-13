<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Assignments</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Manage student internship assignments to companies.</p>
      </div>
      <div class="flex items-center gap-3">
        <select v-model="statusFilter" @change="filterByStatus" class="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
          <option value="">All Statuses</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Terminated">Terminated</option>
        </select>
        <router-link to="/admin/assignments/create" class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-600 active:scale-95">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          New Assignment
        </router-link>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div v-if="store.loading" class="flex items-center justify-center py-16">
        <svg class="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
      <div v-else-if="store.error" class="flex flex-col items-center justify-center py-16 text-center">
        <svg class="h-10 w-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p class="mt-3 text-sm font-semibold text-red-500">{{ store.error }}</p>
      </div>
      <div v-else>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-400">
                <th class="px-5 py-3.5">Student</th>
                <th class="px-5 py-3.5">Company</th>
                <th class="px-5 py-3.5">Tutor</th>
                <th class="px-5 py-3.5">Position</th>
                <th class="px-5 py-3.5">Duration</th>
                <th class="px-5 py-3.5">Status</th>
                <th class="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="a in store.assignments" :key="a.id" class="hover:bg-slate-50/30 transition-colors">
                <td class="whitespace-nowrap px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">{{ getInitials(a.student_name) }}</div>
                    <span class="font-semibold text-slate-900">{{ a.student_name }}</span>
                  </div>
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-slate-500 font-medium">{{ a.company_name }}</td>
                <td class="whitespace-nowrap px-5 py-4 text-slate-500">{{ a.tutor_name }}</td>
                <td class="whitespace-nowrap px-5 py-4 text-slate-500">{{ a.position }}</td>
                <td class="whitespace-nowrap px-5 py-4 text-slate-500 text-xs">{{ formatDate(a.start_date) }} — {{ formatDate(a.end_date) }}</td>
                <td class="whitespace-nowrap px-5 py-4">
                  <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold" :class="statusClass(a.status)">
                    <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(a.status)" />
                    {{ a.status }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-right">
                  <button class="rounded-lg px-2.5 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-all">Edit</button>
                  <button @click="deleteAssignment(a.id)" class="ml-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-all">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="store.assignments.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
          <svg class="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <p class="mt-3 text-sm font-semibold text-slate-400">No assignments created yet.</p>
        </div>
        <div v-if="store.pagination && store.pagination.last_page > 1" class="flex items-center justify-between border-t border-slate-100 px-5 py-3">
          <p class="text-xs text-slate-500">Page {{ store.pagination.current_page }} of {{ store.pagination.last_page }}</p>
          <div class="flex gap-2">
            <button :disabled="store.pagination.current_page <= 1" @click="changePage(store.pagination.current_page - 1)" class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40">Previous</button>
            <button :disabled="store.pagination.current_page >= store.pagination.last_page" @click="changePage(store.pagination.current_page + 1)" class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAssignmentStore } from '@/stores/assignment'

const store = useAssignmentStore()
const statusFilter = ref('')

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(date?: string): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function statusClass(status: string): string {
  switch (status) {
    case 'Assigned': return 'bg-indigo-50 text-indigo-700'
    case 'In Progress': return 'bg-amber-50 text-amber-700'
    case 'Completed': return 'bg-emerald-50 text-emerald-700'
    case 'Terminated': return 'bg-red-50 text-red-700'
    default: return 'bg-slate-50 text-slate-600'
  }
}

function statusDotClass(status: string): string {
  switch (status) {
    case 'Assigned': return 'bg-indigo-500'
    case 'In Progress': return 'bg-amber-500'
    case 'Completed': return 'bg-emerald-500'
    case 'Terminated': return 'bg-red-500'
    default: return 'bg-slate-400'
  }
}

function filterByStatus() {
  store.fetchAssignments({ status: statusFilter.value || undefined })
}

function changePage(page: number) {
  store.fetchAssignments({ page, status: statusFilter.value || undefined })
}

async function deleteAssignment(id: number) {
  if (!confirm('Are you sure you want to delete this assignment?')) return
  try {
    await store.deleteAssignment(id)
  } catch {
    // error handled by store
  }
}

onMounted(() => {
  store.fetchAssignments()
})
</script>
