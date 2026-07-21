<!-- src/views/followup/FollowupList.vue -->
<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Follow-up Records</h1>
        <p class="text-sm text-slate-500">
          Tutor follow-up meetings, notes, and next actions for your students.
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

    <!-- Search -->
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <input
        v-model="search"
        class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20 sm:flex-1"
        placeholder="Search follow-ups..."
        @input="onSearchInput"
      />
      <div class="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:gap-2">
        <button
          class="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 sm:w-auto"
          @click="applySearch"
        >
          Search
        </button>
        <button
          class="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto"
          @click="resetSearch"
        >
          Reset
        </button>
      </div>
    </div>

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
    <div v-if="!followupStore.loading && followupStore.followups.length" class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <!-- Card view on small screens -->
      <div class="grid gap-3 p-3 sm:hidden">
        <div v-for="f in followupStore.followups" :key="f.id" class="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <div class="text-sm font-semibold text-slate-900">{{ studentLabel(f) }}</div>
              <div class="mt-1 text-xs text-slate-500">{{ f.meeting_type }}</div>
            </div>
            <div class="flex items-center gap-1">
              <button @click="openEditForm(f)" class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm active:scale-95">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>
                <span>Edit</span>
              </button>
              <button @click="deleteFollowup(f)" class="inline-flex items-center gap-1 rounded-lg bg-red-600 px-2 py-1 text-xs font-semibold text-white shadow-sm active:scale-95">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916"/></svg>
                <span>Delete</span>
              </button>
            </div>
          </div>
          <div class="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div><span class="font-medium text-slate-500">Date:</span> {{ formatDate(f.meeting_date) }}</div>
            <div><span class="font-medium text-slate-500">Next:</span> {{ f.next_followup ? formatDate(f.next_followup) : '—' }}</div>
          </div>
        </div>
      </div>
      <div class="-mx-4 hidden sm:mx-0 sm:block overflow-x-auto">
        <div class="inline-block min-w-full align-middle">
          <table class="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-400">
                <th class="px-4 py-3 sm:px-5 sm:py-3.5">Student</th>
                <th class="px-4 py-3 sm:px-5 sm:py-3.5">Meeting Type</th>
                <th class="px-4 py-3 sm:px-5 sm:py-3.5">Meeting Date</th>
                <th class="hidden px-4 py-3 sm:px-5 sm:py-3.5 md:table-cell">Next Follow-up</th>
                <th class="px-4 py-3 sm:px-5 sm:py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr
                v-for="f in followupStore.followups"
                :key="f.id"
                class="hover:bg-slate-50/30 transition-colors"
              >
                <td class="whitespace-nowrap px-4 py-3 text-slate-700 sm:px-5 sm:py-4">
                  {{ studentLabel(f) }}
                </td>
                <td class="whitespace-nowrap px-4 py-3 text-slate-600 sm:px-5 sm:py-4">
                  {{ f.meeting_type }}
                </td>
                <td class="whitespace-nowrap px-4 py-3 text-slate-600 sm:px-5 sm:py-4">
                  {{ formatDate(f.meeting_date) }}
                </td>
                <td class="hidden whitespace-nowrap px-4 py-3 text-slate-600 md:table-cell md:px-5 md:py-4">
                  {{ f.next_followup ? formatDate(f.next_followup) : '—' }}
                </td>
                <td class="whitespace-nowrap px-4 py-3 text-right sm:px-5 sm:py-4">
                  <div class="flex items-center justify-end gap-2">
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
                      <span class="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      @click="deleteFollowup(f)"
                      class="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
                    >
                      <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916"
                        />
                      </svg>
                      <span class="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="followupStore.followups.length === 0">
                <td colspan="5" class="px-4 py-10 text-center text-sm text-slate-500 sm:px-5">
                  No follow-up records found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!followupStore.loading" class="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white py-14 text-center">
      <svg class="h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <h3 class="mt-4 text-lg font-semibold text-gray-900">No Follow-up Records Found</h3>
      <p class="mt-2 max-w-md text-sm text-slate-500">
        There are currently no follow-up records. Click the button below to create the first follow-up.
      </p>
      <button
        class="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-600"
        @click="openCreateForm"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        New Follow-up
      </button>
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
import { ref, onMounted } from 'vue'
import { useFollowupStore } from '@/stores/followupStore'
import { useToastStore } from '@/stores/toast'
import type { Followup } from '@/types/followup'
import ErrorAlert from '@/components/common/ErrorAlert.vue'
import FollowupForm from './FollowupForm.vue'

const followupStore = useFollowupStore()
const toast = useToastStore()

const showForm = ref(false)
const editingFollowup = ref<Followup | null>(null)
const search = ref('')

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
  if (!f.student) return '—'
  return f.student.name || `#${f.student_id}`
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
  followupStore.fetchFollowups().catch(() => {})
}

function onSearchInput() {
  followupStore.search = search.value
  followupStore.fetchFollowups().catch(() => {})
}

function applySearch() {
  followupStore.search = search.value
  followupStore.fetchFollowups().catch(() => {})
}

function resetSearch() {
  search.value = ''
  followupStore.search = ''
  followupStore.fetchFollowups().catch(() => {})
}

async function deleteFollowup(followup: Followup) {
  if (!confirm(`Delete follow-up #${followup.id}? This action cannot be undone.`)) return
  try {
    await followupStore.deleteFollowup(followup.id)
    toast.success('Follow-up deleted successfully.', 'Deleted')
  } catch {
    // error already in store
  }
}

onMounted(() => {
  followupStore.fetchFollowups().catch(() => {})
})
</script>
