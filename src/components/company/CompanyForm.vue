<template>
  <div class="mx-auto w-full max-w-3xl rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
    <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
      <div v-if="!hideHeader" class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">
            {{ mode === 'create' ? 'Add Company' : 'Edit Company' }}
          </h2>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {{
              mode === 'create'
                ? 'Fill in the details to register a new host company.'
                : 'Update company details below.'
            }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <FormField label="Company Name" :error="errors.companyName" required>
          <input
            v-model="form.companyName"
            type="text"
            placeholder="e.g. Acme Technologies"
            autocomplete="organization"
            class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            :class="inputClass('companyName')"
            @input="clearFieldError('companyName')"
          />
        </FormField>

        <FormField label="Company Email" :error="errors.companyEmail" required>
          <input
            v-model="form.companyEmail"
            type="email"
            placeholder="e.g. hr@acme.com"
            autocomplete="email"
            class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            :class="inputClass('companyEmail')"
            @input="clearFieldError('companyEmail')"
          />
        </FormField>

        <FormField label="Industry" :error="errors.industry">
          <input
            v-model="form.industry"
            type="text"
            placeholder="e.g. Banking, Telecom"
            autocomplete="organization-title"
            class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            :class="inputClass('industry')"
            @input="clearFieldError('industry')"
          />
        </FormField>

        <FormField label="Location" :error="errors.location">
          <input
            v-model="form.location"
            type="text"
            placeholder="e.g. Phnom Penh, Cambodia"
            autocomplete="address-level2"
            class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            :class="inputClass('location')"
            @input="clearFieldError('location')"
          />
        </FormField>

        <FormField label="Website URL" :error="errors.website">
          <input
            v-model="form.website"
            type="url"
            placeholder="e.g. https://acme.com"
            autocomplete="url"
            class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            :class="inputClass('website')"
            @input="clearFieldError('website')"
          />
        </FormField>

        <FormField label="Telegram Channel Link" :error="errors.telegramLink">
          <input
            v-model="form.telegramLink"
            type="url"
            placeholder="e.g. https://t.me/company"
            autocomplete="url"
            class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            :class="inputClass('telegramLink')"
            @input="clearFieldError('telegramLink')"
          />
        </FormField>

        <!-- Company Logo (full width) -->
        <div class="sm:col-span-2">
          <FormField label="Company Logo" :error="errors.companyImage">
            <!-- Upload Dropzone -->
            <div
              class="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all duration-200"
              :class="{
                'border-primary-300 bg-primary-50/40 dark:border-primary-600 dark:bg-primary-950/20': isDragOver,
                'border-slate-200 bg-slate-50/50 hover:border-primary-200 hover:bg-primary-50/20 dark:border-slate-600 dark:bg-slate-700/30 dark:hover:border-primary-500': !isDragOver && !errors.companyImage,
                'border-error ring-1 ring-error/20 dark:border-red-700': !!errors.companyImage,
              }"
              @dragover.prevent="isDragOver = true"
              @dragleave.prevent="isDragOver = false"
              @drop.prevent="onDrop"
              @click="fileInput?.click()"
            >
              <!-- Preview when a file is selected -->
              <template v-if="form.companyImage">
                <div class="relative mb-3">
                  <img
                    :src="companyImagePreview"
                    alt="Company logo preview"
                    class="h-24 w-24 rounded-xl object-cover shadow-sm ring-2 ring-primary-100 dark:ring-primary-900/50"
                  />
                  <button
                    type="button"
                    class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm transition-colors hover:bg-red-600"
                    @click.stop="removeCompanyImage"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p class="text-xs font-medium text-primary-600 dark:text-primary-400">
                  {{ isFile(form.companyImage) ? form.companyImage.name : 'Logo uploaded' }}
                </p>
                <p class="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">Tap to replace</p>
              </template>

              <!-- Empty state -->
              <template v-else>
                <div class="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700">
                  <svg class="h-7 w-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <p class="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Drop your logo here or <span class="text-primary-600 underline underline-offset-2 dark:text-primary-400">browse</span>
                </p>
                <p class="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">PNG or JPG, max 2MB</p>
              </template>

              <input
                ref="fileInput"
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                class="hidden"
                @change="onFileSelected"
              />
            </div>

            <!-- URL Input -->
            <div class="relative mt-2">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <svg class="h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <input
                v-model="companyLogoUrlInput"
                type="url"
                placeholder="Or paste an image URL..."
                class="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
                @input="onLogoUrlInput"
              />
              <button
                v-if="companyLogoUrlInput"
                type="button"
                class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                @click="clearLogoUrl"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </FormField>
        </div>
      </div>

      <div
        v-if="formError"
        role="alert"
        aria-live="polite"
        class="rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm font-medium text-error dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
      >
        {{ formError }}
      </div>

      <div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-700">
        <button
          v-if="showCancel"
          type="button"
          :disabled="submitting"
          @click="emit('cancel')"
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
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ submitLabelText }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import FormField from '@/components/ui/FormField.vue'

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
  submitLabel?: string
  apiErrors?: Record<string, string>
  onSubmit?: (data: CompanyFormData) => Promise<void>
}

type Emits = {
  cancel: []
}

const props = withDefaults(defineProps<Props>(), {
  initialData: () => ({}),
  showCancel: false,
  hideHeader: false,
  submitLabel: undefined,
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
const isDragOver = ref(false)
const companyLogoUrlInput = ref(
  props.initialData?.companyImage && typeof props.initialData.companyImage === 'string'
    ? props.initialData.companyImage
    : '',
)

const companyImagePreview = computed<string | undefined>(() => {
  if (form.companyImage instanceof File) {
    return URL.createObjectURL(form.companyImage)
  }
  return (form.companyImage as string) || undefined
})

const form = reactive<CompanyFormData>({ ...initialForm })
const errors = reactive<CompanyFormErrors>({})

const showCancel = computed(() => props.showCancel)
const hideHeader = computed(() => props.hideHeader)

const submitLabelText = computed(() => {
  if (submitting.value) {
    return props.mode === 'create' ? 'Creating...' : 'Saving...'
  }
  if (props.submitLabel) return props.submitLabel
  return props.mode === 'create' ? 'Add Company' : 'Update Company'
})

function inputClass(field: keyof CompanyFormData): string {
  return errors[field]
    ? 'border-error ring-1 ring-error/20 focus:border-error focus:ring-2 focus:ring-error/30 dark:border-red-700 dark:ring-red-800/30'
    : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600'
}

function clearFieldError(field: keyof CompanyFormData): void {
  errors[field] = ''
  formError.value = ''
}

function isFile(value: unknown): value is File {
  return value instanceof File
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
  isDragOver.value = false
}

function onDrop(event: DragEvent) {
  isDragOver.value = false
  const file = event.dataTransfer?.files?.[0]
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
  companyLogoUrlInput.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function onLogoUrlInput() {
  const url = companyLogoUrlInput.value.trim()
  if (url) {
    form.companyImage = url
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

function clearLogoUrl() {
  companyLogoUrlInput.value = ''
  form.companyImage = null
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
