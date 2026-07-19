import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { studentService } from '@/services/student'
import { parseApiError } from '@/utils/errorParser'
import type { Student, StudentFormData, StudentPaginationMeta } from '@/types/student'

export const useStudentStore = defineStore('student', () => {
  const students = ref<Student[]>([])
  const currentStudent = ref<Student | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<StudentPaginationMeta | null>(null)

  const studentCount = computed(() => pagination.value?.total ?? students.value.length)

  function getStudentById(id: number): Student | null {
    return students.value.find((s) => s.id === id) ?? null
  }

  async function fetchStudents(params?: {
    per_page?: number
    page?: number
    search?: string
  }): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await studentService.list(params)
      students.value = response.data
      pagination.value = response.meta
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchStudent(id: number): Promise<void> {
    loading.value = true
    error.value = null

    try {
      currentStudent.value = await studentService.get(id)
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createStudent(data: StudentFormData): Promise<Student> {
    loading.value = true
    error.value = null

    try {
      const student = await studentService.create(data)
      students.value.unshift(student)
      pagination.value = pagination.value
        ? { ...pagination.value, total: pagination.value.total + 1 }
        : null
      return student
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateStudent(id: number, data: Partial<StudentFormData>): Promise<Student> {
    loading.value = true
    error.value = null

    try {
      const updated = await studentService.update(id, data)

      const index = students.value.findIndex((s) => s.id === id)
      if (index !== -1) {
        students.value[index] = updated
      }
      if (currentStudent.value?.id === id) {
        currentStudent.value = updated
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

  async function deleteStudent(id: number): Promise<void> {
    loading.value = true
    error.value = null

    try {
      await studentService.delete(id)

      students.value = students.value.filter((s) => s.id !== id)
      if (currentStudent.value?.id === id) {
        currentStudent.value = null
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
    students.value = []
    currentStudent.value = null
    loading.value = false
    error.value = null
    pagination.value = null
  }

  return {
    students,
    currentStudent,
    loading,
    error,
    pagination,
    studentCount,
    getStudentById,
    fetchStudents,
    fetchStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    clearError,
    reset,
  }
})
