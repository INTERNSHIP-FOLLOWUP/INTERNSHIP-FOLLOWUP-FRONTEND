<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
    :class="badgeClass"
  >
    <span class="h-1.5 w-1.5 rounded-full" :class="dotClass" />
    {{ status }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WorklogStatus } from '@/types/worklog'

const props = defineProps<{
  status: WorklogStatus
}>()

const badgeClass = computed(() => {
  switch (props.status) {
    case 'Pending': return 'bg-amber-50 text-amber-700'
    case 'Reviewed': return 'bg-emerald-50 text-emerald-700'
    case 'Approved': return 'bg-emerald-50 text-emerald-700'
    case 'Rejected': return 'bg-rose-50 text-rose-700'
    case 'Needs Revision': return 'bg-orange-50 text-orange-700'
    default: return 'bg-slate-50 text-slate-600'
  }
})

const dotClass = computed(() => {
  switch (props.status) {
    case 'Pending': return 'bg-amber-500'
    case 'Reviewed': return 'bg-emerald-500'
    case 'Approved': return 'bg-emerald-500'
    case 'Rejected': return 'bg-rose-500'
    case 'Needs Revision': return 'bg-orange-500'
    default: return 'bg-slate-400'
  }
})
</script>

