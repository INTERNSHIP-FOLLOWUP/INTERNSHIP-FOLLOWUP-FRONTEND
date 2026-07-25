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
    <div class="flex items-center gap-6">
      <div class="relative">
        <div
          class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed text-sm font-bold transition-colors"
          :class="
            errors.photo
              ? 'border-error bg-error/5 text-error'
              : 'border-slate-300 bg-slate-50 text-slate-400'
          "
        >
          <img
            v-if="photoPreview"
            :src="photoPreview"
            :alt="$t('common.preview')"
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
        <label for="photo" class="block text-sm font-medium text-slate-700">Photo</label>
        <p class="mt-0.5 text-xs text-slate-400">JPG or PNG. Max 2MB.</p>
        <input
          id="photo"
          ref="fileInput"
          type="file"
          accept="image/jpeg,image/png/awg"
          :aria-invalid="!!errors.photo"
          :aria-describedby="errors.photo ? 'photo-error' : undefined"
          class="mt-2 block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-700 hover:file:bg-primary-100"
          @change="onFileChange"
        />
        <p v-if="errors.photo" id="photo-error" class="mt-1 text-xs text-error">
          {{ errors.photo }}
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
      <FormField label="Student Code" :error="errors.student_code" required>
        <input
          v-model="form.student_code"
          type="text"
          :placeholder="$t('forms.studentCodePlaceholder')"
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
          :placeholder="$t('forms.firstNamePlaceholder')"
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
          :placeholder="$t('forms.lastNamePlaceholder')"
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
          :placeholder="$t('forms.emailPlaceholder')"
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
          :placeholder="$t('forms.phoneNumberPlaceholder')"
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
          <option value="inactive">Inactive</option>
          <option value="graduated">Graduated</option>
          <option value="suspended">Suspended</option>
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
import { useI18n } from 'vue-i18n'
import { useStudentStore } from '@/stores/student'
import { useBatchStore } from '@/stores/batchStore'
import { useTutorStore } from '@/stores/tutorStore'
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

const { t: $t_script } = useI18n()
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
      errors[field] = $t_script('validation.passwordMatch')
      return false
    }
    delete errors[field]
    return true
  }

  if (field === 'password') {
    if (value && (value as string).length < 8) {
      errors[field] = $t_script('validation.minLength', { n: 8 })
      return false
    }
    if (!value && !isEdit.value) {
      errors[field] = $t_script('validation.passwordRequired')
      return false
    }
    delete errors[field]
    return true
  }

  if (field === 'phone' && value) {
    if (!PHONE_RE.test(value as string)) {
      errors[field] = $t_script('validation.invalidPhone')
      return false
    }
    delete errors[field]
    return true
  }

  if (!value || (typeof value === 'string' && !value.trim())) {
    if (field === 'phone') return true
    errors[field] = $t_script('validation.required')
    return false
  }

  if (field === 'email' && !EMAIL_RE.test(value as string)) {
    errors[field] = $t_script('validation.email')
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
        (err instanceof Error ? err.message : $t_script('validation.saveStudentFailed'))
    }
  } finally {
    submitting.value = false
  }
}

function populateForm(): void {
  const s = studentStore.currentStudent
  if (!s) return

  form.student_code = s.student_code || ''
  form.first_name = s.first_name || ''
  form.last_name = s.last_name || ''
  form.email = s.email || ''
  form.gender = s.gender || ''
  form.phone = s.phone || ''
  form.batch_id = s.batch_id ?? null
  form.tutor_id = s.tutor_id ?? null
  form.status = (s.status || '') as StudentStatus | ''
  form.password = ''
  form.password_confirmation = ''
  form.photo = null
  originalPhoto.value = s.avatar
  photoPreview.value = s.avatar
}

function omitPassword(payload: StudentFormData & Record<string, unknown>): Record<string, unknown> {
  const { password, password_confirmation, ...rest } = payload
  return rest
}

onMounted(async () => {
    const promises: Promise<unknown>[] = [
        batchStore.fetchBatches(),
        tutorStore.fetchTutors(),
    ]
    if (props.studentId) {
        promises.push(studentStore.fetchStudent(props.studentId).then(populateForm))
    }
    await Promise.all(promises)
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
