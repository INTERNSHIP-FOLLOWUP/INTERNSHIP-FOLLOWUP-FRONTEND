import api from '@/services/api'
import type {
  Company,
  CompanyListResponse,
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from '@/types/company'

interface BackendCompany {
  id: number
  company_name: string
  address: string | null
  industry: string | null
  contact_person: string | null
  phone: string | null
  email: string | null
  website: string | null
  company_profile_image: string | null
  telegram_link: string | null
  created_at: string
  updated_at: string
}

interface BackendListResponse {
  current_page: number
  data: BackendCompany[]
  per_page: number
  total: number
}

interface BackendUpdateResponse {
  company: BackendCompany
  message: string
}

function toFrontend(raw: BackendCompany): Company {
  return {
    id: raw.id,
    companyName: raw.company_name,
    address: raw.address,
    industry: raw.industry,
    contactPerson: raw.contact_person,
    phone: raw.phone,
    email: raw.email,
    website: raw.website,
    companyProfileImage: raw.company_profile_image,
    telegramLink: raw.telegram_link,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

function toBackend(payload: CreateCompanyPayload | UpdateCompanyPayload): Record<string, unknown> {
  return {
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
}

function computeMeta(
  current_page: number,
  per_page: number,
  total: number,
): CompanyListResponse['meta'] {
  const last_page = Math.max(1, Math.ceil(total / per_page))
  const from = total > 0 ? (current_page - 1) * per_page + 1 : null
  const to = total > 0 ? Math.min(current_page * per_page, total) : null
  return { current_page, last_page, per_page, total, from, to }
}

export const companyService = {
  async list(params?: {
    search?: string
    company_name?: string
    industry?: string
    per_page?: number
    page?: number
  }): Promise<CompanyListResponse> {
    const response = await api.get<BackendListResponse>('/admin/companies', { params })
    const body = response.data
    return {
      data: body.data.map(toFrontend),
      meta: computeMeta(body.current_page, body.per_page, body.total),
    }
  },

  async get(id: number): Promise<Company> {
    const response = await api.get<BackendCompany>(`/admin/companies/${id}`)
    return toFrontend(response.data)
  },

  async create(payload: CreateCompanyPayload): Promise<Company> {
    const response = await api.post<BackendCompany>('/admin/companies', toBackend(payload))
    return toFrontend(response.data)
  },

  async update(id: number, payload: UpdateCompanyPayload): Promise<Company> {
    const response = await api.put<BackendUpdateResponse>(
      `/admin/companies/${id}`,
      toBackend(payload),
    )
    return toFrontend(response.data.company)
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/admin/companies/${id}`)
  },
}
