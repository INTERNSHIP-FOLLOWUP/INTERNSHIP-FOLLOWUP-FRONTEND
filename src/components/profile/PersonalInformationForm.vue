<template>
  <div class="rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <div class="border-b border-slate-100 px-6 py-4 dark:border-slate-700">
      <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Personal Information</h2>
      <p class="text-xs text-slate-500 dark:text-slate-400">Update your account's profile information.</p>
    </div>
    <form @submit.prevent="onSubmit" class="space-y-5 px-6 py-5">
      <ErrorAlert :message="store.error" />

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            :class="{ 'border-red-400 dark:border-red-600': errors.name }"
          />
          <p v-if="errors.name" class="text-red-600 dark:text-red-400 text-xs mt-1">{{ errors.name }}</p>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            :class="{ 'border-red-400 dark:border-red-600': errors.email }"
          />
          <p v-if="errors.email" class="text-red-600 dark:text-red-400 text-xs mt-1">{{ errors.email }}</p>
        </div>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label>
        <input
          v-model="form.phone"
          type="text"
          class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
        />
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
          {{ store.loading ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useProfileStore } from '@/stores/profile'
import ErrorAlert from '@/components/common/ErrorAlert.vue'

const store = useProfileStore()

const form = reactive({
  name: '',
  email: '',
  phone: '',
})

const errors = reactive({
  name: '',
  email: '',
})

watch(
  () => store.profile,
  (newProfile) => {
    if (newProfile) {
      form.name = newProfile.name || ''
      form.email = newProfile.email || ''
      form.phone = newProfile.phone || ''
    }
  },
  { immediate: true }
)

function validate() {
  errors.name = ''
  errors.email = ''
  let ok = true

  if (!form.name.trim()) {
    errors.name = 'Name is required.'
    ok = false
  }
  if (!form.email.trim()) {
    errors.email = 'Email is required.'
    ok = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Email format is invalid.'
    ok = false
  }

  return ok
}

async function onSubmit() {
  if (!validate()) return
  await store.updateProfile({
    name: form.name,
    email: form.email,
    phone: form.phone,
  })
}
</script>
