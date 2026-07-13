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

      <div class="flex shrink-0 items-center gap-2">
        <button
          type="button"
          class="rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
          @click="$emit('edit')"
        >
          Edit
        </button>

        <button
          type="button"
          class="rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
          @click="$emit('delete')"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CompanySummary } from '@/stores/company'

type Props = {
  company: CompanySummary
}

type Emits = {
  edit: []
  delete: []
}

defineProps<Props>()
defineEmits<Emits>()
</script>


