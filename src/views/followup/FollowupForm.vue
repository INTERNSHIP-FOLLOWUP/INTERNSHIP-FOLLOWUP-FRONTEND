<!-- src/views/followup/FollowupForm.vue -->
<template>
  <transition name="form-scale" appear>
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      @click.self="$emit('cancelled')"
      @keydown.escape="$emit('cancelled')"
    >
      <div class="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-100 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
        <!-- Header with gradient -->
        <div class="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-4 rounded-t-2xl">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <svg v-if="isEdit" class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              <svg v-else class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-white">{{ isEdit ? 'Edit Follow-up' : 'New Follow-up' }}</h2>
              <p class="text-xs text-indigo-200">{{ isEdit ? 'Update the follow-up record details' : 'Create a new follow-up record' }}</p>
            </div>
          </div>
          <button
            type="button"
            @click="$emit('cancelled')"
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <ErrorAlert :message="submitError" />

          <form @submit.prevent="submit" class="space-y-5">
            <!-- Student selector -->
            <div>
              <label class="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5 dark:text-slate-300">
                <svg class="h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Student
              </label>

              <!-- Student: auto-filled readonly field -->
              <input
                v-if="isStudent"
                :value="studentDisplayName"
                type="text"
                readonly
                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400"
              />

              <!-- Tutor/Admin: search student by name -->
              <div v-else-if="canSearchStudents" class="relative">
                <div class="relative">
                  <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    ref="studentSearchInput"
                    v-model="studentSearch"
                    type="text"
                    placeholder="Search student by name..."
                    autocomplete="off"
                    @input="onStudentSearchInput"
                    @focus="showStudentDropdown = studentResults.length > 0"
                    @blur="onStudentSearchBlur"
                    class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-700 transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
                    :class="{ 'border-red-400 ring-2 ring-red-500/20': errors.student_id }"
                  />
                  <!-- Clear button when student is selected -->
                  <button
                    v-if="form.student_id && studentSearch"
                    type="button"
                    @click="clearStudent"
                    class="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors dark:text-slate-500 dark:hover:bg-slate-600 dark:hover:text-slate-300"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Search results dropdown -->
                <transition name="dropdown">
                  <div
                    v-if="showStudentDropdown && studentResults.length > 0"
                    class="absolute z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white py-1 shadow-lg shadow-slate-200/50 max-h-60 overflow-y-auto dark:border-slate-600 dark:bg-slate-700 dark:shadow-black/20"
                  >
                    <button
                      v-for="(s, idx) in studentResults"
                      :key="s.id"
                      type="button"
                      @mousedown.prevent="selectStudent(s)"
                      class="flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                      :class="idx < studentResults.length - 1 ? 'border-b border-slate-50 dark:border-slate-600' : ''"
                    >
                      <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 text-xs font-bold text-indigo-600 dark:from-indigo-800 dark:to-indigo-900 dark:text-indigo-300">
                        {{ s.name?.charAt(0)?.toUpperCase() || '?' }}
                      </div>
                      <div class="min-w-0">
                        <p class="font-medium text-slate-800 truncate dark:text-slate-200">{{ s.name }}</p>
                        <p class="text-xs text-slate-400 truncate dark:text-slate-400">
                          {{ s.student_code ? `#${s.student_code}` : '' }}
                          {{ s.student_code && s.email ? '·' : '' }}
                          {{ s.email || '' }}
                        </p>
                      </div>
                    </button>
                  </div>
                </transition>

                <!-- No results message -->
                <transition name="dropdown">
                  <div
                    v-if="showStudentDropdown && studentSearch.length >= 2 && studentResults.length === 0 && !searchingStudents"
                    class="absolute z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/50 text-center dark:border-slate-600 dark:bg-slate-700 dark:shadow-black/20"
                  >
                    <p class="text-sm text-slate-500 dark:text-slate-400">No students found matching "{{ studentSearch }}"</p>
                  </div>
                </transition>
              </div>
              <!-- Other roles: fallback text input -->
              <input
                v-else
                v-model.number="form.student_id"
                type="number"
                min="1"
                placeholder="Enter student ID"
                class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
                :class="{ 'border-red-400 ring-2 ring-red-500/20': errors.student_id }"
              />
              <transition name="error-slide">
                <p v-if="errors.student_id" class="text-red-600 dark:text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <svg class="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  {{ errors.student_id }}
                </p>
              </transition>
            </div>

            <!-- Meeting type -->
            <div>
              <label class="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5 dark:text-slate-300">
                <svg class="h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Meeting Type
              </label>
              <div class="relative">
                <select
                  v-model="form.meeting_type"
                  class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 transition-all duration-200 appearance-none focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                  :class="{ 'border-red-400 ring-2 ring-red-500/20': errors.meeting_type }"
                >
                  <option value="" disabled>Select meeting type</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annual">Annual</option>
                </select>
                <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <transition name="error-slide">
                <p v-if="errors.meeting_type" class="text-red-600 dark:text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <svg class="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  {{ errors.meeting_type }}
                </p>
              </transition>
            </div>

            <!-- Meeting date -->
            <div>
              <label class="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5 dark:text-slate-300">
                <svg class="h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Meeting Date
              </label>
              <input
                v-model="form.meeting_date"
                type="date"
                class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 transition-all duration-200 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                :class="{ 'border-red-400 ring-2 ring-red-500/20': errors.meeting_date }"
              />
              <transition name="error-slide">
                <p v-if="errors.meeting_date" class="text-red-600 dark:text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <svg class="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  {{ errors.meeting_date }}
                </p>
              </transition>
            </div>

            <!-- Notes with character count -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <svg class="h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Notes
                </label>
                <span class="text-xs text-slate-400 dark:text-slate-500" :class="{ 'text-amber-500': notesLength > 0 }" v-if="form.notes">
                  {{ notesLength }}
                </span>
              </div>
              <textarea
                v-model="form.notes"
                rows="3"
                maxlength="5000"
                placeholder="Enter meeting notes..."
                class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
                :class="{ 'border-red-400 ring-2 ring-red-500/20': errors.notes }"
              ></textarea>
              <transition name="error-slide">
                <p v-if="errors.notes" class="text-red-600 dark:text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <svg class="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  {{ errors.notes }}
                </p>
              </transition>
            </div>

            <!-- Action items with character count -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <svg class="h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Action Items
                  <span class="text-xs font-normal text-slate-400 dark:text-slate-500">(optional)</span>
                </label>
                <span class="text-xs text-slate-400 dark:text-slate-500" v-if="form.action_items">
                  {{ actionItemsLength }}
                </span>
              </div>
              <textarea
                v-model="form.action_items"
                rows="3"
                maxlength="5000"
                placeholder="Enter action items..."
                class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
              ></textarea>
            </div>

            <!-- Next follow-up date -->
            <div>
              <label class="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5 dark:text-slate-300">
                <svg class="h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Next Follow-up Date
                <span class="text-xs font-normal text-slate-400 dark:text-slate-500">(optional)</span>
              </label>
              <input
                v-model="form.next_followup"
                type="date"
                class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 transition-all duration-200 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              />
            </div>

            <!-- Form Footer -->
            <div class="flex items-center justify-between gap-3 pt-2">
              <p class="text-xs text-slate-400 dark:text-slate-500">
                <kbd class="inline-flex items-center rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-xs text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400">Esc</kbd>
                to cancel
              </p>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="$emit('cancelled')"
                  class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="submitting"
                  class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="submitting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <svg v-else-if="isEdit" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v4h4l10.5-10.5-4-4L4 16zm14.5-9.5l-1.5 1.5 4 4 1.5-1.5-4-4z" />
                  </svg>
                  <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ submitting ? 'Saving...' : (isEdit ? 'Update' : 'Save') }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { reactive, ref, computed, nextTick } from 'vue'
import { useFollowupStore } from '@/stores/followupStore'
import { useAuthStore } from '@/stores/auth'
import { useStudentProfileStore } from '@/stores/studentProfile'
import api from '@/services/api'
import type { Followup, FollowupPayload, MeetingType } from '@/types/followup'
import type { AxiosError } from 'axios'
import ErrorAlert from '@/components/common/ErrorAlert.vue'

const props = defineProps<{ followup: Followup | null }>()
const emit = defineEmits<{ saved: []; cancelled: [] }>()

const followupStore = useFollowupStore()
const auth = useAuthStore()
const profileStore = useStudentProfileStore()

const isStudent = computed(() => auth.userRole === 'student')
const isEdit = computed(() => !!props.followup)
const canSearchStudents = computed(() => auth.userRole === 'tutor' || auth.userRole === 'admin')
const searchRolePrefix = computed(() => auth.userRole === 'admin' ? 'admin' : 'tutor')

const studentDisplayName = computed(() => {
  return auth.user?.name || 'You'
})

const notesLength = computed(() => form.notes ? form.notes.length : 0)
const actionItemsLength = computed(() => form.action_items ? form.action_items.length : 0)

const form = reactive<FollowupPayload>({
  student_id: props.followup?.student_id ?? (isEdit.value ? (null as unknown as number) : (profileStore.profile?.id ?? (null as unknown as number))),
  meeting_type: props.followup?.meeting_type ?? ('' as MeetingType),
  meeting_date: props.followup?.meeting_date ?? '',
  notes: props.followup?.notes ?? '',
  action_items: props.followup?.action_items ?? '',
  next_followup: props.followup?.next_followup ?? null,
})

const errors = reactive({
  student_id: '',
  meeting_type: '',
  meeting_date: '',
  notes: '',
})

// ── Student search state ──
const studentSearchInput = ref<HTMLInputElement | null>(null)
const studentSearch = ref('')
const studentResults = ref<Array<{ id: number; name: string; student_code?: string; email?: string }>>([])
const showStudentDropdown = ref(false)
const searchingStudents = ref(false)
let searchTimeout: ReturnType<typeof setTimeout> | null = null

// On edit mode, pre-fill student name from existing follow-up data
if (props.followup?.student?.name) {
  studentSearch.value = props.followup.student.name
}

async function onStudentSearchInput() {
  if (searchTimeout) clearTimeout(searchTimeout)

  if (studentSearch.value.length < 2) {
    studentResults.value = []
    showStudentDropdown.value = false
    // If they cleared the input but had a student selected, clear selection
    if (!studentSearch.value && form.student_id) {
      form.student_id = null as unknown as number
    }
    return
  }

  // User is typing something different from the selected student's name
  // So clear the current selection
  if (form.student_id && studentSearch.value !== props.followup?.student?.name) {
    form.student_id = null as unknown as number
  }

  searchingStudents.value = true
  searchTimeout = setTimeout(async () => {
    try {
      const res = await api.get(`/${searchRolePrefix.value}/students`, {
        params: { search: studentSearch.value, per_page: 10 },
      })
      studentResults.value = Array.isArray(res.data.data) ? res.data.data : Array.isArray(res.data) ? res.data : []
      showStudentDropdown.value = studentResults.value.length > 0
    } catch {
      studentResults.value = []
      showStudentDropdown.value = false
    } finally {
      searchingStudents.value = false
    }
  }, 350)
}

function selectStudent(s: { id: number; name: string }) {
  form.student_id = s.id
  studentSearch.value = s.name
  showStudentDropdown.value = false
  errors.student_id = ''
}

function onStudentSearchBlur() {
  // Delay hiding so click on dropdown item registers first
  setTimeout(() => {
    showStudentDropdown.value = false
  }, 200)
}

function clearStudent() {
  form.student_id = null as unknown as number
  studentSearch.value = ''
  studentResults.value = []
  showStudentDropdown.value = false
  nextTick(() => studentSearchInput.value?.focus())
}

// ── Form submission state ──
const submitting = ref(false)
const submitError = ref<string | null>(null)

function validate(): boolean {
  errors.student_id = ''
  errors.meeting_type = ''
  errors.meeting_date = ''
  errors.notes = ''
  submitError.value = null
  let valid = true

  if (!form.student_id) {
    errors.student_id = isStudent.value ? 'Please select a student.' : 'Please select a student from the search results.'
    valid = false
  }
  if (!form.meeting_type) {
    errors.meeting_type = 'Please select a meeting type.'
    valid = false
  }
  if (!form.meeting_date) {
    errors.meeting_date = 'Meeting date is required.'
    valid = false
  }
  if (!form.notes.trim()) {
    errors.notes = 'Notes are required.'
    valid = false
  }
  if (form.next_followup && form.next_followup < form.meeting_date) {
    submitError.value = 'Next follow-up date must be after the meeting date.'
    valid = false
  }

  return valid
}

async function submit(): Promise<void> {
  // For students creating new, ensure we send the correct students.id, not users.id
  // Run this BEFORE validation so student_id is set correctly before checking
  if (isStudent.value && !isEdit.value) {
    if (!profileStore.profile?.id) {
      try {
        await profileStore.fetchProfile()
      } catch {
        // Will use whatever student_id we have
      }
    }
    if (profileStore.profile?.id) {
      form.student_id = profileStore.profile.id
    }
  }

  if (!validate()) return

  submitting.value = true
  submitError.value = null
  try {
    if (isEdit.value && props.followup) {
      await followupStore.updateFollowup(props.followup.id, { ...form })
    } else {
      await followupStore.createFollowup({ ...form })
    }
    emit('saved')
  } catch (err) {
    const axiosErr = err as AxiosError<{ message?: string }>
    submitError.value = axiosErr.response?.data?.message ?? 'Failed to save follow-up.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.form-scale-enter-active {
  transition: all 0.25s ease-out;
}
.form-scale-leave-active {
  transition: all 0.15s ease-in;
}
.form-scale-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(12px);
}
.form-scale-leave-to {
  opacity: 0;
  transform: scale(0.97) translateY(8px);
}

.error-slide-enter-active {
  transition: all 0.2s ease-out;
}
.error-slide-leave-active {
  transition: all 0.15s ease-in;
}
.error-slide-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}
.error-slide-leave-to {
  opacity: 0;
  transform: translateY(-2px);
}

.dropdown-enter-active {
  transition: all 0.2s ease-out;
}
.dropdown-leave-active {
  transition: all 0.15s ease-in;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
