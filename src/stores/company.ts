import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/services/api'

export interface CompanySummary {
  id: number
  name: string
  email?: string | null
  location?: string | null
}

export interface CompanyCreatePayload {
  name: string
  email?: string | null
  location?: string | null
  industry?: string | null
  contactPerson?: string | null
  phone?: string | null
  website?: string | null
}


export interface CompanyFormData {
  companyName: string
  companyEmail: string
  location: string
  industry: string
  contactPerson: string
  contactPhone: string
  website: string
}


export type CompanyUpdatePayload = Partial<CompanyCreatePayload>

const ENDPOINT = '/companies'

function unwrapCompanyList(data: any): any[] {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (typeof data === 'object') {
    if (Array.isArray(data.data)) return data.data
    if (data.data && typeof data.data === 'object' && Array.isArray(data.data.data)) return data.data.data
    if (Array.isArray(data.results)) return data.results
  }
  return []
}

function unwrapOne(data: any): any {
  if (!data) return data
  if (Array.isArray(data)) return data[0]
  if (typeof data === 'object') {
    if (data.company) return data.company
    if (Array.isArray(data.data)) return data.data[0]
    if (data.data && typeof data.data === 'object') {
      if (Array.isArray(data.data.data)) return data.data.data[0]
      return data.data
    }
    if (Array.isArray(data.results)) return data.results[0]
  }
  return data
}

function toSummary(raw: any): CompanySummary {
  return {
    id: Number(raw?.id ?? raw?.companyId ?? raw?.pk),
    name: String(raw?.name ?? raw?.companyName ?? raw?.company_name ?? ''),
    email: raw?.email ?? raw?.companyEmail ?? raw?.company_email ?? null,
    location: raw?.location ?? raw?.locationText ?? raw?.location_text ?? raw?.address ?? raw?.company_address ?? null,
  }
}

function mapToApi(payload: CompanyCreatePayload | CompanyUpdatePayload) {
  // Backend mapping (match your DB spec)
  return {
    company_name: payload.name,
    email: payload.email ?? null,
    address: payload.location ?? null,
    industry: (payload as any).industry ?? null,
    contact_person: (payload as any).contactPerson ?? null,
    phone: (payload as any).phone ?? null,
    website: (payload as any).website ?? null,
  }
}



function mapFromForm(form: CompanyFormData): CompanyCreatePayload {
  return {
    name: form.companyName,
    email: form.companyEmail || null,
    location: form.location || null,
    industry: (form as any).industry ?? null,
    contactPerson: (form as any).contactPerson ?? null,
    phone: form.contactPhone || null,
    website: form.website || null,
  }
}


export const useCompanyStore = defineStore('company', () => {
  const companies = ref<CompanySummary[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentCompanyId = ref<number | null>(null)

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

  async function fetchCompanies(): Promise<void> {
    const res = (await withLoading(() => api.get(ENDPOINT))) as { data: any }
    const payload = res.data
    const list = unwrapCompanyList(payload)
    companies.value = list
      .map(toSummary)
      .filter((c) => Number.isFinite(c.id))
  }

  async function fetchCompanyById(id: number): Promise<void> {
    currentCompanyId.value = id
    if (companies.value.some((c) => c.id === id)) return

    const res = (await withLoading(() => api.get(`${ENDPOINT}/${id}`))) as { data: any }
    const raw = unwrapOne((res.data as any) ?? null)
    const company = toSummary(raw)

    if (Number.isFinite(company.id)) {
      companies.value = [...companies.value, company]
    }
  }

  async function createCompany(payload: CompanyCreatePayload): Promise<CompanySummary> {
    const res = (await withLoading(() => api.post(ENDPOINT, mapToApi(payload)))) as { data: any }
    const raw = unwrapOne((res.data as any) ?? null)
    const created = toSummary(raw)

    companies.value = [created, ...companies.value]
    currentCompanyId.value = created.id

    return created
  }

  async function updateCompany(id: number, payload: CompanyUpdatePayload): Promise<CompanySummary> {
    const res = (await withLoading(() => api.put(`${ENDPOINT}/${id}`, mapToApi(payload)))) as { data: any }
    const raw = unwrapOne((res.data as any) ?? null)
    const updated = toSummary(raw)

    companies.value = companies.value.map((c) => (c.id === id ? { ...c, ...updated, id } : c))
    currentCompanyId.value = updated.id

    return updated
  }

  async function deleteCompany(id: number): Promise<void> {
    await withLoading(() => api.delete(`${ENDPOINT}/${id}`))
    companies.value = companies.value.filter((c) => c.id !== id)
    if (currentCompanyId.value === id) currentCompanyId.value = null
  }

  async function fetchProfile(): Promise<void> {
    const res = (await withLoading(() => api.get('/company/profile'))) as { data: any }
    const raw = unwrapOne((res.data as any) ?? null)
    const summary = toSummary(raw)

    if (summary?.id) {
      companies.value = [summary, ...companies.value.filter((c) => c.id !== summary.id)]
      currentCompanyId.value = summary.id
    }
  }

  async function updateProfile(payload: CompanyUpdatePayload): Promise<void> {
    const res = (await withLoading(() => api.put('/company/profile', mapToApi(payload)))) as { data: any }
    const raw = unwrapOne((res.data as any) ?? null)
    const updated = toSummary(raw)

    if (updated?.id) {
      companies.value = companies.value.map((c) => (c.id === updated.id ? { ...c, ...updated, id: updated.id } : c))
      currentCompanyId.value = updated.id
    }
  }

  async function fetchStudents(): Promise<any[]> {
    const res = (await withLoading(() => api.get('/company/students'))) as { data: any }
    const payload = res.data
    return Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : []
  }

  async function fetchEvaluations(): Promise<any[]> {
    const res = (await withLoading(() => api.get('/company/evaluations'))) as { data: any }
    const payload = res.data
    return Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : []
  }

  async function submitEvaluation(payload: { studentId: number; rating: number; remarks?: string | null }): Promise<any> {
    const res = (await withLoading(() => api.post('/company/evaluations', payload))) as { data: any }
    return unwrapOne((res.data as any) ?? null)
  }

  async function fetchFeedback(): Promise<any[]> {
    const res = (await withLoading(() => api.get('/company/feedback'))) as { data: any }
    const payload = res.data
    return Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : []
  }

  async function submitFeedback(payload: { message: string; status?: string | null }): Promise<any> {
    const res = (await withLoading(() => api.post('/company/feedback', payload))) as { data: any }
    return unwrapOne((res.data as any) ?? null)
  }

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
    mapFromForm,
    fetchProfile,
    updateProfile,
    fetchStudents,
    fetchEvaluations,
    submitEvaluation,
    fetchFeedback,
    submitFeedback,
  }
})
