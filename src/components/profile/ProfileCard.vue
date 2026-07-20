<template>
  <div class="rounded-2xl border border-slate-100 bg-white shadow-sm">
    <div class="p-6">
      <div class="flex items-center gap-4">
        <UserAvatar :avatar="profile.avatar" :name="profile.name" size="lg" />
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
          v-if="profile.avatar"
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
import UserAvatar from '@/components/common/UserAvatar.vue'

const store = useProfileStore()
const profile = computed(() => store.profile || {})


</script>