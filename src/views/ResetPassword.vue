<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()

const token = ref((route.query.token as string) || '')
const email = ref((route.query.email as string) || '')
const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

function submit() {
  loading.value = true
  error.value = ''
  message.value = ''

  api
    .post('/auth/reset-password', {
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
      token: token.value,
    })
    .then((res) => {
      message.value = res.data.message || 'Password reset successfully.'
      setTimeout(() => router.push('/login'), 1500)
    })
    .catch(() => {
      error.value = 'Invalid token or passwords did not match.'
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full">
      <h1 class="text-2xl font-bold text-gray-800 mb-2 text-center">Reset password</h1>
      <p class="text-sm text-gray-500 mb-6 text-center">
        Choose a new password for {{ email }}.
      </p>

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            required
            minlength="6"
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:outline-none"
            placeholder="New password"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Confirm password</label>
          <input
            v-model="passwordConfirmation"
            type="password"
            required
            minlength="6"
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:outline-none"
            placeholder="Repeat new password"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-md bg-amber-500 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
        >
          {{ loading ? 'Resetting...' : 'Reset password' }}
        </button>
      </form>

      <p v-if="message" class="mt-4 text-sm text-green-600 text-center">{{ message }}</p>
      <p v-if="error" class="mt-4 text-sm text-red-600 text-center">{{ error }}</p>
    </div>
  </div>
</template>
