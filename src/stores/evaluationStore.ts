import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/services/api'
import { parseApiError } from '@/utils/errorParser'

function getProp<T>(obj: unknown, key: string): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (obj as any)[key] as T
}

export interface StudentSummary {
    id: number
    name: string
    email?: string | null
}

export interface Evaluation {
    id: number
    student?: {
        id?: number
        name?: string
        email?: string | null
        university?: string | null
        internship_position?: string | null
    } | null
    student_id?: number
    technical_skill: number
    communication: number
    professionalism: number
    attendance: number
    overall_score: number
    feedback?: string | null
    created_at?: string | null
    evaluation_date?: string | null
}

export const useEvaluationStore = defineStore('evaluation', () => {
    // ── State ──
    const evaluations = ref<Evaluation[]>([])
    const evaluation = ref<Evaluation | null>(null)
    const students = ref<StudentSummary[]>([])
    const loading = ref(false)
    const errors = ref<Record<string, string>>({})

    const hasErrors = computed(() => Object.keys(errors.value).length > 0)

    function setErrors(newErrors: Record<string, string> | undefined | null) {
        errors.value = newErrors ?? {}
    }

    function clearErrors() {
        errors.value = {}
    }

    // ── Actions ──
    async function fetchStudents(): Promise<void> {
        loading.value = true
        clearErrors()

        try {
            const res = await api.get('/company/students')
            const payload = res.data

            const list = Array.isArray(payload)
                ? payload
                : Array.isArray(payload?.data)
                    ? payload.data
                    : []

            students.value = list.map((s: unknown) => {
                return {
                    id: Number(getProp<unknown>(s, 'id') ?? 0),
                    name: String(getProp<unknown>(s, 'name') ?? getProp<unknown>(s, 'student_name') ?? (getProp<unknown>(s, 'student') as { [key: string]: unknown } | null | undefined)?.['name'] ?? 'Student'),
                    email: getProp<unknown>(s, 'email') ?? (getProp<unknown>(s, 'student') as { [key: string]: unknown } | null | undefined)?.['email'] ?? null,
                }
            })
        } catch (err: unknown) {
            const parsed = parseApiError(err)
            setErrors(parsed.fields)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function fetchEvaluations(): Promise<void> {
        loading.value = true
        clearErrors()

        try {
            const res = await api.get('/company/evaluations')
            const payload = res.data

            const list = Array.isArray(payload)
                ? payload
                : Array.isArray(payload?.data)
                    ? payload.data
                    : []

            evaluations.value = list.map((e: unknown) => {
                return {
                    ...(e as Record<string, unknown>),
                    id: Number(getProp<unknown>(e, 'id') ?? 0),
                    technical_skill: Number(getProp<unknown>(e, 'technical_skill') ?? 0),
                    communication: Number(getProp<unknown>(e, 'communication') ?? 0),
                    professionalism: Number(getProp<unknown>(e, 'professionalism') ?? 0),
                    attendance: Number(getProp<unknown>(e, 'attendance') ?? 0),
                    overall_score: Number(getProp<unknown>(e, 'overall_score') ?? 0),
                }
            })
        } catch (err: unknown) {
            const parsed = parseApiError(err)
            setErrors(parsed.fields)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function fetchEvaluation(id: number): Promise<void> {
        loading.value = true
        clearErrors()

        try {
            const res = await api.get(`/company/evaluations/${id}`)
            const raw = res.data?.evaluation ?? res.data ?? null
            if (!raw) {
                evaluation.value = null
                return
            }

            evaluation.value = {
                ...raw,
                id: Number(raw?.id ?? id),
                technical_skill: Number(raw?.technical_skill ?? 0),
                communication: Number(raw?.communication ?? 0),
                professionalism: Number(raw?.professionalism ?? 0),
                attendance: Number(raw?.attendance ?? 0),
                overall_score: Number(raw?.overall_score ?? 0),
            }
        } catch (err: unknown) {
            const parsed = parseApiError(err)
            setErrors(parsed.fields)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function createEvaluation(data: {
        student_id: number
        technical_skill: number
        communication: number
        professionalism: number
        attendance: number
        overall_score: number
        feedback?: string | null
    }): Promise<Evaluation> {
        loading.value = true
        clearErrors()

        try {
            const res = await api.post('/company/evaluations', data)
            const raw = res.data?.evaluation ?? res.data
            const created: Evaluation = {
                ...raw,
                id: Number(raw?.id ?? 0),
                technical_skill: Number(raw?.technical_skill ?? data.technical_skill),
                communication: Number(raw?.communication ?? data.communication),
                professionalism: Number(
                    raw?.professionalism ?? data.professionalism,
                ),
                attendance: Number(raw?.attendance ?? data.attendance),
                overall_score: Number(raw?.overall_score ?? data.overall_score),
                feedback: raw?.feedback ?? data.feedback ?? null,
            }

            // optimistic: keep list updated
            evaluations.value = [created, ...evaluations.value]
            return created
        } catch (err: unknown) {
            const parsed = parseApiError(err)
            setErrors(parsed.fields)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function updateEvaluation(
        id: number,
        data: {
            technical_skill: number
            communication: number
            professionalism: number
            attendance: number
            overall_score: number
            feedback?: string | null
        },
    ): Promise<Evaluation> {
        loading.value = true
        clearErrors()

        try {
            const res = await api.put(`/company/evaluations/${id}`, data)
            const raw = res.data?.evaluation ?? res.data
            const updated: Evaluation = {
                ...raw,
                id,
                technical_skill: Number(raw?.technical_skill ?? data.technical_skill),
                communication: Number(raw?.communication ?? data.communication),
                professionalism: Number(
                    raw?.professionalism ?? data.professionalism,
                ),
                attendance: Number(raw?.attendance ?? data.attendance),
                overall_score: Number(raw?.overall_score ?? data.overall_score),
                feedback: raw?.feedback ?? data.feedback ?? null,
            }

            evaluations.value = evaluations.value.map((e) => (e.id === id ? updated : e))
            if (evaluation.value?.id === id) evaluation.value = updated
            return updated
        } catch (err: unknown) {
            const parsed = parseApiError(err)
            setErrors(parsed.fields)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function deleteEvaluation(id: number): Promise<void> {
        loading.value = true
        clearErrors()

        try {
            await api.delete(`/company/evaluations/${id}`)
            evaluations.value = evaluations.value.filter((e) => e.id !== id)
            if (evaluation.value?.id === id) evaluation.value = null
        } catch (err: unknown) {
            const parsed = parseApiError(err)
            setErrors(parsed.fields)
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        evaluations,
        evaluation,
        students,
        loading,
        errors,
        hasErrors,
        fetchStudents,
        fetchEvaluations,
        fetchEvaluation,
        createEvaluation,
        updateEvaluation,
        deleteEvaluation,
        setErrors,
        clearErrors,
    }
})

