<template>
  <div class="space-y-4">
    <div v-if="!items.length" class="rounded-lg border border-dashed border-gray-300 p-4">
      <p class="text-sm font-medium text-gray-800">No activity yet</p>
      <p class="mt-1 text-xs text-gray-500">Timeline will appear as the issue changes.</p>
    </div>

    <div v-else class="relative">
      <div class="absolute left-3 top-0 bottom-0 w-px bg-gray-200" aria-hidden="true" />

      <div v-for="(item, idx) in items" :key="itemKey(item, idx)" class="relative">
        <div class="flex items-start gap-3 py-2">
          <div class="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-gray-200">
            <span aria-hidden="true" class="text-xs">{{ iconFor(item) }}</span>
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p class="text-sm font-semibold text-gray-900">{{ itemLabel(item) }}</p>
              <span class="text-xs text-gray-500">{{ formatDate(item.timestamp) }}</span>
            </div>

            <p v-if="item.action" class="mt-1 text-xs text-gray-600">
              {{ item.action }}
            </p>

            <div v-if="item.field" class="mt-1 text-xs text-gray-600">
              <span class="font-medium text-gray-700">Field:</span> {{ item.field }}
            </div>

            <div v-if="item.from !== undefined || item.to !== undefined" class="mt-1 text-xs text-gray-600">
              <span class="font-medium text-gray-700">Change:</span>
              {{ formatValue(item.from) }} → {{ formatValue(item.to) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IssueActivity } from '@/stores/issueStore'

const props = defineProps<{ items?: IssueActivity[] | null }>()

const items = computed(() => (Array.isArray(props.items) ? props.items : []))

function itemKey(item: IssueActivity, idx: number) {
  return item.id != null ? String(item.id) : `${item.type ?? 'item'}-${idx}`
}

function formatDate(value?: string | null) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString()
}

function itemLabel(item: IssueActivity) {
  if (item.type) return item.type
  if (item.action) return item.action
  return 'Activity'
}

function iconFor(item: IssueActivity) {
  const t = String(item.type ?? '').toLowerCase()
  if (t.includes('create')) return '📝'
  if (t.includes('status')) return '📌'
  if (t.includes('priority')) return '🚩'
  if (t.includes('assign')) return '👤'
  if (t.includes('comment')) return '💬'
  return '•'
}

function formatValue(v: unknown) {
  if (v === null || v === undefined) return '—'
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}
</script>

