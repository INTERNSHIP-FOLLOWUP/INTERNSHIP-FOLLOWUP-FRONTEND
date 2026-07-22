<template>
  <div class="rounded-2xl border border-slate-100 bg-white shadow-sm">
    <div class="border-b border-slate-100 px-6 py-4">
      <h2 class="text-lg font-semibold text-slate-900">Account Information</h2>
      <p class="text-xs text-slate-500">Read-only account details.</p>
    </div>
    <div class="px-6 py-5">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">User ID</p>
          <p class="mt-1 text-sm font-semibold text-gray-900">{{ account.id || '—' }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Role</p>
          <p class="mt-1 text-sm font-semibold text-gray-900">{{ account.role || '—' }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Created At</p>
          <p class="mt-1 text-sm font-semibold text-gray-900">{{ account.created_at || '—' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProfileStore } from '@/stores/profile'

const store = useProfileStore()
const account = computed(() => store.profile || {})
</script>