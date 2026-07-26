<template>
  <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-slate-900">
          {{ isEdit ? 'Edit Supervisor' : 'Add Supervisor' }}
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          {{
            isEdit
              ? 'Update supervisor details below.'
              : 'Fill in the details to create a new supervisor account and assign them to a company.'
          }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
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

      <FormField :label="isEdit ? 'Password (leave blank to keep current)' : 'Password'" :error="errors.password" :required="!isEdit">
        <input
          v-model="form.password"
          type="password"
          :placeholder="isEdit ? 'Leave blank to keep current' : 'Min. 8 characters'"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200"
          :class="inputClass('password')"
          @input="clearFieldError('password')"
          @blur="validateField('password')"
        />
      </FormField>

      <FormField label="Company" :error="errors.company_id" required>
        <select
          v-model.number="form.company_id"
          class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition-all duration-200"
          :class="inputClass('company_id')"
          @change="clearFieldError('company_id')"
          @blur="validateField('company_id')"
        >
          <option :value="null" disabled>Select company</option>
          <option v-if="loadingCompanies" disabled>Loading...</option>
          <option v-for="c in companies" :key="c.id" :value="c.id">
            {{ c.company_name || c.name }}
          </option>
        </select>
      </FormField>
    </div>

    <div
      v-if="formError"
      role="alert"
      aria-live="polite"
      class="rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm font-medium text-error"
    >
      {{ formError }}
    </div>

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
        {{ isEdit ? 'Update Supervisor' : 'Add Supervisor' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/services/api'
import FormField from '@/components/ui/FormField.vue'

const props = withDefaults(
  defineProps<{
    supervisorId?: number
    initialCompanyId?: number
  }>(),
  { supervisorId: undefined, initialCompanyId: undefined },
)

const emit = defineEmits<{
  saved: [supervisor: unknown]
  cancel: []
}>()

const isEdit = computed(() => !!props.supervisorId)

interface Company {
  id: number
  company_name: string
  name?: string
}

const companies = ref<Company[]>([])
const loadingCompanies = ref(false)

const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  company_id: null as number | null,
})

const errors = reactive<Record<string, string | undefined>>({})
const formError = ref('')
const submitting = ref(false)

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

  if (field === 'phone' && value) {
    if (!PHONE_RE.test(value as string)) {
      errors[field] = 'Please enter a valid phone number.'
      return false
    }
    delete errors[field]
    return true
  }

  if (field === 'password' && value && (value as string).length < 8) {
    errors[field] = 'Password must be at least 8 characters.'
    return false
  }

  if (!value || (typeof value === 'string' && !value.trim())) {
    if (field === 'phone') return true
    if (field === 'password' && isEdit.value) return true
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
  const fieldsToValidate = ['first_name', 'last_name', 'email', 'company_id']
  if (!isEdit.value) {
    fieldsToValidate.push('password')
  } else if (form.password) {
    fieldsToValidate.push('password')
  }
  if (form.phone) {
    fieldsToValidate.push('phone')
  }
  return fieldsToValidate.every((field) => validateField(field))
}

async function handleSubmit(): Promise<void> {
  if (!validateAll()) return

  submitting.value = true
  formError.value = ''

  try {
    if (isEdit.value) {
      // Edit supervisor — update via admin endpoint
      const payload: Record<string, unknown> = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone || undefined,
        company_id: form.company_id || undefined,
      }
      if (form.password) {
        payload.password = form.password
      }
      await api.put(`/admin/users/${props.supervisorId}`, payload)
    } else {
      // Create supervisor via the company endpoint
      await api.post(`/admin/companies/${form.company_id}/supervisors`, {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
      })
    }

    emit('saved', null)
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
        (err instanceof Error ? err.message : 'Failed to save supervisor.')
    }
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  // Fetch companies for the dropdown
  loadingCompanies.value = true
  try {
    const res = await api.get('/admin/companies', { params: { per_page: 200 } })
    companies.value = res.data.data ?? res.data ?? []
  } catch {
    companies.value = []
  } finally {
    loadingCompanies.value = false
  }

  // Pre-select company if provided
  if (props.initialCompanyId) {
    form.company_id = props.initialCompanyId
  }

  // Load existing supervisor data for edit mode
  if (props.supervisorId) {
    try {
      const res = await api.get(`/admin/users/${props.supervisorId}`)
      const user = res.data.data ?? res.data
      form.first_name = user.first_name || ''
      form.last_name = user.last_name || ''
      form.email = user.email || ''
      form.phone = user.phone || ''
      if (user.supervisor_profile?.company?.id) {
        form.company_id = user.supervisor_profile.company.id
      }
    } catch {
      // Silently fail — form stays empty
    }
  }
})
</script>
