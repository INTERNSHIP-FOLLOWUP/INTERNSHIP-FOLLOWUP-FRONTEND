<template>
  <div class="rounded-2xl border border-slate-100 bg-white shadow-sm">
    <div class="border-b border-slate-100 px-6 py-4">
      <h2 class="text-lg font-semibold text-slate-900">Change Password</h2>
      <p class="text-xs text-slate-500">Update your password to keep your account secure.</p>
    </div>
    <form @submit.prevent="onSubmit" class="space-y-5 px-6 py-5">
      <ErrorAlert :message="store.error" />

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Current Password</label>
          <div class="relative">
            <input
              v-model="form.current_password"
              :type="showCurrent ? 'text' : 'password'"
              class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20"
              :class="{ 'border-red-400': errors.current_password }"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              @click="showCurrent = !showCurrent"
            >
              <svg v-if="!showCurrent" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l-3.293-3.293m0 0a3 3 0 104.243-4.243l3.293 3.293m-3.293-3.293l3.293 3.293M3 3l18 18" />
              </svg>
            </button>
          </div>
          <p v-if="errors.current_password" class="text-red-600 text-xs mt-1">{{ errors.current_password }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">New Password</label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showNew ? 'text' : 'password'"
              class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20"
              :class="{ 'border-red-400': errors.password }"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              @click="showNew = !showNew"
            >
              <svg v-if="!showNew" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l-3.293-3.293m0 0a3 3 0 104.243-4.243l3.293 3.293m-3.293-3.293l3.293 3.293M3 3l18 18" />
              </svg>
            </button>
          </div>
          <p v-if="errors.password" class="text-red-600 text-xs mt-1">{{ errors.password }}</p>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Confirm New Password</label>
          <div class="relative">
            <input
              v-model="form.password_confirmation"
              :type="showConfirm ? 'text' : 'password'"
              class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20"
              :class="{ 'border-red-400': errors.password_confirmation }"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              @click="showConfirm = !showConfirm"
            >
              <svg v-if="!showConfirm" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l-3.293-3.293m0 0a3 3 0 104.243-4.243l3.293 3.293m-3.293-3.293l3.293 3.293M3 3l18 18" />
              </svg>
            </button>
          </div>
          <p v-if="errors.password_confirmation" class="text-red-600 text-xs mt-1">{{ errors.password_confirmation }}</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="submit"
          :disabled="store.loading"
          class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-600 active:scale-95 disabled:opacity-50"
        >
          <svg v-if="store.loading" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ store.loading ? 'Updating...' : 'Change Password' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useProfileStore } from '@/stores/profile'
import ErrorAlert from '@/components/common/ErrorAlert.vue'

const store = useProfileStore()

const form = reactive({
  current_password: '',
  password: '',
  password_confirmation: '',
})

const errors = reactive({
  current_password: '',
  password: '',
  password_confirmation: '',
})

const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

function validate() {
  errors.current_password = ''
  errors.password = ''
  errors.password_confirmation = ''
  let ok = true

  if (!form.current_password) {
    errors.current_password = 'Current password is required.'
    ok = false
  }
  if (!form.password) {
    errors.password = 'New password is required.'
    ok = false
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
    ok = false
  }
  if (form.password !== form.password_confirmation) {
    errors.password_confirmation = 'Passwords do not match.'
    ok = false
  }

  return ok
}

async function onSubmit() {
  if (!validate()) return
  await store.changePassword({ ...form })
}
</script>