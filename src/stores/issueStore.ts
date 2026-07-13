import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/services/api'
import { parseApiError } from '@/utils/errorParser'
import type { UserRole } from '@/types/auth'
import { useAuthStore } from '@/stores/auth'

export type IssuePriority = 'Low' | 'Medium' | 'High'
export type IssueStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed'

export interface StudentSummary {
  id: number
  name: string
}

export interface IssueActivity {
  id?: number
  type?: string
  action?: string
  field?: string
  from?: unknown
  to?: unknown
  actor?: { id?: number; name?: string } | null
  created_at?: string | null
  createdAt?: string | null
  timestamp?: string | null
}

export interface Issue {
  id: number
  title: string
  description: string
  priority: IssuePriority
  status: IssueStatus
  student?: StudentSummary | null
  student_id?: number | null
  created_at?: string | null
  updated_at?: string | null
  created_by?: { id?: number; name?: string } | null
  createdBy?: { id?: number; name?: string } | null
  activities?: IssueActivity[]
  timeline?: IssueActivity[]
}

export const useIssueStore = defineStore('issue', () => {
  const auth = useAuthStore()

  // ── State ──
  const issues = ref<Issue[]>([])
  const issue = ref<Issue | null>(null)
  const students = ref<StudentSummary[]>([])
  const loading = ref(false)
  const errors = ref<Record<string, string>>({})

  // ── Getters ──
  const hasErrors = computed(() => Object.keys(errors.value).length > 0)

  function setErrors(newErrors: Record<string, string> | undefined | null) {
    errors.value = newErrors ?? {}
  }

  function clearErrors() {
    errors.value = {}
  }

  function currentRole(): UserRole | null {
    return auth.userRole as UserRole | null
  }

  // Map local UI role to backend-friendly parameter keys (best guess)
  function buildRoleFilterParams(): Record<string, unknown> {
    const role = currentRole()
    if (!role) return {}

    // Preferred: backend supports role-based scoping. If it doesn’t,
    // we still include params to help later backend integration.
    // Admin: no filter
    if (role === 'admin') return {}

    // Student: filter by current user as student
    if (role === 'student') {
      return { student_id: auth.user?.id }
    }

    // Company: filter by students related to company
    if (role === 'company representative') {
      return { company_scoped: true }
    }

    // Teacher/Tutor: filter by assigned students
    if (role === 'tutor') {
      return { tutor_scoped: true }
    }

    return {}
  }

  // ── Actions ──
  async function fetchIssues(params?: {
    search?: string
    status?: string
    priority?: string
    page?: number
    per_page?: number
  }): Promise<void> {
    loading.value = true
    clearErrors()

    try {
      const roleParams = buildRoleFilterParams()
      const res = await api.get('/issues', {
        params: {
          ...params,
          ...roleParams,
        },
      })

      const payload = res.data

      // Try to normalize common list response formats
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : []

      issues.value = list.map((raw: unknown) => {
        const record = raw as Record<string, unknown>
        const studentRaw = (record['student'] ?? record['assigned_student']) as Record<string, unknown> | null
        const createdByRaw = (record['created_by'] ?? record['createdBy']) as Record<string, unknown> | null
        return {
          ...(record as Record<string, unknown>),
          id: Number((record as Record<string, unknown>)['id'] ?? 0),
          title: String((record as Record<string, unknown>)['title'] ?? ''),
          description: String((record as Record<string, unknown>)['description'] ?? ''),
          priority: ((record as Record<string, unknown>)['priority'] ?? 'Low') as IssuePriority,
          status: ((record as Record<string, unknown>)['status'] ?? 'Open') as IssueStatus,
          student: studentRaw
            ? {
                id: Number(studentRaw['id'] ?? (record as Record<string, unknown>)['student_id'] ?? 0),
                name: String(studentRaw['name'] ?? studentRaw['full_name'] ?? 'Student'),
              }
            : Number((record as Record<string, unknown>)['student_id'])
              ? { id: Number((record as Record<string, unknown>)['student_id']), name: 'Student' }
              : null,
          student_id: Number((record as Record<string, unknown>)['student_id'] ?? (record as Record<string, unknown>)['studentId'] ?? null),
          created_by: createdByRaw
            ? {
                id: Number(createdByRaw['id'] ?? 0),
                name: String(createdByRaw['name'] ?? 'User'),
              }
            : null,
          createdAt: (record as Record<string, unknown>)['created_at'],
          created_at: (record as Record<string, unknown>)['created_at'] ?? (record as Record<string, unknown>)['createdAt'],
          updated_at: (record as Record<string, unknown>)['updated_at'] ?? (record as Record<string, unknown>)['updatedAt'],
          activities: Array.isArray((record as Record<string, unknown>)['activities'])
            ? (record as Record<string, unknown>)['activities'] as unknown[]
            : Array.isArray((record as Record<string, unknown>)['timeline'])
              ? (record as Record<string, unknown>)['timeline'] as unknown[]
              : [],
        } as Issue
      })
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      setErrors(parsed.fields)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchIssue(id: number): Promise<void> {
    loading.value = true
    clearErrors()

    try {
      const res = await api.get(`/issues/${id}`)
      const raw = res.data?.issue ?? res.data

      if (!raw) {
        issue.value = null
        return
      }

      const studentRaw = raw?.student ?? raw?.assigned_student ?? null
      const createdByRaw = raw?.created_by ?? raw?.createdBy ?? null

      issue.value = {
        ...raw,
        id: Number(raw?.id ?? id),
        title: String(raw?.title ?? ''),
        description: String(raw?.description ?? ''),
        priority: (raw?.priority ?? 'Low') as IssuePriority,
        status: (raw?.status ?? 'Open') as IssueStatus,
        student: studentRaw
          ? {
              id: Number(studentRaw?.id ?? raw?.student_id ?? 0),
              name: String(studentRaw?.name ?? studentRaw?.full_name ?? 'Student'),
            }
          : raw?.student_id
            ? { id: Number(raw.student_id), name: 'Student' }
            : null,
        student_id: raw?.student_id ?? raw?.studentId ?? null,
        created_by: createdByRaw
          ? {
              id: Number(createdByRaw?.id ?? 0),
              name: String(createdByRaw?.name ?? 'User'),
            }
          : null,
        created_at: raw?.created_at ?? raw?.createdAt,
        updated_at: raw?.updated_at ?? raw?.updatedAt,
        activities: Array.isArray(raw?.activities)
          ? raw.activities
          : Array.isArray(raw?.timeline)
            ? raw.timeline
            : [],
      } as Issue
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      setErrors(parsed.fields)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createIssue(data: {
    title: string
    description: string
    priority: IssuePriority
    status: IssueStatus
    student_id: number
  }): Promise<Issue> {
    loading.value = true
    clearErrors()

    try {
      const res = await api.post('/issues', data)
      const raw = res.data?.issue ?? res.data

      const created: Issue = {
        ...raw,
        id: Number(raw?.id ?? 0),
        title: String(raw?.title ?? data.title),
        description: String(raw?.description ?? data.description),
        priority: (raw?.priority ?? data.priority) as IssuePriority,
        status: (raw?.status ?? data.status) as IssueStatus,
      }

      // optimistic prepend
      issues.value = [created, ...issues.value]
      return created
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      setErrors(parsed.fields)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateIssue(id: number, data: {
    title: string
    description: string
    priority: IssuePriority
    status: IssueStatus
    student_id: number
  }): Promise<Issue> {
    loading.value = true
    clearErrors()

    try {
      const res = await api.put(`/issues/${id}`, data)
      const raw = res.data?.issue ?? res.data

      const updated: Issue = {
        ...raw,
        id,
        title: String(raw?.title ?? data.title),
        description: String(raw?.description ?? data.description),
        priority: (raw?.priority ?? data.priority) as IssuePriority,
        status: (raw?.status ?? data.status) as IssueStatus,
      }

      issues.value = issues.value.map((i) => (i.id === id ? updated : i))
      if (issue.value?.id === id) issue.value = updated
      return updated
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      setErrors(parsed.fields)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteIssue(id: number): Promise<void> {
    loading.value = true
    clearErrors()

    try {
      await api.delete(`/issues/${id}`)
      issues.value = issues.value.filter((i) => i.id !== id)
      if (issue.value?.id === id) issue.value = null
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      setErrors(parsed.fields)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchStudents(): Promise<void> {
    loading.value = true
    clearErrors()

    try {
      const res = await api.get('/students')
      const payload = res.data

      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : []

      students.value = list.map((s: unknown) => ({
        id: Number((s as Record<string, unknown>).id ?? 0),
        name: String((s as Record<string, unknown>).name ?? (s as Record<string, unknown>).full_name ?? (s as Record<string, unknown>).student_name ?? 'Student'),
      }))
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      setErrors(parsed.fields)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    issues,
    issue,
    students,
    loading,
    errors,
    hasErrors,
    fetchIssues,
    fetchIssue,
    createIssue,
    updateIssue,
    deleteIssue,
    fetchStudents,
    setErrors,
    clearErrors,
  }
})

