<template>
  <div class="mx-auto max-w-2xl space-y-8">
    <div class="flex items-start gap-4">
      <button @click="$router.back()" class="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Profile</h1>
        <p class="mt-1 text-sm text-slate-500">Manage your account settings and password.</p>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div class="flex items-start gap-5">
        <div class="relative shrink-0">
          <div class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-primary-50 text-2xl font-bold text-primary-600">
            <img v-if="avatarPreview" :src="avatarPreview" alt="" class="h-full w-full object-cover" />
            <span v-else>{{ initials }}</span>
          </div>
          <label class="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-primary-500 text-white shadow-sm hover:bg-primary-600">
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input ref="fileInput" type="file" accept="image/jpeg,image/png" class="hidden" @change="onFileChange" />
          </label>
        </div>
        <div class="flex-1 min-w-0 pt-1">
          <h2 class="text-lg font-bold text-slate-900">{{ user?.name }}</h2>
          <p class="text-sm text-slate-500">{{ user?.email }}</p>
          <span class="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-bold text-primary-700 capitalize">
            {{ user?.role }}
          </span>
        </div>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <h2 class="text-base font-bold text-slate-900 mb-5">Edit Profile</h2>
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
            class="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60">
            <svg v-if="profileSubmitting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Save Changes
          </button>
        </div>
      </form>
    </div>

    <div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <h2 class="text-base font-bold text-slate-900 mb-5">Change Password</h2>
      <form @submit.prevent="handleChangePassword" class="space-y-5">
        <FormField label="Current Password" :error="passwordErrors.current_password">
          <input v-model="passwordForm.current_password" type="password"
            class="block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
            :class="passwordErrors.current_password ? 'border-error' : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'" />
        </FormField>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="New Password" :error="passwordErrors.password">
            <input v-model="passwordForm.password" type="password"
              class="block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
              :class="passwordErrors.password ? 'border-error' : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'" />
          </FormField>
          <FormField label="Confirm New Password" :error="passwordErrors.password_confirmation">
            <input v-model="passwordForm.password_confirmation" type="password"
              class="block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
              :class="passwordErrors.password_confirmation ? 'border-error' : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'" />
          </FormField>
        </div>
        <div v-if="passwordMessage" class="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{{ passwordMessage }}</div>
        <div v-if="passwordFormError" class="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{{ passwordFormError }}</div>
        <div class="flex justify-end">
          <button type="submit" :disabled="passwordSubmitting"
            class="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60">
            <svg v-if="passwordSubmitting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Update Password
          </button>
        </div>
      </form>
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

const fileInput = ref<HTMLInputElement | null>(null)
const avatarPreview = ref<string | null>(null)

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
