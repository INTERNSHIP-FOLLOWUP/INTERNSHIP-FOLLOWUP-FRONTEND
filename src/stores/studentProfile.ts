// src/stores/studentProfile.ts
// Pinia store for student self-profile management
// Follows the same pattern as the company store's fetchProfile/updateProfile

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { studentProfileService } from '@/services/studentProfile'
import { parseApiError } from '@/utils/errorParser'
import type {
  StudentProfile,
  StudentProfileUpdatePayload,
  PasswordChangePayload,
} from '@/types/studentProfile'

export const useStudentProfileStore = defineStore('studentProfile', () => {
  // ── State ──
  const profile = ref<StudentProfile | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)

  // ── Actions ──

  /**
   * Fetch the authenticated student's profile from the backend.
   */
  async function fetchProfile(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      profile.value = await studentProfileService.fetchProfile()
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update the authenticated student's profile.
   */
  async function updateProfile(payload: StudentProfileUpdatePayload): Promise<void> {
    saving.value = true
    error.value = null

    try {
      const updated = await studentProfileService.updateProfile(payload)
      profile.value = updated
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      saving.value = false
    }
  }

  /**
   * Upload a new profile photo.
   * After upload, re-fetches the profile from the GET endpoint to ensure
   * the store has the canonical photo URL (avoids response format mismatches).
   */
  async function uploadPhoto(file: File): Promise<void> {
    saving.value = true
    error.value = null

    try {
      await studentProfileService.uploadPhoto(file)
      // Re-fetch profile to get canonical data from GET endpoint
      await fetchProfile()
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      saving.value = false
    }
  }

  /**
   * Change the student's password.
   */
  async function changePassword(payload: PasswordChangePayload): Promise<void> {
    saving.value = true
    error.value = null

    try {
      await studentProfileService.changePassword(payload)
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      saving.value = false
    }
  }

  /**
   * Clear any stored error.
   */
  function clearError(): void {
    error.value = null
  }

  /**
   * Reset the store to its initial state.
   */
  function reset(): void {
    profile.value = null
    loading.value = false
    saving.value = false
    error.value = null
  }

  return {
    // State
    profile,
    loading,
    saving,
    error,

    // Actions
    fetchProfile,
    updateProfile,
    uploadPhoto,
    changePassword,
    clearError,
    reset,
  }
})
