<template>
  <div
    class="mx-auto w-full max-w-3xl"
    :class="hideHeader ? '' : 'rounded-2xl border border-slate-200 bg-white p-5 shadow-xl'"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
      <!-- Header -->
      <div v-if="!hideHeader" class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-slate-900">
            {{ mode === 'create' ? 'New Company' : 'Edit Company' }}
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            {{
              mode === 'create'
                ? 'Fill in the details to register a new partner company.'
                : 'Update the company details below.'
            }}
          </p>
        </div>
        <button
          v-if="showCancel"
          type="button"
          class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          @click="emit('cancel')"
          aria-label="Close"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Logo -->
      <div class="flex items-center gap-4">
        <div class="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
          <img
            v-if="companyImagePreview"
            :src="companyImagePreview"
            alt="Company logo preview"
            class="h-full w-full object-cover"
          />
          <span v-else class="text-xl font-bold text-slate-400 select-none">
            {{ form.companyName ? form.companyName.charAt(0).toUpperCase() : 'C' }}
          </span>
        </div>
        <div class="flex flex-col gap-1.5">
          <p class="text-xs font-semibold text-slate-600">Company Logo</p>
          <div class="flex items-center gap-2">
            <label
              for="companyImage"
              class="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:border-slate-300"
            >
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ form.companyImage ? 'Change' : 'Upload' }}
            </label>
            <button
              v-if="form.companyImage"
              type="button"
              @click="removeCompanyImage"
              class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              Remove
            </button>
          </div>
          <p class="text-xs text-slate-400">PNG or JPG, max 2MB</p>
          <p v-if="errors.companyImage" class="text-xs font-medium text-red-500">{{ errors.companyImage }}</p>
        </div>
        <input
          id="companyImage"
          ref="fileInput"
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          class="sr-only"
          @change="onFileSelected"
        />
      </div>

      <div class="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <!-- Company Name -->
        <div class="space-y-1">
          <label for="companyName" class="block text-xs font-semibold text-slate-600">
            Company Name <span class="text-red-500">*</span>
          </label>
          <input
            id="companyName"
            v-model="form.companyName"
            type="text"
            placeholder="e.g. Acme Technologies"
            autocomplete="organization"
            :aria-invalid="!!errors.companyName"
            :aria-describedby="errors.companyName ? 'companyName-error' : undefined"
            class="h-10 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2"
            :class="inputClass('companyName')"
            @input="clearFieldError('companyName')"
          />
          <p v-if="errors.companyName" id="companyName-error" class="text-xs font-medium text-red-500">
            {{ errors.companyName }}
          </p>
        </div>

        <!-- Company Email -->
        <div class="space-y-1">
          <label for="companyEmail" class="block text-xs font-semibold text-slate-600">
            Company Email <span class="text-red-500">*</span>
          </label>
          <input
            id="companyEmail"
            v-model="form.companyEmail"
            type="email"
            placeholder="e.g. hr@acme.com"
            autocomplete="email"
            :aria-invalid="!!errors.companyEmail"
            :aria-describedby="errors.companyEmail ? 'companyEmail-error' : undefined"
            class="h-10 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2"
            :class="inputClass('companyEmail')"
            @input="clearFieldError('companyEmail')"
          />
          <p v-if="errors.companyEmail" id="companyEmail-error" class="text-xs font-medium text-red-500">
            {{ errors.companyEmail }}
          </p>
        </div>

        <!-- Industry -->
        <div class="space-y-1">
          <label for="industry" class="block text-xs font-semibold text-slate-600">Industry</label>
          <input
            id="industry"
            v-model="form.industry"
            type="text"
            placeholder="e.g. Banking, Telecom"
            autocomplete="organization-title"
            class="h-10 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2"
            :class="inputClass('industry')"
            @input="clearFieldError('industry')"
          />
          <p v-if="errors.industry" class="text-xs font-medium text-red-500">{{ errors.industry }}</p>
        </div>

        <!-- Location -->
        <div class="space-y-1">
          <label for="location" class="block text-xs font-semibold text-slate-600">Location</label>
          <input
            id="location"
            v-model="form.location"
            type="text"
            placeholder="e.g. Kigali, Rwanda"
            autocomplete="address-level2"
            class="h-10 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2"
            :class="inputClass('location')"
            @input="clearFieldError('location')"
          />
          <p v-if="errors.location" class="text-xs font-medium text-red-500">{{ errors.location }}</p>
        </div>

        <!-- Website -->
        <div class="space-y-1">
          <label for="website" class="block text-xs font-semibold text-slate-600">Website URL</label>
          <input
            id="website"
            v-model="form.website"
            type="text"
            placeholder="e.g. https://acme.com"
            autocomplete="url"
            :aria-invalid="!!errors.website"
            :aria-describedby="errors.website ? 'website-error' : undefined"
            class="h-10 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2"
            :class="inputClass('website')"
            @input="clearFieldError('website')"
          />
          <p v-if="errors.website" id="website-error" class="text-xs font-medium text-red-500">
            {{ errors.website }}
          </p>
        </div>

        <!-- Telegram Link -->
        <div class="space-y-1">
          <label for="telegramLink" class="block text-xs font-semibold text-slate-600">Telegram Channel Link</label>
          <input
            id="telegramLink"
            v-model="form.telegramLink"
            type="text"
            placeholder="e.g. https://t.me/company"
            autocomplete="url"
            class="h-10 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2"
            :class="inputClass('telegramLink')"
            @input="clearFieldError('telegramLink')"
          />
          <p v-if="errors.telegramLink" class="text-xs font-medium text-red-500">{{ errors.telegramLink }}</p>
        </div>
      </div>

      <!-- Form error -->
      <p
        v-if="formError"
        role="alert"
        class="rounded-lg bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700"
      >
        {{ formError }}
      </p>

      <!-- Actions -->
      <div class="flex items-center justify-end gap-3">
        <button
          v-if="showCancel"
          type="button"
          :disabled="submitting"
          class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
          @click="emit('cancel')"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="submitting"
          class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
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
          {{ submitting ? 'Saving...' : mode === 'create' ? 'Create Company' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

export type CompanyFormMode = 'create' | 'edit'

export type CompanyFormData = {
  companyName: string
  companyEmail: string
  location: string
  industry: string
  website: string
  companyImage: File | string | null
  telegramLink: string
}

type CompanyFormErrors = Partial<Record<keyof CompanyFormData, string>>

type Props = {
  mode: CompanyFormMode
  initialData?: Partial<CompanyFormData>
  showCancel?: boolean
  hideHeader?: boolean
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
  website: 'website',
  company_image: 'companyImage',
  telegram_link: 'telegramLink',
}

const submitting = ref(false)
const formError = ref('')

const initialForm: CompanyFormData = {
  companyName: '',
  companyEmail: '',
  location: '',
  industry: '',
  website: '',
  companyImage: null,
  telegramLink: '',
}

const fileInput = ref<HTMLInputElement | null>(null)

const companyImagePreview = computed<string | undefined>(() => {
  if (form.companyImage instanceof File) {
    return URL.createObjectURL(form.companyImage)
  }
  return (form.companyImage as string) || undefined
})

const form = reactive<CompanyFormData>({ ...initialForm })
const errors = reactive<CompanyFormErrors>({})

const showCancel = computed(() => props.showCancel)

function inputClass(field: string): string {
  return errors[field as keyof CompanyFormErrors]
    ? 'border-error ring-1 ring-error/20 focus:border-error focus:ring-2 focus:ring-error/30'
    : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
}

function clearFieldError(field: keyof CompanyFormData): void {
  errors[field] = ''
  formError.value = ''
}

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

  if (form.website.trim() && !validateUrl(form.website)) {
    errors.website = 'Please enter a valid website URL.'
    ok = false
  }

  return ok
}

function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    errors.companyImage = 'File size must be less than 2MB'
    return
  }
  if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
    errors.companyImage = 'Only JPEG and PNG files are allowed'
    return
  }
  errors.companyImage = ''
  form.companyImage = file
}

function removeCompanyImage() {
  form.companyImage = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
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
