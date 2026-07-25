import api from '@/services/api'

export interface ProfileResponse {
  id: number
  name: string
  email: string
  avatar: string | null
  role: string
  phone?: string
  created_at?: string
}

export interface UpdateProfilePayload {
  name: string
  email: string
  phone?: string
}

export interface AvatarUploadResponse {
  message: string
  avatar: string
}

export interface AvatarRemoveResponse {
  message: string
}

export interface ChangePasswordPayload {
  current_password: string
  password: string
  password_confirmation: string
}

export interface ChangePasswordResponse {
  message: string
}

export const profileService = {
  async getProfile(): Promise<ProfileResponse> {
    const { data } = await api.get<ProfileResponse>('/profile')
    return data
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<{ message: string; user: Partial<ProfileResponse> }> {
    const { data } = await api.put<{ message: string; user: Partial<ProfileResponse> }>('/profile/update', payload)
    return data
  },

  async uploadAvatar(formData: FormData): Promise<AvatarUploadResponse> {
    const { data } = await api.post<AvatarUploadResponse>('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async removeAvatar(): Promise<AvatarRemoveResponse> {
    const { data } = await api.delete<AvatarRemoveResponse>('/profile/avatar')
    return data
  },

  async changePassword(payload: ChangePasswordPayload): Promise<ChangePasswordResponse> {
    const { data } = await api.put<ChangePasswordResponse>('/profile/password', payload)
    return data
  },
}

