import { defineStore } from 'pinia'
import { commentService } from '@/services/commentService'
import type { Comment, CommentPayload } from '@/types/comment'
import type { AxiosError } from 'axios'

interface CommentState {
  comments: Comment[]
  loading: boolean
  error: string | null
  posting: boolean
  postError: string | null
}

interface ApiErrorResponse {
  message?: string
}

export const useCommentStore = defineStore('comment', {
  state: (): CommentState => ({
    comments: [],
    loading: false,
    error: null,
    posting: false,
    postError: null,
  }),

  actions: {
    async fetchComments(worklogId: number): Promise<void> {
      this.loading = true
      this.error = null
      try {
        this.comments = await commentService.getByWorklog(worklogId)
      } catch (err) {
        const axiosErr = err as AxiosError<ApiErrorResponse>
        this.error = axiosErr.response?.data?.message ?? 'Failed to load comments'
      } finally {
        this.loading = false
      }
    },

    async postComment(payload: CommentPayload): Promise<Comment> {
      this.posting = true
      this.postError = null
      try {
        const comment = await commentService.post(payload)
        this.comments.push(comment)
        return comment
      } catch (err) {
        const axiosErr = err as AxiosError<ApiErrorResponse>
        this.postError = axiosErr.response?.data?.message ?? 'Failed to post comment'
        throw err
      } finally {
        this.posting = false
      }
    },

    reset() {
      this.comments = []
      this.error = null
      this.postError = null
    },
  },
})
