<template>
  <div class="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-slate-900">
          {{ company?.companyName || 'Company Details' }}
        </h2>
        <p class="mt-1 text-sm text-slate-500">View the company's information below.</p>
      </div>
      <button
        type="button"
        class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        @click="emit('close')"
        aria-label="Close"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <svg class="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </div>

    <template v-else-if="company">
      <div class="mt-6 space-y-6">
        <!-- Logo -->
        <div class="flex items-center gap-4">
          <div class="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
            <img
              v-if="logoUrl"
              :src="logoUrl"
              :alt="company.companyName"
              class="h-full w-full object-cover"
            />
            <span v-else class="text-xl font-bold text-slate-400 select-none">
              {{ company.companyName.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-600">Company Logo</p>
            <p class="mt-1 text-xs text-slate-400">{{ logoUrl ? 'Uploaded' : 'No logo uploaded' }}</p>
          </div>
        </div>

        <!-- Fields -->
        <div class="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div class="space-y-1">
            <p class="block text-xs font-semibold text-slate-600">Company Name</p>
            <p class="text-sm text-slate-900">{{ company.companyName }}</p>
          </div>

          <div class="space-y-1">
            <p class="block text-xs font-semibold text-slate-600">Company Email</p>
            <a
              v-if="company.email"
              :href="`mailto:${company.email}`"
              class="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              {{ company.email }}
            </a>
            <p v-else class="text-sm text-slate-400">—</p>
          </div>

          <div class="space-y-1">
            <p class="block text-xs font-semibold text-slate-600">Industry</p>
            <p class="text-sm text-slate-900">{{ company.industry || '—' }}</p>
          </div>

          <div class="space-y-1">
            <p class="block text-xs font-semibold text-slate-600">Location</p>
            <p class="text-sm text-slate-900">{{ company.address || '—' }}</p>
          </div>

          <div class="space-y-1">
            <p class="block text-xs font-semibold text-slate-600">Website URL</p>
            <a
              v-if="company.website"
              :href="normalizeUrl(company.website)"
              target="_blank"
              rel="noopener noreferrer"
              class="block truncate text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              {{ company.website }}
            </a>
            <p v-else class="text-sm text-slate-400">—</p>
          </div>

          <div class="space-y-1">
            <p class="block text-xs font-semibold text-slate-600">Telegram Channel Link</p>
            <a
              v-if="company.telegramLink"
              :href="normalizeUrl(company.telegramLink)"
              target="_blank"
              rel="noopener noreferrer"
              class="block truncate text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              {{ company.telegramLink }}
            </a>
            <p v-else class="text-sm text-slate-400">—</p>
          </div>
        </div>

        <!-- Metadata -->
        <div class="grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
          <div>
            <p class="text-xs font-semibold text-slate-600">Company ID</p>
            <p class="mt-1 text-sm text-slate-900">#{{ company.id }}</p>
          </div>
          <div v-if="company.createdAt">
            <p class="text-xs font-semibold text-slate-600">Created</p>
            <p class="mt-1 text-sm text-slate-900">{{ formatDate(company.createdAt) }}</p>
          </div>
          <div v-if="company.updatedAt">
            <p class="text-xs font-semibold text-slate-600">Last Updated</p>
            <p class="mt-1 text-sm text-slate-900">{{ formatDate(company.updatedAt) }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          @click="emit('close')"
        >
          Close
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-600 active:scale-95"
          @click="emit('edit')"
        >
          Edit Company
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Company } from '@/types/company'

const props = defineProps<{
  company: Company | null
  loading?: boolean
}>()

const emit = defineEmits<{
  close: []
  edit: []
}>()

const logoUrl = computed(() => {
  if (!props.company) return null
  return props.company.companyImageUrl || props.company.companyProfileImageUrl || props.company.companyProfileImage || null
})

function normalizeUrl(url: string | null): string | undefined {
  if (!url) return undefined
  const trimmed = url.trim()
  if (!trimmed) return undefined
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  return `https://${trimmed}`
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}
</script>
