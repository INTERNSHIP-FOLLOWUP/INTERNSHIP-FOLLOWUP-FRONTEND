<template>
  <div>
    <AuthLayout>
      <div class="px-2 sm:px-4 py-2">
        <div class="text-center mb-8">
          <img
            src="@/assets/images/logo.png"
            alt="PN Logo"
            class="mx-auto w-20 h-20 object-contain mb-5 animate-pop-in transition-transform duration-300 hover:scale-105 cursor-pointer"
          />
          <h1 class="text-2xl sm:text-[26px] font-bold dark:text-slate-100 text-slate-900 leading-snug tracking-tight animate-slide-up" v-html="$t('auth.signIn.title')">
          </h1>
          <p class="mt-2 text-sm dark:text-slate-500 text-slate-400 font-normal animate-slide-up anim-delay-100 anim-fill-both">
            {{ $t('auth.signIn.subtitle') }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" novalidate class="space-y-5">
          <!-- Error Banner -->
          <div
            v-if="authStore.error || generalError"
            class="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 animate-pop-in dark:border-red-900/50 dark:bg-red-950/30"
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
            <p class="text-sm font-medium text-red-800 dark:text-red-400">{{ authStore.error || generalError }}</p>
          </div>

          <div class="space-y-4 animate-slide-up anim-delay-150 anim-fill-both">
            <InputField
              v-model="form.email"
              :label="$t('auth.signIn.emailLabel')"
              type="email"
              :placeholder="$t('auth.signIn.emailPlaceholder')"
              required
              :error="errors.email"
              autocomplete="email"
              @blur="validateField('email')"
            />

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

          <div class="flex items-center justify-between animate-slide-up anim-delay-200 anim-fill-both">
            <label class="flex items-center gap-2 cursor-pointer select-none group">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 rounded dark:border-slate-600 border-slate-300 text-[#21BAEA] focus:ring-[#21BAEA]/30 focus:ring-offset-0 cursor-pointer transition transform group-hover:scale-110"
              />
              <span class="text-sm dark:dark:text-slate-500 text-slate-400 text-slate-500 group-hover:dark:text-slate-200 text-slate-700 transition-colors">
                {{ $t('auth.signIn.rememberMe') }}
              </span>
            </label>

            <router-link
              to="/forgot-password"
              class="text-sm font-semibold text-[#21BAEA] hover:text-[#FF9933] transition-all hover:underline underline-offset-2"
            >
              {{ $t('auth.signIn.forgotPassword') }}
            </router-link>
          </div>

          <div class="pt-1 animate-slide-up anim-delay-300 anim-fill-both">
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
import AuthLayout from '@/components/auth/AuthLayout.vue'
import InputField from '@/components/ui/InputField.vue'
import PasswordInput from '@/components/ui/PasswordInput.vue'
import PrimaryButton from '@/components/ui/PrimaryButton.vue'
import { useAuthStore } from '@/stores/auth'
import { parseApiError } from '@/utils/errorParser'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
      errors.email = t('auth.signIn.errors.emailRequired')
      valid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = t('auth.signIn.errors.emailInvalid')
      valid = false
    } else {
      errors.email = ''
    }
  }

  if (field === 'password') {
    if (!form.password) {
      errors.password = t('auth.signIn.errors.passwordRequired')
      valid = false
    } else if (form.password.length < 8) {
      errors.password = t('auth.signIn.errors.passwordMin')
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
