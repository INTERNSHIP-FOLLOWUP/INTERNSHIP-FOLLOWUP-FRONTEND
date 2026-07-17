<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-slate-900">{{ isEdit ? 'Edit Tutor' : 'Add Tutor' }}</h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ isEdit ? 'Update tutor information.' : 'Fill in the details to register a new tutor.' }}
        </p>
      </div>
    </div>

    <form @submit.prevent="submit" class="space-y-5">
      <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div class="grid gap-5 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label class="mb-1.5 block text-sm font-semibold text-slate-700">Full Name *</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              :class="{ 'border-rose-300 bg-rose-50': errors.name }"
              placeholder="Enter full name"
            />
            <p v-if="errors.name" class="mt-1.5 text-xs font-medium text-rose-600">{{ errors.name }}</p>
          </div>

          <div class="sm:col-span-2">
            <label class="mb-1.5 block text-sm font-semibold text-slate-700">Email *</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              :class="{ 'border-rose-300 bg-rose-50': errors.email }"
              placeholder="Enter email address"
            />
            <p v-if="errors.email" class="mt-1.5 text-xs font-medium text-rose-600">{{ errors.email }}</p>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700">
              Password {{ isEdit ? '(leave blank to keep current)' : '*' }}
            </label>
            <input
              v-model="form.password"
              type="password"
              class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              :class="{ 'border-rose-300 bg-rose-50': errors.password }"
              :placeholder="isEdit ? 'New password' : 'Enter password'"
            />
            <p v-if="errors.password" class="mt-1.5 text-xs font-medium text-rose-600">{{ errors.password }}</p>
          </div>

          <div v-if="!isEdit">
            <label class="mb-1.5 block text-sm font-semibold text-slate-700">Confirm Password *</label>
            <input
              v-model="form.password_confirmation"
              type="password"
              class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              placeholder="Re-enter password"
            />
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3">
        <button
          type="button"
          @click="$emit('cancel')"
          class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="store.loading"
          class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-500/20 transition-all duration-200 hover:from-primary-700 hover:to-primary-600 hover:shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span v-if="store.loading" class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          {{ isEdit ? 'Save Changes' : 'Create Tutor' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useTutorStore } from '@/stores/tutorStore'
import { useToastStore } from '@/stores/toast'
import type { TutorWorkload } from '@/types/user'

const props = defineProps<{
  tutorId?: number
}>()

const emit = defineEmits<{
  (e: 'saved'): void
  (e: 'cancel'): void
}>()

const store = useTutorStore()
const toast = useToastStore()

const isEdit = computed(() => !!props.tutorId)

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
})

function validate(): boolean {
  errors.name = ''
  errors.email = ''
  errors.password = ''

  if (!form.name.trim()) {
    errors.name = 'Name is required.'
  }
  if (!form.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email.'
  }
  if (!isEdit.value && !form.password) {
    errors.password = 'Password is required.'
  }
  if (form.password && form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }

  return !errors.name && !errors.email && (!errors.password)
}

async function submit(): Promise<void> {
  if (!validate()) return

  if (isEdit.value) {
    const payload: { name: string; email: string; password?: string } = {
      name: form.name.trim(),
      email: form.email.trim(),
    }
    if (form.password) payload.password = form.password

    try {
      await store.updateTutor(props.tutorId!, payload)
      toast.success('Tutor updated successfully.')
      emit('saved')
    } catch {
      // error handled by store
    }
  } else {
    try {
      await store.createTutor({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      toast.success('Tutor created successfully.')
      emit('saved')
    } catch {
      // error handled by store
    }
  }
}
</script>
