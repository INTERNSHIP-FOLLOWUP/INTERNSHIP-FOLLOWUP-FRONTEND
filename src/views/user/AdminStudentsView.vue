<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Students</h1>
        <p class="mt-1 text-sm text-slate-500">{{ totalUsers }} registered student{{ totalUsers !== 1 ? 's' : '' }}</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="showImportModal = true"
          class="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-indigo-200 hover:bg-slate-50">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Import Excel
        </button>
        <button @click="exportPdf"
          class="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-indigo-200 hover:bg-slate-50">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Export PDF
        </button>
        <button @click="exportExcel"
          class="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-emerald-200 hover:bg-emerald-50">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Excel
        </button>
        <button @click="showFormModal = true"
          class="flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Student
        </button>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <div class="relative min-w-0 flex-1 basis-[200px]">
        <svg class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="searchQuery" type="text" placeholder="Search students..."
          class="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
      </div>
    </div>

    <div class="rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <div v-if="loading" class="space-y-0 divide-y divide-slate-50">
        <div v-for="n in 3" :key="n" class="flex items-center gap-4 px-6 py-4 animate-pulse">
          <div class="h-8 w-8 rounded-full bg-slate-200" />
          <div class="flex-1 space-y-2">
            <div class="h-3 w-1/3 rounded bg-slate-200" />
            <div class="h-3 w-1/4 rounded bg-slate-100" />
          </div>
          <div class="h-5 w-16 rounded-full bg-slate-200" />
          <div class="flex gap-2">
            <div class="h-8 w-20 rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>

      <div v-else-if="users.length > 0">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th class="px-6 py-3.5 font-medium">First Name</th>
                <th class="px-6 py-3.5 font-medium">Last Name</th>
                <th class="px-6 py-3.5 font-medium">Email</th>
                <th class="px-6 py-3.5 font-medium">Status</th>
                <th class="px-6 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="user in users" :key="user.id" class="transition-colors hover:bg-slate-50/50">
                <td class="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">{{ user.first_name }}</td>
                <td class="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">{{ user.last_name }}</td>
                <td class="whitespace-nowrap px-6 py-4 text-slate-500">{{ user.email }}</td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
                    :class="user.deleted_at ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'">
                    <span class="h-1.5 w-1.5 rounded-full" :class="user.deleted_at ? 'bg-rose-500' : 'bg-emerald-500'" />
                    {{ user.deleted_at ? 'Deactivated' : 'Active' }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right">
                  <router-link :to="`/admin/student-profile/${user.id}`"
                    class="rounded-lg px-3 py-1.5 text-xs font-bold text-indigo-600 transition-all hover:bg-indigo-50">
                    View Profile
                  </router-link>
                  <router-link :to="`/admin/users/${user.id}/edit`"
                    class="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50">
                    Edit
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="pagination && pagination.last_page > 1" class="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-xs font-medium text-slate-500">
            Showing <span class="font-semibold text-slate-700">{{ pagination.from }}</span> – <span class="font-semibold text-slate-700">{{ pagination.to }}</span> of <span class="font-semibold text-slate-700">{{ pagination.total }}</span>
          </p>
          <div class="flex items-center gap-1">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage <= 1"
              class="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-slate-600 transition-all hover:bg-slate-100 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-30">&lsaquo;</button>
            <template v-for="p in visiblePages" :key="p">
              <span v-if="p === '...'" class="px-1 text-xs font-bold text-slate-400">...</span>
              <button v-else @click="goToPage(Number(p))"
                class="flex h-9 min-w-[36px] items-center justify-center rounded-lg px-3 text-xs font-bold transition-all"
                :class="p === currentPage ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'">{{ p }}</button>
            </template>
            <button @click="goToPage(currentPage + 1)" :disabled="currentPage >= (pagination?.last_page || 1)"
              class="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-slate-600 transition-all hover:bg-slate-100 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-30">&rsaquo;</button>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center px-6 py-16 text-center">
        <h3 class="text-base font-bold text-slate-900">No students found</h3>
        <p class="mt-1 text-sm text-slate-500">No registered students yet.</p>
      </div>
    </div>

    <!-- Import Students Modal -->
    <ImportStudentsModal :show="showImportModal" @close="showImportModal = false; fetchUsers()" />

    <!-- Add Student Modal -->
    <transition name="fade">
      <div v-if="showFormModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8" @click.self="closeFormModal">
        <div class="w-[92%] max-w-2xl rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl my-8">
          <StudentForm @saved="onStudentSaved" @cancel="closeFormModal" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useToastStore } from '@/stores/toast'
import { studentService } from '@/services/student'
import api from '@/services/api'
import StudentForm from '@/components/student/StudentForm.vue'
import ImportStudentsModal from '@/components/admin/ImportStudentsModal.vue'

interface Role { id: number; name: string }
interface User { id: number; first_name?: string; last_name?: string; name: string; email: string; role: Role | null; deleted_at: string | null }
interface PaginationMeta { current_page: number; last_page: number; per_page: number; total: number; from: number; to: number }

const users = ref<User[]>([])
const loading = ref(false)
const searchQuery = ref('')
const totalUsers = ref(0)
const currentPage = ref(1)
const pagination = ref<PaginationMeta | null>(null)
const showImportModal = ref(false)
const showFormModal = ref(false)
const toast = useToastStore()

const visiblePages = computed(() => {
  const total = pagination.value?.last_page || 1
  const current = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | string)[] = []
  if (current > 3) pages.push(1, '...')
  const start = Math.max(1, current - 1)
  const end = Math.min(total, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < total - 2) pages.push('...', total)
  return pages
})

function closeFormModal() {
  showFormModal.value = false
}

function onStudentSaved() {
  closeFormModal()
  fetchUsers()
  toast.success('Student created successfully.')
}

function goToPage(page: number) {
  if (page < 1 || (pagination.value && page > pagination.value.last_page)) return
  currentPage.value = page
  fetchUsers()
}

async function exportPdf() {
  try {
    const blob = await studentService.exportPdf()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `students-${new Date().toISOString().slice(0, 10)}.pdf`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('PDF exported successfully.')
  } catch {
    toast.error('Failed to export PDF.')
  }
}

async function exportExcel() {
  try {
    const blob = await studentService.exportExcel()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `students-${new Date().toISOString().slice(0, 10)}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Excel exported successfully.')
  } catch {
    toast.error('Failed to export Excel.')
  }
}

async function fetchUsers() {
  loading.value = true
  try {
    const params: Record<string, string | number> = { role: 'student', per_page: 10, page: currentPage.value }
    if (searchQuery.value) params.search = searchQuery.value
    const res = await api.get('/admin/users', { params })
    users.value = res.data.data ?? []
    pagination.value = res.data.meta ?? null
    totalUsers.value = res.data.meta?.total ?? 0
  } catch { /* ignore */ }
  finally { loading.value = false }
}

let timeout: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, () => {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => { currentPage.value = 1; fetchUsers() }, 300)
})

onMounted(fetchUsers)
</script>
