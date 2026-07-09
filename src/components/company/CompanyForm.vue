<template>
  <div class="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-gray-900">Company Profile</h1>
      <p class="mt-1 text-sm text-gray-500">
        Update your company details. Changes are saved locally for now (backend wiring pending).
      </p>
    </div>

    <form class="space-y-5" @submit.prevent="handleSubmit" novalidate>
      <div v-if="formError" class="rounded-xl border border-error/20 bg-error/5 px-4 py-3">
        <p class="text-sm text-error">{{ formError }}</p>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          v-model="form.companyName"
          label="Company Name"
          placeholder="e.g. Acme Technologies"
          required
          :error="errors.companyName"
          autocomplete="organization"
        />

        <InputField
          v-model="form.companyEmail"
          label="Company Email"
          type="email"
          placeholder="e.g. hr@acme.com"
          required
          :error="errors.companyEmail"
          autocomplete="email"
        />

        <InputField
          v-model="form.location"
          label="Location"
          placeholder="e.g. Kigali, Rwanda"
          :error="errors.location"
          autocomplete="address-level2"
        />

        <InputField
          v-model="form.contactPhone"
          label="Contact Phone"
          placeholder="e.g. +250 788 000 000"
          :error="errors.contactPhone"
          autocomplete="tel"
        />

        <InputField
          v-model="form.website"
          label="Website"
          placeholder="e.g. https://acme.com"
          :error="errors.website"
          autocomplete="url"
        />
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="text-xs text-gray-400">
          Tip: You can use this form as the foundation for Create/Update company flows.
        </div>

        <div class="flex gap-3">
          <button
            type="button"
            class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="submitting"
            @click="reset"
          >
            Reset
          </button>

          <PrimaryButton
            type="submit"
            :loading="submitting"
            :disabled="submitting"
            class="sm:w-[160px]"
          >
            {{ submitting ? 'Saving…' : 'Save Changes' }}
          </PrimaryButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import InputField from '@/components/ui/InputField.vue'
import PrimaryButton from '@/components/ui/PrimaryButton.vue'

type CompanyFormState = {
  companyName: string
  companyEmail: string
  location: string
  contactPhone: string
  website: string
}

type CompanyFormErrors = Partial<Record<keyof CompanyFormState, string>>

const submitting = ref(false)
const formError = ref('')

const initialForm: CompanyFormState = {
  companyName: '',
  companyEmail: '',
  location: '',
  contactPhone: '',
  website: '',
}

const form = reactive<CompanyFormState>({ ...initialForm })
const errors = reactive<CompanyFormErrors>({})

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function validateUrl(value: string): boolean {
  if (!value.trim()) return true
  try {
    // Accept http(s) and also plain domains if user types them.
    const normalized = value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`
    // eslint-disable-next-line no-new
    new URL(normalized)
    return true
  } catch {
    return false
  }
}

function validate(): boolean {
  formError.value = ''
  let ok = true

  errors.companyName = ''
  errors.companyEmail = ''
  errors.location = ''
  errors.contactPhone = ''
  errors.website = ''

  if (!form.companyName.trim()) {
    errors.companyName = 'Company name is required.'
    ok = false
  }

  if (!form.companyEmail.trim()) {
    errors.companyEmail = 'Company email is required.'
    ok = false
  } else if (!validateEmail(form.companyEmail)) {
    errors.companyEmail = 'Please enter a valid email address.'
    ok = false
  }

  if (form.contactPhone.trim()) {
    // Loose validation: allow +, digits, spaces, hyphens.
    if (!/^[+]?([0-9][\s-]*){7,}$/.test(form.contactPhone.trim())) {
      errors.contactPhone = 'Please enter a valid phone number.'
      ok = false
    }
  }

  if (form.website.trim() && !validateUrl(form.website)) {
    errors.website = 'Please enter a valid website URL.'
    ok = false
  }

  return ok
}

function reset() {
  Object.assign(form, { ...initialForm })
  Object.keys(errors).forEach((k) => {
    delete (errors as any)[k]
  })
  formError.value = ''
}

async function handleSubmit() {
  if (!validate()) return

  submitting.value = true
  formError.value = ''

  try {
    // Backend not wired yet.
    // Replace this with: await companyStore.updateCompanyProfile(form)
    // when API endpoints are available.
    // eslint-disable-next-line no-console
    console.log('CompanyForm payload:', { ...form })
  } catch (e: unknown) {
    formError.value = e instanceof Error ? e.message : 'Failed to save changes.'
  } finally {
    submitting.value = false
  }
}
</script>

