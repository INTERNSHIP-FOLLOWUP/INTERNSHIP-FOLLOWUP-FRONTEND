<!-- src/views/followup/FollowupForm.vue -->
<template>
  <transition name="form-scale" appear>
    <div
      class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 py-8 backdrop-blur-sm"
      @click.self="$emit('cancelled')"
      @keydown.escape="$emit('cancelled')"
    >
      <div class="my-8 max-h-[90vh] w-[92%] max-w-2xl overflow-y-auto rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
        <form @submit.prevent="submit" class="space-y-6" novalidate>
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">
                {{ isEdit ? 'Edit Follow-up' : 'New Follow-up' }}
              </h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {{
                  isEdit
                    ? 'Update the follow-up record below.'
                    : 'Fill in the details to record a follow-up meeting.'
                }}
              </p>
            </div>
          </div>

          <ErrorAlert :message="submitError" />

          <div class="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <!-- Student selector -->
            <div class="sm:col-span-2">
              <FormField label="Student" :error="errors.student_id" required>
                <!-- Student: auto-filled readonly field -->
                <input
                  v-if="isStudent"
                  :value="studentDisplayName"
                  type="text"
                  readonly
                  class="block w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] text-slate-500 outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400"
                />

                <!-- Tutor/Admin: select or search student -->
                <div v-else-if="canSearchStudents" class="relative">
                  <div class="relative">
                    <svg class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      ref="studentSearchInput"
                      v-model="studentSearch"
                      type="text"
                      placeholder="Select or search student..."
                      autocomplete="off"
                      @input="onStudentSearchInput"
                      @focus="onStudentSearchFocus"
                      @blur="onStudentSearchBlur"
                      class="block w-full rounded-xl border bg-white py-3 pl-10 pr-10 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
                      :class="inputClass('student_id')"
                    />
                    <!-- Clear button when student is selected -->
                    <button
                      v-if="form.student_id && studentSearch"
                      type="button"
                      @click="clearStudent"
                      class="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-600 dark:hover:text-slate-300"
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
                      class="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg shadow-slate-200/50 dark:border-slate-600 dark:bg-slate-700 dark:shadow-black/20"
                    >
                      <button
                        v-for="(s, idx) in studentResults"
                        :key="s.id"
                        type="button"
                        @mousedown.prevent="selectStudent(s)"
                        class="flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                        :class="idx < studentResults.length - 1 ? 'border-b border-slate-50 dark:border-slate-600' : ''"
                      >
                        <div class="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                          <img
                            v-if="studentPhotoUrl(s)"
                            :src="studentPhotoUrl(s) || undefined"
                            alt="Student photo"
                            class="h-full w-full object-cover"
                            @error="onPhotoError(s)"
                          />
                          <div
                            v-else
                            class="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-50 text-xs font-bold text-indigo-600 dark:from-indigo-800 dark:to-indigo-900 dark:text-indigo-300"
                          >
                            {{ s.name?.charAt(0)?.toUpperCase() || '?' }}
                          </div>
                        </div>
                        <div class="min-w-0">
                          <p class="truncate font-medium text-slate-800 dark:text-slate-200">{{ s.name }}</p>
                          <p class="truncate text-xs text-slate-400 dark:text-slate-400">
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
                      class="absolute z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-center shadow-lg shadow-slate-200/50 dark:border-slate-600 dark:bg-slate-700 dark:shadow-black/20"
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
                  class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
                  :class="inputClass('student_id')"
                />
              </FormField>
            </div>

            <FormField label="Meeting Type" :error="errors.meeting_type" required>
              <select
                v-model="form.meeting_type"
                class="block w-full appearance-none rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition-all duration-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                :class="inputClass('meeting_type')"
                @change="clearFieldError('meeting_type')"
              >
                <option value="" disabled>Select meeting type</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
              </select>
            </FormField>

            <FormField label="Meeting Date" :error="errors.meeting_date" required>
              <input
                v-model="form.meeting_date"
                type="date"
                class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition-all duration-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                :class="inputClass('meeting_date')"
                @input="clearFieldError('meeting_date')"
              />
            </FormField>

            <div class="sm:col-span-2">
              <FormField label="Notes" :error="errors.notes" required>
                <textarea
                  v-model="form.notes"
                  rows="3"
                  maxlength="5000"
                  placeholder="Enter meeting notes..."
                  class="block w-full resize-none rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
                  :class="inputClass('notes')"
                  @input="clearFieldError('notes')"
                ></textarea>
                <p v-if="form.notes" class="text-right text-xs text-slate-400 dark:text-slate-500">{{ notesLength }} / 5000</p>
              </FormField>
            </div>

            <div class="sm:col-span-2">
              <FormField label="Action Items (optional)">
                <textarea
                  v-model="form.action_items"
                  rows="3"
                  maxlength="5000"
                  placeholder="Enter action items..."
                  class="block w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
                ></textarea>
                <p v-if="form.action_items" class="text-right text-xs text-slate-400 dark:text-slate-500">{{ actionItemsLength }} / 5000</p>
              </FormField>
            </div>

            <FormField label="Next Follow-up Date (optional)">
              <input
                v-model="form.next_followup"
                type="date"
                class="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              />
            </FormField>
          </div>

          <div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-700">
            <button
              type="button"
              @click="$emit('cancelled')"
              class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-500/20 transition-all duration-200 hover:from-primary-700 hover:to-primary-600 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg v-if="submitting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {{ submitting ? 'Saving...' : (isEdit ? 'Update Follow-up' : 'Add Follow-up') }}
            </button>
          </div>
        </form>
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
import FormField from '@/components/ui/FormField.vue'

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

function inputClass(field: keyof typeof errors): string {
  return errors[field]
    ? 'border-error ring-1 ring-error/20 focus:border-error focus:ring-2 focus:ring-error/30 dark:border-red-700 dark:ring-red-800/30'
    : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600'
}

function clearFieldError(field: keyof typeof errors): void {
  errors[field] = ''
  submitError.value = null
}

// ── Student search state ──
type StudentOption = {
  id: number
  name: string
  student_code?: string
  email?: string
  photo_url?: string | null
  photo?: string | null
}

const studentSearchInput = ref<HTMLInputElement | null>(null)
const studentSearch = ref('')
const studentResults = ref<StudentOption[]>([])
const initialStudents = ref<StudentOption[]>([])
const failedPhotos = ref<Set<string>>(new Set())

function studentPhotoUrl(s: StudentOption): string | null {
  const url = s.photo_url || s.photo
  if (!url || failedPhotos.value.has(url)) return null
  if (/^https?:\/\//.test(url)) return url
  const base = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/?api\/?$/, '')
  if (url.startsWith('/storage/')) return `${base}${url}`
  return `${base}/storage/${url.replace(/^\//, '')}`
}

function onPhotoError(s: StudentOption) {
  const url = s.photo_url || s.photo
  if (url) {
    const next = new Set(failedPhotos.value)
    next.add(url)
    failedPhotos.value = next
  }
}
const showStudentDropdown = ref(false)
const searchingStudents = ref(false)
let searchTimeout: ReturnType<typeof setTimeout> | null = null

// On edit mode, pre-fill student name from existing follow-up data
if (props.followup?.student?.name) {
  studentSearch.value = props.followup.student.name
}

// Preload the tutor's/admin's assigned students so the field works as a
// select: clicking it shows the full list without needing to type first.
async function loadInitialStudents() {
  if (!canSearchStudents.value) return
  try {
    const res = await api.get(`/${searchRolePrefix.value}/students`, {
      params: { per_page: 100 },
    })
    initialStudents.value = Array.isArray(res.data.data) ? res.data.data : Array.isArray(res.data) ? res.data : []
  } catch {
    initialStudents.value = []
  }
}
loadInitialStudents()

function onStudentSearchFocus() {
  if (studentSearch.value.length < 2 && studentResults.value.length === 0) {
    studentResults.value = initialStudents.value
  }
  showStudentDropdown.value = studentResults.value.length > 0
}

async function onStudentSearchInput() {
  if (searchTimeout) clearTimeout(searchTimeout)

  if (studentSearch.value.length < 2) {
    studentResults.value = initialStudents.value
    showStudentDropdown.value = initialStudents.value.length > 0
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
    errors.student_id = isStudent.value ? 'Please select a student.' : 'Please select a student from the list.'
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
