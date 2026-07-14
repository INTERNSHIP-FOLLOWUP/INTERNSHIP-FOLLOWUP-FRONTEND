<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()

const email = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

function submit() {
  loading.value = true
  error.value = ''
  message.value = ''

  api
    .post('/auth/forgot-password', { email: email.value })
    .then((res) => {
      message.value = res.data.message || 'Reset link sent.'
      if (res.data.reset_url) {
        message.value += ' (dev: reset link returned in response)'
      }
    })
    .catch(() => {
      error.value = 'This email is not registered or the request failed.'
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full">
      <h1 class="text-2xl font-bold text-gray-800 mb-2 text-center">Forgot password</h1>
      <p class="text-sm text-gray-500 mb-6 text-center">
        Enter your email and we’ll send you a reset link.
      </p>

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-md bg-amber-500 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
        >
          {{ loading ? 'Sending...' : 'Send reset link' }}
        </button>
      </form>

      <p v-if="message" class="mt-4 text-sm text-green-600 text-center">{{ message }}</p>
      <p v-if="error" class="mt-4 text-sm text-red-600 text-center">{{ error }}</p>

      <p class="mt-6 text-center text-sm text-gray-600">
        <button @click="router.push('/login')" class="hover:text-amber-600">Back to login</button>
      </p>
    </div>
  </div>
</template>
