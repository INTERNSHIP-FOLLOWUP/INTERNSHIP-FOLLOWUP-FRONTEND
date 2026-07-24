<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">All Users</h1>
        <p class="mt-1 text-sm text-slate-500">View all registered users across every role.</p>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <div class="relative min-w-0 flex-1 basis-[200px]">
        <svg
          class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name or email..."
          class="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>

      <select
        v-model="roleFilter"
        class="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 transition-colors focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
      >
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="tutor">Tutor</option>
        <option value="student">Student</option>
        <option value="supervisor">Supervisor</option>
      </select>

      <button
        v-if="searchQuery || roleFilter"
        @click="clearFilters"
        class="flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
      >
        Clear
      </button>
    </div>

    <div
      v-if="error"
      class="flex items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
    >
      <span>{{ error }}</span>
      <button
        @click="error = ''"
        class="ml-auto rounded-md p-1 transition-colors hover:bg-rose-100"
      >
        &times;
      </button>
    </div>

    <div class="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <div v-if="loading && users.length === 0" class="px-6 py-16 text-center">
        <p class="text-sm font-medium text-slate-500">Loading users...</p>
      </div>

      <div v-else-if="users.length > 0" class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr
              class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              <th class="px-6 py-3.5 font-medium">User</th>
              <th class="px-6 py-3.5 font-medium">Email</th>
              <th class="px-6 py-3.5 font-medium">Role</th>
              <th class="px-6 py-3.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="user in users" :key="user.id" class="transition-colors hover:bg-slate-50/50">
              <td class="whitespace-nowrap px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                    :class="roleColor(user.role?.name)"
                  >
                    {{ getInitials(user.name) }}
                  </div>
                  <span class="font-semibold text-slate-900">{{ user.name }}</span>
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4 font-medium text-slate-500">
                {{ user.email }}
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span
                  class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold"
                  :class="roleBadgeClass(user.role?.name)"
                >
                  {{ formatRole(user.role?.name) }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                {{ user.deleted_at ? 'Deleted' : 'Active' }}
              </td>
            </tr>
            <tr v-if="users.length === 0 && !loading">
              <td colspan="4" class="px-6 py-12 text-center text-sm text-slate-400">
                No users found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="pagination && pagination.last_page > 1"
        class="flex items-center justify-between border-t border-slate-100 px-6 py-3"
      >
        <p class="text-xs font-medium text-slate-500">
          Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} users
        </p>
        <div class="flex items-center gap-1.5">
          <button
            @click="goToPage(pagination.current_page - 1)"
            :disabled="pagination.current_page <= 1"
            class="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
          >
            &lsaquo;
          </button>
          <span class="px-2 text-xs text-slate-500"
            >Page {{ pagination.current_page }} of {{ pagination.last_page }}</span
          >
          <button
            @click="goToPage(pagination.current_page + 1)"
            :disabled="pagination.current_page >= pagination.last_page"
            class="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
          >
            &rsaquo;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import api from '@/services/api'

interface Role {
  id: number
  name: string
}

interface User {
  id: number
  name: string
  email: string
  role: Role | null
  deleted_at: string | null
  students_count?: number
}

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

const users = ref<User[]>([])
const loading = ref(false)
const error = ref('')
const pagination = ref<PaginationMeta | null>(null)
const searchQuery = ref('')
const roleFilter = ref('')

let searchTimeout: ReturnType<typeof setTimeout> | null = null

async function fetchUsers(): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    const params: Record<string, string | number> = { per_page: 20 }
    if (searchQuery.value) params.search = searchQuery.value
    if (roleFilter.value) params.role = roleFilter.value
    const res = await api.get('/admin/users', { params })
    const data = res.data
    users.value = data.data ?? data
    if (data.meta) pagination.value = data.meta
    else pagination.value = null
  } catch (err: unknown) {
    const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
    error.value = msg || 'Failed to load users.'
  } finally {
    loading.value = false
  }
}

function goToPage(page: number): void {
  if (page < 1 || (pagination.value && page > pagination.value.last_page)) return
  fetchUsers()
}

function clearFilters(): void {
  searchQuery.value = ''
  roleFilter.value = ''
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatRole(role?: string): string {
  if (!role) return '—'
  return role.charAt(0).toUpperCase() + role.slice(1)
}

function roleColor(role?: string): string {
  switch (role) {
    case 'admin':
      return 'bg-purple-50 text-purple-600'
    case 'tutor':
      return 'bg-blue-50 text-blue-600'
    case 'student':
      return 'bg-emerald-50 text-emerald-600'
    case 'supervisor':
      return 'bg-amber-50 text-amber-600'
    default:
      return 'bg-slate-50 text-slate-600'
  }
}

function roleBadgeClass(role?: string): string {
  switch (role) {
    case 'admin':
      return 'bg-purple-100 text-purple-700'
    case 'tutor':
      return 'bg-blue-100 text-blue-700'
    case 'student':
      return 'bg-emerald-100 text-emerald-700'
    case 'supervisor':
      return 'bg-amber-100 text-amber-700'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchUsers()
  }, 300)
})

watch(roleFilter, () => {
  fetchUsers()
})

onMounted(() => {
  fetchUsers()
})
</script>
