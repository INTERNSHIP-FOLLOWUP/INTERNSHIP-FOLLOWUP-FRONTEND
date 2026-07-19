<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Follow-up Records</h1>
        <p class="text-sm text-slate-500">
          {{ isStudent ? 'Your follow-up meetings, notes, and next actions.' : 'Tutor follow-up meetings, notes, and next actions for your students.' }}
        </p>
      </div>
      <button
        type="button"
        @click="openCreateForm"
        class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-600 active:scale-95"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        New Follow-up
      </button>
    </div>

    <!-- Error Alert -->
    <ErrorAlert :message="followupStore.error" />

    <!-- Loading -->
    <div
      v-if="followupStore.loading"
      class="flex items-center justify-center rounded-2xl border border-slate-100 bg-white py-16 shadow-sm"
    >
      <svg class="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </div>

    <!-- Data Table -->
    <div v-else class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse text-left text-sm">
          <thead>
            <tr
              class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-400"
            >
              <th class="px-5 py-3.5">Student</th>
              <th class="px-5 py-3.5">Meeting Type</th>
              <th class="px-5 py-3.5">Meeting Date</th>
              <th class="px-5 py-3.5">Next Follow-up</th>
              <th class="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr
              v-for="f in followupStore.followups"
              :key="f.id"
              class="hover:bg-slate-50/30 transition-colors"
            >
              <td class="whitespace-nowrap px-5 py-4 text-slate-700">
                {{ studentLabel(f) }}
              </td>
              <td class="whitespace-nowrap px-5 py-4 text-slate-600">
                {{ f.meeting_type }}
              </td>
              <td class="whitespace-nowrap px-5 py-4 text-slate-600">
                {{ formatDate(f.meeting_date) }}
              </td>
              <td class="whitespace-nowrap px-5 py-4 text-slate-600">
                {{ f.next_followup ? formatDate(f.next_followup) : '—' }}
              </td>
              <td class="whitespace-nowrap px-5 py-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <!-- View Detail -->
                  <button
                    @click="openViewDetail(f)"
                    class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
                    title="View details"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View
                  </button>

                  <!-- Edit -->
                  <button
                    @click="openEditForm(f)"
                    class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
                    title="Edit"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                    Edit
                  </button>

                  <!-- Delete -->
                  <button
                    @click="confirmDelete(f)"
                    class="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-50 hover:border-red-300"
                    title="Delete"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="followupStore.followups.length === 0">
              <td colspan="5" class="px-5 py-10 text-center text-sm text-slate-500">
                No follow-up records found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- View Detail Modal -->
    <transition name="modal-scale">
      <div
        v-if="viewingFollowup"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        @click.self="viewingFollowup = null"
      >
        <div class="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-100 bg-white shadow-2xl">
          <!-- Header with gradient -->
          <div class="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-4 rounded-t-2xl">
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-white">Follow-up Details</h2>
                <p class="text-xs text-indigo-200">Record #{{ viewingFollowup.id }}</p>
              </div>
            </div>
            <button
              @click="viewingFollowup = null"
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 space-y-5">
            <!-- Row: Student & Meeting Type -->
            <div class="grid grid-cols-2 gap-5">
              <div class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
                <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Student
                </div>
                <p class="text-sm font-medium text-slate-800">{{ studentLabel(viewingFollowup) }}</p>
              </div>
              <div class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
                <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Meeting Type
                </div>
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                  :class="meetingTypeBadge(viewingFollowup.meeting_type)"
                >
                  <span class="h-1.5 w-1.5 rounded-full" :class="meetingTypeDot(viewingFollowup.meeting_type)"></span>
                  {{ viewingFollowup.meeting_type }}
                </span>
              </div>
            </div>

            <!-- Row: Meeting Date & Next Follow-up -->
            <div class="grid grid-cols-2 gap-5">
              <div class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
                <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Meeting Date
                </div>
                <p class="text-sm font-medium text-slate-800">{{ formatDate(viewingFollowup.meeting_date) }}</p>
              </div>
              <div class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
                <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Next Follow-up
                </div>
                <p class="text-sm font-medium" :class="viewingFollowup.next_followup ? 'text-slate-800' : 'text-slate-400'">
                  {{ viewingFollowup.next_followup ? formatDate(viewingFollowup.next_followup) : 'Not scheduled' }}
                </p>
              </div>
            </div>

            <!-- Notes card -->
            <div class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
              <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Notes
              </div>
              <p class="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                {{ viewingFollowup.notes || '—' }}
              </p>
            </div>

            <!-- Action Items card -->
            <div v-if="viewingFollowup.action_items" class="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
              <div class="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">
                <svg class="h-4 w-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Action Items
              </div>
              <p class="text-sm text-amber-800 whitespace-pre-wrap leading-relaxed">
                {{ viewingFollowup.action_items }}
              </p>
            </div>

            <!-- Footer: timestamps + actions -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div class="flex gap-4 text-xs text-slate-400">
                <span>Created {{ formatDateTime(viewingFollowup.created_at) }}</span>
                <span class="text-slate-300">·</span>
                <span>Updated {{ formatDateTime(viewingFollowup.updated_at) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="quickEdit(viewingFollowup)"
                  class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-600 active:scale-95"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  Edit Record
                </button>
                <button
                  @click="viewingFollowup = null"
                  class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Edit/Create Modal -->
    <FollowupForm
      v-if="showForm"
      :followup="editingFollowup"
      @saved="onSaved"
      @cancelled="showForm = false"
    />

    <!-- Delete Confirmation -->
    <ConfirmDialog
      :show="showDeleteConfirm"
      title="Delete Follow-up"
      :message="`Are you sure you want to delete this follow-up record? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      :loading="deleting"
      :error="deleteError"
      @confirm="handleDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useFollowupStore } from '@/stores/followupStore'
import { useAuthStore } from '@/stores/auth'
import type { Followup } from '@/types/followup'
import ErrorAlert from '@/components/common/ErrorAlert.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { useToastStore } from '@/stores/toast'
import FollowupForm from './FollowupForm.vue'

const followupStore = useFollowupStore()
const auth = useAuthStore()
const toast = useToastStore()

const showForm = ref(false)
const editingFollowup = ref<Followup | null>(null)
const viewingFollowup = ref<Followup | null>(null)

// Delete state
const showDeleteConfirm = ref(false)
const deletingFollowup = ref<Followup | null>(null)
const deleting = ref(false)
const deleteError = ref<string | null>(null)

const isStudent = computed(() => auth.userRole === 'student')

const fetchParams = computed(() => {
  if (auth.userRole === 'student' && auth.user?.id) {
    return { student_id: auth.user.id }
  }
  if (auth.userRole === 'tutor' && auth.user?.id) {
    return { tutor_id: auth.user.id }
  }
  return {}
})

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function formatDateTime(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

function studentLabel(f: Followup): string {
  if (!f.student_id) return '—'
  if (isStudent.value && auth.user?.id === f.student_id) return 'Me'
  if (f.student?.name) return f.student.name
  return `Student #${f.student_id}`
}

function meetingTypeBadge(type: string): string {
  switch (type) {
    case 'Monthly':
      return 'bg-blue-50 text-blue-700'
    case 'Quarterly':
      return 'bg-purple-50 text-purple-700'
    case 'Annual':
      return 'bg-amber-50 text-amber-700'
    default:
      return 'bg-slate-50 text-slate-700'
  }
}

function meetingTypeDot(type: string): string {
  switch (type) {
    case 'Monthly':
      return 'bg-blue-500'
    case 'Quarterly':
      return 'bg-purple-500'
    case 'Annual':
      return 'bg-amber-500'
    default:
      return 'bg-slate-400'
  }
}

function openCreateForm() {
  editingFollowup.value = null
  showForm.value = true
}

function openEditForm(followup: Followup) {
  viewingFollowup.value = null
  editingFollowup.value = followup
  showForm.value = true
}

function openViewDetail(followup: Followup) {
  viewingFollowup.value = followup
}

function quickEdit(followup: Followup) {
  viewingFollowup.value = null
  nextTick(() => {
    editingFollowup.value = followup
    showForm.value = true
  })
}

function confirmDelete(followup: Followup) {
  deletingFollowup.value = followup
  deleteError.value = null
  showDeleteConfirm.value = true
}

async function handleDelete() {
  if (!deletingFollowup.value) return
  deleting.value = true
  deleteError.value = null
  try {
    await followupStore.deleteFollowup(deletingFollowup.value.id)
    toast.success('Follow-up record deleted successfully.', 'Deleted')
    showDeleteConfirm.value = false
    deletingFollowup.value = null
  } catch (err) {
    deleteError.value = followupStore.error || 'Failed to delete follow-up.'
  } finally {
    deleting.value = false
  }
}

function onSaved() {
  showForm.value = false
  followupStore.fetchFollowups(fetchParams.value).catch(() => {})
}

onMounted(() => {
  followupStore.fetchFollowups(fetchParams.value).catch(() => {})
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active {
  transition: opacity 0.25s ease-out;
}
.modal-scale-enter-active > div {
  transition: transform 0.25s ease-out, opacity 0.25s ease-out;
}
.modal-scale-leave-active {
  transition: opacity 0.15s ease-in;
}
.modal-scale-leave-active > div {
  transition: transform 0.15s ease-in, opacity 0.15s ease-in;
}
.modal-scale-enter-from {
  opacity: 0;
}
.modal-scale-enter-from > div {
  transform: scale(0.95) translateY(12px);
  opacity: 0;
}
.modal-scale-leave-to {
  opacity: 0;
}
.modal-scale-leave-to > div {
  transform: scale(0.97) translateY(8px);
  opacity: 0;
}
</style>
