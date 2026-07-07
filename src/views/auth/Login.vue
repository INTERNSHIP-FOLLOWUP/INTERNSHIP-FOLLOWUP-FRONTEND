<template>
  <div class="animate-fade-in">
    <AuthLayout>
      <div class="rounded-[20px] p-8 transition-all duration-300">
        
        <div class="text-center mb-6">
          <div class="mx-auto w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center shadow-md shadow-primary-500/20 mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
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
              placeholder="student@example.com"
              required
              :error="errors.email"
              :icon="emailIcon"
              autocomplete="email"
              @blur="validateField('email')"
            />

            <div class="w-full text-left">
              <label class="block text-sm font-medium text-slate-700 mb-1.5">
                Password <span class="text-error font-bold ml-0.5">*</span>
              </label>

              <div class="relative rounded-xl shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>

                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="form.password"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  @blur="validateField('password')"
                  class="block w-full rounded-xl border border-slate-300 pl-11 pr-11 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors disabled:opacity-50"
                  :class="{ 'border-error focus:border-error focus:ring-error/20': errors.password }"
                />

                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                >
                  <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                  <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>

              <p v-if="errors.password" class="mt-1.5 text-xs text-error animate-fade-in">
                {{ errors.password }}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between mt-4">
            <label class="flex items-center gap-2 cursor-pointer select-none group">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500/30 focus:ring-offset-0 cursor-pointer transition"
              />
              <span class="text-sm text-slate-600 group-hover:text-slate-800 transition-colors select-none">
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
            <button 
              type="submit" 
              :disabled="loading"
              class="relative w-full flex justify-center items-center px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-85 disabled:cursor-not-allowed rounded-xl shadow-md transition-all duration-200 min-h-[44px]"
            >
              <div v-if="loading" class="flex items-center gap-2.5">
                <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing In...</span>
              </div>

              <span v-else>
                Sign In
              </span>
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, h } from 'vue'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import InputField from '@/components/ui/InputField.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

const loading = ref(false)
const rememberMe = ref(false)
const showPassword = ref(false)

const emailIcon = {
  render() {
    return h('svg', {
      class: 'h-5 w-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      }),
    ])
  },
}

function validateField(field: 'email' | 'password'): boolean {
  let valid = true

  if (field === 'email') {
    if (!form.email.trim()) {
      errors.email = 'Email is required.'
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
      errors.password = 'Password is required.'
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
  return emailValid && passwordValid
}

async function handleSubmit() {
  if (!validateAll()) return

  loading.value = true

  try {
    await authStore.login({
      email: form.email.trim(),
      password: form.password,
    })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'response' in err) {
      const axiosErr = err as {
        response?: {
          data?: {
            message?: string
            errors?: Record<string, string[]>
          }
        }
      }

      if (axiosErr.response?.data?.errors) {
        const serverErrors = axiosErr.response.data.errors
        const emailErr = serverErrors['email']
        const passwordErr = serverErrors['password']
        if (emailErr && emailErr[0]) errors.email = emailErr[0]
        if (passwordErr && passwordErr[0]) errors.password = passwordErr[0]
      } else if (axiosErr.response?.data?.message) {
        errors.password = axiosErr.response.data.message
      } else {
        errors.password = 'Network error. Please try again.'
      }
    } else {
      errors.password = 'An unexpected error occurred. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>