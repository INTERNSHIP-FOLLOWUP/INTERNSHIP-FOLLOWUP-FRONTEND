<template>
  <div class="rounded-2xl border border-slate-100 bg-white shadow-sm">
    <div class="p-6">
      <div class="flex items-center gap-4">
        <div class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-slate-100">
          <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="h-full w-full object-cover" />
          <svg v-else class="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">{{ profile.name || 'User' }}</h2>
          <p class="text-sm text-slate-500">{{ profile.email }}</p>
          <span class="mt-1 inline-flex rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">
            {{ profile.role || 'Tutor' }}
          </span>
        </div>
      </div>
      <div class="mt-4 flex items-center gap-2">
        <button
          type="button"
          @click="$emit('upload-avatar')"
          :disabled="store.loading"
          class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50"
        >
          <svg v-if="store.loading" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Upload Avatar
        </button>
        <button
          v-if="avatarUrl"
          type="button"
          @click="$emit('remove-avatar')"
          :disabled="store.loading"
          class="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm transition-colors hover:bg-red-50 disabled:opacity-50"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProfileStore } from '@/stores/profile'

const store = useProfileStore()
const profile = computed(() => store.profile || {})

const avatarUrl = computed(() => {
  const avatar = profile.value.avatar
  if (!avatar) return ''
  if (/^https?:\/\//.test(avatar)) return avatar
  const base = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/?api\/?$/, '')
  return `${base}/storage/${avatar.replace(/^\//, '')}`
})
</script>