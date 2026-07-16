import api from '@/services/api'
import type { Comment, CommentPayload } from '@/types/comment'

export const commentService = {
  async getByWorklog(worklogId: number): Promise<Comment[]> {
    const response = await api.get<Comment[]>('/comments', {
      params: { worklog_id: worklogId },
    })
    return response.data
  },

  async post(payload: CommentPayload): Promise<Comment> {
    const response = await api.post<Comment>('/comments', payload)
    return response.data
  },
}
