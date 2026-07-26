<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Supervisors</h1>
        <p class="mt-1 text-sm text-slate-500">
          {{ totalSupervisors }} registered supervisor{{ totalSupervisors !== 1 ? 's' : '' }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="openCreateModal"
          class="flex h-10 items-center gap-2 rounded-xl bg-primary-600 px-4 text-sm font-semibold text-white shadow-md shadow-primary-200 transition-all hover:bg-primary-700">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Supervisor
        </button>
        <button @click="refresh"
          class="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-primary-200 hover:bg-primary-50">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-3">
      <div class="relative min-w-0 flex-1 basis-[200px]">
        <svg class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="searchQuery" type="text" placeholder="Search supervisors..."
          class="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100" />
      </div>
      <select v-model="companyFilter"
        class="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100">
        <option value="">All Companies</option>
        <option v-for="c in companies" :key="c.id" :value="c.id">
          {{ c.company_name || c.name }}
        </option>
      </select>
    </div>

    <!-- Error -->
    <div v-if="error" role="alert"
      class="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
      <span class="flex-1">{{ error }}</span>
      <button @click="error = ''" class="rounded-lg p-1.5 transition-colors hover:bg-rose-100">&times;</button>
    </div>

    <!-- Table -->
    <div class="rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <!-- Loading skeleton -->
      <div v-if="loading" class="space-y-0 divide-y divide-slate-50">
        <div v-for="n in 3" :key="n" class="flex items-center gap-4 px-6 py-4 animate-pulse">
          <div class="h-8 w-8 rounded-full bg-slate-200" />
          <div class="flex-1 space-y-2">
            <div class="h-3 w-1/3 rounded bg-slate-200" />
            <div class="h-3 w-1/4 rounded bg-slate-100" />
          </div>
          <div class="h-5 w-24 rounded-full bg-slate-200" />
          <div class="flex gap-2">
            <div class="h-8 w-14 rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>

      <div v-else-if="filteredSupervisors.length > 0">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th class="px-6 py-3.5 font-medium">Name</th>
                <th class="px-6 py-3.5 font-medium">Email</th>
                <th class="px-6 py-3.5 font-medium">Phone</th>
                <th class="px-6 py-3.5 font-medium">Company</th>
                <th class="px-6 py-3.5 font-medium">Status</th>
                <th class="px-6 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="supervisor in filteredSupervisors" :key="supervisor.id"
                class="transition-colors hover:bg-slate-50/50">
                <td class="whitespace-nowrap px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                      {{ getInitials(supervisor.name || supervisor.first_name + ' ' + supervisor.last_name) }}
                    </div>
                    <span class="font-semibold text-slate-900">{{ supervisor.name || supervisor.first_name + ' ' + supervisor.last_name }}</span>
                  </div>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-slate-500 max-w-[200px] truncate">{{ supervisor.email }}</td>
                <td class="whitespace-nowrap px-6 py-4 text-slate-500">{{ supervisor.phone || '—' }}</td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                    {{ supervisor.supervisor_profile?.company?.company_name || supervisor.company_name || '—' }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
                    :class="supervisor.deleted_at ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'">
                    <span class="h-1.5 w-1.5 rounded-full" :class="supervisor.deleted_at ? 'bg-rose-500' : 'bg-emerald-500'" />
                    {{ supervisor.deleted_at ? 'Deactivated' : 'Active' }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <button type="button" @click="editSupervisor(supervisor)" title="Edit Supervisor"
                      class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900">
                      <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button type="button" @click="deleteSupervisor(supervisor)" title="Delete Supervisor"
                      class="flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 transition-all hover:bg-rose-50 hover:text-rose-700">
                      <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
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
            Showing <span class="font-semibold text-slate-700">{{ pagination.from }}</span> – <span class="font-semibold text-slate-700">{{ pagination.to }}</span> of <span class="font-semibold text-slate-700">{{ pagination.total }}</span>
          </p>
          <div class="flex items-center gap-1">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage <= 1"
              class="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-slate-600 transition-all hover:bg-slate-100 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-30">&lsaquo;</button>
            <template v-for="p in visiblePages" :key="p">
              <span v-if="p === '...'" class="px-1 text-xs font-bold text-slate-400">...</span>
              <button v-else @click="goToPage(Number(p))"
                class="flex h-9 min-w-[36px] items-center justify-center rounded-lg px-3 text-xs font-bold transition-all"
                :class="p === currentPage ? 'bg-primary-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-primary-600'">{{ p }}</button>
            </template>
            <button @click="goToPage(currentPage + 1)" :disabled="currentPage >= (pagination?.last_page || 1)"
              class="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-slate-600 transition-all hover:bg-slate-100 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-30">&rsaquo;</button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
          <svg class="h-7 w-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="mt-4 text-base font-bold text-slate-900">No supervisors found</h3>
        <p class="mt-1 text-sm text-slate-500">
          {{ searchQuery || companyFilter ? 'Try adjusting your filters.' : 'No supervisors have been added yet.' }}
        </p>
      </div>
    </div>

    <!-- Add/Edit Supervisor Modal -->
    <transition name="fade">
      <div v-if="showFormModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8" @click.self="closeFormModal">
        <div class="w-[92%] max-w-2xl rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl my-8">
          <SupervisorForm
            :supervisor-id="editingSupervisorId"
            :initial-company-id="creatingCompanyId"
            @saved="onSupervisorSaved"
            @cancel="closeFormModal"
          />
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation Dialog -->
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
import SupervisorForm from '@/components/supervisor/SupervisorForm.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

interface Company {
  id: number
  company_name: string
  name?: string
}

interface SupervisorProfile {
  company?: Company
}

interface Supervisor {
  id: number
  first_name: string
  last_name: string
  name: string
  email: string
  phone: string | null
  role?: { id: number; name: string }
  supervisor_profile?: SupervisorProfile
  company_name?: string
  deleted_at: string | null
}

interface PaginationMeta { current_page: number; last_page: number; per_page: number; total: number; from: number; to: number }

const toast = useToastStore()
const { show: confirmShow, loading: confirmLoading, error: confirmError, open: confirmOpen, cancel: confirmCancel, confirmAsync: confirmAsyncFn } = useConfirmDialog()

const supervisors = ref<Supervisor[]>([])
const companies = ref<Company[]>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const companyFilter = ref('')
const currentPage = ref(1)
const pagination = ref<PaginationMeta | null>(null)
const totalSupervisors = ref(0)
const showFormModal = ref(false)
const editingSupervisorId = ref<number | undefined>(undefined)
const creatingCompanyId = ref<number | undefined>(undefined)
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmButtonText = ref('Confirm')
type ActionType = 'delete'
const pendingAction = ref<{ type: ActionType; supervisor: Supervisor } | null>(null)

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

const filteredSupervisors = computed(() => {
  let list = supervisors.value

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter((s) =>
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q)
    )
  }

  if (companyFilter.value) {
    const companyId = Number(companyFilter.value)
    list = list.filter((s) => {
      const sid = s.supervisor_profile?.company?.id
      return sid === companyId
    })
  }

  return list
})

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function openCreateModal() {
  editingSupervisorId.value = undefined
  creatingCompanyId.value = undefined
  showFormModal.value = true
}

function editSupervisor(supervisor: Supervisor) {
  editingSupervisorId.value = supervisor.id
  creatingCompanyId.value = undefined
  showFormModal.value = true
}

function closeFormModal() {
  showFormModal.value = false
  editingSupervisorId.value = undefined
  creatingCompanyId.value = undefined
}

function onSupervisorSaved() {
  closeFormModal()
  fetchSupervisors()
  toast.success('Supervisor saved successfully.')
}

async function confirmAction(type: ActionType, supervisor: Supervisor) {
  pendingAction.value = { type, supervisor }
  if (type === 'delete') {
    confirmTitle.value = 'Delete Supervisor'
    confirmMessage.value = `Are you sure you want to permanently delete ${supervisor.name}?`
    confirmButtonText.value = 'Delete'
  }
  const confirmed = await confirmOpen({ title: confirmTitle.value, message: confirmMessage.value })
  if (!confirmed) return
  await handleConfirmAction()
}

async function handleConfirmAction() {
  if (!pendingAction.value) return
  const { type, supervisor } = pendingAction.value
  await confirmAsyncFn(async () => {
    if (type === 'delete') {
      await api.delete(`/admin/users/${supervisor.id}`)
      toast.success(`Supervisor "${supervisor.name}" deleted.`)
    }
    pendingAction.value = null
    fetchSupervisors()
  })
}

function deleteSupervisor(supervisor: Supervisor) { confirmAction('delete', supervisor) }

function goToPage(page: number) {
  if (page < 1 || (pagination.value && page > pagination.value.last_page)) return
  currentPage.value = page
  fetchSupervisors()
}

function refresh() {
  currentPage.value = 1
  fetchSupervisors()
}

async function fetchSupervisors() {
  loading.value = true
  error.value = ''
  try {
    const params: Record<string, string | number> = { role: 'supervisor', per_page: 15, page: currentPage.value }
    if (searchQuery.value) params.search = searchQuery.value
    const res = await api.get('/admin/users', { params })
    supervisors.value = res.data.data ?? []
    pagination.value = res.data.meta ?? null
    totalSupervisors.value = res.data.counts?.supervisor ?? res.data.meta?.total ?? 0
  } catch (err: unknown) {
    error.value = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load supervisors.'
  } finally {
    loading.value = false
  }
}

let timeout: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, () => {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => { currentPage.value = 1; fetchSupervisors() }, 300)
})

onMounted(async () => {
  // Fetch companies for filter dropdown
  try {
    const res = await api.get('/admin/companies', { params: { per_page: 200 } })
    companies.value = res.data.data ?? res.data ?? []
  } catch {
    companies.value = []
  }
  fetchSupervisors()
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
