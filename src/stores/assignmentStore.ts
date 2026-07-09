import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { parseApiError } from '@/utils/errorParser'
import type {
  Assignment,
  CreateAssignmentPayload,
  UpdateAssignmentPayload,
  AssignmentPaginationMeta,
} from '@/types/assignment'

export const useAssignmentStore = defineStore('assignment', () => {
  const assignments = ref<Assignment[]>([])
  const currentAssignment = ref<Assignment | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<AssignmentPaginationMeta | null>(null)

  const assignmentCount = computed(() =>
    pagination.value ? pagination.value.total : assignments.value.length,
  )

  function getAssignmentById(id: number): Assignment | null {
    return assignments.value.find((a) => a.id === id) ?? null
  }

  async function fetchAssignments(params: Record<string, unknown> = {}): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const res = await api.get('/assignments', { params })
      const data = res.data as Assignment[] | { data: Assignment[] }
      assignments.value = Array.isArray(data) ? data : (data?.data ?? [])
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createAssignment(payload: CreateAssignmentPayload): Promise<Assignment> {
    error.value = null

    try {
      const res = await api.post('/assignments', payload)
      const record = res.data as Assignment
      assignments.value.push(record)
      return record
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    }
  }

  async function updateAssignment(
    id: number,
    payload: UpdateAssignmentPayload,
  ): Promise<Assignment> {
    error.value = null

    try {
      const res = await api.put(`/assignments/${id}`, payload)
      const updated = res.data as Assignment
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
    }
  }

  async function updateStatus(id: number, status: Assignment['status']): Promise<Assignment> {
    return updateAssignment(id, { status })
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
    getAssignmentById,
    fetchAssignments,
    createAssignment,
    updateAssignment,
    updateStatus,
    clearError,
    reset,
  }
})
