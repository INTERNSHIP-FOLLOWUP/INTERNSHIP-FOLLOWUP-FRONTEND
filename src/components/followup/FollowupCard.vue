<!-- src/components/followup/FollowupCard.vue -->
<template>
  <div class="border rounded-lg p-4 hover:shadow-sm transition-shadow">
    <div class="flex justify-between items-start mb-2">
      <h4 class="font-medium text-sm">{{ studentName }}</h4>
      <MeetingTypeBadge :type="followup.meeting_type" />
    </div>

    <p class="text-xs text-gray-500 mb-2">
      Meeting: {{ formattedMeetingDate }}
    </p>

    <p class="text-sm text-gray-700 line-clamp-2 mb-2">
      {{ followup.notes }}
    </p>

    <div v-if="followup.next_followup" class="text-xs text-gray-400">
      Next follow-up: {{ formattedNextDate }}
    </div>

    <button
      v-if="showViewButton"
      @click="$emit('view', followup)"
      class="text-blue-600 text-xs mt-2 hover:underline"
    >
      View details
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Followup } from '@/types/followup'
import MeetingTypeBadge from './MeetingTypeBadge.vue'

const props = withDefaults(
  defineProps<{
    followup: Followup
    studentName: string
    showViewButton?: boolean
  }>(),
  { showViewButton: true }
)

defineEmits<{ view: [followup: Followup] }>()

const formattedMeetingDate = computed(() =>
  new Date(props.followup.meeting_date).toLocaleDateString()
)

const formattedNextDate = computed(() =>
  props.followup.next_followup
    ? new Date(props.followup.next_followup).toLocaleDateString()
    : ''
)
</script>