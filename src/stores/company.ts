import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/services/api'
import { companyService } from '@/services/company'
import { parseApiError } from '@/utils/errorParser'
import type {
  Company,
  CreateCompanyPayload,
  CompanyPaginationMeta,
  CompanyListResponse,
} from '@/types/company'

export interface CompanySummary {
  id: number
  name: string
  email: string | null
  location: string | null
  industry: string | null
  contactPerson: string | null
  phone: string | null
  website: string | null
  companyProfileImage: string | null
  telegramLink: string | null
}

export type CompanyUpdatePayload = Partial<CreateCompanyPayload>

export interface CompanyFormData {
  companyName: string
  companyEmail: string
  location: string
  industry: string
  contactPerson: string
  contactPhone: string
  website: string
  companyProfileImage: string
  telegramLink: string
}

function toSummary(c: Company): CompanySummary {
  return {
    id: c.id,
    name: c.companyName,
    email: c.email,
    location: c.address,
    industry: c.industry,
    contactPerson: c.contactPerson,
    phone: c.phone,
    website: c.website,
    companyProfileImage: c.companyProfileImage,
    telegramLink: c.telegramLink,
  }
}

function mapFromForm(form: CompanyFormData): CreateCompanyPayload {
  return {
    companyName: form.companyName,
    email: form.companyEmail || null,
    address: form.location || null,
    industry: form.industry || null,
    contactPerson: form.contactPerson || null,
    phone: form.contactPhone || null,
    website: form.website || null,
    companyProfileImage: form.companyProfileImage || null,
    telegramLink: form.telegramLink || null,
  }
}

export const useCompanyStore = defineStore('company', () => {
  const companies = ref<CompanySummary[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentCompanyId = ref<number | null>(null)
  const pagination = ref<CompanyPaginationMeta | null>(null)

  const currentCompany = computed(() => {
    if (currentCompanyId.value == null) return null
    return companies.value.find((c) => c.id === currentCompanyId.value) ?? null
  })

  const companyCount = computed(() => pagination.value?.total ?? companies.value.length)

  async function fetchCompanies(params?: {
    search?: string
    company_name?: string
    industry?: string
    per_page?: number
    page?: number
  }): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response: CompanyListResponse = await companyService.list(params)
      companies.value = response.data.map(toSummary)
      pagination.value = response.meta
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCompanyById(id: number): Promise<void> {
    currentCompanyId.value = id
    if (companies.value.some((c) => c.id === id)) return

    loading.value = true
    error.value = null

    try {
      const company: Company = await companyService.get(id)
      const summary = toSummary(company)
      companies.value = [...companies.value, summary]
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createCompany(payload: CreateCompanyPayload): Promise<CompanySummary> {
    loading.value = true
    error.value = null

    try {
      const created: Company = await companyService.create(payload)
      const summary = toSummary(created)
      companies.value = [summary, ...companies.value]
      currentCompanyId.value = summary.id
      pagination.value = pagination.value
        ? { ...pagination.value, total: pagination.value.total + 1 }
        : null
      return summary
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateCompany(id: number, payload: CompanyUpdatePayload): Promise<CompanySummary> {
    loading.value = true
    error.value = null

    try {
      const updated: Company = await companyService.update(id, payload)
      const summary = toSummary(updated)
      companies.value = companies.value.map((c) => (c.id === id ? { ...c, ...summary, id } : c))
      currentCompanyId.value = summary.id
      return summary
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteCompany(id: number): Promise<void> {
    loading.value = true
    error.value = null

    try {
      await companyService.delete(id)
      companies.value = companies.value.filter((c) => c.id !== id)
      if (currentCompanyId.value === id) currentCompanyId.value = null
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

  async function fetchProfile(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const res = await api.get('/company/profile')
      const raw = res.data?.company ?? res.data?.data ?? res.data
      if (raw?.id) {
        const summary = toSummary({
          id: raw.id,
          companyName: raw.company_name ?? raw.name ?? '',
          address: raw.address ?? null,
          industry: raw.industry ?? null,
          contactPerson: raw.contact_person ?? raw.contactPerson ?? null,
          phone: raw.phone ?? null,
          email: raw.email ?? null,
          website: raw.website ?? null,
          companyProfileImage: raw.company_profile_image ?? null,
          telegramLink: raw.telegram_link ?? null,
          createdAt: raw.created_at ?? '',
          updatedAt: raw.updated_at ?? '',
        })
        companies.value = [summary, ...companies.value.filter((c) => c.id !== summary.id)]
        currentCompanyId.value = summary.id
      }
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(payload: CompanyUpdatePayload): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const body: Record<string, unknown> = {
        company_name: payload.companyName,
        address: payload.address ?? null,
        industry: payload.industry ?? null,
        contact_person: payload.contactPerson ?? null,
        phone: payload.phone ?? null,
        email: payload.email ?? null,
        website: payload.website ?? null,
        company_profile_image: payload.companyProfileImage ?? null,
        telegram_link: payload.telegramLink ?? null,
      }
      const res = await api.put('/company/profile', body)
      const raw = res.data?.company ?? res.data?.data ?? res.data
      if (raw?.id) {
        const summary = toSummary({
          id: raw.id,
          companyName: raw.company_name ?? raw.name ?? '',
          address: raw.address ?? null,
          industry: raw.industry ?? null,
          contactPerson: raw.contact_person ?? raw.contactPerson ?? null,
          phone: raw.phone ?? null,
          email: raw.email ?? null,
          website: raw.website ?? null,
          companyProfileImage: raw.company_profile_image ?? null,
          telegramLink: raw.telegram_link ?? null,
          createdAt: raw.created_at ?? '',
          updatedAt: raw.updated_at ?? '',
        })
        companies.value = companies.value.map((c) =>
          c.id === summary.id ? { ...c, ...summary, id: summary.id } : c,
        )
        currentCompanyId.value = summary.id
      }
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchStudents(): Promise<unknown[]> {
    try {
      const res = await api.get('/company/students')
      const payload = res.data
      return Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : []
    } catch {
      return []
    }
  }

  async function fetchEvaluations(): Promise<unknown[]> {
    try {
      const res = await api.get('/company/evaluations')
      const payload = res.data
      return Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : []
    } catch {
      return []
    }
  }

  async function submitEvaluation(payload: {
    studentId: number
    rating: number
    remarks?: string | null
  }): Promise<unknown> {
    const res = await api.post('/company/evaluations', payload)
    return res.data
  }

  async function fetchFeedback(): Promise<unknown[]> {
    try {
      const res = await api.get('/company/feedback')
      const payload = res.data
      return Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : []
    } catch {
      return []
    }
  }

  async function submitFeedback(payload: {
    message: string
    status?: string | null
  }): Promise<unknown> {
    const res = await api.post('/company/feedback', payload)
    return res.data
  }

  function clearError(): void {
    error.value = null
  }

  function reset(): void {
    companies.value = []
    currentCompanyId.value = null
    loading.value = false
    error.value = null
    pagination.value = null
  }

  return {
    companies,
    loading,
    error,
    currentCompanyId,
    currentCompany,
    pagination,
    companyCount,
    fetchCompanies,
    fetchCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
    clearError,
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
