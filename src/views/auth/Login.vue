<template>
  <div class="animate-fade-in">
    <AuthLayout>
      <div class="rounded-[20px] p-8 transition-all duration-300">
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
          <h1 class="text-[22px] sm:text-[24px] font-bold text-slate-900 leading-tight">
            Student Internship<br />Follow-up System
          </h1>
          <p class="mt-1.5 text-[14px] text-slate-500">
            Sign in to access your internship management dashboard.
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
              label="Password"
              placeholder="Enter your password"
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
                Remember me
              </span>
            </label>

            <router-link
              to="/forgot-password"
              class="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors focus:outline-none focus:underline underline-offset-2"
            >
              Forgot Password?
            </router-link>
          </div>

          <div class="mt-6">
            <PrimaryButton type="submit" :loading="authStore.loading" :disabled="authStore.loading">
              {{ authStore.loading ? 'Loading...' : 'Log In' }}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </AuthLayout>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick } from 'vue'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import InputField from '@/components/ui/InputField.vue'
import PasswordInput from '@/components/ui/PasswordInput.vue'
import PrimaryButton from '@/components/ui/PrimaryButton.vue'
import { useAuthStore } from '@/stores/auth'
import { parseApiError } from '@/utils/errorParser'

const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

const rememberMe = ref(false)

function validateField(field: 'email' | 'password'): boolean {
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

  if (field === 'password') {
    if (!form.password) {
      errors.password = 'Please enter your password.'
      valid = false
    } else if (form.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.'
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

async function handleSubmit() {
  if (!validateAll()) return

  // Clear previous errors
  authStore.error = null

  try {
    await authStore.login({
      email: form.email.trim(),
      password: form.password,
    })
  } catch (err: unknown) {
    const parsed = parseApiError(err)

    // Map field-level friendly messages
    if (parsed.fields) {
      if (parsed.fields.email) errors.email = parsed.fields.email
      if (parsed.fields.password) errors.password = parsed.fields.password
    }
  }
}
</script>
