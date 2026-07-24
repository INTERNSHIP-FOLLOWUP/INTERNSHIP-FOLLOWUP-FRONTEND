<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <!-- Page header -->
    <div class="flex items-start gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Profile</h1>
        <p class="mt-1 text-sm text-slate-500">Manage your account settings and password.</p>
      </div>
    </div>

    <!-- Profile Summary Card -->
    <div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-6 sm:flex-row sm:items-center">
        <!-- Avatar -->
        <div class="relative shrink-0">
          <div
            class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-3xl font-bold text-purple-600 shadow-inner ring-1 ring-purple-200/60"
          >
            <img v-if="avatarSrc" :src="avatarSrc" alt="" class="h-full w-full object-cover" />
            <span v-else>{{ initials }}</span>
          </div>
          <label
            class="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-primary-500 text-white shadow-md transition-colors hover:bg-primary-600"
            title="Change photo"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input ref="fileInput" type="file" accept="image/jpeg,image/png" class="hidden" @change="onFileChange" />
          </label>
        </div>

        <!-- Name / email / role -->
        <div class="min-w-0 flex-1">
          <h2 class="text-xl font-bold text-slate-900">{{ user?.name }}</h2>
          <p class="mt-0.5 text-sm text-slate-500">{{ user?.email }}</p>
          <span class="mt-2 inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold capitalize text-purple-700 ring-1 ring-purple-200/60">
            <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            {{ user?.role }}
          </span>
        </div>

        <!-- Stats -->
        <div class="flex shrink-0 gap-6 border-slate-200 sm:border-l sm:pl-6">
          <div class="flex flex-col items-start">
            <div class="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Member Since
            </div>
            <span class="mt-1 text-sm font-semibold text-slate-800">{{ memberSince }}</span>
          </div>
          <div class="flex flex-col items-start">
            <div class="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <svg class="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-1.998A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V7a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              Account Status
            </div>
            <span class="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile -->
    <div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div class="mb-5 flex items-center gap-2.5">
        <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </span>
        <h2 class="text-base font-bold text-slate-900">Edit Profile</h2>
      </div>

      <form @submit.prevent="handleUpdateProfile" class="space-y-5">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="First Name" :error="profileErrors.first_name">
            <input v-model="profileForm.first_name" type="text"
              class="block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
              :class="profileErrors.first_name ? 'border-error' : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'" />
          </FormField>
          <FormField label="Last Name" :error="profileErrors.last_name">
            <input v-model="profileForm.last_name" type="text"
              class="block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
              :class="profileErrors.last_name ? 'border-error' : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'" />
          </FormField>
        </div>
        <FormField label="Email" :error="profileErrors.email">
          <input v-model="profileForm.email" type="email"
            class="block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
            :class="profileErrors.email ? 'border-error' : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'" />
        </FormField>

        <div v-if="profileMessage" class="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{{ profileMessage }}</div>
        <div v-if="profileFormError" class="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{{ profileFormError }}</div>

        <div class="flex justify-end">
          <button type="submit" :disabled="profileSubmitting"
            class="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60">
            <svg v-if="profileSubmitting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Save Changes
          </button>
        </div>
      </form>
    </div>

    <!-- Change Password -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-3">
        <div class="mb-5 flex items-center gap-2.5">
          <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </span>
          <h2 class="text-base font-bold text-slate-900">Change Password</h2>
        </div>

        <form @submit.prevent="handleChangePassword" class="space-y-5">
          <FormField label="Current Password" :error="passwordErrors.current_password">
            <div class="relative">
              <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input v-model="passwordForm.current_password" :type="show.current ? 'text' : 'password'"
                class="block w-full rounded-xl border bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                :class="passwordErrors.current_password ? 'border-error' : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'" />
              <button type="button" @click="show.current = !show.current"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600">
                <svg v-if="show.current" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </FormField>

          <FormField label="New Password" :error="passwordErrors.password">
            <div class="relative">
              <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input v-model="passwordForm.password" :type="show.new ? 'text' : 'password'"
                class="block w-full rounded-xl border bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                :class="passwordErrors.password ? 'border-error' : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'" />
              <button type="button" @click="show.new = !show.new"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600">
                <svg v-if="show.new" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </FormField>

          <FormField label="Confirm New Password" :error="passwordErrors.password_confirmation">
            <div class="relative">
              <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input v-model="passwordForm.password_confirmation" :type="show.confirm ? 'text' : 'password'"
                class="block w-full rounded-xl border bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                :class="passwordErrors.password_confirmation ? 'border-error' : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'" />
              <button type="button" @click="show.confirm = !show.confirm"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600">
                <svg v-if="show.confirm" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </FormField>

          <div v-if="passwordMessage" class="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{{ passwordMessage }}</div>
          <div v-if="passwordFormError" class="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{{ passwordFormError }}</div>

          <div class="flex justify-end">
            <button type="submit" :disabled="passwordSubmitting"
              class="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60">
              <svg v-if="passwordSubmitting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Update Password
            </button>
          </div>
        </form>
      </div>

      <!-- Decorative shield illustration -->
      <div class="hidden items-center justify-center rounded-2xl border border-indigo-100/60 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 lg:col-span-2 lg:flex">
        <svg viewBox="0 0 200 200" class="h-full max-h-56 w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- leaves -->
          <path d="M30 60c10-18 30-22 46-12-8 20-26 28-44 24-2-4-2-9-2-12z" fill="#a5b4fc" opacity="0.5" />
          <path d="M170 140c-10 18-30 22-46 12 8-20 26-28 44-24 2 4 2 9 2 12z" fill="#c4b5fd" opacity="0.5" />
          <!-- stars -->
          <path d="M40 30l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#fbbf24" />
          <path d="M160 40l2.5 5.5L168 47l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" fill="#34d399" />
          <path d="M150 165l2 4.5L157 171l-3.5 3.5 1 4.5-4.5-2.5L145 179l1-4.5L142.5 171l4.5-.5z" fill="#60a5fa" />
          <!-- shield -->
          <path d="M100 28l46 18v44c0 34-22 54-46 62-24-8-46-28-46-62V46l46-18z" fill="#3b82f6" />
          <path d="M100 28l46 18v44c0 34-22 54-46 62V28z" fill="#2563eb" />
          <!-- padlock -->
          <rect x="84" y="92" width="32" height="26" rx="5" fill="#ffffff" />
          <path d="M90 92v-6a10 10 0 0120 0v6" stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round" />
          <circle cx="100" cy="104" r="3.5" fill="#2563eb" />
          <rect x="98.5" y="107" width="3" height="7" rx="1.5" fill="#2563eb" />
        </svg>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/auth'
import FormField from '@/components/ui/FormField.vue'

const authStore = useAuthStore()

const user = computed(() => authStore.user)

const initials = computed(() => {
  const u = user.value
  if (!u) return '?'
  return `${u.first_name?.[0] ?? ''}${u.last_name?.[0] ?? ''}`.toUpperCase() || '?'
})

// Avatar: prefer live preview, then stored avatar_url/avatar
const fileInput = ref<HTMLInputElement | null>(null)
const avatarPreview = ref<string | null>(null)
const avatarSrc = computed(() => {
  if (avatarPreview.value) return avatarPreview.value
  const u = user.value
  const raw = u?.avatar_url ?? u?.avatar
  if (!raw) return ''
  if (/^https?:\/\//.test(raw)) return raw
  const base = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/?api\/?$/, '')
  return `${base}/storage/${raw.replace(/^\//, '')}`
})

// Member since — falls back to mock value from the design when not provided
const memberSince = computed(() => {
  const raw = (user.value as Record<string, unknown> | null)?.['created_at'] as string | undefined
  if (raw) {
    const d = new Date(raw)
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }
  }
  return 'July 2024'
})

// Password visibility toggles
const show = reactive({ current: false, new: false, confirm: false })

const profileForm = reactive({
  first_name: '',
  last_name: '',
  email: '',
})
const profileErrors = reactive<Record<string, string>>({})
const profileMessage = ref('')
const profileFormError = ref('')
const profileSubmitting = ref(false)

const passwordForm = reactive({
  current_password: '',
  password: '',
  password_confirmation: '',
})
const passwordErrors = reactive<Record<string, string>>({})
const passwordMessage = ref('')
const passwordFormError = ref('')
const passwordSubmitting = ref(false)

function populateProfile(): void {
  const u = user.value
  if (!u) return
  profileForm.first_name = u.first_name || ''
  profileForm.last_name = u.last_name || ''
  profileForm.email = u.email || ''
}

function onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value)
  avatarPreview.value = URL.createObjectURL(file)
}

async function handleUpdateProfile(): Promise<void> {
  profileMessage.value = ''
  profileFormError.value = ''
  for (const k of Object.keys(profileErrors)) delete profileErrors[k]

  profileSubmitting.value = true
  try {
    const fd = new FormData()
    fd.append('first_name', profileForm.first_name)
    fd.append('last_name', profileForm.last_name)
    fd.append('email', profileForm.email)
    fd.append('_method', 'PUT')
    const file = fileInput.value?.files?.[0]
    if (file) fd.append('avatar', file)

    const updated = await authService.updateProfile(fd)
    authStore.user = updated
    profileMessage.value = 'Profile updated successfully.'
    setTimeout(() => { profileMessage.value = '' }, 3000)
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } }
    if (axiosErr.response?.data?.errors) {
      for (const [key, msgs] of Object.entries(axiosErr.response.data.errors)) {
        profileErrors[key] = msgs[0] ?? ''
      }
    } else {
      profileFormError.value = (err as Error).message || 'Failed to update profile.'
    }
  } finally {
    profileSubmitting.value = false
  }
}

async function handleChangePassword(): Promise<void> {
  passwordMessage.value = ''
  passwordFormError.value = ''
  for (const k of Object.keys(passwordErrors)) delete passwordErrors[k]

  if (passwordForm.password !== passwordForm.password_confirmation) {
    passwordErrors.password_confirmation = 'Passwords do not match.'
    return
  }

  passwordSubmitting.value = true
  try {
    const res = await authService.changePassword({
      current_password: passwordForm.current_password,
      password: passwordForm.password,
      password_confirmation: passwordForm.password_confirmation,
    })
    passwordMessage.value = res.message || 'Password changed successfully.'
    passwordForm.current_password = ''
    passwordForm.password = ''
    passwordForm.password_confirmation = ''
    setTimeout(() => { passwordMessage.value = '' }, 3000)
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } }
    if (axiosErr.response?.data?.errors) {
      for (const [key, msgs] of Object.entries(axiosErr.response.data.errors)) {
        passwordErrors[key] = msgs[0] ?? ''
      }
    } else {
      passwordFormError.value = (axiosErr.response?.data?.message as string) || 'Failed to change password.'
    }
  } finally {
    passwordSubmitting.value = false
  }
}

onMounted(populateProfile)
</script>
