import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { assignmentService } from '@/services/assignment'
import { parseApiError } from '@/utils/errorParser'
import type {
  Assignment,
  CreateAssignmentPayload,
  UpdateAssignmentPayload,
  AssignmentListResponse,
} from '@/types/assignment'

export const useAssignmentStore = defineStore('assignment', () => {
  const assignments = ref<Assignment[]>([])
  const currentAssignment = ref<Assignment | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<AssignmentListResponse['meta'] | null>(null)

  const assignmentCount = computed(() => pagination.value?.total ?? assignments.value.length)

  async function fetchAssignments(params?: {
    page?: number
    per_page?: number
    status?: string
    company_id?: number
  }): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await assignmentService.list(params)
      assignments.value = response.data
      pagination.value = response.meta
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createAssignment(payload: CreateAssignmentPayload): Promise<Assignment> {
    loading.value = true
    error.value = null

    try {
      const record = await assignmentService.create(payload)
      assignments.value.push(record)
      return record
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateAssignment(
    id: number,
    payload: UpdateAssignmentPayload,
  ): Promise<Assignment> {
    loading.value = true
    error.value = null

    try {
      const updated = await assignmentService.update(id, payload)
      const idx = assignments.value.findIndex((a) => a.id === id)
      if (idx !== -1) {
        assignments.value[idx] = updated
      }
      if (currentAssignment.value?.id === id) {
        currentAssignment.value = updated
      }
      return updated
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateStatus(id: number, status: Assignment['status']): Promise<Assignment> {
    return updateAssignment(id, { status })
  }

  async function deleteAssignment(id: number): Promise<void> {
    loading.value = true
    error.value = null

    try {
      await assignmentService.delete(id)
      assignments.value = assignments.value.filter((a) => a.id !== id)
      if (currentAssignment.value?.id === id) {
        currentAssignment.value = null
      }
      pagination.value = pagination.value
        ? { ...pagination.value, total: pagination.value.total - 1 }
        : null
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError(): void {
    error.value = null
  }

  function reset(): void {
    assignments.value = []
    currentAssignment.value = null
    loading.value = false
    error.value = null
    pagination.value = null
  }

  return {
    assignments,
    currentAssignment,
    loading,
    error,
    pagination,
    assignmentCount,
    fetchAssignments,
    createAssignment,
    updateAssignment,
    updateStatus,
    deleteAssignment,
    clearError,
    reset,
  }
})
