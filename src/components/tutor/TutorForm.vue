<template>
<<<<<<< HEAD
  <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-slate-900">
          {{ isEdit ? 'Edit Tutor' : 'Add Tutor' }}
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          {{
            isEdit
              ? 'Update tutor details below.'
              : 'Fill in the details to create a new tutor account.'
          }}
=======
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-slate-900">{{ isEdit ? 'Edit Tutor' : 'Add Tutor' }}</h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ isEdit ? 'Update tutor information.' : 'Fill in the details to register a new tutor.' }}
>>>>>>> sprint-2
        </p>
      </div>
    </div>

<<<<<<< HEAD
    <div class="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
      <!-- Name -->
      <div class="space-y-1.5">
        <label for="name" class="block text-sm font-medium text-slate-700">
          Full Name <span class="text-error">*</span>
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          placeholder="e.g. Sokha Mao"
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
        <label for="password" class="block text-sm font-medium text-slate-700">
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
=======
    <form @submit.prevent="submit" class="space-y-5">
      <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div class="grid gap-5 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label class="mb-1.5 block text-sm font-semibold text-slate-700">Full Name *</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              :class="{ 'border-rose-300 bg-rose-50': errors.name }"
              placeholder="Enter full name"
            />
            <p v-if="errors.name" class="mt-1.5 text-xs font-medium text-rose-600">{{ errors.name }}</p>
          </div>

          <div class="sm:col-span-2">
            <label class="mb-1.5 block text-sm font-semibold text-slate-700">Email *</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              :class="{ 'border-rose-300 bg-rose-50': errors.email }"
              placeholder="Enter email address"
            />
            <p v-if="errors.email" class="mt-1.5 text-xs font-medium text-rose-600">{{ errors.email }}</p>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700">
              Password {{ isEdit ? '(leave blank to keep current)' : '*' }}
            </label>
            <input
              v-model="form.password"
              type="password"
              class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              :class="{ 'border-rose-300 bg-rose-50': errors.password }"
              :placeholder="isEdit ? 'New password' : 'Enter password'"
            />
            <p v-if="errors.password" class="mt-1.5 text-xs font-medium text-rose-600">{{ errors.password }}</p>
          </div>

          <div v-if="!isEdit">
            <label class="mb-1.5 block text-sm font-semibold text-slate-700">Confirm Password *</label>
            <input
              v-model="form.password_confirmation"
              type="password"
              class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              placeholder="Re-enter password"
            />
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3">
        <button
          type="button"
          @click="$emit('cancel')"
          class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="store.loading"
          class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-500/20 transition-all duration-200 hover:from-primary-700 hover:to-primary-600 hover:shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span v-if="store.loading" class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          {{ isEdit ? 'Save Changes' : 'Create Tutor' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useTutorStore } from '@/stores/tutorStore'
import { useToastStore } from '@/stores/toast'
import type { TutorWorkload } from '@/types/user'

const props = defineProps<{
  tutorId?: number
}>()

const emit = defineEmits<{
  (e: 'saved'): void
  (e: 'cancel'): void
}>()

const store = useTutorStore()
const toast = useToastStore()
>>>>>>> sprint-2

const isEdit = computed(() => !!props.tutorId)

const form = reactive({
  name: '',
  email: '',
  password: '',
<<<<<<< HEAD
})

const errors = reactive<Record<string, string>>({})
const formError = ref('')
const submitting = ref(false)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const requiredFields = ['name', 'email'] as const
const conditionalFields = ['password'] as const

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

  if (field === 'password' && value && (value as string).length < 8) {
    errors[field] = 'Password must be at least 8 characters.'
    return false
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
    const payload: { name: string; email: string; password?: string } = {
      name: form.name,
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

  form.name = tutor.name
  form.email = tutor.email
  form.password = ''
}

onMounted(async () => {
  if (props.tutorId) {
    await tutorStore.fetchTutors()
    populateForm()
  }
})
=======
  password_confirmation: '',
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
})

function validate(): boolean {
  errors.name = ''
  errors.email = ''
  errors.password = ''

  if (!form.name.trim()) {
    errors.name = 'Name is required.'
  }
  if (!form.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email.'
  }
  if (!isEdit.value && !form.password) {
    errors.password = 'Password is required.'
  }
  if (form.password && form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }

  return !errors.name && !errors.email && (!errors.password)
}

async function submit(): Promise<void> {
  if (!validate()) return

  if (isEdit.value) {
    const payload: { name: string; email: string; password?: string } = {
      name: form.name.trim(),
      email: form.email.trim(),
    }
    if (form.password) payload.password = form.password

    try {
      await store.updateTutor(props.tutorId!, payload)
      toast.success('Tutor updated successfully.')
      emit('saved')
    } catch {
      // error handled by store
    }
  } else {
    try {
      await store.createTutor({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      toast.success('Tutor created successfully.')
      emit('saved')
    } catch {
      // error handled by store
    }
  }
}
>>>>>>> sprint-2
</script>
