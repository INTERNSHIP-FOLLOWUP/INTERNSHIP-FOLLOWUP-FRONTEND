<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
    :class="badgeClass"
  >
    <span class="h-1.5 w-1.5 rounded-full" :class="dotClass" />
    {{ statusText }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { WorklogStatus } from '@/types/worklog'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    status?: WorklogStatus | undefined
  }>(),
  {
    status: 'Pending',
  },
)

const statusText = computed(() => {
  const key = props.status?.toLowerCase()
  if (key && ['pending', 'reviewed', 'approved', 'rejected'].includes(key)) {
    return t('worklogs.' + key)
  }
  return t('worklogs.pending')
})

const badgeClass = computed(() => {
  switch (props.status) {
    case 'Pending':
      return 'bg-yellow-50 text-yellow-700'
    case 'Reviewed':
      return 'bg-blue-50 text-blue-700'
    case 'Approved':
      return 'bg-green-50 text-green-700'
    case 'Rejected':
      return 'bg-red-50 text-red-700'
    default:
      return 'bg-slate-50 text-slate-600'
  }
})

const dotClass = computed(() => {
  switch (props.status) {
    case 'Pending':
      return 'bg-yellow-500'
    case 'Reviewed':
      return 'bg-blue-500'
    case 'Approved':
      return 'bg-green-500'
    case 'Rejected':
      return 'bg-red-500'
    default:
      return 'bg-slate-400'
  }
})
</script>
