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
   * GET /api/profile
   * Returns the authenticated user's profile.
   */
  async fetchProfile(): Promise<StudentProfile> {
    const response = await api.get<{ data?: StudentProfile } | StudentProfile>('/profile')
    const data = (response.data as { data?: StudentProfile }).data ?? response.data
    return data as StudentProfile
  },

  /**
   * PUT /api/profile/update
   * Update the authenticated user's profile.
   */
  async updateProfile(payload: StudentProfileUpdatePayload): Promise<StudentProfile> {
    const response = await api.put<{ user?: StudentProfile; data?: StudentProfile }>('/profile/update', payload)
    const data = response.data.user ?? response.data.data ?? (response.data as unknown as StudentProfile)
    return data
  },

  /**
   * POST /api/profile/avatar
   * Upload a new profile avatar photo.
   */
  async uploadPhoto(file: File): Promise<PhotoUploadResponse> {
    const fd = new FormData()
    fd.append('avatar', file)
    const response = await api.post<PhotoUploadResponse>('/profile/avatar', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  /**
   * PUT /api/profile/password
   * Change the authenticated user's password.
   */
  async changePassword(payload: PasswordChangePayload): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>('/profile/password', payload)
    return response.data
  },
}
