<template>
  <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-slate-900">
          {{ isEdit ? 'Edit Student' : 'Add Student' }}
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          {{
            isEdit
              ? 'Update the student record below.'
              : 'Fill in the details to register a new student.'
          }}
        </p>
      </div>
    </div>

    <!-- Photo Upload -->
    <div class="flex items-start gap-5">
      <!-- Avatar with click-to-change overlay -->
      <div class="relative group shrink-0" @click="fileInput?.click()">
        <div
          class="relative h-24 w-24 cursor-pointer overflow-hidden rounded-2xl shadow-md ring-4 transition-all duration-300"
          :class="errors.photo ? 'ring-red-200' : 'ring-slate-100 group-hover:ring-blue-200'"
        >
          <!-- Photo or placeholder -->
          <img
            v-if="photoPreview"
            :src="photoPreview"
            alt="Profile photo"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div
            v-else
            class="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200"
          >
            <svg class="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <!-- Hover overlay -->
          <div class="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100 rounded-2xl">
            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="text-[10px] font-semibold text-white tracking-wide">Change</span>
          </div>
        </div>
        <!-- Badge indicator for existing photo -->
        <div
          v-if="photoPreview"
          class="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white shadow-sm"
        >
          <svg class="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <!-- Upload controls -->
      <div class="flex flex-col justify-center gap-2 pt-1">
        <div>
          <p class="text-sm font-semibold text-slate-800">Profile Photo</p>
          <p class="text-xs text-slate-400">JPG or PNG · Max 2 MB</p>
        </div>
        <div class="flex items-center gap-2">
          <label
            for="photo"
            class="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:border-slate-300"
          >
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ photoPreview ? 'Change Photo' : 'Upload Photo' }}
          </label>
          <button
            v-if="photoPreview"
            type="button"
            @click="removePhoto"
            class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Remove
          </button>
        </div>
        <p v-if="errors.photo" class="text-xs text-red-500 font-medium">{{ errors.photo }}</p>
      </div>

      <!-- Hidden file input -->
      <input
        id="photo"
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png"
        class="sr-only"
        :aria-invalid="!!errors.photo"
        @change="onFileChange"
      />
    </div>

    <div class="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
      <FormField label="Student ID" :error="errors.student_code" required>
        <input
          v-model="form.student_code"
          type="text"
          placeholder="PNC2026-001"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200"
          :class="inputClass('student_code')"
          @input="clearFieldError('student_code')"
          @blur="validateField('student_code')"
        />
      </FormField>

      <FormField label="First Name" :error="errors.first_name" required>
        <input
          v-model="form.first_name"
          type="text"
          placeholder="Enter first name"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200"
          :class="inputClass('first_name')"
          @input="clearFieldError('first_name')"
          @blur="validateField('first_name')"
        />
      </FormField>

      <FormField label="Last Name" :error="errors.last_name" required>
        <input
          v-model="form.last_name"
          type="text"
          placeholder="Enter last name"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200"
          :class="inputClass('last_name')"
          @input="clearFieldError('last_name')"
          @blur="validateField('last_name')"
        />
      </FormField>

      <FormField label="Email" :error="errors.email" required>
        <input
          v-model="form.email"
          type="email"
          placeholder="Enter email address"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200"
          :class="inputClass('email')"
          @input="clearFieldError('email')"
          @blur="validateField('email')"
        />
      </FormField>

      <FormField label="Phone" :error="errors.phone">
        <input
          v-model="form.phone"
          type="tel"
          placeholder="Enter phone number"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200"
          :class="inputClass('phone')"
          @input="clearFieldError('phone')"
          @blur="validateField('phone')"
        />
      </FormField>

      <FormField label="Gender" :error="errors.gender" required>
        <select
          v-model="form.gender"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition-all duration-200"
          :class="inputClass('gender')"
          @change="clearFieldError('gender')"
          @blur="validateField('gender')"
        >
          <option value="" disabled>Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </FormField>

      <FormField label="Batch" :error="errors.batch_id" required>
        <select
          v-model.number="form.batch_id"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition-all duration-200"
          :class="inputClass('batch_id')"
          @change="clearFieldError('batch_id')"
          @blur="validateField('batch_id')"
        >
          <option :value="null" disabled>Select batch</option>
          <option v-if="batchStore.loading" disabled>Loading...</option>
          <option v-for="b in batchStore.batches" :key="b.id" :value="b.id">
            {{ b.batch_name || b.name }}
          </option>
        </select>
      </FormField>

      <FormField label="Tutor" :error="errors.tutor_id" required>
        <select
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
        <p v-if="tutorStore.error" class="mt-1 text-xs text-error">{{ tutorStore.error }}</p>
      </FormField>

      <FormField label="Status" :error="errors.status" required>
        <select
          v-model="form.status"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition-all duration-200"
          :class="inputClass('status')"
          @change="clearFieldError('status')"
          @blur="validateField('status')"
        >
          <option value="" disabled>Select status</option>
          <option value="active">Active</option>
          <option value="deactivated">Deactivated</option>
        </select>
      </FormField>
    </div>

    <!-- Form error -->
    <div
      v-if="formError"
      role="alert"
      aria-live="polite"
      class="rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm font-medium text-error"
    >
      {{ formError }}
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
      <button type="button" @click="$emit('cancel')"
        class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
        Cancel
      </button>
      <button
        type="submit"
        :disabled="submitting"
        class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-500/20 transition-all duration-200 hover:from-primary-700 hover:to-primary-600 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
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
        {{ isEdit ? 'Update Student' : 'Add Student' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { useStudentStore } from '@/stores/student'
import { useBatchStore } from '@/stores/batchStore'
import { useTutorStore } from '@/stores/tutorStore'
import api from '@/services/api'
import FormField from '@/components/ui/FormField.vue'
import type { StudentFormData, StudentStatus } from '@/types/student'

const props = withDefaults(
  defineProps<{
    studentId?: number
    apiErrors?: Record<string, string>
  }>(),
  { studentId: undefined, apiErrors: () => ({}) },
)

const emit = defineEmits<{
  saved: [student: unknown]
  cancel: []
}>()

const studentStore = useStudentStore()
const batchStore = useBatchStore()
const tutorStore = useTutorStore()

const isEdit = computed(() => !!props.studentId)

const form = reactive<StudentFormData & { status: string; photo: File | null }>({
  student_code: '',
  name: '',
  first_name: '',
  last_name: '',
  email: '',
  gender: '',
  phone: '',
  batch_id: null,
  tutor_id: null,
  status: '',
  password: '12345678',
  password_confirmation: '12345678',
  photo: null,
})

const errors = reactive<Record<string, string | undefined>>({})
const formError = ref('')
const submitting = ref(false)
const photoPreview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const originalPhoto = ref<string | null>(null)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[\d\s\-+()]{7,20}$/

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

  if (field === 'password_confirmation') {
    if (form.password !== form.password_confirmation) {
      errors[field] = 'Passwords do not match.'
      return false
    }
    delete errors[field]
    return true
  }

  if (field === 'password') {
    if (value && (value as string).length < 8) {
      errors[field] = 'Password must be at least 8 characters.'
      return false
    }
    if (!value && !isEdit.value) {
      errors[field] = 'Password is required.'
      return false
    }
    delete errors[field]
    return true
  }

  if (field === 'phone' && value) {
    if (!PHONE_RE.test(value as string)) {
      errors[field] = 'Please enter a valid phone number.'
      return false
    }
    delete errors[field]
    return true
  }

  if (!value || (typeof value === 'string' && !value.trim())) {
    if (field === 'phone') return true
    errors[field] = 'This field is required.'
    return false
  }

  if (field === 'email' && !EMAIL_RE.test(value as string)) {
    errors[field] = 'Please enter a valid email address.'
    return false
  }

  delete errors[field]
  return true
}

function validateAll(): boolean {
  const fieldsToValidate = [
    'student_code',
    'first_name',
    'last_name',
    'email',
    'gender',
    'batch_id',
    'tutor_id',
    'status',
  ]
  if (!isEdit.value) fieldsToValidate.push('password')
  return fieldsToValidate.every((field) => validateField(field))
}

function onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    errors.photo = 'Only JPG and PNG files are allowed.'
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    errors.photo = 'File size must be under 2MB.'
    return
  }

  delete errors.photo
  form.photo = file

  if (photoPreview.value) URL.revokeObjectURL(photoPreview.value)
  photoPreview.value = URL.createObjectURL(file)
}

function removePhoto(): void {
  form.photo = null
  if (photoPreview.value) {
    URL.revokeObjectURL(photoPreview.value)
    photoPreview.value = originalPhoto.value
  }
  if (fileInput.value) fileInput.value.value = ''
}

async function handleSubmit(): Promise<void> {
  if (!validateAll()) return

  submitting.value = true
  formError.value = ''

  try {
    const basePayload: StudentFormData & Record<string, unknown> = {
      ...form,
      name: `${form.first_name} ${form.last_name}`.trim(),
    }

    // Don't send photo field if no new file was selected (edit mode keeps existing)
    if (basePayload.photo === null || basePayload.photo === originalPhoto.value) {
      delete basePayload.photo
    }

    if (isEdit.value && props.studentId) {
      if (form.status === 'deactivated') {
        await api.put(`/admin/users/${props.studentId}/deactivate`).catch(() => {})
      } else {
        await api.put(`/admin/users/${props.studentId}/activate`).catch(() => {})
      }
    }

    const result = isEdit.value
      ? await studentStore.updateStudent(props.studentId!, omitPassword(basePayload))
      : await studentStore.createStudent(basePayload)

    emit('saved', result)
  } catch (err: unknown) {
    const axiosErr = err as {
      response?: { status?: number; data?: { errors?: Record<string, string[]>; message?: string } }
    }
    if (axiosErr.response?.status === 422) {
      const apiErrs = axiosErr.response.data?.errors
      if (apiErrs) {
        const { mapValidationErrors } = await import('@/utils/mapValidationErrors')
        const mapped = mapValidationErrors(apiErrs)
        for (const [key, msg] of Object.entries(mapped)) {
          ;(errors as Record<string, string>)[key] = msg
        }
      }
    } else {
      formError.value =
        axiosErr.response?.data?.message ||
        (err instanceof Error ? err.message : 'Failed to save student.')
    }
  } finally {
    submitting.value = false
  }
}

function populateForm(data?: unknown): void {
  const s = (data || studentStore.currentStudent || (props.studentId ? studentStore.getStudentById(props.studentId) : null)) as Record<string, any> | null
  if (!s) return

  const user = s.user || {}
  const profile = s.student_profile || {}
  form.student_code = s.student_code || profile.student_code || ''
  form.first_name = user.first_name || s.first_name || (s.name ? s.name.split(' ')[0] : '')
  form.last_name = user.last_name || s.last_name || (s.name ? s.name.split(' ').slice(1).join(' ') : '')
  form.email = user.email || s.email || ''
  form.gender = user.gender || s.gender || profile.gender || ''
  form.phone = user.phone || s.phone || ''
  form.batch_id = s.batch_id ?? s.batch?.id ?? profile.batch_id ?? null
  form.tutor_id = s.tutor_id ?? s.tutor?.id ?? profile.tutor_id ?? null
  if (s.deleted_at || user.deleted_at) {
    form.status = 'deactivated'
  } else {
    form.status = (user.status || s.status || profile.status || 'active') as StudentStatus | ''
  }
  form.password = ''
  form.password_confirmation = ''
  form.photo = null
  // Try all possible photo URL fields from the API
  const photoUrl = s.photo_url || s.photo || s.user?.avatar || s.avatar || null
  originalPhoto.value = photoUrl
  photoPreview.value = photoUrl
}

function resetForm(): void {
  form.student_code = ''
  form.first_name = ''
  form.last_name = ''
  form.email = ''
  form.gender = ''
  form.phone = ''
  form.batch_id = null
  form.tutor_id = null
  form.status = 'active'
  form.password = '12345678'
  form.password_confirmation = '12345678'
  form.photo = null
  originalPhoto.value = null
  if (photoPreview.value) URL.revokeObjectURL(photoPreview.value)
  photoPreview.value = null
}

function omitPassword(payload: StudentFormData & Record<string, unknown>): Record<string, unknown> {
  const { password, password_confirmation, ...rest } = payload
  return rest
}

async function initData(): Promise<void> {
  // 1. FAST: Instantly populate from local store cache if available
  if (props.studentId) {
    const cached = studentStore.getStudentById(props.studentId)
    if (cached) populateForm(cached)
  }

  // 2. CLEAN: Fetch batches/tutors only if not already loaded in memory
  const tasks: Promise<unknown>[] = []
  if (batchStore.batches.length === 0) {
    tasks.push(batchStore.fetchBatches().catch(() => {}))
  }
  if (tutorStore.tutors.length === 0) {
    tasks.push(tutorStore.fetchTutors().catch(() => {}))
  }

  // 3. Refresh detailed student record in background if needed
  if (props.studentId) {
    tasks.push(
      studentStore.fetchStudent(props.studentId)
        .then(() => populateForm(studentStore.currentStudent))
        .catch(() => {})
    )
  }

  await Promise.all(tasks)
}

onMounted(() => {
  initData()
})

watch(() => props.studentId, (newId) => {
  if (newId) {
    const cached = studentStore.getStudentById(newId)
    if (cached) populateForm(cached)
    studentStore.fetchStudent(newId).then(() => populateForm(studentStore.currentStudent)).catch(() => {})
  } else {
    resetForm()
  }
})

watch(() => props.apiErrors, (vals) => {
  if (vals) {
    formError.value = ''
    for (const [key, msg] of Object.entries(vals)) {
      ;(errors as Record<string, string>)[key] = msg
    }
  }
}, { immediate: true })

onUnmounted(() => {
  if (photoPreview.value) URL.revokeObjectURL(photoPreview.value)
})
</script>
