<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <router-link to="/admin/users" class="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 mb-4">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m7-7l-7 7 7 7" />
          </svg>
          Back to Users
        </router-link>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">{{ isEdit ? 'Edit User' : 'Add User' }}</h1>
        <p class="mt-1 text-sm text-slate-500">{{ isEdit ? 'Update user account details.' : 'Create a new user account.' }}</p>
      </div>
      <button type="button" @click="$router.back()"
        class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">
        Cancel
      </button>
    </div>

    <div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700">First Name <span class="text-rose-500">*</span></label>
            <input v-model="form.first_name" type="text" required
              class="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              :class="{ 'border-rose-300': errors.first_name }" />
            <p v-if="errors.first_name" class="mt-1 text-xs text-rose-600">{{ errors.first_name }}</p>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700">Last Name <span class="text-rose-500">*</span></label>
            <input v-model="form.last_name" type="text" required
              class="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              :class="{ 'border-rose-300': errors.last_name }" />
            <p v-if="errors.last_name" class="mt-1 text-xs text-rose-600">{{ errors.last_name }}</p>
          </div>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700">Email <span class="text-rose-500">*</span></label>
          <input v-model="form.email" type="email" required
            class="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            :class="{ 'border-rose-300': errors.email }" />
          <p v-if="errors.email" class="mt-1 text-xs text-rose-600">{{ errors.email }}</p>
        </div>

        <div v-if="!isEdit">
          <label class="mb-1.5 block text-sm font-semibold text-slate-700">Password <span class="text-rose-500">*</span></label>
          <input v-model="form.password" type="password" required minlength="8"
            class="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            :class="{ 'border-rose-300': errors.password }" />
          <p v-if="errors.password" class="mt-1 text-xs text-rose-600">{{ errors.password }}</p>
          <p v-else class="mt-1 text-xs text-slate-400">Min 8 characters</p>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700">Role <span class="text-rose-500">*</span></label>
          <select v-model="form.role" required
            class="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100">
            <option value="" disabled>Select role</option>
            <option value="admin">Admin</option>
            <option value="tutor">Tutor</option>
            <option value="student">Student</option>
            <option value="company">Company</option>
          </select>
        </div>

        <div v-if="submitError" class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {{ submitError }}
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <router-link to="/admin/users"
            class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
            Cancel
          </router-link>
          <button type="submit" :disabled="submitting"
            class="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed">
            {{ submitting ? 'Saving...' : (isEdit ? 'Update User' : 'Create User') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { useToastStore } from '@/stores/toast'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()

const isEdit = computed(() => !!route.params.id)
const submitting = ref(false)
const submitError = ref('')
const errors = ref<Record<string, string>>({})

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  role: '',
})

onMounted(async () => {
  if (isEdit.value) {
    try {
      const res = await api.get(`/admin/users/${route.params.id}`)
      const u = res.data
      form.value.first_name = u.first_name || ''
      form.value.last_name = u.last_name || ''
      form.value.email = u.email
      form.value.role = u.role?.name || ''
    } catch {
      toast.error('Failed to load user.')
      router.push('/admin/users')
    }
  }
})

async function handleSubmit() {
  submitting.value = true
  submitError.value = ''
  errors.value = {}

  try {
    const payload: Record<string, unknown> = {
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      email: form.value.email,
      role: form.value.role,
    }
    if (!isEdit.value) payload.password = form.value.password

    if (isEdit.value) {
      await api.put(`/admin/users/${route.params.id}`, payload)
      toast.success('User updated successfully.')
    } else {
      await api.post('/admin/users', payload)
      toast.success('User created successfully.')
    }
    router.push('/admin/users')
  } catch (err: unknown) {
    const resp = (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })?.response?.data
    if (resp?.errors) {
      const errs: Record<string, string> = {}
      for (const [k, v] of Object.entries(resp.errors)) {
        errs[k] = (v as string[])[0]
      }
      errors.value = errs
    }
    submitError.value = resp?.message || 'An error occurred.'
  } finally {
    submitting.value = false
  }
}
</script>
