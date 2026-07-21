import { defineStore } from 'pinia'
import { ref } from 'vue'
import { profileService, type ProfileResponse, type UpdateProfilePayload, type ChangePasswordPayload } from '@/services/profileService'
import { useToastStore } from '@/stores/toast'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<ProfileResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function getProfile(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const data = await profileService.getProfile()
      profile.value = data
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      error.value = axiosErr?.response?.data?.message || 'Failed to load profile.'
      useToastStore().error(error.value, 'Load Profile Failed')
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(payload: UpdateProfilePayload): Promise<{ message: string; user: Partial<ProfileResponse> } | undefined> {
    loading.value = true
    error.value = null
    try {
      const data = await profileService.updateProfile(payload)
      profile.value = { ...profile.value!, ...data.user }
      useToastStore().success('Profile updated successfully.', 'Profile')
      return data
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      error.value = axiosErr?.response?.data?.message || 'Failed to update profile.'
      useToastStore().error(error.value, 'Update Profile Failed')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function uploadAvatar(formData: FormData): Promise<{ message: string; avatar: string } | undefined> {
    loading.value = true
    error.value = null
    try {
      const data = await profileService.uploadAvatar(formData)
      if (profile.value) {
        profile.value.avatar = data.avatar
      }
      useToastStore().success('Avatar uploaded successfully.', 'Avatar')
      return data
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      error.value = axiosErr?.response?.data?.message || 'Failed to upload avatar.'
      useToastStore().error(error.value, 'Upload Avatar Failed')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function removeAvatar(): Promise<{ message: string } | undefined> {
    loading.value = true
    error.value = null
    try {
      const data = await profileService.removeAvatar()
      if (profile.value) {
        profile.value.avatar = null
      }
      useToastStore().success('Avatar removed successfully.', 'Avatar')
      return data
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      error.value = axiosErr?.response?.data?.message || 'Failed to remove avatar.'
      useToastStore().error(error.value, 'Remove Avatar Failed')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function changePassword(payload: ChangePasswordPayload): Promise<{ message: string } | undefined> {
    loading.value = true
    error.value = null
    try {
      const data = await profileService.changePassword(payload)
      useToastStore().success('Password changed successfully.', 'Password')
      return data
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }
      const msg = axiosErr?.response?.data?.errors?.current_password?.[0] || axiosErr?.response?.data?.message || 'Failed to change password.'
      error.value = msg
      useToastStore().error(msg, 'Change Password Failed')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    profile,
    loading,
    error,
    getProfile,
    updateProfile,
    uploadAvatar,
    removeAvatar,
    changePassword,
  }
})

