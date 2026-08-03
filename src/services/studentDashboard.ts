import api from '@/services/api'
import type { StudentDashboardResponse, StudentDashboardData } from '@/types/studentDashboard'

export const studentDashboardService = {
  async getDashboard(): Promise<StudentDashboardData> {
    const response = await api.get<StudentDashboardResponse>('/student/dashboard')
    return response.data.data
  },
}
