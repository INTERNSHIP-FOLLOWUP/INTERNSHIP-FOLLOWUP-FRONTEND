<template>
  <div class="mx-auto w-full max-w-5xl rounded-3xl border border-gray-200/70 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.03)] transition-all duration-300">
    <!-- Premium Banner Header -->
    <div class="relative overflow-hidden border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white px-8 py-8 sm:px-10">
      <div class="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-50/40 blur-3xl" />
      <div class="absolute -right-4 -top-24 h-48 w-48 rounded-full bg-sky-50/40 blur-3xl" />
      
      <div class="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-400 text-white shadow-sm shadow-indigo-200">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              {{ modeLabel }} Company Profile
            </h1>
            <p class="mt-1 text-sm text-gray-500">
              {{ mode === 'create' ? 'Register and configure a brand new company ecosystem.' : 'Modify configuration settings and data endpoints for this profile.' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid Form -->
    <form @submit.prevent="handleSubmit" novalidate>
      <div class="px-8 py-10 sm:px-10 space-y-10">
        
        <!-- Error Banner -->
        <div v-if="formError" role="alert" aria-live="polite" class="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50/60 p-4 animate-in fade-in duration-200">
          <svg class="h-5 w-5 shrink-0 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div class="text-sm font-medium text-red-800">{{ formError }}</div>
        </div>

        <!-- Section 1: General Info Layout Split -->
        <div class="grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-3">
          <div class="lg:pt-1">
            <h2 class="text-base font-bold text-gray-900 flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
              Core Information
            </h2>
            <p class="mt-1.5 text-sm text-gray-500 leading-relaxed">
              Provide identifying information used across internal system modules.
            </p>
          </div>
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-2 bg-gray-50/40 border border-gray-100/70 p-6 rounded-2xl">
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
              v-model="form.industry"
              label="Industry"
              placeholder="e.g. Banking, Telecom"
              :error="errors.industry"
              autocomplete="organization-title"
            />
            <InputField
              v-model="form.location"
              label="Location"
              placeholder="e.g. Kigali, Rwanda"
              :error="errors.location"
              autocomplete="address-level2"
            />
          </div>
        </div>

        <div class="border-t border-gray-100" />

        <!-- Section 2: Primary Contact Split -->
        <div class="grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-3">
          <div class="lg:pt-1">
            <h2 class="text-base font-bold text-gray-900 flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full bg-sky-400"></span>
              Primary Liaison
            </h2>
            <p class="mt-1.5 text-sm text-gray-500 leading-relaxed">
              Main operational anchor point for standard administrative routing.
            </p>
          </div>
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-2 bg-gray-50/40 border border-gray-100/70 p-6 rounded-2xl">
            <InputField
              v-model="form.contactPerson"
              label="Contact Person Name"
              placeholder="e.g. John Doe"
              :error="errors.contactPerson"
              autocomplete="name"
            />
            <InputField
              v-model="form.contactPhone"
              label="Direct Phone Line"
              placeholder="e.g. +250 788 000 000"
              :error="errors.contactPhone"
              autocomplete="tel"
            />
          </div>
        </div>

        <div class="border-t border-gray-100" />

        <!-- Section 3: Identity & Assets Split -->
        <div class="grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-3">
          <div class="lg:pt-1">
            <h2 class="text-base font-bold text-gray-900 flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Digital Presence
            </h2>
            <p class="mt-1.5 text-sm text-gray-500 leading-relaxed">
              Public external hyperlinks and media structures representing the entity brand.
            </p>
          </div>
          
          <div class="lg:col-span-2 bg-gray-50/40 border border-gray-100/70 p-6 rounded-2xl space-y-5">
            <!-- Dynamic Realtime Profile Image Preview Component -->
            <div class="flex items-center gap-4 rounded-xl border border-dashed border-gray-200 bg-white p-4">
              <div class="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
                <img 
                  v-if="form.companyProfileImage && !errors.companyProfileImage" 
                  :src="form.companyProfileImage" 
                  alt="Live Preview" 
                  class="h-full w-full object-cover"
                />
                <span v-else class="text-lg font-bold text-gray-400 select-none">
                  {{ form.companyName ? form.companyName.charAt(0).toUpperCase() : 'C' }}
                </span>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-gray-800">Visual Identity Asset</h4>
                <p class="text-xs text-gray-500 mt-0.5">Provide an image address URL below to generate the thumbnail.</p>
              </div>
            </div>

            <InputField
              v-model="form.companyProfileImage"
              label="Profile Image URL"
              placeholder="e.g. https://example.com/logo.png"
              :error="errors.companyProfileImage"
              autocomplete="url"
            />

            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <InputField
                v-model="form.website"
                label="Website URL"
                placeholder="e.g. https://acme.com"
                :error="errors.website"
                autocomplete="url"
              />
              <InputField
                v-model="form.telegramLink"
                label="Telegram Channel Link"
                placeholder="e.g. https://t.me/company"
                :error="errors.telegramLink"
                autocomplete="url"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Action Panel Footer -->
      <div class="flex flex-col border-t border-gray-100 bg-gray-50/60 px-8 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10 gap-4">
        <div class="flex items-center gap-2 text-xs font-medium text-gray-400 justify-center sm:justify-start">
          <span class="inline-block h-1.5 w-1.5 rounded-full bg-red-400"></span>
          Fields marked mandatory require accurate validation.
        </div>

        <div class="flex items-center justify-center gap-3">
          <button
            v-if="showCancel"
            type="button"
            class="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-200/40 hover:text-gray-900 focus:outline-none"
            :disabled="submitting"
            @click="emit('cancel')"
          >
            Cancel
          </button>

          <button
            type="button"
            class="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
            :disabled="submitting"
            @click="reset"
          >
            Reset
          </button>

          <PrimaryButton
            type="submit"
            :loading="submitting"
            :disabled="submitting"
            class="min-w-[140px] shadow-sm shadow-indigo-100 !rounded-xl"
          >
            {{ submitting ? (mode === 'create' ? 'Creating...' : 'Saving...') : (mode === 'create' ? 'Create Profile' : 'Save Changes') }}
          </PrimaryButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import InputField from '@/components/ui/InputField.vue'
import PrimaryButton from '@/components/ui/PrimaryButton.vue'
import { useCompanyStore } from '@/stores/company'

export type CompanyFormMode = 'create' | 'edit'

export type CompanyFormData = {
  companyName: string
  companyEmail: string
  location: string
  industry: string
  contactPerson: string
  contactPhone: string
  website: string
  companyProfileImage: string
  telegramLink: string
}

type CompanyFormErrors = Partial<Record<keyof CompanyFormData, string>>

type Props = {
  mode: CompanyFormMode
  initialData?: Partial<CompanyFormData>
  showCancel?: boolean
  apiErrors?: Record<string, string>
}

type Emits = {
  submit: [payload: CompanyFormData]
  cancel: []
}

const props = withDefaults(defineProps<Props>(), {
  initialData: () => ({}),
  showCancel: false,
})

const emit = defineEmits<Emits>()

const store = useCompanyStore()
const submitting = ref(false)
const formError = ref('')

const initialForm: CompanyFormData = {
  companyName: '',
  companyEmail: '',
  location: '',
  industry: '',
  contactPerson: '',
  contactPhone: '',
  website: '',
  companyProfileImage: '',
  telegramLink: '',
}

const form = reactive<CompanyFormData>({ ...initialForm })
const errors = reactive<CompanyFormErrors>({})

const modeLabel = computed(() => (props.mode === 'create' ? 'Create' : 'Edit'))
const showCancel = computed(() => props.showCancel)

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function validateUrl(value: string): boolean {
  if (!value.trim()) return true
  try {
    const normalized =
      value.startsWith('http://') || value.startsWith('https://')
        ? value
        : `https://${value}`
    new URL(normalized)
    return true
  } catch {
    return false
  }
}

function validate(): boolean {
  formError.value = ''
  let ok = true

  ;(Object.keys(initialForm) as Array<keyof CompanyFormData>).forEach((k) => {
    errors[k] = ''
  })

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
  Object.assign(form, {
    ...initialForm,
    ...props.initialData,
  })
  ;(Object.keys(initialForm) as Array<keyof CompanyFormData>).forEach((k) => {
    errors[k] = ''
  })
  formError.value = ''
}

watch(
  () => props.initialData,
  () => reset(),
  { deep: true, immediate: true },
)

watch(
  () => props.apiErrors,
  (vals) => {
    if (vals) {
      formError.value = ''
      for (const [key, msg] of Object.entries(vals)) {
        if (key in errors) {
          (errors as Record<string, string>)[key] = msg
        }
      }
    }
  },
  { immediate: true },
)

async function handleSubmit() {
  if (!validate()) return

  submitting.value = true
  formError.value = ''

  try {
    emit('submit', { ...form })
  } catch (e: unknown) {
    formError.value = e instanceof Error ? e.message : 'Failed to submit. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>