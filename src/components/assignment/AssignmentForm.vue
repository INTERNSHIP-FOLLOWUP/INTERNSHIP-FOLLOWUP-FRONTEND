<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
    @click.self="$emit('close')"
  >
    <div class="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
      <!-- Header -->
      <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-slate-900">
          {{ isEdit ? $t('assignmentForm.editTitle') : $t('assignmentForm.createTitle') }}
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          {{
            isEdit
              ? $t('assignmentForm.editSubtitle')
              : $t('assignmentForm.createSubtitle')
          }}
        </p>
      </div>
      <button
        type="button"
        class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors dark:hover:bg-slate-800"
        @click="$emit('close')"
        :aria-label="$t('common.close')"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <div class="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
      <!-- Student -->
      <div class="space-y-1">
        <label
          for="student_id"
          class="block text-xs font-semibold text-slate-600 dark:text-slate-400"
        >
          Student <span class="text-red-500">*</span>
        </label>
        <select
          id="student_id"
          v-model.number="form.student_id"
          :aria-invalid="!!errors.student_id"
          :aria-describedby="errors.student_id ? 'student_id-error' : undefined"
          class="h-10 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-700 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-200"
          :class="inputClass('student_id')"
          @change="clearFieldError('student_id')"
        >
          <option :value="null" disabled>{{ $t('assignmentForm.selectStudent') }}</option>
          <option v-if="studentsLoading" disabled>{{ $t('assignmentForm.loading') }}</option>
          <option v-for="s in students" :key="s.id" :value="s.id">
            {{ s.name }}
          </option>
        </select>
        <p v-if="errors.student_id" id="student_id-error" class="text-xs font-medium text-red-500">
          {{ errors.student_id }}
        </p>
      </div>

      <!-- Company -->
      <div class="space-y-1">
        <label
          for="company_id"
          class="block text-xs font-semibold text-slate-600 dark:text-slate-400"
        >
          Company <span class="text-red-500">*</span>
        </label>
        <select
          id="company_id"
          v-model.number="form.company_id"
          :aria-invalid="!!errors.company_id"
          :aria-describedby="errors.company_id ? 'company_id-error' : undefined"
          class="h-10 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-700 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-200"
          :class="inputClass('company_id')"
          @change="clearFieldError('company_id')"
        >
          <option :value="null" disabled>{{ $t('assignmentForm.selectCompany') }}</option>
          <option v-if="companiesLoading" disabled>{{ $t('assignmentForm.loading') }}</option>
          <option v-for="c in companies" :key="c.id" :value="c.id">
            {{ c.company_name || c.name }}
          </option>
        </select>
        <p v-if="errors.company_id" id="company_id-error" class="text-xs font-medium text-red-500">
          {{ errors.company_id }}
        </p>
      </div>

      <!-- Tutor -->
      <div class="space-y-1">
        <label
          for="tutor_id"
          class="block text-xs font-semibold text-slate-600 dark:text-slate-400"
        >
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
          <option :value="null" disabled>{{ $t('assignmentForm.selectTutor') }}</option>
          <option v-if="tutorStore.loading" disabled>{{ $t('assignmentForm.loading') }}</option>
          <option v-for="t in tutorStore.tutorOptions" :key="t.value" :value="t.value">
            {{ t.label }}
          </option>
        </select>
        <p v-if="errors.tutor_id" id="tutor_id-error" class="text-xs font-medium text-red-500">
          {{ errors.tutor_id }}
        </p>
      </div>

      <!-- Position -->
      <div class="space-y-1">
        <label
          for="position"
          class="block text-xs font-semibold text-slate-600 dark:text-slate-400"
        >
          Position <span class="text-red-500">*</span>
        </label>
        <input
          id="position"
          v-model="form.position"
          type="text"
          :placeholder="$t('forms.positionPlaceholder')"
          maxlength="255"
          :aria-invalid="!!errors.position"
          :aria-describedby="errors.position ? 'position-error' : undefined"
          class="h-10 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
          :class="inputClass('position')"
          @input="clearFieldError('position')"
        />
        <p v-if="errors.position" id="position-error" class="text-xs font-medium text-red-500">
          {{ errors.position }}
        </p>
      </div>

      <!-- Start Date -->
      <div class="space-y-1">
        <label
          for="start_date"
          class="block text-xs font-semibold text-slate-600 dark:text-slate-400"
        >
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
        <p v-if="errors.start_date" id="start_date-error" class="text-xs font-medium text-red-500">
          {{ errors.start_date }}
        </p>
      </div>

      <!-- End Date -->
      <div class="space-y-1">
        <label
          for="end_date"
          class="block text-xs font-semibold text-slate-600 dark:text-slate-400"
        >
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
        <p v-if="errors.end_date" id="end_date-error" class="text-xs font-medium text-red-500">
          {{ errors.end_date }}
        </p>
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
          <option value="" disabled>{{ $t('assignmentForm.selectStatus') }}</option>
          <option v-for="s in allowedStatuses" :key="s.value" :value="s.value">
            {{ s.label }}
          </option>
        </select>
        <p v-if="errors.status" id="status-error" class="text-xs font-medium text-red-500">
          {{ errors.status }}
        </p>
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
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {{ submitting ? $t('assignmentForm.saving') : isEdit ? $t('assignmentForm.updateBtn') : $t('assignmentForm.createBtn') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAssignmentStore } from '@/stores/assignment'
import { useTutorStore } from '@/stores/tutorStore'
import { assignmentService } from '@/services/assignment'
import api from '@/services/api'
import type { Assignment, AssignmentStatus } from '@/types/assignment'

interface OptionItem {
  id: number
  name?: string
  company_name?: string
}

interface AssignmentFormData {
  student_id: number | null
  company_id: number | null
  tutor_id: number | null
  position: string
  start_date: string
  end_date: string
  status: AssignmentStatus | ''
}

const STATUS_LABELS: Record<AssignmentStatus, string> = {
  Assigned: 'messages.assignments.assignedStatus',
  'In Progress': 'messages.assignments.inProgressStatus',
  Completed: 'messages.assignments.completedStatus',
  Terminated: 'messages.assignments.terminatedStatus',
}

const VALID_TRANSITIONS: Record<AssignmentStatus, AssignmentStatus[]> = {
  Assigned: ['Assigned', 'In Progress', 'Terminated'],
  'In Progress': ['In Progress', 'Completed', 'Terminated'],
  Completed: ['Completed'],
  Terminated: ['Terminated'],
}

const props = withDefaults(
  defineProps<{ show?: boolean; assignmentId?: number; apiErrors?: Record<string, string> }>(),
  { show: false, assignmentId: undefined, apiErrors: () => ({}) },
)

const emit = defineEmits<{
  saved: [assignment: Assignment]
  close: []
}>()

const { t: $t_script } = useI18n()

const assignmentStore = useAssignmentStore()
const tutorStore = useTutorStore()

const isTutorDisabled = computed(() => {
  const current = form.status as AssignmentStatus
  return current === 'Completed' || current === 'Terminated'
})

const isEdit = computed(() => !!props.assignmentId)

const students = ref<OptionItem[]>([])
const companies = ref<OptionItem[]>([])
const studentsLoading = ref(false)
const companiesLoading = ref(false)

const form = reactive<AssignmentFormData>({
  student_id: null,
  company_id: null,
  tutor_id: null,
  position: '',
  start_date: '',
  end_date: '',
  status: '',
})

const allowedStatuses = computed(() => {
  const current = form.status as AssignmentStatus
  if (!isEdit.value || !current) {
    return Object.entries(STATUS_LABELS).map(([value, key]) => ({ value, label: $t_script(key) }))
  }
  const allowed = VALID_TRANSITIONS[current] ?? []
  return allowed.map((value) => ({ value, label: $t_script(STATUS_LABELS[value]) }))
})

const errors = reactive<Record<string, string>>({})
const formError = ref('')
const submitting = ref(false)

const requiredFields = [
  'student_id',
  'company_id',
  'tutor_id',
  'position',
  'start_date',
  'end_date',
] as const

function inputClass(field: string): string {
  return errors[field]
    ? 'border-error ring-1 ring-error/20 focus:border-error focus:ring-2 focus:ring-error/30'
    : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
}

function clearFieldError(field: string): void {
  delete errors[field]
  formError.value = ''
}

function validateField(field: string): boolean {
  const value = (form as Record<string, unknown>)[field]

  if (requiredFields.includes(field as (typeof requiredFields)[number]) && !value) {
    errors[field] = $t_script('validation.required')
    return false
  }

  if (field === 'start_date' && form.end_date && value && value > form.end_date) {
    errors[field] = $t_script('validation.startBeforeEnd')
    return false
  }

  if (field === 'end_date' && form.start_date && value && value < form.start_date) {
    errors[field] = $t_script('validation.endAfterStart')
    return false
  }

  delete errors[field]
  return true
}

function validateAll(): boolean {
  let valid = true
  for (const field of requiredFields) {
    if (!validateField(field)) valid = false
  }
  if (isEdit.value && !form.status) {
    errors.status = $t_script('validation.required')
    valid = false
  }
  return valid
}

async function handleSubmit(): Promise<void> {
  if (!validateAll()) return

  submitting.value = true
  formError.value = ''

  try {
    const payload = {
      student_id: form.student_id!,
      company_id: form.company_id!,
      tutor_id: form.tutor_id!,
      position: form.position,
      start_date: form.start_date,
      end_date: form.end_date,
    }

    const result = isEdit.value
      ? await assignmentStore.updateAssignment(props.assignmentId!, {
          ...payload,
          status: form.status as AssignmentStatus,
        })
      : await assignmentStore.createAssignment(payload)

    emit('saved', result)
    emit('close')
  } catch (err: unknown) {
    const axiosErr = err as {
      response?: { status?: number; data?: { errors?: Record<string, string[]> } }
    }
    if (axiosErr.response?.status === 422) {
      const apiErrs = axiosErr.response.data?.errors
      if (apiErrs) {
        for (const [key, messages] of Object.entries(apiErrs)) {
          if (messages.length > 0 && messages[0]) {
            errors[key] = messages[0]
          }
        }
      }
    } else {
      formError.value = err instanceof Error ? err.message : $t_script('validation.saveAssignmentFailed')
    }
  } finally {
    submitting.value = false
  }
}

function resetForm(): void {
  form.student_id = null
  form.company_id = null
  form.tutor_id = null
  form.position = ''
  form.start_date = ''
  form.end_date = ''
  form.status = ''
  Object.keys(errors).forEach((key) => delete errors[key])
  formError.value = ''
}

function populateForm(data: Assignment): void {
  form.student_id = data.student_id
  form.company_id = data.company_id
  form.tutor_id = data.tutor_id
  form.position = data.position
  form.start_date = data.start_date
  form.end_date = data.end_date
  form.status = data.status
  Object.keys(errors).forEach((key) => delete errors[key])
  formError.value = ''
}

async function loadDropdownData(): Promise<void> {
  studentsLoading.value = true
  companiesLoading.value = true

  try {
    const [studentsRes, companiesRes] = await Promise.all([
      api.get('/admin/students', { params: { per_page: 100 } }),
      api.get('/admin/companies', { params: { per_page: 200 } }),
    ])
    students.value = studentsRes.data.data ?? studentsRes.data
    companies.value = companiesRes.data.data ?? companiesRes.data
  } catch {
    formError.value = $t_script('validation.loadFailed')
  } finally {
    studentsLoading.value = false
    companiesLoading.value = false
  }
}

async function loadAssignmentDetails(id: number): Promise<void> {
  try {
    const data = await assignmentService.get(id)
    populateForm(data)
  } catch {
    formError.value = $t_script('validation.loadDetailsFailed')
  }
}

onMounted(async () => {
  tutorStore.fetchTutors()
  await loadDropdownData()
})

watch(
  () => props.show,
  async (isOpen) => {
    if (!isOpen) return

    await loadDropdownData()

    if (props.assignmentId) {
      await loadAssignmentDetails(props.assignmentId)
    } else {
      resetForm()
    }
  },
  { immediate: true },
)

watch(
  () => props.assignmentId,
  async (id) => {
    if (!props.show) return

    if (id) {
      await loadAssignmentDetails(id)
    } else {
      resetForm()
    }
  },
)

watch(
  () => props.apiErrors,
  (vals) => {
    if (vals) {
      formError.value = ''
      for (const [key, msg] of Object.entries(vals)) {
        if (key in errors) errors[key] = msg
      }
    }
  },
  { immediate: true },
)
</script>
