<template>
  <transition name="fade">
    <div
      v-if="showModal"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="force-password-title"
    >
      <div
        class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
      >
        <div class="flex items-start gap-4">
          <div
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 21v-2a7 7 0 0114 0v2M12 14v3m0 3h.01"
              />
            </svg>
          </div>
          <div>
            <h3
              id="force-password-title"
              class="text-lg font-bold text-slate-900 dark:text-slate-100"
            >
              Change your temporary password
            </h3>
            <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {{ roleMessage }}
            </p>
          </div>
        </div>

        <div v-if="!showForm" class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            class="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            @click="openForm"
          >
            Change Password
          </button>
        </div>

        <form v-else class="mt-6 space-y-4" @submit.prevent="submitPasswordChange">
          <!-- Current Password -->
          <label class="block">
            <span class="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >Current Password</span
            >
            <div class="relative mt-1.5">
              <input
                v-model="form.current_password"
                :type="showFields.current ? 'text' : 'password'"
                autocomplete="current-password"
                class="block w-full rounded-xl border px-4 py-2.5 pr-11 text-sm text-slate-900 outline-none transition-all dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
                :class="
                  errors.current_password
                    ? 'border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-500'
                    : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:border-primary-400'
                "
                placeholder="Enter current password"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition-colors hover:text-slate-600 focus:text-primary-600 focus:outline-none dark:text-slate-500 dark:hover:text-slate-300"
                :aria-label="showFields.current ? 'Hide current password' : 'Show current password'"
                @click="showFields.current = !showFields.current"
              >
                <svg
                  v-if="!showFields.current"
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <svg
                  v-else
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              </button>
            </div>
            <span
              v-if="errors.current_password"
              class="mt-1 block text-xs font-medium text-red-600 dark:text-red-400"
            >
              {{ errors.current_password }}
            </span>
          </label>

          <!-- New Password -->
          <label class="block">
            <span class="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >New Password</span
            >
            <div class="relative mt-1.5">
              <input
                v-model="form.password"
                :type="showFields.new ? 'text' : 'password'"
                autocomplete="new-password"
                class="block w-full rounded-xl border px-4 py-2.5 pr-11 text-sm text-slate-900 outline-none transition-all dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
                :class="
                  errors.password
                    ? 'border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-500'
                    : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:border-primary-400'
                "
                placeholder="Enter new password"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition-colors hover:text-slate-600 focus:text-primary-600 focus:outline-none dark:text-slate-500 dark:hover:text-slate-300"
                :aria-label="showFields.new ? 'Hide new password' : 'Show new password'"
                @click="showFields.new = !showFields.new"
              >
                <svg
                  v-if="!showFields.new"
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <svg
                  v-else
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              </button>
            </div>
            <span
              v-if="errors.password"
              class="mt-1 block text-xs font-medium text-red-600 dark:text-red-400"
            >
              {{ errors.password }}
            </span>
          </label>

          <!-- Confirm New Password -->
          <label class="block">
            <span class="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >Confirm New Password</span
            >
            <div class="relative mt-1.5">
              <input
                v-model="form.password_confirmation"
                :type="showFields.confirm ? 'text' : 'password'"
                autocomplete="new-password"
                class="block w-full rounded-xl border px-4 py-2.5 pr-11 text-sm text-slate-900 outline-none transition-all dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
                :class="
                  errors.password_confirmation
                    ? 'border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-500'
                    : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:border-primary-400'
                "
                placeholder="Confirm new password"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition-colors hover:text-slate-600 focus:text-primary-600 focus:outline-none dark:text-slate-500 dark:hover:text-slate-300"
                :aria-label="showFields.confirm ? 'Hide confirm password' : 'Show confirm password'"
                @click="showFields.confirm = !showFields.confirm"
              >
                <svg
                  v-if="!showFields.confirm"
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <svg
                  v-else
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              </button>
            </div>
            <span
              v-if="errors.password_confirmation"
              class="mt-1 block text-xs font-medium text-red-600 dark:text-red-400"
            >
              {{ errors.password_confirmation }}
            </span>
          </label>

          <div
            v-if="formError"
            class="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-950/30 dark:text-red-400"
          >
            {{ formError }}
          </div>

          <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="submit"
              :disabled="submitting"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                v-if="submitting"
                class="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
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
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/auth'

const auth = useAuthStore()

const showForm = ref(false)
const submitting = ref(false)
const formError = ref('')
const errors = ref<Record<string, string>>({})
const showFields = ref({
  current: false,
  new: false,
  confirm: false,
})
const form = ref({
  current_password: '',
  password: '',
  password_confirmation: '',
})

// Show modal when user is logged in, not admin, and must_change_password is true
const showModal = computed(() => {
  const u = auth.user
  return (
    !!u &&
    u.role !== 'admin' &&
    u.must_change_password === true
  )
})

const roleName = computed(() => {
  const role = auth.user?.role ?? ''
  const names: Record<string, string> = {
    tutor: 'tutor',
    student: 'student',
    supervisor: 'company representative',
    company: 'company representative',
    'company representative': 'company representative',
  }
  return names[role] || role
})

const roleMessage = computed(() => {
  return `For account security, ${roleName.value} must set a new password before continuing.`
})

function resetFields() {
  showForm.value = false
  formError.value = ''
  errors.value = {}
  form.value = {
    current_password: '',
    password: '',
    password_confirmation: '',
  }
  showFields.value = { current: false, new: false, confirm: false }
}

function openForm() {
  showForm.value = true
  formError.value = ''
  errors.value = {}
}

async function submitPasswordChange() {
  formError.value = ''
  errors.value = {}

  // Client-side validation
  if (!form.value.current_password) {
    errors.value = { current_password: 'Current password is required.' }
    return
  }
  if (!form.value.password || form.value.password.length < 8) {
    errors.value = { password: 'Password must be at least 8 characters long.' }
    return
  }
  if (form.value.password !== form.value.password_confirmation) {
    errors.value = { password_confirmation: 'Passwords do not match.' }
    return
  }

  submitting.value = true
  try {
    await authService.changePassword({
      current_password: form.value.current_password,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
    })

    // Update local auth store - set must_change_password to false
    auth.updateUser({ must_change_password: false })

    // Reset and close modal
    resetFields()
  } catch (err: unknown) {
    const axiosErr = err as {
      response?: {
        data?: { errors?: Record<string, string[]>; message?: string }
      }
    }
    const fields = axiosErr.response?.data?.errors
    if (fields) {
      errors.value = Object.fromEntries(
        Object.entries(fields).map(([key, messages]) => [key, messages[0] ?? '']),
      )
    } else {
      formError.value =
        axiosErr.response?.data?.message || 'Failed to update password. Please try again.'
    }
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
