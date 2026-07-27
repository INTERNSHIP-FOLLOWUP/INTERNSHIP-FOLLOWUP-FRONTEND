<template>
  <div
    class="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 dark:border-slate-700 dark:bg-slate-800"
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
            v-if="companyImagePreview"
            :src="companyImagePreview"
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
          class="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/60 p-4 dark:border-red-900/50 dark:bg-red-950/30"
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
          <div class="text-sm font-medium text-red-800 dark:text-red-400">{{ formError }}</div>
        </div>

        <!-- Section 1: General Info -->
        <div class="grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-3">
          <div class="lg:pt-1">
            <h3
              class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500"
            >
              <span class="h-1 w-1 rounded-full bg-indigo-500"></span>
              Core Information
            </h3>
            <p class="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Provide identifying information used across internal system modules.
            </p>
          </div>
          <div
            class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-2 rounded-xl border border-slate-100 bg-slate-50/50 p-6 dark:border-slate-600 dark:bg-slate-700/30"
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

        <!-- Section 2: Digital Presence -->
        <div class="grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-3">
          <div class="lg:pt-1">
            <h3
              class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500"
            >
              <span class="h-1 w-1 rounded-full bg-violet-400"></span>
              Digital Presence
            </h3>
            <p class="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Public external hyperlinks and media structures representing the entity brand.
            </p>
          </div>

          <div            class="lg:col-span-2 rounded-xl border border-slate-100 bg-slate-50/50 p-6 space-y-5 dark:border-slate-600 dark:bg-slate-700/30">
            <!-- Company Logo Upload -->
            <div class="space-y-1.5">
              <label class="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                Company Logo
                <span class="text-xs font-normal text-slate-400 dark:text-slate-500">(PNG, JPG, max 2MB)</span>
              </label>

              <!-- Upload Dropzone -->
              <div
                class="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all duration-200"
                :class="{
                  'border-indigo-300 bg-indigo-50/40 dark:border-indigo-600 dark:bg-indigo-950/20': isDragOver,
                  'border-slate-200 bg-slate-50/50 hover:border-indigo-200 hover:bg-indigo-50/20 dark:border-slate-600 dark:bg-slate-700/30 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/10': !isDragOver,
                  'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/20': errors.companyImage,
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
                      class="h-24 w-24 rounded-xl object-cover shadow-sm ring-2 ring-indigo-100"
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
                  <p class="text-xs font-medium text-indigo-600">
                    {{ isFile(form.companyImage) ? form.companyImage.name : 'Logo uploaded' }}
                  </p>
                  <p class="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                    Tap to replace
                  </p>
                </template>

                <!-- Empty state -->
                <template v-else>
                  <div                    class="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700">
                    <svg class="h-7 w-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <p class="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Drop your logo here or <span class="text-indigo-600 underline underline-offset-2">browse</span>
                  </p>
                  <p class="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                    Supported: JPEG, PNG
                  </p>
                </template>

                <input
                  ref="fileInput"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  class="hidden"
                  @change="onFileSelected"
                />
              </div>
              <p v-if="errors.companyImage" class="text-xs font-medium text-red-500 dark:text-red-400">{{ errors.companyImage }}</p>

              <!-- URL Input -->
              <div class="mt-3">
                <div class="relative">
                  <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg class="h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <input
                    v-model="companyLogoUrlInput"
                    type="url"
                    placeholder="Or paste an image URL..."
                    class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 transition-colors focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500"
                    @input="onLogoUrlInput"
                  />
                  <button
                    v-if="companyLogoUrlInput"
                    type="button"
                    class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                    @click="clearLogoUrl"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
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
        class="flex flex-col items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-8 py-5 sm:flex-row dark:border-slate-700 dark:bg-slate-700/30"
      >
        <div class="flex items-center gap-2">
          <span class="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
          <span class="text-xs font-medium text-slate-400 dark:text-slate-500">Complete all required fields</span>
        </div>

        <div class="flex items-center gap-2">
          <button
            v-if="showCancel"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-slate-200"
            :disabled="submitting"
            @click="emit('cancel')"
          >
            Cancel
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-slate-200"
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
  website: string
  companyImage: File | string | null
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
