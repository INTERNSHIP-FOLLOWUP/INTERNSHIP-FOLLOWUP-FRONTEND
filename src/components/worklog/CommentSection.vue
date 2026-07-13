<!-- src/components/worklog/CommentSection.vue -->
<template>
  <div class="mt-4">
    <h3 class="text-sm font-semibold mb-2">Comments</h3>

    <ErrorAlert :message="commentStore.error" />

    <div v-if="commentStore.loading" class="flex items-center gap-2 text-gray-500 py-2">
      <Spinner /> Loading comments...
    </div>

    <div v-else>
      <CommentItem
        v-for="comment in commentStore.comments"
        :key="comment.id"
        :comment="comment"
      />
      <p v-if="commentStore.comments.length === 0" class="text-sm text-gray-400 py-2">
        No comments yet.
      </p>
    </div>

    <ErrorAlert :message="commentStore.postError" />

    <form @submit.prevent="submit" class="mt-3 flex gap-2 items-start">
      <textarea
        v-model="message"
        rows="2"
        placeholder="Write a comment..."
        class="border rounded px-3 py-2 flex-1 text-sm"
        :class="{ 'border-red-500': fieldError }"
      ></textarea>
      <button
        type="submit"
        :disabled="commentStore.posting"
        class="px-4 py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-50 flex items-center gap-2"
      >
        <Spinner v-if="commentStore.posting" />
        {{ commentStore.posting ? 'Posting...' : 'Post' }}
      </button>
    </form>
    <p v-if="fieldError" class="text-red-600 text-sm mt-1">{{ fieldError }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useCommentStore } from '@/stores/commentStore'
import Spinner from '@/components/ui/LoadingSpinner.vue'
import ErrorAlert from '@/components/common/ErrorAlert.vue'
import CommentItem from './CommentItem.vue'

const props = defineProps<{ worklogId: number }>()

const commentStore = useCommentStore()
const message = ref('')
const fieldError = ref('')

async function submit() {
  fieldError.value = ''
  if (!message.value.trim()) {
    fieldError.value = 'Comment cannot be empty.'
    return
  }
  try {
    await commentStore.postComment({
      worklog_id: props.worklogId,
      message: message.value.trim(),
    })
    message.value = ''
  } catch {
    // postError already set in store; nothing extra needed here
  }
}

onMounted(() => {
  commentStore.fetchComments(props.worklogId)
})

onUnmounted(() => {
  commentStore.reset()
})
</script>