/**
 * Service file for the Tutor → My Students feature.
 * Communicates with the GET /api/tutor/students endpoint.
 */

import api from '@/services/api'
import type { TutorMyStudentListResponse } from '@/types/tutorMyStudents'

export interface MyStudentsQuery {
  search?: string
  status?: string
  company_id?: number
  per_page?: number
  page?: number
}

export const tutorMyStudentsService = {
  /**
   * Fetch students assigned to the authenticated tutor.
   * Supports search, filters, and pagination.
   */
  async list(params?: MyStudentsQuery): Promise<TutorMyStudentListResponse> {
    const response = await api.get('/tutor/students', { params })
    return response.data
  },
}
