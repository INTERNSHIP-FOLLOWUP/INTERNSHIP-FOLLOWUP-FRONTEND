<!-- src/components/worklog/CommentItem.vue -->
<template>
  <div class="flex gap-3 py-2 border-b last:border-0">
    <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium shrink-0">
      {{ initials }}
    </div>
    <div class="flex-1">
      <div class="flex items-center gap-2">
        <span class="font-medium text-sm">{{ comment.user_name }}</span>
        <span class="text-xs text-gray-400">{{ formattedDate }}</span>
      </div>
      <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ comment.message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Comment } from '@/types/comment'

const props = defineProps<{ comment: Comment }>()

const initials = computed(() =>
  props.comment.user_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? '?'
)

const formattedDate = computed(() =>
  new Date(props.comment.created_at).toLocaleString()
)
</script>