<template>
  <div class="animate-fade-in space-y-6">
    <!-- Page Header (Profile Mode Only) -->
    <template v-if="isProfileMode">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Company & Supervisor Profile</h1>
          <p class="mt-1 text-sm text-slate-500">
            Manage your personal supervisor details, company information, and security settings.
          </p>
        </div>
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#21BAEA]/15 text-[#21BAEA] text-xs font-bold self-start sm:self-auto border border-[#21BAEA]/20">
          <span class="w-2 h-2 rounded-full bg-[#21BAEA]" />
          Supervisor Account
        </span>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="flex flex-col items-center gap-3">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p class="text-sm font-medium text-slate-500">Loading profile details...</p>
        </div>
      </div>

      <!-- Profile Content (Two-Column Layout) -->
      <template v-else>
        <!-- Success Message -->
        <div
          v-if="successMessage"
          class="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 shadow-2xs animate-fade-in"
          role="alert"
        >
          <svg class="h-5 w-5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm font-medium text-emerald-800">{{ successMessage }}</p>
          <button
            @click="successMessage = ''"
            class="ml-auto -mr-1 flex h-6 w-6 items-center justify-center rounded-full text-emerald-500 transition-colors hover:bg-emerald-100"
          >
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Two-Column Layout -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <!-- Left Column: Supervisor Avatar & Quick Info -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Supervisor Info Card -->
            <div class="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <!-- Avatar Section -->
              <div class="flex flex-col items-center text-center">
                <div class="relative group">
                  <div
                    class="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white shadow-lg transition-shadow duration-200 group-hover:shadow-xl"
                    :class="photoUploadError ? 'border-red-300' : 'border-slate-100'"
                  >
                    <img
                      v-if="photoPreview || displayPhoto"
                      :src="(photoPreview || displayPhoto) || ''"
                      :alt="supervisorFullName"
                      class="h-full w-full rounded-full object-cover"
                    />
                    <div
                      v-else
                      class="flex h-full w-full items-center justify-center bg-linear-to-br from-[#21BAEA] to-blue-600 text-3xl font-bold text-white"
                    >
                      {{ supervisorInitials }}
                    </div>
                  </div>
                </div>

                <p v-if="photoUploadError" class="mt-2 text-xs text-red-500">{{ photoUploadError }}</p>

                <h2 class="mt-4 text-lg font-bold text-slate-900">{{ supervisorFullName }}</h2>
                <p class="text-sm text-slate-500 truncate max-w-[250px]">{{ user?.email }}</p>

                <!-- Role Badge -->
                <span class="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-700">
                  <span class="flex h-1.5 w-1.5 rounded-full bg-blue-500" />
                  {{ user?.role || 'N/A' }}
                </span>
              </div>

              <!-- Account Info Divider -->
              <div class="mt-6 border-t border-slate-100 pt-5">
                <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-400">Account Info</h3>
                <dl class="mt-3 space-y-3">
                  <div>
                    <dt class="text-xs font-medium text-slate-400">Email</dt>
                    <dd class="mt-0.5 text-sm font-medium text-slate-800 truncate max-w-[250px]">{{ user?.email }}</dd>
                  </div>
                  <div>
                    <dt class="text-xs font-medium text-slate-400">Role</dt>
                    <dd class="mt-0.5 text-sm font-medium capitalize text-slate-800">{{ user?.role || 'N/A' }}</dd>
                  </div>
                  <div>
                    <dt class="text-xs font-medium text-slate-400">First Name</dt>
                    <dd class="mt-0.5 text-sm font-medium text-slate-800">{{ user?.first_name || '—' }}</dd>
                  </div>
                  <div>
                    <dt class="text-xs font-medium text-slate-400">Last Name</dt>
                    <dd class="mt-0.5 text-sm font-medium text-slate-800">{{ user?.last_name || '—' }}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <!-- Right Column: Forms -->
          <div class="space-y-6 lg:col-span-2">
            <!-- Company Profile Card -->
            <div class="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
              <div class="border-b border-slate-100 px-6 py-4">
                <div>
                  <h2 class="text-base font-bold text-slate-900">Company Profile</h2>
                  <p class="mt-0.5 text-sm text-slate-500">Update your company information and details</p>
                </div>
              </div>

              <div class="p-6">
                <CompanyForm
                  :mode="mode"
                  :initialData="initialData"
                  :apiErrors="apiErrors"
                  :onSubmit="onSubmit"
                  :showCancel="false"
                  hideHeader
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>

    <!-- Non-Profile Mode: Original Simple Layout -->
    <template v-else>
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
        <span class="text-sm font-medium text-slate-900">
          {{ mode === 'create' ? 'New Company' : 'Edit Company' }}
        </span>
      </div>

      <CompanyForm
        :mode="mode"
        :initialData="initialData"
        :apiErrors="apiErrors"
        :onSubmit="onSubmit"
        showCancel
        @cancel="goBack"
      />
    </template>
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

// ── State ──
const isLoading = ref(false)
const successMessage = ref('')
const photoUploadError = ref('')
const photoPreview = ref<string | null>(null)

const mode = computed(() => (route.params.id ? 'edit' : 'create'))
const isProfileMode = computed(() => route.name === 'CompanyProfile')
const apiErrors = ref<Record<string, string>>({})

// ── Computed Properties for Supervisor Info ──
const user = computed(() => authStore.user)
const supervisorFullName = computed(() => {
  if (!user.value) return 'Unknown'
  return `${user.value.first_name} ${user.value.last_name}`.trim() || user.value.name || 'Unknown'
})
const supervisorInitials = computed(() => {
  if (!user.value) return 'U'
  const first = user.value.first_name?.[0] || ''
  const last = user.value.last_name?.[0] || ''
  return (first + last).toUpperCase() || user.value.name?.[0]?.toUpperCase() || 'U'
})
const displayPhoto = computed(() => {
  return user.value?.avatar_url || user.value?.avatar || null
})

const initialData = ref<Partial<CompanyFormData>>({
  companyName: '',
  companyEmail: '',
  location: '',
  website: '',
  companyImage: null,
  telegramLink: '',
})

function getCompanyId(): number {
  const idRaw = route.params.id
  return typeof idRaw === 'string' ? Number(idRaw) : Array.isArray(idRaw) ? Number(idRaw[0]) : NaN
}

async function loadIfNeeded() {
  if (isProfileMode.value) {
    isLoading.value = true
    try {
      // Company profile — load from the /company/profile endpoint
      await store.fetchProfile()
      const c = store.currentCompany
      if (!c) {
        isLoading.value = false
        return
      }

      initialData.value = {
        companyName: c.name,
        companyEmail: c.email ?? '',
        location: c.location ?? '',
        industry: c.industry ?? '',
        website: c.website ?? '',
        companyImage: c.companyImageUrl ?? c.companyImage ?? null,
        telegramLink: c.telegramLink ?? '',
      }
    } finally {
      isLoading.value = false
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
    website: c.website ?? '',
    companyImage: c.companyImageUrl ?? c.companyImage ?? null,
    telegramLink: c.telegramLink ?? '',
  }
}

onMounted(async () => {
  await loadIfNeeded()
})

function goBack() {
  if (isProfileMode.value) {
    router.push({ name: 'CompanyDashboard' }).catch(() => {})
  } else {
    router.push({ name: 'AdminCompanies' }).catch(() => {})
  }
}

async function onSubmit(formData: CompanyFormData) {
  const payload = store.mapFromForm(formData as unknown as StoreCompanyFormData)
  apiErrors.value = {}
  successMessage.value = ''

  try {
    if (isProfileMode.value) {
      await store.updateProfile(payload)
      await store.fetchProfile()
      successMessage.value = 'Profile updated successfully.'
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
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
    if (!isProfileMode.value) {
      await store.fetchCompanies()
      goBack()
    }
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
