<template>
  <div class="animate-fade-in">
    <AuthLayout>
      <div class="relative rounded-[20px] p-8 transition-all duration-300">
        <!-- Language Switcher -->
        <div class="absolute right-6 top-6">
          <LanguageSwitcher variant="standalone" />
        </div>

        <div class="text-center mb-6">
          <div
            class="mx-auto w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center shadow-md shadow-primary-500/20 mb-4"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
            </svg>
          </div>
          <h1 class="text-[22px] sm:text-[24px] font-bold text-slate-900 leading-tight" v-html="$t('auth.signIn.title')">
          </h1>
          <p class="mt-1.5 text-[14px] text-slate-500">
            {{ $t('auth.signIn.subtitle') }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" novalidate>
          <!-- Error Banner -->
          <div
            v-if="authStore.error || generalError"
            class="mb-4 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/60 p-4"
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
            <p class="text-sm font-medium text-red-800">{{ authStore.error || generalError }}</p>
          </div>

          <div class="space-y-4">
            <InputField
              v-model="form.email"
              :label="$t('auth.signIn.emailLabel')"
              type="email"
              :placeholder="$t('auth.signIn.emailPlaceholder')"
              required
              :error="errors.email"
              autocomplete="email"
              @blur="validateField('email')"
            >
              <template #icon>
                <svg
                  class="h-5 w-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </template>
            </InputField>

            <PasswordInput
              v-model="form.password"
              :label="$t('auth.signIn.passwordLabel')"
              :placeholder="$t('auth.signIn.passwordPlaceholder')"
              required
              :error="errors.password"
              autocomplete="current-password"
              @blur="validateField('password')"
            />
          </div>

          <div class="flex items-center justify-between mt-4">
            <label class="flex items-center gap-2 cursor-pointer select-none group">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500/30 focus:ring-offset-0 cursor-pointer transition"
              />
              <span
                class="text-sm text-slate-600 group-hover:text-slate-800 transition-colors select-none"
              >
                {{ $t('auth.signIn.rememberMe') }}
              </span>
            </label>

            <router-link
              to="/forgot-password"
              class="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors focus:outline-none focus:underline underline-offset-2"
            >
              {{ $t('auth.signIn.forgotPassword') }}
            </router-link>
          </div>

          <div class="mt-6">
            <PrimaryButton type="submit" :loading="authStore.loading" :disabled="authStore.loading">
              {{ authStore.loading ? $t('auth.signIn.loading') : $t('auth.signIn.loginButton') }}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </AuthLayout>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import InputField from '@/components/ui/InputField.vue'
import PasswordInput from '@/components/ui/PasswordInput.vue'
import PrimaryButton from '@/components/ui/PrimaryButton.vue'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import { useAuthStore } from '@/stores/auth'
import { parseApiError } from '@/utils/errorParser'

const i18n = useI18n()

const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

const generalError = ref('')
const rememberMe = ref(false)

function validateField(field: 'email' | 'password'): boolean {
  let valid = true

  if (field === 'email') {
    if (!form.email.trim()) {
      errors.email = i18n.t('auth.signIn.errors.emailRequired')
      valid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = i18n.t('auth.signIn.errors.emailInvalid')
      valid = false
    } else {
      errors.email = ''
    }
  }

  if (field === 'password') {
    if (!form.password) {
      errors.password = i18n.t('auth.signIn.errors.passwordRequired')
      valid = false
    } else if (form.password.length < 8) {
      errors.password = i18n.t('auth.signIn.errors.passwordMin')
      valid = false
    } else {
      errors.password = ''
    }
  }

  return valid
}

function validateAll(): boolean {
  const emailValid = validateField('email')
  const passwordValid = validateField('password')

  // Focus the first invalid field
  if (!emailValid) {
    nextTick(() => {
      const el = document.getElementById('input-email-address')
      if (el) el.focus()
    })
  } else if (!passwordValid) {
    nextTick(() => {
      const el = document.getElementById('input-password')
      if (el) el.focus()
    })
  }

  return emailValid && passwordValid
}

// Clear any stale error when the component mounts
onMounted(() => {
  authStore.error = null
  generalError.value = ''
})

async function handleSubmit() {
  if (!validateAll()) return

  // Clear previous errors
  authStore.error = null

  try {
    generalError.value = ''
    authStore.error = null
    await authStore.login({
      email: form.email.trim(),
      password: form.password,
    })
  } catch (err: unknown) {
    const parsed = parseApiError(err)

    // Show general error when no field-level errors
    if (parsed.fields) {
      if (parsed.fields.email) errors.email = parsed.fields.email
      if (parsed.fields.password) errors.password = parsed.fields.password
    }

    if (!Object.values(errors).some(Boolean)) {
      generalError.value = parsed.message
    }
  }
}
</script>
