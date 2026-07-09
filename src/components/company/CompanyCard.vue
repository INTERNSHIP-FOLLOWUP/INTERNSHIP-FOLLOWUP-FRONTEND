<template>
  <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <h3 class="truncate text-base font-semibold text-gray-900">
            {{ company.name }}
          </h3>
        </div>

        <div class="mt-2 space-y-1 text-sm text-gray-600">
          <p v-if="company.email" class="break-words">{{ company.email }}</p>
          <p v-if="company.location" class="break-words">{{ company.location }}</p>
        </div>
      </div>

      <!-- Placeholder for future actions (edit/delete/view) -->
      <div class="flex shrink-0 items-center gap-2" aria-hidden="true"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CompanySummary } from '@/stores/company'

type Props = {
  company: CompanySummary
}

defineProps<Props>()
</script>

