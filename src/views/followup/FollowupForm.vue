<!-- src/views/followup/FollowupForm.vue -->
<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3 sm:p-4">
    <div class="w-full max-h-[calc(100dvh-64px)] overflow-y-auto rounded-xl bg-white shadow-xl sm:max-h-[90vh] sm:max-w-lg sm:p-6 p-4">
      <h2 class="text-lg font-semibold mb-4 text-slate-900">
        {{ isEdit ? 'Edit Follow-up' : 'New Follow-up' }}
      </h2>

      <ErrorAlert :message="submitError" />

      <form @submit.prevent="submit" class="space-y-4">
        <!-- Student selector -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Student</label>
          <select
            v-model="form.student_id"
            :disabled="studentsLoading"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
            :class="{ 'border-red-400': errors.student_id }"
          >
            <option :value="null" disabled>Select a student</option>
            <option v-for="student in students" :key="student.id" :value="student.id">
              {{ student.name }}
            </option>
          </select>
          <p v-if="studentsError" class="text-red-600 text-xs mt-1">{{ studentsError }}</p>
          <p v-if="errors.student_id" class="text-red-600 text-xs mt-1">{{ errors.student_id }}</p>
        </div>

        <!-- Company selector -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Company</label>
          <select
            v-model="form.company_id"
            :disabled="companiesLoading"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
            :class="{ 'border-red-400': errors.company_id }"
          >
            <option :value="null">Auto-assign from student internship</option>
            <option v-for="company in companies" :key="company.id" :value="company.id">
              {{ company.name }}
            </option>
          </select>
          <p v-if="companiesError" class="text-red-600 text-xs mt-1">{{ companiesError }}</p>
          <p v-if="errors.company_id" class="text-red-600 text-xs mt-1">{{ errors.company_id }}</p>
        </div>

        <!-- Meeting type -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Meeting Type</label>
          <select
            v-model="form.meeting_type"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            :class="{ 'border-red-400': errors.meeting_type }"
          >
            <option value="" disabled>Select meeting type</option>
            <option value="In-Person">In-Person</option>
            <option value="Online">Online</option>
            <option value="Phone">Phone</option>
            <option value="Virtual">Virtual</option>
          </select>
          <p v-if="errors.meeting_type" class="text-red-600 text-xs mt-1">
            {{ errors.meeting_type }}
          </p>
        </div>

        <!-- Meeting date -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Meeting Date</label>
          <input
            v-model="form.meeting_date"
            type="date"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            :class="{ 'border-red-400': errors.meeting_date }"
          />
          <p v-if="errors.meeting_date" class="text-red-600 text-xs mt-1">
            {{ errors.meeting_date }}
          </p>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Notes</label>
          <textarea
            v-model="form.notes"
            rows="3"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            :class="{ 'border-red-400': errors.notes }"
          ></textarea>
          <p v-if="errors.notes" class="text-red-600 text-xs mt-1">{{ errors.notes }}</p>
        </div>

        <!-- Action items -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Action Items</label>
          <textarea
            v-model="form.action_items"
            rows="3"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          ></textarea>
        </div>

        <!-- Next follow-up date -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Next Follow-up Date</label>
          <input
            v-model="form.next_followup"
            type="date"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div class="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
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
          </form>

        <div class="p-6">
          <ErrorAlert :message="submitError" />

          <form @submit.prevent="submit" class="space-y-5">
            <!-- Student selector -->
            <div>
              <label class="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5">
                <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed"
              />

              <!-- Tutor/Admin: number input for student ID -->
              <input
                v-else
                v-model.number="form.student_id"
                type="number"
                min="1"
                placeholder="Enter student ID"
                class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                :class="{ 'border-red-400 ring-2 ring-red-500/20': errors.student_id }"
              />
              <transition name="error-slide">
                <p v-if="errors.student_id" class="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                  <svg class="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  {{ errors.student_id }}
                </p>
              </transition>
            </div>

            <!-- Meeting type -->
            <div>
              <label class="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5">
                <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Meeting Type
              </label>
              <div class="relative">
                <select
                  v-model="form.meeting_type"
                  class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 transition-all duration-200 appearance-none focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  :class="{ 'border-red-400 ring-2 ring-red-500/20': errors.meeting_type }"
                >
                  <option value="" disabled>Select meeting type</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annual">Annual</option>
                </select>
                <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <transition name="error-slide">
                <p v-if="errors.meeting_type" class="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                  <svg class="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  {{ errors.meeting_type }}
                </p>
              </transition>
            </div>

            <!-- Meeting date -->
            <div>
              <label class="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5">
                <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Meeting Date
              </label>
              <input
                v-model="form.meeting_date"
                type="date"
                class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 transition-all duration-200 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                :class="{ 'border-red-400 ring-2 ring-red-500/20': errors.meeting_date }"
              />
              <transition name="error-slide">
                <p v-if="errors.meeting_date" class="text-red-600 text-xs mt-1.5 flex items-center gap-1">
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
                <label class="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                  <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Notes
                </label>
                <span class="text-xs text-slate-400" :class="{ 'text-amber-500': notesLength > 0 }" v-if="form.notes">
                  {{ notesLength }}
                </span>
              </div>
              <textarea
                v-model="form.notes"
                rows="3"
                maxlength="5000"
                placeholder="Enter meeting notes..."
                class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                :class="{ 'border-red-400 ring-2 ring-red-500/20': errors.notes }"
              ></textarea>
              <transition name="error-slide">
                <p v-if="errors.notes" class="text-red-600 text-xs mt-1.5 flex items-center gap-1">
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
                <label class="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                  <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Action Items
                  <span class="text-xs font-normal text-slate-400">(optional)</span>
                </label>
                <span class="text-xs text-slate-400" v-if="form.action_items">
                  {{ actionItemsLength }}
                </span>
              </div>
              <textarea
                v-model="form.action_items"
                rows="3"
                maxlength="5000"
                placeholder="Enter action items..."
                class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
              ></textarea>
            </div>

            <!-- Next follow-up date -->
            <div>
              <label class="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5">
                <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Next Follow-up Date
                <span class="text-xs font-normal text-slate-400">(optional)</span>
              </label>
              <input
                v-model="form.next_followup"
                type="date"
                class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 transition-all duration-200 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <!-- Form Footer -->
            <div class="flex items-center justify-between gap-3 pt-2">
              <p class="text-xs text-slate-400">
                <kbd class="inline-flex items-center rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-xs text-slate-500">Esc</kbd>
                to cancel
              </p>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="$emit('cancelled')"
                  class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95"
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
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useFollowupStore } from '@/stores/followupStore'
import { useAuthStore } from '@/stores/auth'
import type { Followup, FollowupPayload, MeetingType } from '@/types/followup'
import type { AxiosError } from 'axios'
import ErrorAlert from '@/components/common/ErrorAlert.vue'
import api from '@/services/api'

const props = defineProps<{ followup: Followup | null }>()
const emit = defineEmits<{ saved: []; cancelled: [] }>()

const followupStore = useFollowupStore()
const auth = useAuthStore()

const studentDisplayName = computed(() => auth.user?.name || auth.user?.email || 'You')
const isStudent = computed(() => auth.userRole === 'student')
const isEdit = computed(() => !!props.followup)

const students = ref<Array<{ id: number; name: string }>>([])
const studentsLoading = ref(false)
const studentsError = ref<string | null>(null)

const companies = ref<Array<{ id: number; name: string }>>([])
const companiesLoading = ref(false)
const companiesError = ref<string | null>(null)

const form = reactive<FollowupPayload>({
  student_id: props.followup?.student_id ?? (null as unknown as number),
  company_id: props.followup?.company_id ?? (null as unknown as number),
  meeting_type: props.followup?.meeting_type ?? ('' as MeetingType),
  meeting_date: props.followup?.meeting_date ?? '',
  notes: props.followup?.notes ?? '',
  action_items: props.followup?.action_items ?? '',
  next_followup: props.followup?.next_followup ?? null,
})

const errors = reactive({
  student_id: '',
  company_id: '',
  meeting_type: '',
  meeting_date: '',
  notes: '',
})

const notesLength = computed(() => form.notes.length)
const actionItemsLength = computed(() => form.action_items.length)

const submitting = ref(false)
const submitError = ref<string | null>(null)

async function fetchStudents() {
  studentsLoading.value = true
  studentsError.value = null
  try {
    const res = await api.get('/tutor/students')
    students.value = (res.data.data || []).map((s: any) => ({ id: s.id, name: s.name }))
  } catch {
    studentsError.value = 'Unable to load students.'
  } finally {
    studentsLoading.value = false
  }
}

async function fetchCompanies() {
  companiesLoading.value = true
  companiesError.value = null
  try {
    const res = await api.get('/tutor/companies')
    companies.value = (res.data.data || res.data || []).map((c: any) => ({ id: c.id, name: c.company_name || c.name }))
  } catch {
    companiesError.value = 'Unable to load companies.'
  } finally {
    companiesLoading.value = false
  }
}

function validate(): boolean {
  errors.student_id = ''
  errors.company_id = ''
  errors.meeting_type = ''
  errors.meeting_date = ''
  errors.notes = ''
  submitError.value = null
  let valid = true

  if (!form.student_id) {
    errors.student_id = isStudent.value ? 'Please select a student.' : 'Please enter a student ID.'
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

onMounted(() => {
  fetchStudents()
  fetchCompanies()
})

async function submit(): Promise<void> {
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
</style>
