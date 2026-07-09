import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/services/api'

export type CompanyRepresentativeViewTab =
  | 'internships'
  | 'evaluations'
  | 'students'
  | 'worklogs'
  | 'followups'
  | 'issues'
  | 'profile'

export interface CompanySummary {
  id: number
  name: string
  email?: string
  location?: string
}

export type CompanyCreatePayload = {
  name: string
  email?: string
  location?: string
}

export type CompanyUpdatePayload = Partial<CompanyCreatePayload>

type CompanyApiResponse<T> = T | { data: T }

const ENDPOINT = '/companies'

function toCompanySummary(raw: any): CompanySummary {
  return {
    id: Number(raw?.id),
    name: String(raw?.name ?? raw?.companyName ?? ''),
    email: raw?.email ?? raw?.companyEmail,
    location: raw?.location ?? raw?.locationText,
  }
}

export const useCompanyStore = defineStore('company', () => {
  // State
  const companies = ref<CompanySummary[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Current selected company (for potential details screens)
  const currentCompanyId = ref<number | null>(null)

  // Getters
  const currentCompany = computed(() => {
    if (currentCompanyId.value == null) return null
    return companies.value.find((c) => c.id === currentCompanyId.value) ?? null
  })

  async function withLoading<T>(fn: () => Promise<T>): Promise<T> {
    loading.value = true
    error.value = null
    try {
      return await fn()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to perform company action'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Actions
  async function fetchCompanies(): Promise<void> {
    const res = await withLoading(() => api.get(ENDPOINT))
    const payload = (res.data as CompanyApiResponse<any[]>)

    const list = Array.isArray(payload)
      ? payload
      : Array.isArray((payload as any)?.data)
        ? (payload as any).data
        : []

    companies.value = list.map(toCompanySummary).filter((c) => Number.isFinite(c.id))
  }

  async function fetchCompanyById(id: number): Promise<void> {
    currentCompanyId.value = id

    // If already present in list, avoid extra request.
    if (companies.value.some((c) => c.id === id)) return

    const res = await withLoading(() => api.get(`${ENDPOINT}/${id}`))
    const payload = (res.data as CompanyApiResponse<any>)
    const raw = Array.isArray(payload) ? payload[0] : ('data' in payload ? (payload as any).data : payload)

    const company = toCompanySummary(raw)
    if (Number.isFinite(company.id)) {
      companies.value = [...companies.value, company]
    }
  }

  async function createCompany(payload: CompanyCreatePayload): Promise<CompanySummary> {
    const res = await withLoading(() => api.post(ENDPOINT, payload))
    const data = res.data as CompanyApiResponse<any>
    const raw = 'data' in (data as any) ? (data as any).data : data

    const created = toCompanySummary(raw)

    companies.value = [created, ...companies.value]
    currentCompanyId.value = created.id

    return created
  }

  async function updateCompany(id: number, payload: CompanyUpdatePayload): Promise<CompanySummary> {
    const res = await withLoading(() => api.put(`${ENDPOINT}/${id}`, payload))
    const data = res.data as CompanyApiResponse<any>
    const raw = 'data' in (data as any) ? (data as any).data : data

    const updated = toCompanySummary(raw)

    companies.value = companies.value.map((c: CompanySummary) => (c.id === id ? { ...c, ...updated, id } : c))

    currentCompanyId.value = updated.id

    return updated
  }

  async function deleteCompany(id: number): Promise<void> {
    await withLoading(() => api.delete(`${ENDPOINT}/${id}`))
    companies.value = companies.value.filter((c) => c.id !== id)
    if (currentCompanyId.value === id) currentCompanyId.value = null
  }

  // Optional: reset store
  function reset(): void {
    companies.value = []
    currentCompanyId.value = null
    error.value = null
    loading.value = false
  }

  return {
    companies,
    loading,
    error,
    currentCompanyId,
    currentCompany,
    fetchCompanies,
    fetchCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
    reset,
  }
})


