<template>
  <div class="group relative rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:border-gray-200 hover:shadow-md">
    <!-- Top Content Area -->
    <div class="flex items-start gap-4">
      <!-- Company Avatar / Fallback Placeholder -->
      <img
        v-if="company.companyProfileImage"
        :src="company.companyProfileImage"
        alt=""
        class="h-12 w-12 shrink-0 rounded-xl object-cover ring-4 ring-gray-50 transition-transform group-hover:scale-[1.02]"
      />
      <div
        v-else
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 text-base font-bold text-gray-600 ring-4 ring-gray-50 select-none"
      >
        {{ company.name.charAt(0).toUpperCase() }}
      </div>

      <!-- Main Text Details -->
      <div class="min-w-0 flex-1">
        <h3 class="truncate text-base font-semibold tracking-tight text-gray-900 group-hover:text-sky-950">
          {{ company.name }}
        </h3>

        <!-- Contact & Location Metadata -->
        <div class="mt-2.5 space-y-2 text-sm text-gray-500">
          <!-- Location -->
          <div v-if="company.location" class="flex items-center gap-2 text-gray-600">
            <svg class="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            <span class="truncate">{{ company.location }}</span>
          </div>

          <!-- Email -->
          <div v-if="company.email" class="flex items-center gap-2">
            <svg class="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            <span class="truncate break-all">{{ company.email }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Divider Line -->
    <div class="my-4 border-t border-gray-100" />

    <!-- Action Bar Footer -->
    <div class="flex items-center justify-between gap-3">
      <!-- Left side: Social Links -->
      <div>
        <a
          v-if="normalizedTelegram"
          :href="normalizedTelegram"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 rounded-lg bg-sky-50 px-2.5 py-1.5 text-xs font-semibold text-sky-700 transition-colors hover:bg-sky-100 hover:text-sky-800"
        >
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          Telegram
        </a>
      </div>

      <!-- Right side: Management Controls -->
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="$emit('edit')"
        >
          Edit
        </button>

        <button
          type="button"
          class="rounded-xl bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="$emit('delete')"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CompanySummary } from '@/stores/company'

type Props = {
  company: CompanySummary
}

type Emits = {
  edit: []
  delete: []
}

const props = defineProps<Props>()
defineEmits<Emits>()

function normalizeUrl(url: string | null): string | null {
  if (!url) return null
  const trimmed = url.trim()
  if (!trimmed) return null
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  if (trimmed.startsWith('@')) return `https://t.me/${trimmed.slice(1)}`
  if (trimmed.startsWith('t.me/')) return `https://${trimmed}`
  return `https://${trimmed}`
}

const normalizedTelegram = computed(() => normalizeUrl(props.company.telegramLink))
</script>