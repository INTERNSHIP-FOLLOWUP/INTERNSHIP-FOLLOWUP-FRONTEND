<template>
  <div class="animate-fade-in space-y-6">
    <!-- Back Button -->
    <div class="flex items-center gap-3">
      <button
        @click="goBack"
        class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Companies
      </button>
      <span class="text-sm text-slate-300">/</span>
      <span class="text-sm font-medium text-slate-900">{{
        mode === 'create' ? 'New Company' : 'Edit Company'
      }}</span>
    </div>

    <CompanyForm
      :mode="mode"
      :initialData="initialData"
      :apiErrors="apiErrors"
      :onSubmit="onSubmit"
      showCancel
      @cancel="goBack"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CompanyForm from '@/components/company/CompanyForm.vue'
import type { CompanyFormData } from '@/components/company/CompanyForm.vue'
import type { CompanyFormData as StoreCompanyFormData } from '@/stores/company'
import { useCompanyStore } from '@/stores/company'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { mapValidationErrors } from '@/utils/mapValidationErrors'
import { parseApiError } from '@/utils/errorParser'

const store = useCompanyStore()
const authStore = useAuthStore()
const toast = useToastStore()
const route = useRoute()
const router = useRouter()

const mode = computed(() => (route.params.id ? 'edit' : 'create'))
const apiErrors = ref<Record<string, string>>({})

function getCompanyId(): number {
  const idRaw = route.params.id
  return typeof idRaw === 'string' ? Number(idRaw) : Array.isArray(idRaw) ? Number(idRaw[0]) : NaN
}

const initialData = ref<Partial<CompanyFormData>>({
  companyName: '',
  companyEmail: '',
  location: '',
  contactPhone: '',
  website: '',
  companyImage: null,
  avatar: null,
  telegramLink: '',
})

async function loadIfNeeded() {
  if (isProfileMode.value) {
    // Company profile — load from the /company/profile endpoint
    await store.fetchProfile()
    const c = store.currentCompany
    if (!c) return

    initialData.value = {
      companyName: c.name,
      companyEmail: c.email ?? '',
      location: c.location ?? '',
      industry: c.industry ?? '',
      contactPerson: c.contactPerson ?? '',
      contactPhone: c.phone ?? '',
      website: c.website ?? '',
      companyImage: c.companyImageUrl ?? c.companyImage ?? null,
      avatar: authStore.userAvatar,
      telegramLink: c.telegramLink ?? '',
      role: c.role ?? '',
      password: '',
    }
    return
  }

  if (mode.value !== 'edit') return
  const id = getCompanyId()
  if (!Number.isFinite(id)) return

  await store.fetchCompanyById(id)
  const c = store.currentCompany
  if (!c) return

  initialData.value = {
    companyName: c.name,
    companyEmail: c.email ?? '',
    location: c.location ?? '',
    industry: c.industry ?? '',
    contactPerson: c.contactPerson ?? '',
    contactPhone: c.phone ?? '',
    website: c.website ?? '',
    companyImage: c.companyImageUrl ?? c.companyImage ?? null,
    avatar: authStore.userAvatar,
    telegramLink: c.telegramLink ?? '',
  }
}

onMounted(async () => {
  await loadIfNeeded()
})

function goBack() {
  router.push({ name: 'AdminCompanies' }).catch(() => {})
}

async function onSubmit(formData: CompanyFormData) {
  const payload = store.mapFromForm(formData as unknown as StoreCompanyFormData)
  apiErrors.value = {}

  try {
    if (isProfileMode.value) {
      await store.updateProfile(payload)
      await store.fetchProfile()
      toast.success('Profile updated successfully.')
    } else if (mode.value === 'create') {
      await store.createCompany(payload)
      await store.fetchCompanies()
      toast.success('Company created successfully.')
    } else {
      const id = getCompanyId()
      if (!Number.isFinite(id)) return
      await store.updateCompany(id, payload)
      await store.fetchCompanies()
      toast.success('Company updated successfully.')
    }
    await store.fetchCompanies()
    goBack()
  } catch (err: unknown) {
    const axiosErr = err as {
      response?: { status?: number; data?: { errors?: Record<string, string[]> } }
    }
    if (axiosErr.response?.status === 422) {
      apiErrors.value = mapValidationErrors(axiosErr.response.data?.errors)
      toast.error('Please fix the highlighted errors.', 'Validation Error')
    } else if (axiosErr.response?.status && axiosErr.response.status >= 500) {
      const parsed = parseApiError(err)
      toast.error(parsed.message, 'Server Error')
      throw new Error(parsed.message)
    } else {
      toast.error('Failed to save. Please try again.', 'Error')
      throw err
    }
  }
}
</script>
