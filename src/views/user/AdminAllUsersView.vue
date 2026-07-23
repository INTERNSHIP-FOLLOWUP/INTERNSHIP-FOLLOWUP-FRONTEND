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
        <button @click="exportUsers"
          class="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-emerald-200 hover:bg-emerald-50">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Excel
        </button>
        <button @click="selectMode ? clearSelection() : enterSelectMode()"
          class="flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-all"
          :class="selectMode
            ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-rose-200 hover:bg-rose-50'">
          <svg v-if="selectMode" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {{ selectMode ? 'Cancel' : 'Select All' }}
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
      <!-- Loading skeleton -->
      <div v-if="loading && users.length === 0">
        <div class="space-y-0 divide-y divide-slate-50">
          <div v-for="n in 5" :key="n" class="flex items-center gap-4 px-6 py-4 animate-pulse">
            <div class="h-4 w-4 rounded bg-slate-200" />
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
                <th v-if="selectMode" class="px-4 py-3.5 w-10">
                  <input type="checkbox" :checked="isAllSelected" :indeterminate="isIndeterminate"
                    @change="toggleSelectAll"
                    class="h-4 w-4 rounded border-slate-300 text-rose-600 cursor-pointer accent-rose-600" />
                </th>
                <th class="px-6 py-3.5 font-medium">User</th>
                <th class="px-6 py-3.5 font-medium">Email</th>
                <th class="px-6 py-3.5 font-medium">Role</th>
                <th class="px-6 py-3.5 font-medium">Status</th>
                <th class="px-6 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="user in users" :key="user.id"
                class="transition-colors hover:bg-slate-50/50"
                :class="{ 'bg-rose-50/40': selectedIds.has(user.id) }">
                <td v-if="selectMode" class="px-4 py-4 w-10">
                  <input type="checkbox" :checked="selectedIds.has(user.id)"
                    @change="toggleSelect(user.id)"
                    class="h-4 w-4 rounded border-slate-300 text-rose-600 cursor-pointer accent-rose-600" />
                </td>
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
                    <button @click="deleteUser(user)" class="rounded-lg px-3 py-1.5 text-xs font-bold text-rose-600 transition-all hover:bg-rose-50 hover:text-rose-800">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
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

    <!-- ── Floating Bulk Action Bar ── -->
    <transition name="slide-up">
      <div v-if="selectedIds.size > 0"
        class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        <div class="flex items-center gap-3 rounded-2xl border border-rose-200 bg-white px-5 py-3 shadow-2xl shadow-rose-100 ring-1 ring-rose-100">
          <!-- Count badge -->
          <span class="flex h-7 min-w-[28px] items-center justify-center rounded-full bg-rose-600 px-2 text-xs font-bold text-white">
            {{ selectedIds.size }}
          </span>
          <span class="text-sm font-semibold text-slate-700">
            user{{ selectedIds.size !== 1 ? 's' : '' }} selected
          </span>
          <div class="mx-1 h-5 w-px bg-slate-200" />
          <button @click="bulkDelete"
            :disabled="bulkDeleting"
            class="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-rose-700 disabled:opacity-60 active:scale-95">
            <svg v-if="bulkDeleting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {{ bulkDeleting ? 'Deleting...' : 'Delete Selected' }}
          </button>
          <button @click="clearSelection"
            class="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-95">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
        </div>
      </div>
    </transition>

    <!-- ── Bulk Confirm Modal ── -->
    <transition name="fade">
      <div v-if="showBulkConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="showBulkConfirm = false">
        <div class="w-[92%] max-w-md rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50">
              <svg class="h-5 w-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-semibold text-slate-900">Delete {{ selectedIds.size }} User{{ selectedIds.size !== 1 ? 's' : '' }}</h3>
              <p class="mt-0.5 text-sm text-slate-500">
                This action is permanent and cannot be undone.
              </p>
            </div>
          </div>
          <div v-if="bulkError" class="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{{ bulkError }}</div>
          <div class="mt-5 flex items-center justify-end gap-3">
            <button @click="showBulkConfirm = false" :disabled="bulkDeleting"
              class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
              Cancel
            </button>
            <button @click="confirmBulkDelete" :disabled="bulkDeleting"
              class="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:opacity-60">
              <svg v-if="bulkDeleting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {{ bulkDeleting ? 'Deleting...' : `Delete ${selectedIds.size}` }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <ImportUsersModal :show="showImportModal" @close="showImportModal = false; fetchUsers()" />

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
const showImportModal = ref(false)
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmButtonText = ref('Confirm')
type ActionType = 'delete' | 'deactivate' | 'activate'
const pendingAction = ref<{ type: ActionType; user: User } | null>(null)

// ── Bulk select state ──
const selectMode = ref(false)
const selectedIds = ref<Set<number>>(new Set())
const showBulkConfirm = ref(false)
const bulkDeleting = ref(false)
const bulkError = ref('')

function enterSelectMode() {
  selectMode.value = true
}

const isAllSelected = computed(() =>
  users.value.length > 0 && users.value.every(u => selectedIds.value.has(u.id))
)
const isIndeterminate = computed(() =>
  users.value.some(u => selectedIds.value.has(u.id)) && !isAllSelected.value
)

function toggleSelect(id: number) {
  const next = new Set(selectedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selectedIds.value = next
}

function toggleSelectAll() {
  if (isAllSelected.value) {
    const next = new Set(selectedIds.value)
    users.value.forEach(u => next.delete(u.id))
    selectedIds.value = next
  } else {
    const next = new Set(selectedIds.value)
    users.value.forEach(u => next.add(u.id))
    selectedIds.value = next
  }
}

function clearSelection() {
  selectedIds.value = new Set()
  selectMode.value = false
}

function bulkDelete() {
  bulkError.value = ''
  showBulkConfirm.value = true
}

async function confirmBulkDelete() {
  bulkDeleting.value = true
  bulkError.value = ''
  try {
    const ids = Array.from(selectedIds.value)
    await api.post('/admin/users/bulk-delete', { ids })
    toast.success(`Deleted ${ids.length} user${ids.length !== 1 ? 's' : ''} successfully.`)
    showBulkConfirm.value = false
    clearSelection()
    fetchUsers()
  } catch (err: unknown) {
    bulkError.value = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Bulk delete failed.'
  } finally {
    bulkDeleting.value = false
  }
}

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
    }
    pendingAction.value = null
    fetchUsers()
  })
}

function deleteUser(user: User) { confirmAction('delete', user) }
function deactivateUser(user: User) { confirmAction('deactivate', user) }
function activateUser(user: User) { confirmAction('activate', user) }

async function exportUsers() {
  try {
    const res = await api.get('/admin/users/export/excel', { responseType: 'blob' })
    const url = window.URL.createObjectURL(res.data)
    const a = document.createElement('a')
    a.href = url
    a.download = `users-${new Date().toISOString().slice(0, 10)}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Users exported successfully.')
  } catch {
    toast.error('Failed to export users.')
  }
}

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

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active { transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
.slide-up-leave-active { transition: all 0.2s ease-in; }
.slide-up-enter-from  { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.95); }
.slide-up-leave-to    { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.95); }
</style>
