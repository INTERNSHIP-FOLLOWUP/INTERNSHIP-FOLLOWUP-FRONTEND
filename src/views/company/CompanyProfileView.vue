<template>
  <div class="animate-fade-in space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Company & Supervisor Profile</h1>
        <p class="mt-1 text-sm text-slate-500">
          Manage your personal supervisor details, profile avatar, company organization info, and security settings.
        </p>
      </div>
      <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#21BAEA]/15 text-[#21BAEA] text-xs font-bold self-start sm:self-auto border border-[#21BAEA]/20">
        <span class="w-2 h-2 rounded-full bg-[#21BAEA]" />
        Supervisor Account
      </span>
    </div>

    <!-- Loading State -->
    <div v-if="loadingAll" class="flex items-center justify-center py-20">
      <div class="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" color="primary" />
        <p class="text-sm font-medium text-slate-500">Loading profile details...</p>
      </div>
    </div>

    <!-- Profile Content -->
    <template v-else>
      <!-- Success Toast Notification -->
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
          aria-label="Dismiss"
        >
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Two-Column Layout (Matching Tutor Profile) -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Left Column: Avatar & Quick Info -->
        <div class="lg:col-span-1 space-y-6">
          <div class="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <!-- Supervisor Avatar Section -->
            <div class="flex flex-col items-center text-center">
              <div class="relative group">
                <div
                  class="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white shadow-lg transition-shadow duration-200 group-hover:shadow-xl"
                  :class="photoUploadError ? 'border-red-300' : 'border-slate-100'"
                >
                  <img
                    v-if="photoPreview || displayPhoto"
                    :src="photoPreview || displayPhoto || undefined"
                    :alt="fullName"
                    class="h-full w-full rounded-full object-cover"
                  />
                  <div
                    v-else
                    class="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#21BAEA] to-blue-600 text-3xl font-bold text-white"
                  >
                    {{ initials }}
                  </div>
                </div>

                <!-- Upload Overlay -->
                <label
                  class="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  :class="{ 'opacity-100': uploadingPhoto }"
                >
                  <svg
                    v-if="!uploadingPhoto"
                    class="h-8 w-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <LoadingSpinner v-else size="sm" color="white" />
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/jpeg,image/png"
                    class="hidden"
                    @change="handlePhotoUpload"
                  />
                </label>
              </div>

              <p v-if="photoUploadError" class="mt-2 text-xs text-red-500">{{ photoUploadError }}</p>

              <h2 class="mt-4 text-lg font-bold text-slate-900">{{ fullName }}</h2>
              <p class="text-xs text-slate-500 truncate max-w-[240px]">{{ user?.email }}</p>

              <!-- Role Badge -->
              <span
                class="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-amber-50 text-[#FF9933] border border-[#FF9933]/20"
              >
                <span class="flex h-1.5 w-1.5 rounded-full bg-[#FF9933]" />
                Company Supervisor
              </span>
            </div>

            <!-- Quick Info Divider -->
            <div class="mt-6 border-t border-slate-100 pt-5">
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Account & Company Info</h3>
              <dl class="mt-3 space-y-3">
                <div>
                  <dt class="text-xs font-medium text-slate-400">Supervisor Email</dt>
                  <dd class="mt-0.5 text-xs font-semibold text-slate-800 truncate max-w-[240px]">{{ user?.email || '—' }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-slate-400">Company Name</dt>
                  <dd class="mt-0.5 text-xs font-semibold text-slate-800">{{ currentCompany?.name || 'Assigned Company' }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-slate-400">Industry Track</dt>
                  <dd class="mt-0.5 text-xs font-semibold text-slate-800">{{ currentCompany?.industry || 'Technology & IT Services' }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-slate-400">Member Since</dt>
                  <dd class="mt-0.5 text-xs font-semibold text-slate-800">{{ memberSince }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <!-- Right Column: Forms -->
        <div class="space-y-6 lg:col-span-2">
          <!-- Card 1: Supervisor Personal Information -->
          <div class="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
            <div class="border-b border-slate-100 px-6 py-4">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-base font-bold text-slate-900">Personal Information</h2>
                  <p class="mt-0.5 text-xs text-slate-500">Update supervisor personal details and contact info</p>
                </div>
                <button
                  v-if="!editingProfile"
                  @click="startEditingProfile"
                  class="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-2 text-xs font-bold text-[#21BAEA] transition-colors hover:bg-blue-100"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Personal Info
                </button>
              </div>
            </div>

            <div class="p-6">
              <!-- View Mode -->
              <dl v-if="!editingProfile" class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt class="text-xs font-medium text-slate-400">First Name</dt>
                  <dd class="mt-0.5 text-sm font-semibold text-slate-800">{{ user?.first_name || '—' }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-slate-400">Last Name</dt>
                  <dd class="mt-0.5 text-sm font-semibold text-slate-800">{{ user?.last_name || '—' }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-slate-400">Email Address</dt>
                  <dd class="mt-0.5 text-sm font-semibold text-slate-800 truncate max-w-[240px]">{{ user?.email || '—' }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-slate-400">Phone Number</dt>
                  <dd class="mt-0.5 text-sm font-semibold text-slate-800">{{ (user as any)?.phone || 'Not provided' }}</dd>
                </div>
              </dl>

              <!-- Edit Mode -->
              <form v-else @submit.prevent="saveProfile" class="space-y-4">
                <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  <FormField label="First Name" :error="formErrors.first_name" required>
                    <input
                      v-model="editForm.first_name"
                      type="text"
                      placeholder="Enter first name"
                      class="block w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all"
                      :class="inputErrorClass('first_name')"
                      @input="clearFieldError('first_name')"
                    />
                  </FormField>

                  <FormField label="Last Name" :error="formErrors.last_name" required>
                    <input
                      v-model="editForm.last_name"
                      type="text"
                      placeholder="Enter last name"
                      class="block w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all"
                      :class="inputErrorClass('last_name')"
                      @input="clearFieldError('last_name')"
                    />
                  </FormField>

                  <FormField label="Email" :error="formErrors.email" required>
                    <input
                      v-model="editForm.email"
                      type="email"
                      placeholder="Enter email address"
                      class="block w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all"
                      :class="inputErrorClass('email')"
                      @input="clearFieldError('email')"
                    />
                  </FormField>

                  <FormField label="Phone Number">
                    <input
                      v-model="editForm.phone"
                      type="text"
                      placeholder="Enter phone number"
                      class="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all"
                    />
                  </FormField>
                </div>

                <ErrorAlert v-if="formErrors._form" :message="formErrors._form" />

                <div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    :disabled="profileSubmitting"
                    class="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    @click="editingProfile = false"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="profileSubmitting"
                    class="inline-flex items-center gap-2 rounded-xl bg-[#21BAEA] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#00A3D9] transition-all"
                  >
                    <LoadingSpinner v-if="profileSubmitting" size="sm" color="white" />
                    Save Personal Profile
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Card 2: Company Profile Information -->
          <div class="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
            <div class="border-b border-slate-100 px-6 py-4">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-base font-bold text-slate-900">Company Information</h2>
                  <p class="mt-0.5 text-xs text-slate-500">Manage company name, industry, website, and contact details</p>
                </div>
                <button
                  v-if="!editingCompany"
                  @click="startEditingCompany"
                  class="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-3.5 py-2 text-xs font-bold text-[#FF9933] transition-colors hover:bg-amber-100"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m3 0h1m-4-8l-2-2m0 0l-2 2m2-2v6" />
                  </svg>
                  Edit Company Details
                </button>
              </div>
            </div>

            <div class="p-6">
              <!-- View Mode -->
              <dl v-if="!editingCompany" class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt class="text-xs font-medium text-slate-400">Company Name</dt>
                  <dd class="mt-0.5 text-sm font-semibold text-slate-800">{{ currentCompany?.name || '—' }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-slate-400">Industry / Sector</dt>
                  <dd class="mt-0.5 text-sm font-semibold text-slate-800">{{ currentCompany?.industry || '—' }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-slate-400">Office Location / Address</dt>
                  <dd class="mt-0.5 text-sm font-semibold text-slate-800">{{ currentCompany?.location || '—' }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-slate-400">Website URL</dt>
                  <dd class="mt-0.5 text-sm font-semibold text-[#21BAEA] truncate">
                    <a v-if="currentCompany?.website" :href="currentCompany.website" target="_blank" class="hover:underline">
                      {{ currentCompany.website }}
                    </a>
                    <span v-else class="text-slate-400">—</span>
                  </dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-slate-400">Telegram Link / Contact</dt>
                  <dd class="mt-0.5 text-sm font-semibold text-slate-800">{{ currentCompany?.telegramLink || '—' }}</dd>
                </div>
              </dl>

              <!-- Edit Mode -->
              <form v-else @submit.prevent="saveCompanyProfile" class="space-y-4">
                <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  <FormField label="Company Name" required class="sm:col-span-2">
                    <input
                      v-model="companyForm.companyName"
                      type="text"
                      placeholder="Enter official company name"
                      class="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all"
                    />
                  </FormField>

                  <FormField label="Industry / Field">
                    <input
                      v-model="companyForm.industry"
                      type="text"
                      placeholder="e.g. Software Development, IT Services"
                      class="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all"
                    />
                  </FormField>

                  <FormField label="Office Address / Location">
                    <input
                      v-model="companyForm.location"
                      type="text"
                      placeholder="Phnom Penh, Cambodia"
                      class="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all"
                    />
                  </FormField>

                  <FormField label="Website URL">
                    <input
                      v-model="companyForm.website"
                      type="url"
                      placeholder="https://company.com"
                      class="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all"
                    />
                  </FormField>

                  <FormField label="Telegram Link / Contact">
                    <input
                      v-model="companyForm.telegramLink"
                      type="text"
                      placeholder="https://t.me/company"
                      class="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all"
                    />
                  </FormField>
                </div>

                <div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    :disabled="companySubmitting"
                    class="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    @click="editingCompany = false"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="companySubmitting"
                    class="inline-flex items-center gap-2 rounded-xl bg-[#FF9933] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#e68a2e] transition-all"
                  >
                    <LoadingSpinner v-if="companySubmitting" size="sm" color="white" />
                    Save Company Profile
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Card 3: Password & Security -->
          <div class="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
            <div class="border-b border-slate-100 px-6 py-4">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-base font-bold text-slate-900">Security & Password</h2>
                  <p class="mt-0.5 text-xs text-slate-500">Update your supervisor account password</p>
                </div>
                <button
                  v-if="!editingPassword"
                  @click="editingPassword = true"
                  class="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-200"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Change Password
                </button>
              </div>
            </div>

            <div class="p-6">
              <template v-if="!editingPassword">
                <p class="text-xs text-slate-500">Keep your supervisor account secure by using a strong password.</p>
              </template>

              <form v-else @submit.prevent="savePassword" class="space-y-4">
                <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  <PasswordInput
                    v-model="passwordForm.current_password"
                    label="Current Password"
                    placeholder="Enter current password"
                    required
                    :error="passwordErrors.current_password ?? ''"
                  />

                  <div class="sm:col-span-2 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                    <PasswordInput
                      v-model="passwordForm.password"
                      label="New Password"
                      placeholder="Min. 8 characters"
                      required
                      :error="passwordErrors.password ?? ''"
                    />

                    <PasswordInput
                      v-model="passwordForm.password_confirmation"
                      label="Confirm New Password"
                      placeholder="Re-enter new password"
                      required
                      :error="passwordErrors.password_confirmation ?? ''"
                    />
                  </div>
                </div>

                <ErrorAlert v-if="passwordErrors._form" :message="passwordErrors._form" />

                <div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    :disabled="passwordSubmitting"
                    class="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    @click="cancelPasswordChange"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="passwordSubmitting || !isPasswordFormValid"
                    class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-all disabled:opacity-50"
                  >
                    <LoadingSpinner v-if="passwordSubmitting" size="sm" color="white" />
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/auth'
import { useCompanyStore } from '@/stores/company'
import { useToastStore } from '@/stores/toast'
import FormField from '@/components/ui/FormField.vue'
import PasswordInput from '@/components/ui/PasswordInput.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorAlert from '@/components/common/ErrorAlert.vue'
import { parseApiError } from '@/utils/errorParser'


const authStore = useAuthStore()
const companyStore = useCompanyStore()
const toast = useToastStore()

const user = computed(() => authStore.user)
const currentCompany = computed(() => companyStore.currentCompany)
const loadingAll = ref(false)

const displayPhoto = computed(() => {
  const u = user.value
  if (!u) return null
  const raw = (u as Record<string, unknown>).avatar_url as string | undefined
    ?? (u as Record<string, unknown>).avatar as string | undefined
  if (!raw) return null
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/api\/?$/, '')
  const cleanPath = raw.startsWith('/') ? raw : `/storage/${raw}`
  return `${baseUrl}${cleanPath}`
})

const fullName = computed(() => {
  const u = user.value
  if (!u) return 'Supervisor'
  return `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Company Supervisor'
})

const initials = computed(() => {
  const u = user.value
  if (!u) return 'CS'
  return `${(u.first_name?.[0] || '')}${(u.last_name?.[0] || '')}`.toUpperCase() || 'CS'
})

const memberSince = computed(() => {
  const u = user.value as Record<string, unknown> | null
  const raw = u?.created_at as string | undefined
  if (raw) {
    const d = new Date(raw)
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }
  }
  return '—'
})

const successMessage = ref('')

// ── Supervisor Personal Profile ──
const editingProfile = ref(false)
const editForm = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
})
const formErrors = reactive<Record<string, string>>({})
const profileSubmitting = ref(false)

function startEditingProfile(): void {
  const u = user.value
  if (!u) return
  editForm.first_name = u.first_name || ''
  editForm.last_name = u.last_name || ''
  editForm.email = u.email || ''
  editForm.phone = (u as Record<string, unknown>).phone as string || ''
  editingProfile.value = true
}

function inputErrorClass(field: string): string {
  return formErrors[field]
    ? 'border-red-300 ring-1 ring-red-200 focus:border-red-500'
    : 'border-slate-200 focus:border-[#21BAEA] focus:ring-2 focus:ring-[#21BAEA]/20'
}

function clearFieldError(field: string): void {
  delete formErrors[field]
}

async function saveProfile(): Promise<void> {
  if (!editForm.first_name.trim() || !editForm.last_name.trim() || !editForm.email.trim()) {
    formErrors._form = 'First name, last name, and email are required.'
    return
  }

  profileSubmitting.value = true
  try {
    const fd = new FormData()
    fd.append('first_name', editForm.first_name)
    fd.append('last_name', editForm.last_name)
    fd.append('email', editForm.email)
    if (editForm.phone) fd.append('phone', editForm.phone)
    fd.append('_method', 'PUT')

    const updated = await authService.updateProfile(fd)
    authStore.user = updated

    successMessage.value = 'Personal supervisor profile updated successfully!'
    setTimeout(() => { successMessage.value = '' }, 4000)
    toast.success('Your profile details have been updated.')
    editingProfile.value = false
  } catch (err: unknown) {
    const parsed = parseApiError(err)
    formErrors._form = parsed.message
  } finally {
    profileSubmitting.value = false
  }
}

// ── Supervisor Photo Upload ──
const fileInput = ref<HTMLInputElement | null>(null)
const uploadingPhoto = ref(false)
const photoUploadError = ref('')
const photoPreview = ref<string | null>(null)

async function handlePhotoUpload(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    photoUploadError.value = 'Only JPG and PNG files are allowed.'
    return
  }

  photoUploadError.value = ''
  uploadingPhoto.value = true

  if (photoPreview.value) URL.revokeObjectURL(photoPreview.value)
  photoPreview.value = URL.createObjectURL(file)

  try {
    const fd = new FormData()
    fd.append('avatar', file)
    fd.append('_method', 'PUT')
    fd.append('first_name', user.value?.first_name || '')
    fd.append('last_name', user.value?.last_name || '')
    fd.append('email', user.value?.email || '')

    const updated = await authService.updateProfile(fd)
    authStore.user = updated

    successMessage.value = 'Profile avatar updated!'
    setTimeout(() => { successMessage.value = '' }, 4000)
    toast.success('Your profile photo has been updated.')
    photoPreview.value = null
  } catch (err: unknown) {
    const parsed = parseApiError(err)
    photoUploadError.value = parsed.message
  } finally {
    uploadingPhoto.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

// ── Company Profile Editing ──
const editingCompany = ref(false)
const companyForm = reactive({
  companyName: '',
  industry: '',
  location: '',
  website: '',
  telegramLink: '',
})
const companySubmitting = ref(false)

function startEditingCompany(): void {
  const c = currentCompany.value
  companyForm.companyName = c?.name || ''
  companyForm.industry = c?.industry || ''
  companyForm.location = c?.location || ''
  companyForm.website = c?.website || ''
  companyForm.telegramLink = c?.telegramLink || ''
  editingCompany.value = true
}

async function saveCompanyProfile(): Promise<void> {
  if (!companyForm.companyName.trim()) {
    toast.error('Company Name is required.')
    return
  }

  companySubmitting.value = true
  try {
    await companyStore.updateProfile({
      companyName: companyForm.companyName,
      industry: companyForm.industry || null,
      address: companyForm.location || null,
      website: companyForm.website || null,
      telegramLink: companyForm.telegramLink || null,
    })
    await companyStore.fetchProfile()

    successMessage.value = 'Company profile details updated successfully!'
    setTimeout(() => { successMessage.value = '' }, 4000)
    toast.success('Company profile has been updated.')
    editingCompany.value = false
  } catch (err: unknown) {
    const parsed = parseApiError(err)
    toast.error(parsed.message)
  } finally {
    companySubmitting.value = false
  }
}

// ── Password Change ──
const editingPassword = ref(false)
const passwordForm = reactive({
  current_password: '',
  password: '',
  password_confirmation: '',
})
const passwordErrors = reactive<Record<string, string>>({})
const passwordSubmitting = ref(false)

const isPasswordFormValid = computed(() => {
  return (
    passwordForm.current_password.length > 0 &&
    passwordForm.password.length >= 8 &&
    passwordForm.password_confirmation.length > 0 &&
    passwordForm.password === passwordForm.password_confirmation
  )
})

function cancelPasswordChange(): void {
  editingPassword.value = false
  passwordForm.current_password = ''
  passwordForm.password = ''
  passwordForm.password_confirmation = ''
}

async function savePassword(): Promise<void> {
  if (!isPasswordFormValid.value) return

  passwordSubmitting.value = true
  try {
    await authService.changePassword({
      current_password: passwordForm.current_password,
      password: passwordForm.password,
      password_confirmation: passwordForm.password_confirmation,
    })

    successMessage.value = 'Password updated successfully!'
    setTimeout(() => { successMessage.value = '' }, 4000)
    toast.success('Your password has been changed.')
    editingPassword.value = false
    cancelPasswordChange()
  } catch (err: unknown) {
    const parsed = parseApiError(err)
    passwordErrors._form = parsed.message
  } finally {
    passwordSubmitting.value = false
  }
}

onMounted(async () => {
  loadingAll.value = true
  try {
    await Promise.all([
      authStore.refreshUser(),
      companyStore.fetchProfile(),
    ])
  } catch {
    // Silently continue
  } finally {
    loadingAll.value = false
  }
})

onUnmounted(() => {
  if (photoPreview.value) {
    URL.revokeObjectURL(photoPreview.value)
    photoPreview.value = null
  }
})
</script>
