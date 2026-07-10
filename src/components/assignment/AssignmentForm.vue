<template>
  <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-slate-900">
          {{ isEdit ? 'Edit Assignment' : 'New Assignment' }}
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          {{
            isEdit
              ? 'Update the internship assignment below.'
              : 'Assign a student to a company with a tutor.'
          }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
      <!-- Student -->
      <div class="space-y-1.5">
        <label for="student_id" class="block text-sm font-medium text-slate-700">
          Student <span class="text-error">*</span>
        </label>
        <select
          id="student_id"
          v-model.number="form.student_id"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition-all duration-200"
          :class="inputClass('student_id')"
          @change="clearFieldError('student_id')"
          @blur="validateField('student_id')"
        >
          <option :value="null" disabled>Select student</option>
          <option v-if="studentsLoading" disabled>Loading...</option>
          <option v-for="s in students" :key="s.id" :value="s.id">
            {{ s.name }}
          </option>
        </select>
        <p v-if="errors.student_id" class="text-sm text-error">{{ errors.student_id }}</p>
      </div>

      <!-- Company -->
      <div class="space-y-1.5">
        <label for="company_id" class="block text-sm font-medium text-slate-700">
          Company <span class="text-error">*</span>
        </label>
        <select
          id="company_id"
          v-model.number="form.company_id"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition-all duration-200"
          :class="inputClass('company_id')"
          @change="clearFieldError('company_id')"
          @blur="validateField('company_id')"
        >
          <option :value="null" disabled>Select company</option>
          <option v-if="companiesLoading" disabled>Loading...</option>
          <option v-for="c in companies" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
        <p v-if="errors.company_id" class="text-sm text-error">{{ errors.company_id }}</p>
      </div>

      <!-- Tutor -->
      <div class="space-y-1.5">
        <label for="tutor_id" class="block text-sm font-medium text-slate-700">
          Tutor <span class="text-error">*</span>
        </label>
        <select
          id="tutor_id"
          v-model.number="form.tutor_id"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition-all duration-200"
          :class="inputClass('tutor_id')"
          @change="clearFieldError('tutor_id')"
          @blur="validateField('tutor_id')"
        >
          <option :value="null" disabled>Select tutor</option>
          <option v-if="tutorStore.loading" disabled>Loading...</option>
          <option v-for="t in tutorStore.tutors" :key="t.id" :value="t.id">
            {{ t.name }}
          </option>
        </select>
        <p v-if="errors.tutor_id" class="text-sm text-error">{{ errors.tutor_id }}</p>
      </div>

      <!-- Position -->
      <div class="space-y-1.5">
        <label for="position" class="block text-sm font-medium text-slate-700">
          Position <span class="text-error">*</span>
        </label>
        <input
          id="position"
          v-model="form.position"
          type="text"
          placeholder="e.g. Software Engineer Intern"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200"
          :class="inputClass('position')"
          @input="clearFieldError('position')"
          @blur="validateField('position')"
        />
        <p v-if="errors.position" class="text-sm text-error">{{ errors.position }}</p>
      </div>

      <!-- Start Date -->
      <div class="space-y-1.5">
        <label for="start_date" class="block text-sm font-medium text-slate-700">
          Start Date <span class="text-error">*</span>
        </label>
        <input
          id="start_date"
          v-model="form.start_date"
          type="date"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition-all duration-200"
          :class="inputClass('start_date')"
          @change="clearFieldError('start_date')"
          @blur="validateField('start_date')"
        />
        <p v-if="errors.start_date" class="text-sm text-error">{{ errors.start_date }}</p>
      </div>

      <!-- End Date -->
      <div class="space-y-1.5">
        <label for="end_date" class="block text-sm font-medium text-slate-700">
          End Date <span class="text-error">*</span>
        </label>
        <input
          id="end_date"
          v-model="form.end_date"
          type="date"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition-all duration-200"
          :class="inputClass('end_date')"
          @change="clearFieldError('end_date')"
          @blur="validateField('end_date')"
        />
        <p v-if="errors.end_date" class="text-sm text-error">{{ errors.end_date }}</p>
      </div>

      <!-- Status (edit only) -->
      <div v-if="isEdit" class="space-y-1.5">
        <label for="status" class="block text-sm font-medium text-slate-700">
          Status <span class="text-error">*</span>
        </label>
        <select
          id="status"
          v-model="form.status"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition-all duration-200"
          :class="inputClass('status')"
          @change="clearFieldError('status')"
          @blur="validateField('status')"
        >
          <option value="" disabled>Select status</option>
          <option v-for="s in allowedStatuses" :key="s.value" :value="s.value">
            {{ s.label }}
          </option>
        </select>
        <p v-if="errors.status" class="text-sm text-error">{{ errors.status }}</p>
      </div>
    </div>

    <!-- Form error -->
    <div
      v-if="formError"
      class="rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm font-medium text-error"
    >
      {{ formError }}
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
      <button
        type="button"
        @click="$emit('cancel')"
        class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
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
        {{ isEdit ? 'Update Assignment' : 'Create Assignment' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAssignmentStore } from '@/stores/assignment'
import { useTutorStore } from '@/stores/tutorStore'
import { assignmentService } from '@/services/assignment'
import api from '@/services/api'
import type { User } from '@/types/auth'
import type { AssignmentStatus, Assignment } from '@/types/assignment'

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
  assigned: 'Assigned',
  in_progress: 'In Progress',
  completed: 'Completed',
  terminated: 'Terminated',
}

const VALID_TRANSITIONS: Record<AssignmentStatus, AssignmentStatus[]> = {
  assigned: ['assigned', 'in_progress', 'terminated'],
  in_progress: ['in_progress', 'completed', 'terminated'],
  completed: ['completed'],
  terminated: ['terminated'],
}

const props = withDefaults(
  defineProps<{ assignmentId?: number }>(),
  { assignmentId: undefined },
)

const emit = defineEmits<{
  saved: [assignment: Assignment]
  cancel: []
}>()

const assignmentStore = useAssignmentStore()
const tutorStore = useTutorStore()

const isEdit = computed(() => !!props.assignmentId)

const students = ref<User[]>([])
const companies = ref<User[]>([])
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
    return Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))
  }
  const allowed = VALID_TRANSITIONS[current] ?? []
  return allowed.map((value) => ({ value, label: STATUS_LABELS[value] }))
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
    errors[field] = 'This field is required.'
    return false
  }

  if (field === 'start_date' && form.end_date && value && value > form.end_date) {
    errors[field] = 'Start date must be before end date.'
    return false
  }

  if (field === 'end_date' && form.start_date && value && value < form.start_date) {
    errors[field] = 'End date must be after start date.'
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
    errors.status = 'This field is required.'
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
  } catch (err: unknown) {
    formError.value = err instanceof Error ? err.message : 'Failed to save assignment.'
  } finally {
    submitting.value = false
  }
}

function populateForm(data: Assignment): void {
  form.student_id = data.student_id
  form.company_id = data.company_id
  form.tutor_id = data.tutor_id
  form.position = data.position
  form.start_date = data.start_date
  form.end_date = data.end_date
  form.status = data.status
}

onMounted(async () => {
  studentsLoading.value = true
  companiesLoading.value = true
  tutorStore.fetchTutors()

  try {
    const [studentsRes, companiesRes] = await Promise.all([
      api.get('/admin/users', { params: { role: 'student', per_page: 200 } }),
      api.get('/admin/users', { params: { role: 'company', per_page: 200 } }),
    ])
    students.value = studentsRes.data.data ?? studentsRes.data
    companies.value = companiesRes.data.data ?? companiesRes.data
  } catch {
    formError.value = 'Failed to load dropdown data.'
  } finally {
    studentsLoading.value = false
    companiesLoading.value = false
  }

  if (props.assignmentId) {
    try {
      const data = await assignmentService.get(props.assignmentId)
      populateForm(data)
    } catch {
      formError.value = 'Failed to load assignment details.'
    }
  }
})
</script>
