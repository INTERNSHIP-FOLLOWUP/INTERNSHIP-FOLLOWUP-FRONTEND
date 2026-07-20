<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">All Users</h1>
        <p class="mt-1 text-sm text-slate-500">
          {{ totalUsers }} registered user{{ totalUsers !== 1 ? 's' : '' }} across all roles
        </p>
      </div>
      <div class="flex gap-2">
        <button @click="showImportModal = true"
          class="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-indigo-200">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Import Excel
        </button>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <div class="relative min-w-0 flex-1 basis-[200px]">
        <svg class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="searchQuery" type="text" placeholder="Search by name or email..."
          class="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
      </div>
      <select v-model="roleFilter"
        class="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100">
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="tutor">Tutor</option>
        <option value="student">Student</option>
        <option value="company">Company</option>
      </select>
      <select v-model="statusFilter"
        class="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="deactivated">Deactivated</option>
      </select>
      <button v-if="searchQuery || roleFilter || statusFilter" @click="clearFilters"
        class="flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700">
        Clear
      </button>
    </div>

    <div v-if="error" role="alert"
      class="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
      <span class="flex-1">{{ error }}</span>
      <button @click="error = ''" class="rounded-lg p-1.5 transition-colors hover:bg-rose-100">&times;</button>
    </div>

    <div class="rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <div v-if="loading && users.length === 0">
        <div class="space-y-0 divide-y divide-slate-50">
          <div v-for="n in 5" :key="n" class="flex items-center gap-4 px-6 py-4 animate-pulse">
            <div class="h-8 w-8 rounded-full bg-slate-200" />
            <div class="flex-1 space-y-2">
              <div class="h-3 w-1/3 rounded bg-slate-200" />
              <div class="h-3 w-1/4 rounded bg-slate-100" />
            </div>
            <div class="h-5 w-16 rounded-full bg-slate-200" />
            <div class="flex gap-2">
              <div class="h-8 w-12 rounded-lg bg-slate-200" />
              <div class="h-8 w-14 rounded-lg bg-slate-200" />
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="users.length > 0">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th class="px-6 py-3.5 font-medium">User</th>
                <th class="px-6 py-3.5 font-medium">Email</th>
                <th class="px-6 py-3.5 font-medium">Role</th>
                <th class="px-6 py-3.5 font-medium">Status</th>
                <th class="px-6 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="user in users" :key="user.id" class="transition-colors hover:bg-slate-50/50">
                <td class="whitespace-nowrap px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold" :class="roleAvatarClass(user.role?.name)">
                      {{ getInitials(user.name) }}
                    </div>
                    <span class="font-semibold text-slate-900">{{ user.name }}</span>
                  </div>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{{ user.email }}</td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold" :class="roleBadgeClass(user.role?.name)">
                    <span class="h-1.5 w-1.5 rounded-full" :class="roleDotClass(user.role?.name)" />
                    {{ formatRole(user.role?.name) }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold" :class="user.deleted_at ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'">
                    <span class="h-1.5 w-1.5 rounded-full" :class="user.deleted_at ? 'bg-rose-500' : 'bg-emerald-500'" />
                    {{ user.deleted_at ? 'Deactivated' : 'Active' }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <router-link :to="`/admin/users/${user.id}/edit`" class="rounded-lg px-3 py-1.5 text-xs font-bold text-indigo-600 transition-all hover:bg-indigo-50 hover:text-indigo-800">
                      Edit
                    </router-link>
                    <button v-if="user.deleted_at" @click="activateUser(user)" class="rounded-lg px-3 py-1.5 text-xs font-bold text-emerald-600 transition-all hover:bg-emerald-50 hover:text-emerald-800">
                      Activate
                    </button>
                    <button v-else @click="deactivateUser(user)" class="rounded-lg px-3 py-1.5 text-xs font-bold text-amber-600 transition-all hover:bg-amber-50 hover:text-amber-800">
                      Deactivate
                    </button>
                    <button @click="resetPassword(user)" class="rounded-lg px-3 py-1.5 text-xs font-bold text-blue-600 transition-all hover:bg-blue-50 hover:text-blue-800">
                      Reset Pwd
                    </button>
                    <button @click="deleteUser(user)" class="rounded-lg px-3 py-1.5 text-xs font-bold text-rose-600 transition-all hover:bg-rose-50 hover:text-rose-800">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="pagination && pagination.last_page > 1" class="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-xs font-medium text-slate-500">
            Showing <span class="font-semibold text-slate-700">{{ pagination.from }}</span> – <span class="font-semibold text-slate-700">{{ pagination.to }}</span> of <span class="font-semibold text-slate-700">{{ pagination.total }}</span> user{{ pagination.total !== 1 ? 's' : '' }}
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

      <div v-else-if="!loading" class="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <svg class="h-8 w-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
        <h3 class="mt-5 text-base font-bold text-slate-900">No users found</h3>
        <p class="mt-1.5 text-sm text-slate-500 max-w-sm">
          {{ searchQuery || roleFilter || statusFilter ? 'Try adjusting your filters.' : 'No registered users yet.' }}
        </p>
      </div>
    </div>

    <ConfirmDialog
      :show="confirmShow"
      :title="confirmTitle"
      :message="confirmMessage"
      :confirm-text="confirmButtonText"
      cancel-text="Cancel"
      :loading="confirmLoading"
      :error="confirmError"
      @confirm="handleConfirmAction"
      @cancel="confirmCancel"
    />

    <ImportUsersModal :show="showImportModal" @close="showImportModal = false; fetchUsers()" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import api from '@/services/api'
import { useToastStore } from '@/stores/toast'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import ImportUsersModal from '@/components/admin/ImportUsersModal.vue'

const toast = useToastStore()
const { show: confirmShow, loading: confirmLoading, error: confirmError, open: confirmOpen, cancel: confirmCancel, confirmAsync: confirmAsyncFn } = useConfirmDialog()

interface Role { id: number; name: string }
interface User {
  id: number; name: string; email: string
  role: Role | null; deleted_at: string | null
  first_name?: string; last_name?: string
  students_count?: number
}
interface PaginationMeta {
  current_page: number; last_page: number; per_page: number
  total: number; from: number; to: number
}
interface RoleCounts { admin: number; tutor: number; student: number; company: number }

const users = ref<User[]>([])
const loading = ref(false)
const error = ref('')
const pagination = ref<PaginationMeta | null>(null)
const roleStats = ref<RoleCounts>({ admin: 0, tutor: 0, student: 0, company: 0 })
const currentPage = ref(1)
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const showImportModal = ref(false)

const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmButtonText = ref('Confirm')
type ActionType = 'delete' | 'deactivate' | 'activate' | 'reset-password'
const pendingAction = ref<{ type: ActionType; user: User } | null>(null)

const totalUsers = computed(() => {
  if (pagination.value) return pagination.value.total
  return roleStats.value.admin + roleStats.value.tutor + roleStats.value.student + roleStats.value.company
})

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

async function fetchUsers(): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    const params: Record<string, string | number> = { page: currentPage.value, per_page: 15 }
    if (searchQuery.value) params.search = searchQuery.value
    if (roleFilter.value) params.role = roleFilter.value
    if (statusFilter.value) params.status = statusFilter.value
    const res = await api.get('/admin/users', { params })
    const body = res.data
    users.value = body.data ?? []
    pagination.value = body.meta ?? null
    if (body.counts) roleStats.value = body.counts
  } catch (err: unknown) {
    error.value = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load users.'
  } finally {
    loading.value = false
  }
}

function goToPage(page: number): void {
  if (page < 1 || (pagination.value && page > pagination.value.last_page)) return
  currentPage.value = page
  fetchUsers()
}

function clearFilters(): void {
  searchQuery.value = ''
  roleFilter.value = ''
  statusFilter.value = ''
  currentPage.value = 1
  fetchUsers()
}

async function confirmAction(type: ActionType, user: User) {
  pendingAction.value = { type, user }
  if (type === 'delete') {
    confirmTitle.value = 'Delete User'
    confirmMessage.value = `Are you sure you want to permanently delete ${user.name}?`
    confirmButtonText.value = 'Delete'
  } else if (type === 'deactivate') {
    confirmTitle.value = 'Deactivate User'
    confirmMessage.value = `Are you sure you want to deactivate ${user.name}?`
    confirmButtonText.value = 'Deactivate'
  } else if (type === 'activate') {
    confirmTitle.value = 'Activate User'
    confirmMessage.value = `Activate ${user.name}?`
    confirmButtonText.value = 'Activate'
  } else if (type === 'reset-password') {
    confirmTitle.value = 'Reset Password'
    confirmMessage.value = `Reset password for ${user.name} to a new password?`
    confirmButtonText.value = 'Reset'
  }
  const confirmed = await confirmOpen({ title: confirmTitle.value, message: confirmMessage.value })
  if (!confirmed) return
  await handleConfirmAction()
}

async function handleConfirmAction() {
  if (!pendingAction.value) return
  const { type, user } = pendingAction.value
  await confirmAsyncFn(async () => {
    if (type === 'delete') {
      await api.delete(`/admin/users/${user.id}`)
      toast.success(`User "${user.name}" deleted.`)
    } else if (type === 'deactivate') {
      await api.put(`/admin/users/${user.id}/deactivate`)
      toast.success(`User "${user.name}" deactivated.`)
    } else if (type === 'activate') {
      await api.put(`/admin/users/${user.id}/activate`)
      toast.success(`User "${user.name}" activated.`)
    } else if (type === 'reset-password') {
      await api.post(`/admin/users/${user.id}/reset-password`, { password: 'newpassword123' })
      toast.success(`Password reset for "${user.name}". New password: newpassword123`)
    }
    pendingAction.value = null
    fetchUsers()
  })
}

function deleteUser(user: User) { confirmAction('delete', user) }
function deactivateUser(user: User) { confirmAction('deactivate', user) }
function activateUser(user: User) { confirmAction('activate', user) }
function resetPassword(user: User) { confirmAction('reset-password', user) }

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
function formatRole(role?: string): string {
  if (!role) return '—'
  return role.charAt(0).toUpperCase() + role.slice(1)
}
function roleAvatarClass(role?: string): string {
  switch (role) {
    case 'admin':   return 'bg-purple-100 text-purple-700'
    case 'tutor':   return 'bg-blue-100 text-blue-700'
    case 'student': return 'bg-emerald-100 text-emerald-700'
    case 'company': return 'bg-amber-100 text-amber-700'
    default:        return 'bg-slate-100 text-slate-600'
  }
}
function roleBadgeClass(role?: string): string {
  switch (role) {
    case 'admin':   return 'bg-purple-50 text-purple-700'
    case 'tutor':   return 'bg-blue-50 text-blue-700'
    case 'student': return 'bg-emerald-50 text-emerald-700'
    case 'company': return 'bg-amber-50 text-amber-700'
    default:        return 'bg-slate-50 text-slate-600'
  }
}
function roleDotClass(role?: string): string {
  switch (role) {
    case 'admin':   return 'bg-purple-500'
    case 'tutor':   return 'bg-blue-500'
    case 'student': return 'bg-emerald-500'
    case 'company': return 'bg-amber-500'
    default:        return 'bg-slate-400'
  }
}

let searchTimeout: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { currentPage.value = 1; fetchUsers() }, 350)
})
watch(roleFilter, () => { currentPage.value = 1; fetchUsers() })
watch(statusFilter, () => { currentPage.value = 1; fetchUsers() })

onMounted(() => { fetchUsers() })
</script>
