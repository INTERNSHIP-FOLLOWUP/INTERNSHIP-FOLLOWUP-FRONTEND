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
                <button
                  @click="openEditForm(f)"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
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

    <!-- Modal -->
    <FollowupForm
      v-if="showForm"
      :followup="editingFollowup"
      @saved="onSaved"
      @cancelled="showForm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFollowupStore } from '@/stores/followupStore'
import { useAuthStore } from '@/stores/auth'
import type { Followup } from '@/types/followup'
import ErrorAlert from '@/components/common/ErrorAlert.vue'
import FollowupForm from './FollowupForm.vue'

const followupStore = useFollowupStore()
const auth = useAuthStore()

const showForm = ref(false)
const editingFollowup = ref<Followup | null>(null)

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

function studentLabel(f: Followup): string {
  if (!f.student_id) return '—'
  if (isStudent.value && auth.user?.id === f.student_id) return 'Me'
  return `Student #${f.student_id}`
}

function openCreateForm() {
  editingFollowup.value = null
  showForm.value = true
}

function openEditForm(followup: Followup) {
  editingFollowup.value = followup
  showForm.value = true
}

function onSaved() {
  showForm.value = false
  followupStore.fetchFollowups(fetchParams.value).catch(() => {})
}

onMounted(() => {
  followupStore.fetchFollowups(fetchParams.value).catch(() => {})
})
</script>
