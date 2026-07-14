<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

function submit() {
  loading.value = true
  error.value = ''
  api
    .post('/auth/login', { email: email.value, password: password.value })
    .then(() => router.push('/'))
    .catch(() => {
      error.value = 'Invalid credentials.'
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full">
      <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h1>
      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-md bg-amber-500 py-2 text-white hover:bg-amber-600 disabled:opacity-50"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      <p v-if="error" class="mt-4 text-sm text-red-600 text-center">{{ error }}</p>
      <p class="mt-4 text-center text-sm text-gray-600">
        <button @click="router.push('/forgot-password')" class="hover:text-amber-600">
          Forgot password?
        </button>
      </p>
    </div>
  </div>
</template>
