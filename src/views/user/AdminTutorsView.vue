<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Tutors</h1>
        <p class="mt-1 text-sm text-slate-500">{{ totalUsers }} registered tutor{{ totalUsers !== 1 ? 's' : '' }}</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="selectMode ? clearSelection() : enterSelectMode()"
          class="flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-all"
          :class="selectMode
            ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-indigo-200 hover:bg-indigo-50'">
          <svg v-if="selectMode" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {{ selectMode ? 'Cancel' : 'Select All' }}
        </button>
        <router-link to="/admin/users/create"
          class="flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Tutor
        </router-link>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <div class="relative min-w-0 flex-1 basis-[200px]">
        <svg class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="searchQuery" type="text" placeholder="Search tutors..."
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
                <th v-if="selectMode" class="px-4 py-3.5 w-10">
                  <input type="checkbox" :checked="isAllSelected" :indeterminate="isIndeterminate"
                    @change="toggleSelectAll"
                    class="h-4 w-4 rounded border-slate-300 cursor-pointer accent-rose-600" />
                </th>
                <th class="px-6 py-3.5 font-medium">First Name</th>
                <th class="px-6 py-3.5 font-medium">Last Name</th>
                <th class="px-6 py-3.5 font-medium">Email</th>
                <th class="px-6 py-3.5 font-medium">Students</th>
                <th class="px-6 py-3.5 font-medium">Status</th>
                <th class="px-6 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <template v-for="user in users" :key="user.id">
                <tr @click="toggleTutor(user.id)" class="cursor-pointer transition-colors hover:bg-slate-50/50"
                  :class="{ 'bg-rose-50/40': selectedIds.has(user.id) }">
                  <td v-if="selectMode" class="px-4 py-4 w-10" @click.stop>
                    <input type="checkbox" :checked="selectedIds.has(user.id)"
                      @change="toggleSelect(user.id)"
                      class="h-4 w-4 rounded border-slate-300 cursor-pointer accent-rose-600" />
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">{{ user.first_name }}</td>
                  <td class="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">{{ user.last_name }}</td>
                  <td class="whitespace-nowrap px-6 py-4 text-slate-500">{{ user.email }}</td>
                  <td class="whitespace-nowrap px-6 py-4 text-slate-500">{{ user.students_count ?? '—' }}</td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
                      :class="user.deleted_at ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'">
                      <span class="h-1.5 w-1.5 rounded-full" :class="user.deleted_at ? 'bg-rose-500' : 'bg-emerald-500'" />
                      {{ user.deleted_at ? 'Deactivated' : 'Active' }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-right" @click.stop>
                    <div class="flex items-center justify-end gap-1">
                      <button type="button" @click.stop="goToProfile(user.id)" title="View Profile"
                        class="flex h-8 w-8 items-center justify-center rounded-lg text-indigo-600 transition-all hover:bg-indigo-50 hover:text-indigo-700">
                        <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button type="button" @click.stop="editTutor(user.id)" title="Edit Tutor"
                        class="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 transition-all hover:bg-blue-50 hover:text-blue-700">
                        <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button type="button" @click.stop="deleteUser(user)" title="Delete Tutor"
                        class="flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 transition-all hover:bg-rose-50 hover:text-rose-700">
                        <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <button type="button" @click.stop="toggleTutor(user.id)" title="Toggle Activity"
                        class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900"
                        :class="{ 'bg-slate-100 text-slate-900': expandedTutorId === user.id }">
                        <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="expandedTutorId === user.id">
                  <td colspan="6" class="bg-slate-50 px-6 py-4">
                    <TutorRowDetails :activity="activityFor(user.id)" />
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center px-6 py-16 text-center">
        <h3 class="text-base font-bold text-slate-900">No tutors found</h3>
        <p class="mt-1 text-sm text-slate-500">No registered tutors yet.</p>
      </div>
    </div>
    <!-- ── Floating Bulk Action Bar ── -->
    <transition name="slide-up">
      <div v-if="selectedIds.size > 0"
        class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        <div class="flex items-center gap-3 rounded-2xl border border-rose-200 bg-white px-5 py-3 shadow-2xl shadow-rose-100 ring-1 ring-rose-100">
          <span class="flex h-7 min-w-[28px] items-center justify-center rounded-full bg-rose-600 px-2 text-xs font-bold text-white">
            {{ selectedIds.size }}
          </span>
          <span class="text-sm font-semibold text-slate-700">
            tutor{{ selectedIds.size !== 1 ? 's' : '' }} selected
          </span>
          <div class="mx-1 h-5 w-px bg-slate-200" />
          <button @click="bulkDelete" :disabled="bulkDeleting"
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
              <h3 class="text-base font-semibold text-slate-900">Delete {{ selectedIds.size }} Tutor{{ selectedIds.size !== 1 ? 's' : '' }}</h3>
              <p class="mt-0.5 text-sm text-slate-500">This action is permanent and cannot be undone.</p>
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
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useToastStore } from '@/stores/toast'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import TutorRowDetails from '@/components/admin/TutorRowDetails.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

interface Role { id: number; name: string }
interface User { id: number; first_name?: string; last_name?: string; name: string; email: string; role: Role | null; deleted_at: string | null; students_count?: number }

interface TutorWorklogStats {
  total: number
  submitted: number
  approved: number
  rejected: number
}

interface TutorActivity {
  worklog_stats: TutorWorklogStats
  issues: Array<{ title?: string }>
  assignments: Array<unknown>
  students: Array<unknown>
}

const router = useRouter()
const toast = useToastStore()
const { show: confirmShow, loading: confirmLoading, error: confirmError, open: confirmOpen, cancel: confirmCancel, confirmAsync: confirmAsyncFn } = useConfirmDialog()
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmButtonText = ref('Confirm')
type ActionType = 'delete'
const pendingAction = ref<{ type: ActionType; user: User } | null>(null)
const users = ref<User[]>([])
const loading = ref(false)
const searchQuery = ref('')
const totalUsers = ref(0)
const expandedTutorId = ref<number | null>(null)
const tutorActivity = ref<Record<number, TutorActivity>>({})

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
    toast.success(`Deleted ${ids.length} tutor${ids.length !== 1 ? 's' : ''} successfully.`)
    showBulkConfirm.value = false
    clearSelection()
    fetchUsers()
  } catch (err: unknown) {
    bulkError.value = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Bulk delete failed.'
  } finally {
    bulkDeleting.value = false
  }
}

function editTutor(userId: number) {
  router.push(`/admin/tutors/${userId}/edit`)
}

function goToProfile(userId: number) {
  router.push(`/admin/tutor-profile/${userId}`)
}

async function confirmAction(type: ActionType, user: User) {
  pendingAction.value = { type, user }
  if (type === 'delete') {
    confirmTitle.value = 'Delete Tutor'
    confirmMessage.value = `Are you sure you want to permanently delete ${user.first_name} ${user.last_name}?`
    confirmButtonText.value = 'Delete'
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
      toast.success(`Tutor "${user.first_name} ${user.last_name}" deleted.`)
    }
    pendingAction.value = null
    fetchUsers()
  })
}

function deleteUser(user: User) { confirmAction('delete', user) }

function activityFor(userId: number): TutorActivity | undefined {
  return tutorActivity.value[userId]
}

async function toggleTutor(userId: number) {
  if (expandedTutorId.value === userId) {
    expandedTutorId.value = null
    return
  }

  expandedTutorId.value = userId
  if (tutorActivity.value[userId]) {
    return
  }

  try {
    const res = await api.get(`/admin/tutors/${userId}/activity`)
    tutorActivity.value[userId] = res.data as TutorActivity
  } catch {
    tutorActivity.value[userId] = {
      worklog_stats: { total: 0, submitted: 0, approved: 0, rejected: 0 },
      issues: [],
      assignments: [],
      students: [],
    }
  }
}

async function fetchUsers() {
  loading.value = true
  try {
    const params: Record<string, string | number> = { role: 'tutor', per_page: 50 }
    if (searchQuery.value) params.search = searchQuery.value
    const res = await api.get('/admin/users', { params })
    users.value = res.data.data ?? []
    totalUsers.value = res.data.meta?.total ?? 0
  } catch { /* ignore */ }
  finally { loading.value = false }
}

let timeout: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, () => {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(fetchUsers, 300)
})

onMounted(fetchUsers)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active { transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
.slide-up-leave-active { transition: all 0.2s ease-in; }
.slide-up-enter-from  { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.95); }
.slide-up-leave-to    { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.95); }
</style>
