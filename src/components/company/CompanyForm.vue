<template>
  <div class="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
    <div class="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">{{ modeLabel }} Company</h1>
        <p class="mt-1 text-sm text-gray-500">
          {{ mode === 'create' ? 'Create a new company profile.' : 'Edit the company profile.' }}
        </p>
      </div>

      <button
        v-if="showCancel"
        type="button"
        class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
        :disabled="submitting"
        @click="emit('cancel')"
      >
        Cancel
      </button>
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
          v-model="form.industry"
          label="Industry"
          placeholder="e.g. Banking, Telecom"
          :error="errors.industry"
          autocomplete="organization"
        />

        <InputField
          v-model="form.contactPerson"
          label="Contact Person"
          placeholder="e.g. John Doe"
          :error="errors.contactPerson"
          autocomplete="name"
        />

        <InputField
          v-model="form.contactPhone"
          label="Phone"
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
          Required fields will be validated client-side before submit.
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
            {{ submitting ? (mode === 'create' ? 'Creating…' : 'Saving…') : (mode === 'create' ? 'Create' : 'Save Changes') }}
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
}


type CompanyFormErrors = Partial<Record<keyof CompanyFormData, string>>

type Props = {
  mode: CompanyFormMode
  /** Used in edit mode (and also allows prefill in create mode if desired). */
  initialData?: Partial<CompanyFormData>
  /** When used inside a modal/dialog, you may want an explicit cancel button. */
  showCancel?: boolean
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

  // Industry / Contact Person are optional unless backend requires them.
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

async function handleSubmit() {
  if (!validate()) return

  submitting.value = true
  formError.value = ''

  try {
    emit('submit', { ...form })
  } catch (e: unknown) {
    // Parent API wiring errors (or any thrown error) can be surfaced here.
    formError.value = e instanceof Error ? e.message : 'Failed to submit.'
  } finally {
    submitting.value = false
  }
}
</script>

