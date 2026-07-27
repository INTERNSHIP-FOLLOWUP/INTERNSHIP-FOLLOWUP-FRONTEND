<template>
  <div class="animate-fade-in">
    <AuthLayout>
      <div class="px-2 sm:px-4 py-2">
        <div class="text-center mb-8">
          <img
            src="@/assets/images/logo.png"
            alt="PN Logo"
            class="mx-auto w-20 h-20 object-contain mb-5"
          />
          <h1 class="text-2xl sm:text-[26px] font-bold dark:text-slate-100 text-slate-900 leading-snug tracking-tight">
            Forgot Password
          </h1>
          <p class="mt-2 text-sm dark:text-slate-500 text-slate-400 font-normal">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form @submit.prevent="handleSubmit" novalidate>
          <div class="space-y-4">
            <InputField
              v-model="form.email"
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              required
              :error="errors.email"
              autocomplete="email"
              @blur="validateField('email')"
            >
              <template #icon>
                <svg
                  class="h-5 w-5 dark:text-slate-500 text-slate-400"
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
          </div>

          <div
            v-if="successMessage"
            class="mt-4 p-3 rounded-xl bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-900/50"
          >
            <p class="text-sm text-green-700 flex items-center gap-2 dark:text-green-400">
              <svg
                class="h-5 w-5 shrink-0 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {{ successMessage }}
            </p>
          </div>

          <div
            v-if="errorMessage && !successMessage"
            class="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-900/50"
          >
            <p class="text-sm text-error flex items-center gap-2">
              <svg
                class="h-5 w-5 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ errorMessage }}
            </p>
          </div>

          <div class="mt-6">
            <PrimaryButton type="submit" :loading="loading" :disabled="loading || sent">
              {{ sent ? 'Email Sent' : 'Send Reset Link' }}
            </PrimaryButton>
          </div>
        </form>

        <div class="mt-6 text-center">
          <router-link
            to="/login"
            class="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors focus:outline-none focus:underline underline-offset-2"
          >
            <span class="inline-flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Sign In
            </span>
          </router-link>
        </div>
      </div>
    </AuthLayout>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import InputField from '@/components/ui/InputField.vue'
import PrimaryButton from '@/components/ui/PrimaryButton.vue'
import { authService } from '@/services/auth'
import { parseApiError } from '@/utils/errorParser'

const form = reactive({
  email: '',
})

const errors = reactive({
  email: '',
})

const loading = ref(false)
const sent = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

function validateField(field: 'email'): boolean {
  let valid = true

  if (field === 'email') {
    if (!form.email.trim()) {
      errors.email = 'Please enter your email address.'
      valid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address.'
      valid = false
    } else {
      errors.email = ''
    }
  }

  return valid
}

function validateAll(): boolean {
  return validateField('email')
}

async function handleSubmit() {
  if (!validateAll()) return

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await authService.forgotPassword(form.email.trim())
    sent.value = true
    successMessage.value =
      response.message ||
      'If that email is registered, you will receive a password reset link shortly.'
  } catch (err: unknown) {
    const parsed = parseApiError(err)
    if (parsed.fields?.email) {
      errors.email = parsed.fields.email
    } else {
      errorMessage.value = parsed.message
    }
  } finally {
    loading.value = false
  }
}
</script>
