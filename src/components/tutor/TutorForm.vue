<template>
  <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">
          {{ isEdit ? 'Edit Tutor' : 'Add Tutor' }}
        </h2>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {{
            isEdit
              ? 'Update tutor details below.'
              : 'Fill in the details to create a new tutor account.'
          }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
      <!-- First Name -->
      <div class="space-y-1.5">
        <label for="firstName" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
          First Name <span class="text-error">*</span>
        </label>
        <input
          id="firstName"
          v-model="form.first_name"
          type="text"
          placeholder="e.g. Sokha"
          :aria-invalid="!!errors.first_name"
          :aria-describedby="errors.first_name ? 'firstName-error' : undefined"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
          :class="inputClass('first_name')"
          @input="clearFieldError('first_name')"
          @blur="validateField('first_name')"
        />
        <p v-if="errors.first_name" id="firstName-error" class="text-sm text-error">{{ errors.first_name }}</p>
      </div>

      <!-- Last Name -->
      <div class="space-y-1.5">
        <label for="lastName" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Last Name <span class="text-error">*</span>
        </label>
        <input
          id="lastName"
          v-model="form.last_name"
          type="text"
          placeholder="e.g. Mao"
          :aria-invalid="!!errors.last_name"
          :aria-describedby="errors.last_name ? 'lastName-error' : undefined"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200"
          :class="inputClass('last_name')"
          @input="clearFieldError('last_name')"
          @blur="validateField('last_name')"
        />
        <p v-if="errors.last_name" id="lastName-error" class="text-sm text-error">{{ errors.last_name }}</p>
      </div>

      <!-- Email -->
      <div class="space-y-1.5">
        <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Email <span class="text-error">*</span>
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="e.g. sokha.mao@example.com"
          :aria-invalid="!!errors.email"
          :aria-describedby="errors.email ? 'email-error' : undefined"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200"
          :class="inputClass('email')"
          @input="clearFieldError('email')"
          @blur="validateField('email')"
        />
        <p v-if="errors.email" id="email-error" class="text-sm text-error">{{ errors.email }}</p>
      </div>

      <!-- Password (create only) -->
      <div v-if="!isEdit" class="space-y-1.5 sm:col-span-2">
        <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Password <span class="text-error">*</span>
        </label>
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
    <div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-700">
      <button
        type="button"
        @click="$emit('cancel')"
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
        {{ isEdit ? 'Update Tutor' : 'Add Tutor' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useTutorStore } from '@/stores/tutorStore'
import type { Student } from '@/types/student'

const props = withDefaults(
  defineProps<{
    tutorId?: number
    apiErrors?: Record<string, string>
  }>(),
  { tutorId: undefined, apiErrors: () => ({}) },
)

const emit = defineEmits<{
  saved: [tutor: Student]
  cancel: []
}>()

const tutorStore = useTutorStore()

const isEdit = computed(() => !!props.tutorId)

const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
})

const errors = reactive<Record<string, string>>({})
const formError = ref('')
const submitting = ref(false)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const requiredFields = ['first_name', 'last_name', 'email'] as const
const conditionalFields = ['password'] as const

function inputClass(field: string): string {
  return errors[field]
    ? 'border-error ring-1 ring-error/20 focus:border-error focus:ring-2 focus:ring-error/30'
    : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600'
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

  if (field === 'password' && value && (value as string).length < 8) {
    errors[field] = 'Password must be at least 8 characters.'
    return false
  }

  if (field === 'first_name' || field === 'last_name') {
    return true
  }

  delete errors[field]
  return true
}

function validateAll(): boolean {
  let valid = true
  for (const field of [...requiredFields, ...(isEdit.value ? [] : conditionalFields)]) {
    if (!validateField(field)) valid = false
  }
  return valid
}

async function handleSubmit(): Promise<void> {
  if (!validateAll()) return

  submitting.value = true
  formError.value = ''

  try {
    const payload: { first_name: string; last_name: string; email: string; password?: string } = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
    }

    if (!isEdit.value && form.password) {
      payload.password = form.password
    }

    const result = isEdit.value
      ? await tutorStore.updateTutor(props.tutorId!, payload)
      : await tutorStore.createTutor(payload)

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
      formError.value = err instanceof Error ? err.message : 'Failed to save tutor.'
    }
  } finally {
    submitting.value = false
  }
}

function populateForm(): void {
  const tutor = tutorStore.tutors.find((t) => t.id === props.tutorId)
  if (!tutor) return

  form.first_name = tutor.first_name ?? ''
  form.last_name = tutor.last_name ?? ''
  form.email = tutor.email
  form.password = ''
}

onMounted(async () => {
  if (props.tutorId) {
    await tutorStore.fetchTutors()
    populateForm()
  }
})
</script>
