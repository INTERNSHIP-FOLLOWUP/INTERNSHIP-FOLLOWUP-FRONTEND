<template>
  <div
    class="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300"
  >
    <!-- Hero Header matching Detail View -->
    <div
      class="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-sky-400 px-8 py-10 sm:px-10"
    >
      <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div class="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

      <div class="relative flex flex-col items-center gap-5 sm:flex-row sm:items-end">
        <!-- Live Preview Avatar -->
        <div
          class="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white/50 bg-white shadow-xl"
        >
          <img
            v-if="form.companyProfileImage && !errors.companyProfileImage"
            :src="form.companyProfileImage"
            alt="Company logo preview"
            class="h-full w-full object-cover"
          />
          <span v-else class="text-3xl font-bold text-indigo-600 select-none">
            {{ form.companyName ? form.companyName.charAt(0).toUpperCase() : 'C' }}
          </span>
        </div>

        <div class="text-center sm:text-left">
          <h1 class="text-2xl font-bold text-white drop-shadow-sm">
            {{ form.companyName || (mode === 'create' ? 'New Company' : 'Edit Company') }}
          </h1>
          <div class="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span
              v-if="form.industry"
              class="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
            >
              {{ form.industry }}
            </span>
            <span
              v-if="form.companyEmail"
              class="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm"
            >
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {{ form.companyEmail }}
            </span>
            <span
              v-if="!form.companyName && !form.industry && !form.companyEmail"
              class="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm"
            >
              {{ mode === 'create' ? 'Fill in the details below' : 'Update the fields below' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid Form -->
    <form @submit.prevent="handleSubmit" novalidate>
      <div class="px-8 py-10 sm:px-10 space-y-10">
        <!-- Error Banner -->
        <div
          v-if="formError"
          class="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/60 p-4"
        >
          <svg
            class="h-5 w-5 shrink-0 text-red-500 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div class="text-sm font-medium text-red-800">{{ formError }}</div>
        </div>

        <!-- Section 1: General Info -->
        <div class="grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-3">
          <div class="lg:pt-1">
            <h3
              class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400"
            >
              <span class="h-1 w-1 rounded-full bg-indigo-500"></span>
              Core Information
            </h3>
            <p class="mt-1.5 text-xs text-slate-500 leading-relaxed">
              Provide identifying information used across internal system modules.
            </p>
          </div>
          <div
            class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-2 rounded-xl border border-slate-100 bg-slate-50/50 p-6"
          >
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

        <div class="border-t border-slate-100" />

        <!-- Section 2: Primary Contact -->
        <div class="grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-3">
          <div class="lg:pt-1">
            <h3
              class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400"
            >
              <span class="h-1 w-1 rounded-full bg-sky-400"></span>
              Primary Liaison
            </h3>
            <p class="mt-1.5 text-xs text-slate-500 leading-relaxed">
              Main operational anchor point for standard administrative routing.
            </p>
          </div>
          <div
            class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-2 rounded-xl border border-slate-100 bg-slate-50/50 p-6"
          >
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

        <div class="border-t border-slate-100" />

        <!-- Section 3: Digital Presence -->
        <div class="grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-3">
          <div class="lg:pt-1">
            <h3
              class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400"
            >
              <span class="h-1 w-1 rounded-full bg-violet-400"></span>
              Digital Presence
            </h3>
            <p class="mt-1.5 text-xs text-slate-500 leading-relaxed">
              Public external hyperlinks and media structures representing the entity brand.
            </p>
          </div>

          <div
            class="lg:col-span-2 rounded-xl border border-slate-100 bg-slate-50/50 p-6 space-y-5"
          >
            <!-- Profile Image URL -->
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

      <!-- Action Panel Footer matching Detail View -->
      <div
        class="flex flex-col items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-8 py-5 sm:flex-row"
      >
        <div class="flex items-center gap-2">
          <span class="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
          <span class="text-xs font-medium text-slate-400">Complete all required fields</span>
        </div>

        <div class="flex items-center gap-2">
          <button
            v-if="showCancel"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
            :disabled="submitting"
            @click="emit('cancel')"
          >
            Cancel
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
            :disabled="submitting"
            @click="reset"
          >
            Reset
          </button>

          <PrimaryButton
            type="submit"
            :loading="submitting"
            :disabled="submitting"
            class="min-w-[140px] !rounded-xl shadow-sm shadow-indigo-100"
          >
            {{
              submitting
                ? mode === 'create'
                  ? 'Creating...'
                  : 'Saving...'
                : mode === 'create'
                  ? 'Create Profile'
                  : 'Save Changes'
            }}
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
  onSubmit?: (data: CompanyFormData) => Promise<void>
}

type Emits = {
  cancel: []
}

const props = withDefaults(defineProps<Props>(), {
  initialData: () => ({}),
  showCancel: false,
  apiErrors: () => ({}),
})

const emit = defineEmits<Emits>()

const BACKEND_FIELD_MAP: Record<string, keyof CompanyFormData> = {
  company_name: 'companyName',
  email: 'companyEmail',
  location: 'location',
  industry: 'industry',
  contact_person: 'contactPerson',
  phone: 'contactPhone',
  website: 'website',
  company_profile_image: 'companyProfileImage',
  telegram_link: 'telegramLink',
}

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

const showCancel = computed(() => props.showCancel)

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function validateUrl(value: string): boolean {
  if (!value.trim()) return true
  try {
    const normalized =
      value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`
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

function applyServerErrors(serverErrors: Record<string, string>) {
  for (const [key, msg] of Object.entries(serverErrors)) {
    const field = BACKEND_FIELD_MAP[key] ?? (key as keyof CompanyFormData)
    if (field in form) {
      ;(errors as CompanyFormErrors)[field] = msg
    }
  }
}

watch(
  () => props.initialData,
  () => reset(),
  { deep: true, immediate: true },
)

watch(
  () => props.apiErrors,
  (serverErrors) => {
    ;(Object.keys(initialForm) as Array<keyof CompanyFormData>).forEach((k) => {
      errors[k] = ''
    })
    if (serverErrors) {
      applyServerErrors(serverErrors)
    }
  },
  { deep: true },
)

async function handleSubmit() {
  if (!validate()) return

  submitting.value = true
  formError.value = ''

  try {
    await props.onSubmit?.({ ...form })
  } catch (e: unknown) {
    formError.value = e instanceof Error ? e.message : 'Failed to submit. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>
