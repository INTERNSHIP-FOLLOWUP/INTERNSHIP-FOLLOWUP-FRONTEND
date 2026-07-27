<template>
  <!-- ─── FORCED: Inactive student must change password to access dashboard ─── -->
  <div v-if="auth.user?.status === 'inactive'" class="flex items-center justify-center min-h-[70vh]">
    <div class="w-full max-w-lg animate-fade-in">
      <div class="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
        <!-- Top accent -->
        <div class="h-2 bg-gradient-to-r from-amber-400 to-orange-500"></div>

        <div class="p-8 text-center">
          <!-- Lock icon -->
          <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 ring-8 ring-amber-50/50">
            <svg class="h-8 w-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>

          <h1 class="text-xl font-bold text-slate-900">Account Activation Required</h1>
          <p class="mt-2 text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
            Your account is currently inactive. You must set a new password to activate your account and access the student dashboard.
          </p>
        </div>

        <!-- Password Form -->
        <div class="px-8 pb-8">
          <form @submit.prevent="handlePasswordSubmit" class="space-y-5">
            <PasswordInput
              v-model="passwordForm.current_password"
              label="Current Password"
              placeholder="Enter current password"
              required
              :error="passwordErrors.current_password ?? ''"
              autocomplete="current-password"
            />

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

            <!-- Password hint -->
            <div class="rounded-lg bg-amber-50/60 border border-amber-100 px-4 py-3">
              <div class="flex items-start gap-2">
                <svg class="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-xs text-amber-800">Password must be at least 8 characters and should include a mix of letters, numbers, and symbols for better security.</p>
              </div>
            </div>

            <!-- Error Alert -->
            <ErrorAlert :message="passwordErrors._form" />

            <button
              type="submit"
              :disabled="passwordSubmitting || !isPasswordFormValid"
              class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:from-emerald-700 hover:to-emerald-600 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LoadingSpinner v-if="passwordSubmitting" size="sm" color="white" />
              {{ passwordSubmitting ? 'Activating...' : 'Activate Account' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- ─── NORMAL: Active student dashboard ─── -->
  <template v-else>
    <!-- Page Header -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Welcome back, {{ firstName }}!</h1>
        <p class="mt-1 text-sm text-gray-500">
          Here's an overview of your internship progress and activities.
        </p>
      </div>
      <button
        @click="openPasswordModal"
        class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-[0.97] self-start sm:self-auto"
      >
        <svg class="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
        Change Password
      </button>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ stat.label }}</p>
            <p class="mt-1 text-2xl font-bold text-gray-900">{{ stat.value }}</p>
          </div>
          <div class="flex h-10 w-10 items-center justify-center rounded-lg" :class="stat.color">
            <component :is="stat.icon" class="h-5 w-5 text-white" />
          </div>
        </div>
        <p
          class="mt-2 text-xs"
          :class="stat.trend.startsWith('+') ? 'text-green-600' : 'text-gray-400'"
        >
          {{ stat.trend }}
        </p>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 class="text-base font-semibold text-gray-900">Recent Worklogs</h2>
        <p class="mt-2 text-sm text-gray-500">
          You haven't submitted any worklogs yet. Start logging your weekly progress.
        </p>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 class="text-base font-semibold text-gray-900">Tutor Feedback</h2>
        <p class="mt-2 text-sm text-gray-500">
          No feedback received yet. Submit worklogs to get feedback from your tutor.
        </p>
      </div>
    </div>

    <!-- Change Password Modal (for active students) -->
    <transition name="fade">
      <div
        v-if="showPasswordModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-modal-title"
        @click="closePasswordModal"
      >
        <div
          class="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl animate-scale-in"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 id="password-modal-title" class="text-base font-bold text-slate-900">
                Change Password
              </h2>
              <p class="mt-0.5 text-xs text-slate-500">
                Update your account password
              </p>
            </div>
            <button
              @click="closePasswordModal"
              :disabled="passwordSubmitting"
              class="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
              aria-label="Close modal"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <form @submit.prevent="handlePasswordSubmit" class="px-6 py-5 space-y-5">
            <PasswordInput
              v-model="passwordForm.current_password"
              label="Current Password"
              placeholder="Enter current password"
              required
              :error="passwordErrors.current_password ?? ''"
              autocomplete="current-password"
            />

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

            <!-- Password hint -->
            <div class="rounded-lg bg-amber-50/60 border border-amber-100 px-4 py-3">
              <div class="flex items-start gap-2">
                <svg class="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-xs text-amber-800">Password must be at least 8 characters and should include a mix of letters, numbers, and symbols for better security.</p>
              </div>
            </div>

            <ErrorAlert :message="passwordErrors._form" />

            <div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                :disabled="passwordSubmitting"
                class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                @click="closePasswordModal"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="passwordSubmitting || !isPasswordFormValid"
                class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:from-emerald-700 hover:to-emerald-600 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LoadingSpinner v-if="passwordSubmitting" size="sm" color="white" />
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </template>
</template>

<script setup lang="ts">
import { ref, reactive, computed, h, defineComponent } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/auth'
import { useToastStore } from '@/stores/toast'
import PasswordInput from '@/components/ui/PasswordInput.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorAlert from '@/components/common/ErrorAlert.vue'
import { parseApiError } from '@/utils/errorParser'
import { mapValidationErrors } from '@/utils/mapValidationErrors'

const auth = useAuthStore()
const toast = useToastStore()

const firstName = computed(() => {
  const name = auth.user?.name
  if (!name) return 'Student'
  return name.split(' ')[0] || 'Student'
})

function createIcon(path: string) {
  return defineComponent({
    setup() {
      return () =>
        h(
          'svg',
          {
            class: 'h-5 w-5',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24',
          },
          [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              'stroke-width': 2,
              d: path,
            }),
          ],
        )
    },
  })
}

const stats = [
  {
    label: 'My Company',
    value: 'Not assigned',
    trend: 'Waiting for assignment',
    color: 'bg-emerald-500',
    icon: createIcon(
      'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    ),
  },
  {
    label: 'Worklogs Submitted',
    value: 0,
    trend: 'No data yet',
    color: 'bg-blue-500',
    icon: createIcon(
      'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    ),
  },
  {
    label: 'Pending Reviews',
    value: 0,
    trend: 'No data yet',
    color: 'bg-amber-500',
    icon: createIcon('M15 12a3 3 0 11-6 0 3 3 0 016 0z'),
  },
  {
    label: 'Open Issues',
    value: 0,
    trend: 'No data yet',
    color: 'bg-rose-500',
    icon: createIcon(
      'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
    ),
  },
]

// ── Password Change Modal ──
const showPasswordModal = ref(false)
const passwordSubmitting = ref(false)

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

function openPasswordModal(): void {
  resetPasswordForm()
  showPasswordModal.value = true
}

function closePasswordModal(): void {
  if (passwordSubmitting.value) return
  showPasswordModal.value = false
  resetPasswordForm()
}

function resetPasswordForm(): void {
  passwordForm.current_password = ''
  passwordForm.password = ''
  passwordForm.password_confirmation = ''
  clearPasswordErrors()
}

function clearPasswordErrors(): void {
  for (const key of Object.keys(passwordErrors)) {
    delete passwordErrors[key]
  }
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
async function handlePasswordSubmit(): Promise<void> {
  if (!validatePasswordForm()) return

  passwordSubmitting.value = true

  try {
    await authService.changePassword({
      current_password: passwordForm.current_password,
      password: passwordForm.password,
      password_confirmation: passwordForm.password_confirmation,
    })

    toast.success('Your password has been updated successfully.', 'Password Changed')
    await auth.refreshUser()
    closePasswordModal()
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
  } finally {
    passwordSubmitting.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
