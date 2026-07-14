<template>
  <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
    <!-- Header -->
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
    <div class="flex items-center gap-6">
      <div class="relative">
        <div
          class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed text-sm font-bold transition-colors"
          :class="
            errors.avatar
              ? 'border-error bg-error/5 text-error'
              : 'border-slate-300 bg-slate-50 text-slate-400'
          "
        >
          <img
            v-if="photoPreview"
            :src="photoPreview"
            alt="Preview"
            class="h-full w-full rounded-full object-cover"
          />
          <svg v-else class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      </div>
      <div class="flex-1">
        <label for="avatar" class="block text-sm font-medium text-slate-700">Photo</label>
        <p class="mt-0.5 text-xs text-slate-400">JPG or PNG. Max 5MB.</p>
        <input
          id="avatar"
          ref="fileInput"
          type="file"
          accept="image/jpeg,image/png"
          :aria-invalid="!!errors.avatar"
          :aria-describedby="errors.avatar ? 'avatar-error' : undefined"
          class="mt-2 block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-700 hover:file:bg-primary-100"
          @change="onFileChange"
        />
        <p v-if="errors.avatar" id="avatar-error" class="mt-1 text-xs text-error">
          {{ errors.avatar }}
        </p>
        <button
          v-if="photoPreview && isEdit"
          type="button"
          @click="removePhoto"
          class="mt-1 text-xs font-medium text-error hover:text-error/80"
        >
          Remove photo
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
      <!-- Student Code -->
      <div class="space-y-1.5">
        <label for="student_code" class="block text-sm font-medium text-slate-700">
          Student Code <span class="text-error">*</span>
        </label>
        <input
          id="student_code"
          v-model="form.student_code"
          type="text"
          placeholder="e.g. STU-001"
          :aria-invalid="!!errors.student_code"
          :aria-describedby="errors.student_code ? 'student_code-error' : undefined"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200"
          :class="inputClass('student_code')"
          @input="clearFieldError('student_code')"
          @blur="validateField('student_code')"
        />
        <p v-if="errors.student_code" id="student_code-error" class="text-sm text-error">
          {{ errors.student_code }}
        </p>
      </div>

      <!-- Name -->
      <div class="space-y-1.5">
        <label for="name" class="block text-sm font-medium text-slate-700">
          Full Name <span class="text-error">*</span>
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          placeholder="e.g. John Doe"
          :aria-invalid="!!errors.name"
          :aria-describedby="errors.name ? 'name-error' : undefined"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200"
          :class="inputClass('name')"
          @input="clearFieldError('name')"
          @blur="validateField('name')"
        />
        <p v-if="errors.name" id="name-error" class="text-sm text-error">{{ errors.name }}</p>
      </div>

      <!-- Email -->
      <div class="space-y-1.5">
        <label for="email" class="block text-sm font-medium text-slate-700">
          Email <span class="text-error">*</span>
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="e.g. john@example.com"
          :aria-invalid="!!errors.email"
          :aria-describedby="errors.email ? 'email-error' : undefined"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200"
          :class="inputClass('email')"
          @input="clearFieldError('email')"
          @blur="validateField('email')"
        />
        <p v-if="errors.email" id="email-error" class="text-sm text-error">{{ errors.email }}</p>
      </div>

      <!-- Phone -->
      <div class="space-y-1.5">
        <label for="phone" class="block text-sm font-medium text-slate-700">
          Phone <span class="text-error">*</span>
        </label>
        <input
          id="phone"
          v-model="form.phone"
          type="tel"
          placeholder="e.g. 012 345 678"
          :aria-invalid="!!errors.phone"
          :aria-describedby="errors.phone ? 'phone-error' : undefined"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200"
          :class="inputClass('phone')"
          @input="clearFieldError('phone')"
          @blur="validateField('phone')"
        />
        <p v-if="errors.phone" id="phone-error" class="text-sm text-error">{{ errors.phone }}</p>
      </div>

      <!-- Gender -->
      <div class="space-y-1.5">
        <label for="gender" class="block text-sm font-medium text-slate-700">
          Gender <span class="text-error">*</span>
        </label>
        <select
          id="gender"
          v-model="form.gender"
          :aria-invalid="!!errors.gender"
          :aria-describedby="errors.gender ? 'gender-error' : undefined"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition-all duration-200"
          :class="inputClass('gender')"
          @change="clearFieldError('gender')"
          @blur="validateField('gender')"
        >
          <option value="" disabled>Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <p v-if="errors.gender" id="gender-error" class="text-sm text-error">{{ errors.gender }}</p>
      </div>

      <!-- Batch -->
      <div class="space-y-1.5">
        <label for="batch_id" class="block text-sm font-medium text-slate-700">
          Batch <span class="text-error">*</span>
        </label>
        <select
          id="batch_id"
          v-model.number="form.batch_id"
          :aria-invalid="!!errors.batch_id"
          :aria-describedby="errors.batch_id ? 'batch_id-error' : undefined"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition-all duration-200"
          :class="inputClass('batch_id')"
          @change="clearFieldError('batch_id')"
          @blur="validateField('batch_id')"
        >
          <option :value="null" disabled>Select batch</option>
          <option v-if="batchStore.loading" disabled>Loading...</option>
          <option v-for="b in batchStore.batches" :key="b.id" :value="b.id">
            {{ b.name }}
          </option>
        </select>
        <p v-if="errors.batch_id" id="batch_id-error" class="text-sm text-error">
          {{ errors.batch_id }}
        </p>
      </div>

      <!-- Tutor -->
      <div class="space-y-1.5">
        <label for="tutor_id" class="block text-sm font-medium text-slate-700">
          Tutor <span class="text-error">*</span>
        </label>
        <select
          id="tutor_id"
          v-model.number="form.tutor_id"
          :aria-invalid="!!errors.tutor_id"
          :aria-describedby="errors.tutor_id ? 'tutor_id-error' : undefined"
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
        <p v-if="errors.tutor_id" id="tutor_id-error" class="text-sm text-error">
          {{ errors.tutor_id }}
        </p>
        <p v-if="tutorStore.error" class="text-sm text-error">{{ tutorStore.error }}</p>
      </div>

      <!-- Password (create only) -->
      <div v-if="!isEdit" class="space-y-1.5">
        <label for="password" class="block text-sm font-medium text-slate-700"> Password </label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="Min. 8 characters"
          :aria-invalid="!!errors.password"
          :aria-describedby="errors.password ? 'password-error' : undefined"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200"
          :class="inputClass('password')"
          @input="clearFieldError('password')"
          @blur="validateField('password')"
        />
        <p v-if="errors.password" id="password-error" class="text-sm text-error">
          {{ errors.password }}
        </p>
      </div>
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
import type { StudentFormData } from '@/types/student'

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

const form = reactive<StudentFormData>({
  student_code: '',
  name: '',
  email: '',
  gender: '',
  phone: '',
  batch_id: null,
  tutor_id: null,
  password: '',
  password_confirmation: '',
  avatar: null,
})

const errors = reactive<Record<string, string>>({})
const formError = ref('')
const submitting = ref(false)
const photoPreview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const originalAvatar = ref<string | null>(null)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[\d\s\-+()]{7,20}$/

const requiredFields = [
  'student_code',
  'name',
  'email',
  'gender',
  'phone',
  'batch_id',
  'tutor_id',
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

  if (field === 'email' && value && !EMAIL_RE.test(value as string)) {
    errors[field] = 'Please enter a valid email address.'
    return false
  }

  if (field === 'phone' && value && !PHONE_RE.test(value as string)) {
    errors[field] = 'Please enter a valid phone number.'
    return false
  }

  if (field === 'password' && value && (value as string).length < 8) {
    errors[field] = 'Password must be at least 8 characters.'
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
  if (form.password && !validateField('password')) valid = false
  return valid
}

function onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    errors.avatar = 'Only JPG and PNG files are allowed.'
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    errors.avatar = 'File size must be under 5MB.'
    return
  }

  delete errors.avatar
  form.avatar = file

  if (photoPreview.value) URL.revokeObjectURL(photoPreview.value)
  photoPreview.value = URL.createObjectURL(file)
}

function removePhoto(): void {
  form.avatar = null
  if (photoPreview.value) {
    URL.revokeObjectURL(photoPreview.value)
    photoPreview.value = originalAvatar.value
  }
  if (fileInput.value) fileInput.value.value = ''
}

async function handleSubmit(): Promise<void> {
  if (!validateAll()) return

  submitting.value = true
  formError.value = ''

  try {
    const payload: StudentFormData = { ...form }

    if (payload.avatar === null && isEdit.value) {
      payload.avatar = originalAvatar.value || null
    }

    const result = isEdit.value
      ? await studentStore.updateStudent(props.studentId!, payload)
      : await studentStore.createStudent(payload)

    emit('saved', result)
  } catch (err: unknown) {
    const axiosErr = err as {
      response?: { status?: number; data?: { errors?: Record<string, string[]> } }
    }
    if (axiosErr.response?.status === 422) {
      const apiErrs = axiosErr.response.data?.errors
      if (apiErrs) {
        const { mapValidationErrors } = await import('@/utils/mapValidationErrors')
        const mapped = mapValidationErrors(apiErrs)
        for (const [key, msg] of Object.entries(mapped)) {
          if (key in errors) (errors as Record<string, string>)[key] = msg
        }
      }
    } else {
      formError.value = err instanceof Error ? err.message : 'Failed to save student.'
    }
  } finally {
    submitting.value = false
  }
}

function populateForm(): void {
  const s = studentStore.currentStudent
  if (!s) return

  form.student_code = s.student_code || ''
  form.name = s.name || ''
  form.email = s.email || ''
  form.gender = s.gender || ''
  form.phone = s.phone || ''
  form.batch_id = s.batch_id ?? null
  form.tutor_id = s.tutor_id ?? null
  form.password = ''
  form.password_confirmation = ''
  form.avatar = null
  originalAvatar.value = s.avatar
  photoPreview.value = s.avatar
}

onMounted(async () => {
  batchStore.fetchBatches()
  tutorStore.fetchTutors()

  if (props.studentId) {
    await studentStore.fetchStudent(props.studentId)
    populateForm()
  }
})

watch(
  () => props.studentId,
  (id) => {
    if (id) {
      studentStore.fetchStudent(id).then(populateForm)
    }
  },
)

watch(
  () => props.apiErrors,
  (vals) => {
    if (vals) {
      formError.value = ''
      for (const [key, msg] of Object.entries(vals)) {
        if (key in errors) (errors as Record<string, string>)[key] = msg
      }
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  if (photoPreview.value) URL.revokeObjectURL(photoPreview.value)
})
</script>
