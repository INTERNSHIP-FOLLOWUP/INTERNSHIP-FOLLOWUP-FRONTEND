// src/stores/commentStore.ts
import { defineStore } from 'pinia'
import api from '@/services/api'
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

interface PaginatedResponse<T> {
  data: T[]
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
        const res = await api.get<PaginatedResponse<Comment> | Comment[]>('/comments', {
          params: { worklog_id: worklogId },
        })
        const payload = res.data
        this.comments = Array.isArray(payload) ? payload : payload.data
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
        const res = await api.post<Comment>('/comments', payload)
        this.comments.push(res.data)
        return res.data
      } catch (err) {
        const axiosErr = err as AxiosError<ApiErrorResponse>
        this.postError = axiosErr.response?.data?.message ?? 'Failed to post comment'
        throw err
      } finally {
        this.posting = false
      }
    },

    // Clears state when navigating away from a worklog, so stale comments 
    // from one worklog don't briefly flash when opening another
    reset(): void {
      this.comments = []
      this.error = null
      this.postError = null
    },
  },
})