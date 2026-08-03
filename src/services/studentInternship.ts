import api from '@/services/api'
import type { Assignment } from '@/types/assignment'

interface StudentInternshipResponse {
  data: Assignment
  message?: string
}

export const studentInternshipService = {
  /**
   * GET /api/student/internship
   * Returns the current student's internship assignment.
   * Requires student role. Returns 404 if not assigned yet.
   */
  async getMyInternship(): Promise<Assignment> {
    const response = await api.get<StudentInternshipResponse>('/student/internship')
    return response.data.data
  },
}
