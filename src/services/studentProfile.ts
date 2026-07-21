// src/services/studentProfile.ts
// Student self-profile management API service
// Follows the same pattern as studentInternshipService.ts

import api from '@/services/api'
import type {
  StudentProfile,
  StudentProfileUpdatePayload,
  StudentProfileResponse,
  PasswordChangePayload,
  PhotoUploadResponse,
} from '@/types/studentProfile'

export const studentProfileService = {
  /**
   * GET /api/student/profile
   * Returns the authenticated student's full profile.
   */
  async fetchProfile(): Promise<StudentProfile> {
    const response = await api.get<StudentProfileResponse>('/student/profile')
    return response.data.data
  },

  /**
   * PUT /api/student/profile
   * Update the authenticated student's profile (name, phone, gender).
   */
  async updateProfile(payload: StudentProfileUpdatePayload): Promise<StudentProfile> {
    const response = await api.put<StudentProfileResponse>('/student/profile', payload)
    return response.data.data
  },

  /**
   * POST /api/student/profile/photo
   * Upload a new profile photo.
   */
  async uploadPhoto(file: File): Promise<PhotoUploadResponse> {
    const fd = new FormData()
    fd.append('photo', file)
    const response = await api.post<PhotoUploadResponse>('/student/profile/photo', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  /**
   * PUT /api/student/profile/password
   * Change the authenticated student's password.
   */
  async changePassword(payload: PasswordChangePayload): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>('/student/profile/password', payload)
    return response.data
  },
}
