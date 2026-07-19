<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 pt-10 sm:items-center sm:pt-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assignment-form-title"
      @click.self="$emit('close')"
    >
      <transition name="scale" appear>
        <div
          ref="dialogRef"
          class="w-full max-w-2xl rounded-2xl border border-slate-100 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          @keydown.escape="$emit('close')"
        >
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-700">
            <div>
              <h2 id="assignment-form-title" class="text-base font-semibold text-slate-900 dark:text-white">
                {{ isEdit ? 'Edit Assignment' : 'New Assignment' }}
              </h2>
              <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                {{ isEdit ? 'Update the internship assignment below.' : 'Assign a student to a company with a tutor.' }}
              </p>
            </div>
            <button
              type="button"
              class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors dark:hover:bg-slate-800"
              @click="$emit('close')"
              aria-label="Close"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" novalidate class="px-6 py-5">
            <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <!-- Student -->
              <div class="space-y-1">
                <label for="student_id" class="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Student <span class="text-red-500">*</span>
                </label>
                <select
                  id="student_id"
                  v-model.number="form.student_id"
                  :disabled="isEdit"
                  :aria-invalid="!!errors.student_id"
                  :aria-describedby="errors.student_id ? 'student_id-error' : undefined"
                  class="h-10 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-700 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-200"
                  :class="inputClass('student_id')"
                  @change="clearFieldError('student_id')"
                >
                  <option :value="null" disabled>Select student</option>
                  <option v-if="studentsLoading" disabled>Loading...</option>
                  <option v-for="s in students" :key="s.id" :value="s.id">
                    {{ s.name }}
                  </option>
                </select>
                <p v-if="errors.student_id" id="student_id-error" class="text-xs font-medium text-red-500">{{ errors.student_id }}</p>
              </div>

              <!-- Company -->
              <div class="space-y-1">
                <label for="company_id" class="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Company <span class="text-red-500">*</span>
                </label>
                <select
                  id="company_id"
                  v-model.number="form.company_id"
                  :disabled="isEdit"
                  :aria-invalid="!!errors.company_id"
                  :aria-describedby="errors.company_id ? 'company_id-error' : undefined"
                  class="h-10 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-700 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-200"
                  :class="inputClass('company_id')"
                  @change="clearFieldError('company_id')"
                >
                  <option :value="null" disabled>Select company</option>
                  <option v-if="companiesLoading" disabled>Loading...</option>
                  <option v-for="c in companies" :key="c.id" :value="c.id">
                    {{ c.company_name || c.name }}
                  </option>
                </select>
                <p v-if="errors.company_id" id="company_id-error" class="text-xs font-medium text-red-500">{{ errors.company_id }}</p>
              </div>

              <!-- Tutor -->
              <div class="space-y-1">
                <label for="tutor_id" class="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Tutor <span class="text-red-500">*</span>
                </label>
                <select
                  id="tutor_id"
                  v-model.number="form.tutor_id"
                  :aria-invalid="!!errors.tutor_id"
                  :aria-describedby="errors.tutor_id ? 'tutor_id-error' : undefined"
                  class="h-10 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-700 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200"
                  :class="inputClass('tutor_id')"
                  :disabled="isTutorDisabled"
                  @change="clearFieldError('tutor_id')"
                >
                  <option :value="null" disabled>Select tutor</option>
                  <option v-if="tutorStore.loading" disabled>Loading...</option>
                  <option v-for="t in tutorStore.tutorOptions" :key="t.value" :value="t.value">
                    {{ t.label }}
                  </option>
                </select>
                <p v-if="errors.tutor_id" id="tutor_id-error" class="text-xs font-medium text-red-500">{{ errors.tutor_id }}</p>
              </div>

              <!-- Position -->
              <div class="space-y-1">
                <label for="position" class="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Position <span class="text-red-500">*</span>
                </label>
                <input
                  id="position"
                  v-model="form.position"
                  type="text"
                  placeholder="e.g. Software Engineer Intern"
                  maxlength="255"
                  :aria-invalid="!!errors.position"
                  :aria-describedby="errors.position ? 'position-error' : undefined"
                  class="h-10 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
                  :class="inputClass('position')"
                  @input="clearFieldError('position')"
                />
                <p v-if="errors.position" id="position-error" class="text-xs font-medium text-red-500">{{ errors.position }}</p>
              </div>

              <!-- Start Date -->
              <div class="space-y-1">
                <label for="start_date" class="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Start Date <span class="text-red-500">*</span>
                </label>
                <input
                  id="start_date"
                  v-model="form.start_date"
                  type="date"
                  :aria-invalid="!!errors.start_date"
                  :aria-describedby="errors.start_date ? 'start_date-error' : undefined"
                  class="h-10 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-700 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-200 [color-scheme:light] dark:[color-scheme:dark]"
                  :class="inputClass('start_date')"
                  @change="clearFieldError('start_date')"
                />
                <p v-if="errors.start_date" id="start_date-error" class="text-xs font-medium text-red-500">{{ errors.start_date }}</p>
              </div>

              <!-- End Date -->
              <div class="space-y-1">
                <label for="end_date" class="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  End Date <span class="text-red-500">*</span>
                </label>
                <input
                  id="end_date"
                  v-model="form.end_date"
                  type="date"
                  :aria-invalid="!!errors.end_date"
                  :aria-describedby="errors.end_date ? 'end_date-error' : undefined"
                  class="h-10 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-700 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-200 [color-scheme:light] dark:[color-scheme:dark]"
                  :class="inputClass('end_date')"
                  @change="clearFieldError('end_date')"
                />
                <p v-if="errors.end_date" id="end_date-error" class="text-xs font-medium text-red-500">{{ errors.end_date }}</p>
              </div>

              <!-- Status (edit only) -->
              <div v-if="isEdit" class="space-y-1">
                <label for="status" class="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Status <span class="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  v-model="form.status"
                  :aria-invalid="!!errors.status"
                  :aria-describedby="errors.status ? 'status-error' : undefined"
                  class="h-10 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-700 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-200"
                  :class="inputClass('status')"
                  @change="clearFieldError('status')"
                >
                  <option value="" disabled>Select status</option>
                  <option v-for="s in allowedStatuses" :key="s.value" :value="s.value">
                    {{ s.label }}
                  </option>
                </select>
                <p v-if="errors.status" id="status-error" class="text-xs font-medium text-red-500">{{ errors.status }}</p>
              </div>
            </div>

            <!-- Form error -->
            <p
              v-if="formError"
              role="alert"
              class="mt-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400"
            >
              {{ formError }}
            </p>

            <!-- Actions -->
            <div class="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                :disabled="submitting"
                class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                @click="$emit('close')"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg v-if="submitting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {{ submitting ? 'Saving...' : isEdit ? 'Update Assignment' : 'Create Assignment' }}
              </button>
            </div>
          </form>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { useAssignmentStore } from '@/stores/assignment'
import { useTutorStore } from '@/stores/tutorStore'
import { assignmentService } from '@/services/assignment'
import api from '@/services/api'
import { mapValidationErrors } from '@/utils/mapValidationErrors'
import type { AssignmentStatus, Assignment, CreateAssignmentPayload, UpdateAssignmentPayload } from '@/types/assignment'

interface OptionItem {
  id: number
  name?: string
  company_name?: string
}

const VALID_TRANSITIONS: Record<AssignmentStatus, AssignmentStatus[]> = {
  Assigned: ['In Progress', 'Terminated'],
  'In Progress': ['Completed', 'Terminated'],
  Completed: [],
  Terminated: ['Assigned'],
}

const props = withDefaults(
  defineProps<{
    show: boolean
    assignmentId?: number
  }>(),
  { assignmentId: undefined },
)

const emit = defineEmits<{
  close: []
  saved: [assignment: Assignment]
}>()

const assignmentStore = useAssignmentStore()
const tutorStore = useTutorStore()

const dialogRef = ref<HTMLElement | null>(null)
const isEdit = computed(() => !!props.assignmentId)

const students = ref<OptionItem[]>([])
const companies = ref<OptionItem[]>([])
const studentsLoading = ref(false)
const companiesLoading = ref(false)

const form = reactive({
  student_id: null as number | null,
  company_id: null as number | null,
  tutor_id: null as number | null,
  position: '',
  start_date: '',
  end_date: '',
  status: '' as AssignmentStatus | '',
})

const errors = reactive<Record<string, string>>({})
const formError = ref('')
const submitting = ref(false)

const requiredFields = ['student_id', 'company_id', 'tutor_id', 'position', 'start_date', 'end_date'] as const

const isTutorDisabled = computed(() => {
  return form.status === 'Completed' || form.status === 'Terminated'
})

const allowedStatuses = computed(() => {
  const current = form.status as AssignmentStatus
  if (!current) return []
  const allowed = VALID_TRANSITIONS[current] ?? []
  return allowed.map((value) => ({ value, label: value }))
})

function inputClass(field: string): Record<string, boolean> {
  return {
    'border-slate-200 focus:border-indigo-300 focus:ring-indigo-500/20 dark:border-slate-600': !errors[field],
    'border-red-300 focus:border-red-400 focus:ring-red-500/20 dark:border-red-500': !!errors[field],
  }
}

function clearFieldError(field: string): void {
  delete errors[field]
  formError.value = ''
}

function validate(): boolean {
  let valid = true
  for (const key of Object.keys(errors)) delete errors[key]
  formError.value = ''

  for (const field of requiredFields) {
    const value = form[field]
    if (value === null || value === '' || (typeof value === 'string' && !value.trim())) {
      errors[field] = 'This field is required.'
      valid = false
    }
  }

  if (form.start_date && form.end_date && form.start_date >= form.end_date) {
    errors.end_date = 'End date must be after start date.'
    valid = false
  }

  if (isEdit.value && !form.status) {
    errors.status = 'This field is required.'
    valid = false
  }

  return valid
}

async function handleSubmit(): Promise<void> {
  if (!validate()) return

  submitting.value = true
  formError.value = ''

    try {
      const payload: CreateAssignmentPayload = {
        student_id: form.student_id!,
        company_id: form.company_id!,
        tutor_id: form.tutor_id!,
        position: form.position.trim(),
        start_date: form.start_date,
        end_date: form.end_date,
      }

      let result: Assignment

      if (isEdit.value) {
        const updatePayload: UpdateAssignmentPayload = { ...payload }
        if (form.status && form.status !== originalStatus) {
          updatePayload.status = form.status as AssignmentStatus
        }
        result = await assignmentStore.updateAssignment(props.assignmentId!, updatePayload)
      } else {
        result = await assignmentStore.createAssignment(payload)
      }

    emit('saved', result)
  } catch (err: unknown) {
    const axiosErr = err as {
      response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } }
    }
    if (axiosErr.response?.status === 422 && axiosErr.response.data?.errors) {
      const mapped = mapValidationErrors(axiosErr.response.data.errors)
      if (Object.keys(mapped).length > 0) {
        for (const [key, msg] of Object.entries(mapped)) {
          errors[key] = msg
        }
        return
      }
    }
    formError.value = axiosErr?.response?.data?.message || 'Failed to save assignment.'
  } finally {
    submitting.value = false
  }
}

let originalStatus: AssignmentStatus | null = null

function populateForm(data: Assignment): void {
  form.student_id = data.student_id
  form.company_id = data.company_id
  form.tutor_id = data.tutor_id
  form.position = data.position
  form.start_date = data.start_date
  form.end_date = data.end_date
  form.status = data.status
  originalStatus = data.status
}

function trapFocus(e: KeyboardEvent) {
  if (e.key !== 'Tab' || !dialogRef.value) return
  const focusable = dialogRef.value.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )
  if (focusable.length === 0) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last?.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first?.focus()
  }
}

watch(
  () => props.show,
  async (val) => {
    if (!val) return

    const [studentsRes, companiesRes] = await Promise.all([
      api.get('/admin/users', { params: { role: 'student', per_page: 200 } }),
      api.get('/admin/companies', { params: { per_page: 200 } }).catch(() => null),
    ])

    if (studentsRes?.data) {
      students.value = studentsRes.data.data ?? studentsRes.data
    }

    if (companiesRes?.data) {
      companies.value = companiesRes.data.data ?? companiesRes.data
    }

    if (!tutorStore.loaded) {
      tutorStore.fetchTutors()
    }

    if (props.assignmentId) {
      try {
        const data = await assignmentService.get(props.assignmentId)
        populateForm(data)
      } catch {
        formError.value = 'Failed to load assignment details.'
      }
    } else {
      form.student_id = null
      form.company_id = null
      form.tutor_id = null
      form.position = ''
      form.start_date = ''
      form.end_date = ''
      form.status = ''
      originalStatus = null
    }

    for (const key of Object.keys(errors)) delete errors[key]
    formError.value = ''

    nextTick(() => {
      document.addEventListener('keydown', trapFocus)
    })
  },
)

watch(
  () => props.assignmentId,
  () => {
    if (!props.assignmentId) {
      originalStatus = null
    }
  },
)
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
.scale-enter-active {
  transition: all 0.2s ease-out;
}
.scale-leave-active {
  transition: all 0.15s ease-in;
}
.scale-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(4px);
}
.scale-leave-to {
  opacity: 0;
  transform: scale(0.97) translateY(2px);
}
</style>
