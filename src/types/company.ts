export interface Company {
  id: number
  companyName: string
  address: string | null
  industry: string | null
  contactPerson: string | null
  phone: string | null
  email: string | null
  website: string | null
  companyProfileImage: string | null
  telegramLink: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateCompanyPayload {
  companyName: string
  address?: string | null
  industry?: string | null
  contactPerson?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
  companyProfileImage?: string | null
  telegramLink?: string | null
}

export type UpdateCompanyPayload = Partial<CreateCompanyPayload>

export interface CompanyPaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

export interface CompanyListResponse {
  data: Company[]
  meta: CompanyPaginationMeta
}
