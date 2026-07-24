<!-- src/views/profile/StudentProfileView.vue -->
<template>
  <div class="animate-fade-in space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-slate-900">My Profile</h1>
      <p class="mt-1 text-sm text-slate-500">
        Manage your personal information, profile photo, and security settings.
      </p>
    </div>

    <!-- Loading State -->
    <div
      v-if="store.loading && !store.profile"
      class="flex items-center justify-center py-20"
    >
      <div class="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" color="primary" />
        <p class="text-sm font-medium text-slate-500">Loading your profile...</p>
      </div>
    </div>

    <!-- Error State (initial load failure) -->
    <ErrorAlert
      v-else-if="store.error && !store.profile"
      :message="store.error"
    />

    <!-- Profile Content -->
    <template v-else-if="store.profile">
      <!-- Success Toast Notifications -->
      <div
        v-if="successMessage"
        class="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4"
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

      <!-- Two-column layout -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Left Column: Avatar & Quick Info -->
        <div class="lg:col-span-1">
          <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <!-- Avatar Section -->
            <div class="flex flex-col items-center text-center">
              <div class="relative group">
                <div
                  class="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white shadow-lg transition-shadow duration-200 group-hover:shadow-xl"
                  :class="photoUploadError ? 'border-red-300' : 'border-slate-100'"
                >
                  <img
                    v-if="photoPreview || displayPhoto"
                    :src="photoPreview ?? displayPhoto ?? undefined"
                    :alt="store.profile.name"
                    class="h-full w-full rounded-full object-cover"
                  />
                  <div
                    v-else
                    class="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500 text-3xl font-bold text-white"
                  >
                    {{ initials }}
                  </div>
                </div>

                <!-- Upload overlay -->
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

              <h2 class="mt-4 text-lg font-bold text-slate-900">{{ store.profile.name }}</h2>
              <p class="text-sm text-slate-500">{{ formatStudentId(store.profile.student_code, store.profile.batch) }}</p>

              <!-- Status Badge -->
              <span
                class="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                :class="statusBadgeClass"
              >
                <span class="flex h-1.5 w-1.5 rounded-full" :class="statusDotClass" />
                {{ store.profile.status || 'N/A' }}
              </span>
            </div>

            <!-- Quick Info Divider -->
            <div class="mt-6 border-t border-slate-100 pt-5">
              <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-400">Account Info</h3>
              <dl class="mt-3 space-y-3">
                <div>
                  <dt class="text-xs font-medium text-slate-400">Email</dt>
                  <dd class="mt-0.5 text-sm font-medium text-slate-800">{{ store.profile.email }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-slate-400">Batch</dt>
                  <dd class="mt-0.5 text-sm font-medium text-slate-800">{{ store.profile.batch?.batch_name || 'Not assigned' }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-slate-400">Tutor</dt>
                  <dd class="mt-0.5 text-sm font-medium text-slate-800">{{ store.profile.tutor?.name || 'Not assigned' }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-slate-400">Member Since</dt>
                  <dd class="mt-0.5 text-sm font-medium text-slate-800">{{ formatDate(store.profile.created_at) }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <!-- Right Column: Forms -->
        <div class="space-y-6 lg:col-span-2">
          <!-- Personal Information Card -->
          <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div class="border-b border-slate-100 px-6 py-4">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-base font-bold text-slate-900">Personal Information</h2>
                  <p class="mt-0.5 text-sm text-slate-500">Update your personal details</p>
                </div>
                <button
                  v-if="!editingProfile"
                  @click="startEditing"
                  class="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-3.5 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-100"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              </div>
            </div>

            <div class="p-6">
              <!-- View Mode -->
              <dl v-if="!editingProfile" class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt class="text-xs font-medium text-slate-400">First Name</dt>
                  <dd class="mt-0.5 text-sm font-semibold text-slate-800">{{ firstName }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-slate-400">Last Name</dt>
                  <dd class="mt-0.5 text-sm font-semibold text-slate-800">{{ lastName }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-slate-400">Phone Number</dt>
                  <dd class="mt-0.5 text-sm font-semibold text-slate-800">{{ store.profile.phone || '—' }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-slate-400">Gender</dt>
                  <dd class="mt-0.5 text-sm font-semibold text-slate-800">{{ store.profile.gender || '—' }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-slate-400">Last Updated</dt>
                  <dd class="mt-0.5 text-sm font-semibold text-slate-800">{{ formatDate(store.profile.updated_at) }}</dd>
                </div>
              </dl>

              <!-- Edit Mode -->
              <form v-else @submit.prevent="saveProfile" class="space-y-4">
                <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  <FormField label="First Name" :error="formErrors.first_name" required>
                    <input
                      v-model="editForm.first_name"
                      type="text"
                      placeholder="Enter your first name"
                      class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200"
                      :class="inputErrorClass('first_name')"
                      @input="clearFieldError('first_name')"
                    />
                  </FormField>

                  <FormField label="Last Name" :error="formErrors.last_name" required>
                    <input
                      v-model="editForm.last_name"
                      type="text"
                      placeholder="Enter your last name"
                      class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200"
                      :class="inputErrorClass('last_name')"
                      @input="clearFieldError('last_name')"
                    />
                  </FormField>

                  <FormField label="Phone" :error="formErrors.phone">
                    <input
                      v-model="editForm.phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all duration-200"
                      :class="inputErrorClass('phone')"
                      @input="clearFieldError('phone')"
                    />
                  </FormField>

                  <FormField label="Gender" :error="formErrors.gender">
                    <select
                      v-model="editForm.gender"
                      class="block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition-all duration-200"
                      :class="inputErrorClass('gender')"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </FormField>
                </div>

                <!-- Form-level error -->
                <ErrorAlert v-if="formErrors._form" :message="formErrors._form" />

                <!-- Actions -->
                <div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    :disabled="store.saving"
                    class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                    @click="cancelEditing"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="store.saving"
                    class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:from-primary-700 hover:to-primary-600 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <LoadingSpinner v-if="store.saving" size="sm" color="white" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Password Change Card -->
          <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div class="border-b border-slate-100 px-6 py-4">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-base font-bold text-slate-900">Security</h2>
                  <p class="mt-0.5 text-sm text-slate-500">Update your password</p>
                </div>
                <button
                  v-if="!editingPassword"
                  @click="editingPassword = true"
                  class="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-3.5 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-100"
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
                <p class="text-sm text-slate-500">Your password was last changed whenever you last set it. Keep it secure and don't share it with anyone.</p>
              </template>

              <form v-else @submit.prevent="savePassword" class="space-y-4">
                <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  <PasswordInput
                    v-model="passwordForm.current_password"
                    label="Current Password"
                    placeholder="Enter current password"
                    required
                    :error="passwordErrors.current_password ?? ''"
                    autocomplete="current-password"
                  />

                  <div class="sm:col-span-2 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                    <PasswordInput
                      v-model="passwordForm.password"
                      label="New Password"
                      placeholder="Min. 8 characters"
                      required
                      :error="passwordErrors.password ?? ''"
                      autocomplete="new-password"
                    />

                    <PasswordInput
                      v-model="passwordForm.password_confirmation"
                      label="Confirm New Password"
                      placeholder="Re-enter new password"
                      required
                      :error="passwordErrors.password_confirmation ?? ''"
                      autocomplete="new-password"
                    />
                  </div>
                </div>

                <!-- Password requirements hint -->
                <div class="rounded-lg bg-amber-50/60 border border-amber-100 px-4 py-3">
                  <div class="flex items-start gap-2">
                    <svg class="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-xs text-amber-800">Password must be at least 8 characters and include a mix of letters, numbers, and symbols for better security.</p>
                  </div>
                </div>

                <!-- Form-level error -->
                <ErrorAlert v-if="passwordErrors._form" :message="passwordErrors._form" />

                <!-- Actions -->
                <div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    :disabled="store.saving"
                    class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                    @click="cancelPasswordChange"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="store.saving || !isPasswordFormValid"
                    class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:from-primary-700 hover:to-primary-600 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <LoadingSpinner v-if="store.saving" size="sm" color="white" />
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
import { useStudentProfileStore } from '@/stores/studentProfile'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import FormField from '@/components/ui/FormField.vue'
import PasswordInput from '@/components/ui/PasswordInput.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorAlert from '@/components/common/ErrorAlert.vue'
import { parseApiError } from '@/utils/errorParser'
import { mapValidationErrors } from '@/utils/mapValidationErrors'
import { formatStudentId } from '@/utils/studentUtils'
import type { StudentProfileUpdatePayload } from '@/types/studentProfile'

const store = useStudentProfileStore()
const authStore = useAuthStore()
const toast = useToastStore()

// ── Lifecycle ──
onMounted(async () => {
  try {
    await store.fetchProfile()
  } catch {
    // Error is handled by the store
  }
})

// ── Helpers ──

/**
 * Construct a displayable photo URL from the relative path returned by the API.
 * Backend returns relative paths like "/storage/students/abc.jpg" — we prepend
 * the API base URL to make a full URL the browser can load.
 */
const displayPhoto = computed(() => {
  const photo = store.profile?.photo
  if (!photo) return null
  // Backend now returns full URLs directly (e.g. "http://localhost:8000/storage/...")
  if (photo.startsWith('http://') || photo.startsWith('https://')) return photo
  // Defensive fallback: prepend base URL for any relative path
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/api\/?$/, '')
  const cleanPath = photo.startsWith('/') ? photo : `/storage/${photo}`
  return `${baseUrl}${cleanPath}`
})

const firstName = computed(() => {
  const name = store.profile?.name || ''
  return name.split(' ')[0] || '—'
})

const lastName = computed(() => {
  const name = store.profile?.name || ''
  const parts = name.split(' ')
  return parts.slice(1).join(' ') || '—'
})

const initials = computed(() => {
  if (!store.profile?.name) return '?'
  return store.profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const statusBadgeClass = computed(() => {
  switch (store.profile?.status) {
    case 'active':
      return 'bg-emerald-50 text-emerald-700'
    case 'inactive':
      return 'bg-slate-50 text-slate-600'
    case 'graduated':
      return 'bg-blue-50 text-blue-700'
    case 'suspended':
      return 'bg-red-50 text-red-700'
    default:
      return 'bg-slate-50 text-slate-600'
  }
})

const statusDotClass = computed(() => {
  switch (store.profile?.status) {
    case 'active':
      return 'bg-emerald-500'
    case 'inactive':
      return 'bg-slate-400'
    case 'graduated':
      return 'bg-blue-500'
    case 'suspended':
      return 'bg-red-500'
    default:
      return 'bg-slate-400'
  }
})

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

// ── Success Message (inline toast) ──
const successMessage = ref('')

// ── Profile Editing ──
const editingProfile = ref(false)
const editForm = reactive({
  first_name: '',
  last_name: '',
  phone: '',
  gender: '',
})
const formErrors = reactive<Record<string, string>>({})

function startEditing(): void {
  const parts = (store.profile?.name || '').split(' ')
  editForm.first_name = parts[0] || ''
  editForm.last_name = parts.slice(1).join(' ') || ''
  editForm.phone = store.profile?.phone || ''
  editForm.gender = store.profile?.gender || ''
  editingProfile.value = true
}

function cancelEditing(): void {
  editingProfile.value = false
  clearAllFormErrors()
}

function inputErrorClass(field: string): string {
  return formErrors[field]
    ? 'border-error ring-1 ring-error/20 focus:border-error focus:ring-2 focus:ring-error/30'
    : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
}

function clearFieldError(field: string): void {
  delete formErrors[field]
}

function clearAllFormErrors(): void {
  for (const key of Object.keys(formErrors)) {
    delete formErrors[key]
  }
}

function validateProfileForm(): boolean {
  let valid = true
  clearAllFormErrors()

  if (!editForm.first_name.trim()) {
    formErrors.first_name = 'First name is required.'
    valid = false
  }

  if (!editForm.last_name.trim()) {
    formErrors.last_name = 'Last name is required.'
    valid = false
  }

  if (editForm.phone && !/^[\d\s\-+()]{7,20}$/.test(editForm.phone)) {
    formErrors.phone = 'Please enter a valid phone number.'
    valid = false
  }

  return valid
}

async function saveProfile(): Promise<void> {
  if (!validateProfileForm()) return

  const payload: StudentProfileUpdatePayload = {}
  const fullName = `${editForm.first_name} ${editForm.last_name}`.trim()
  if (fullName !== store.profile?.name) payload.name = fullName
  if (editForm.phone !== store.profile?.phone) payload.phone = editForm.phone || undefined
  if (editForm.gender !== store.profile?.gender) payload.gender = editForm.gender || undefined

  // Only send if something changed
  if (Object.keys(payload).length === 0) {
    editingProfile.value = false
    return
  }

  try {
    await store.updateProfile(payload)
    // Sync sidebar/navbar name with updated profile
    try {
      await authStore.refreshUser()
    } catch {
      // Silently ignore — profile was saved successfully
    }
    successMessage.value = 'Profile updated successfully!'
    setTimeout(() => { successMessage.value = '' }, 4000)
    toast.success('Your profile has been updated.', 'Profile Updated')
    editingProfile.value = false
  } catch (err: unknown) {
    const axiosErr = err as {
      response?: { status?: number; data?: { errors?: Record<string, string[]>; message?: string } }
    }
    if (axiosErr.response?.status === 422 && axiosErr.response.data?.errors) {
      const mapped = mapValidationErrors(axiosErr.response.data.errors)
      for (const [key, msg] of Object.entries(mapped)) {
        (formErrors as Record<string, string>)[key] = msg
      }
    } else {
      const parsed = parseApiError(err)
      formErrors._form = parsed.message
    }
  }
}

// ── Photo Upload ──
const fileInput = ref<HTMLInputElement | null>(null)
const uploadingPhoto = ref(false)
const photoUploadError = ref('')
const photoPreview = ref<string | null>(null)

async function handlePhotoUpload(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  // Validate
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    photoUploadError.value = 'Only JPG and PNG files are allowed.'
    return
  }

  photoUploadError.value = ''
  uploadingPhoto.value = true

  // Show local preview immediately
  if (photoPreview.value) URL.revokeObjectURL(photoPreview.value)
  photoPreview.value = URL.createObjectURL(file)

  try {
    await store.uploadPhoto(file)
    // Sync sidebar avatar with updated profile photo
    try {
      await authStore.refreshUser()
    } catch {
      // Silently ignore — photo was uploaded successfully
    }
    successMessage.value = 'Profile photo updated!'
    setTimeout(() => { successMessage.value = '' }, 4000)
    toast.success('Your profile photo has been updated.', 'Photo Updated')
    photoPreview.value = null
  } catch (err: unknown) {
    const parsed = parseApiError(err)
    photoUploadError.value = parsed.message
    // Revert preview on failure
    if (photoPreview.value) {
      URL.revokeObjectURL(photoPreview.value)
      photoPreview.value = null
    }
  } finally {
    uploadingPhoto.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

// Cleanup object URLs on unmount
onUnmounted(() => {
  if (photoPreview.value) {
    URL.revokeObjectURL(photoPreview.value)
    photoPreview.value = null
  }
})

// ── Password Change ──
const editingPassword = ref(false)
const passwordForm = reactive({
  current_password: '',
  password: '',
  password_confirmation: '',
})
const passwordErrors = reactive<Record<string, string>>({})

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
  clearPasswordErrors()
  resetPasswordForm()
}

function clearPasswordErrors(): void {
  for (const key of Object.keys(passwordErrors)) {
    delete passwordErrors[key]
  }
}

function resetPasswordForm(): void {
  passwordForm.current_password = ''
  passwordForm.password = ''
  passwordForm.password_confirmation = ''
}

function validatePasswordForm(): boolean {
  let valid = true
  clearPasswordErrors()

  if (!passwordForm.current_password) {
    passwordErrors.current_password = 'Current password is required.'
    valid = false
  }

  if (!passwordForm.password) {
    passwordErrors.password = 'New password is required.'
    valid = false
  } else if (passwordForm.password.length < 8) {
    passwordErrors.password = 'Password must be at least 8 characters.'
    valid = false
  }

  if (!passwordForm.password_confirmation) {
    passwordErrors.password_confirmation = 'Please confirm your new password.'
    valid = false
  } else if (passwordForm.password !== passwordForm.password_confirmation) {
    passwordErrors.password_confirmation = 'Passwords do not match.'
    valid = false
  }

  return valid
}

async function savePassword(): Promise<void> {
  if (!validatePasswordForm()) return

  try {
    await store.changePassword({
      current_password: passwordForm.current_password,
      password: passwordForm.password,
      password_confirmation: passwordForm.password_confirmation,
    })

    successMessage.value = 'Password changed successfully!'
    setTimeout(() => { successMessage.value = '' }, 4000)
    toast.success('Your password has been updated.', 'Password Changed')
    editingPassword.value = false
    resetPasswordForm()
  } catch (err: unknown) {
    const axiosErr = err as {
      response?: { status?: number; data?: { errors?: Record<string, string[]>; message?: string } }
    }
    if (axiosErr.response?.status === 422 && axiosErr.response.data?.errors) {
      const mapped = mapValidationErrors(axiosErr.response.data.errors)
      for (const [key, msg] of Object.entries(mapped)) {
        (passwordErrors as Record<string, string>)[key] = msg
      }
    } else {
      const parsed = parseApiError(err)
      passwordErrors._form = parsed.message
    }
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
