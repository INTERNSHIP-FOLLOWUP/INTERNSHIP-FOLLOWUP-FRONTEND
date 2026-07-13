<template>
  <div
    class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
    role="group"
    :aria-label="`Issue ${issue.title}`"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h3 class="truncate text-sm font-semibold text-gray-900">
          {{ issue.title }}
        </h3>
        <p class="mt-1 line-clamp-2 text-xs text-gray-600">
          {{ issue.description }}
        </p>
      </div>

      <div class="flex shrink-0 items-center gap-2">
        <PriorityBadge :priority="issue.priority" />
      </div>
    </div>

    <div class="mt-3 flex flex-wrap items-center gap-2">
      <IssueStatusBadge :status="issue.status" />
      <span class="text-xs text-gray-500">
        <span class="font-medium text-gray-700">Student:</span>
        {{ issue.student?.name ?? '—' }}
      </span>
    </div>

    <div class="mt-4 flex items-center justify-between">
      <div class="text-xs text-gray-500">
        <div>
          <span class="font-medium text-gray-700">Created:</span>
          {{ formatDate(issue.created_at ?? null) }}
        </div>
      </div>

      <div class="flex items-center gap-2">
        <BaseButton
          variant="secondary"
          size="sm"
          :to="`/issues/${issue.id}`"
          aria-label="View issue"
        >
          View
        </BaseButton>
        <BaseButton
          variant="primary"
          size="sm"
          :to="`/issues/${issue.id}/edit`"
          aria-label="Edit issue"
        >
          Edit
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Issue } from '@/stores/issueStore'
import IssueStatusBadge from '@/components/issue/IssueStatusBadge.vue'
import PriorityBadge from '@/components/issue/PriorityBadge.vue'
import BaseButton from '@/components/common/BaseButton.vue'

defineProps<{ issue: Issue }>()

function formatDate(value?: string | null) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString()
}
</script>

