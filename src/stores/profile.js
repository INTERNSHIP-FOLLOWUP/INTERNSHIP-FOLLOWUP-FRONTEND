import { defineStore } from 'pinia'
import { ref } from 'vue'
import { profileService } from '@/services/profileService'
import { useToastStore } from '@/stores/toast'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function getProfile() {
    loading.value = true
    error.value = null
    try {
      const data = await profileService.getProfile()
      profile.value = data.data || data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load profile.'
      useToastStore().error(error.value, 'Load Profile Failed')
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(payload) {
    loading.value = true
    error.value = null
    try {
      const data = await profileService.updateProfile(payload)
      profile.value = { ...profile.value, ...data.data }
      useToastStore().success('Profile updated successfully.', 'Profile')
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update profile.'
      useToastStore().error(error.value, 'Update Profile Failed')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function uploadAvatar(formData) {
    loading.value = true
    error.value = null
    try {
      const data = await profileService.uploadAvatar(formData)
      if (profile.value) {
        profile.value.avatar = data.data?.avatar || profile.value.avatar
      }
      useToastStore().success('Avatar uploaded successfully.', 'Avatar')
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to upload avatar.'
      useToastStore().error(error.value, 'Upload Avatar Failed')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function removeAvatar() {
    loading.value = true
    error.value = null
    try {
      const data = await profileService.removeAvatar()
      if (profile.value) {
        profile.value.avatar = null
      }
      useToastStore().success('Avatar removed successfully.', 'Avatar')
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to remove avatar.'
      useToastStore().error(error.value, 'Remove Avatar Failed')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function changePassword(payload) {
    loading.value = true
    error.value = null
    try {
      const data = await profileService.changePassword(payload)
      useToastStore().success('Password changed successfully.', 'Password')
      return data
    } catch (err) {
      const msg = err.response?.data?.errors?.current_password?.[0] || err.response?.data?.message || 'Failed to change password.'
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