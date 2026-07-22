import api from '@/services/api'
import type {
  Company,
  CompanyListResponse,
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from '@/types/company'
import { normalizeImageUrl } from '@/utils/normalizeImageUrl'

interface BackendCompany {
  id: number
  company_name: string
  role: string | null
  address: string | null
  industry: string | null
  contact_person: string | null
  phone: string | null
  email: string | null
  website: string | null
  company_profile_image: string | null
  company_profile_image_url: string | null
  company_image: string | null
  company_image_url: string | null
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
    role: raw.role,
    address: raw.address,
    industry: raw.industry,
    contactPerson: raw.contact_person,
    phone: raw.phone,
    email: raw.email,
    website: raw.website,
    companyProfileImage: normalizeImageUrl(raw.company_profile_image),
    companyProfileImageUrl: normalizeImageUrl(raw.company_profile_image_url),
    companyImage: normalizeImageUrl(raw.company_image),
    companyImageUrl: normalizeImageUrl(raw.company_image_url),
    telegramLink: raw.telegram_link,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

/**
 * Check if the payload contains any File uploads.
 */
function hasFileUpload(
  payload: CreateCompanyPayload | UpdateCompanyPayload,
): boolean {
  return payload.companyImage instanceof File || payload.companyProfileImage instanceof File
}

/**
 * Convert payload to FormData when a file is present.
 */
function toFormData(
  payload: CreateCompanyPayload | UpdateCompanyPayload,
): FormData {
  const fd = new FormData()

  appendIfSet(fd, 'company_name', payload.companyName)
  appendIfSet(fd, 'role', payload.role)
  appendIfSet(fd, 'address', payload.address)
  appendIfSet(fd, 'industry', payload.industry)
  appendIfSet(fd, 'contact_person', payload.contactPerson)
  appendIfSet(fd, 'phone', payload.phone)
  appendIfSet(fd, 'email', payload.email)
  appendIfSet(fd, 'website', payload.website)
  appendIfSet(fd, 'telegram_link', payload.telegramLink)

  if (payload.password) {
    fd.append('password', payload.password)
  }

  if (payload.companyImage instanceof File) {
    fd.append('company_image', payload.companyImage)
  } else if (payload.companyImage && typeof payload.companyImage === 'string') {
    fd.append('company_image', payload.companyImage)
  }

  if (payload.companyProfileImage instanceof File) {
    fd.append('company_profile_image', payload.companyProfileImage)
  } else if (payload.companyProfileImage && typeof payload.companyProfileImage === 'string') {
    fd.append('company_profile_image', payload.companyProfileImage)
  }

  return fd
}

function appendIfSet(fd: FormData, key: string, value: unknown) {
  if (value !== undefined && value !== null) {
    fd.append(key, String(value))
  }
}

function toBackend(payload: CreateCompanyPayload | UpdateCompanyPayload): Record<string, unknown> | FormData {
  // If a file is included, use FormData for multipart upload
  if (hasFileUpload(payload)) {
    return toFormData(payload)
  }

  const body: Record<string, unknown> = {
    company_name: payload.companyName,
    role: payload.role ?? null,
    address: payload.address ?? null,
    industry: payload.industry ?? null,
    contact_person: payload.contactPerson ?? null,
    phone: payload.phone ?? null,
    email: payload.email ?? null,
    website: payload.website ?? null,
    telegram_link: payload.telegramLink ?? null,
    ...(payload.password ? { password: payload.password } : {}),
  }

  // Only include image fields if they are actually set and non-null (to avoid overwriting existing values)
  if (payload.companyImage != null) {
    body.company_image = payload.companyImage
  }
  if (payload.companyProfileImage != null) {
    body.company_profile_image = payload.companyProfileImage
  }

  return body
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

/** Detect whether body is FormData (file upload) or a plain object */
function getPostConfig(body: unknown) {
  if (body instanceof FormData) {
    return {
      data: body,
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  }
  return { data: body }
}

/** Detect whether body is FormData for PUT requests (Laravel needs _method trick) */
function getPutConfig(body: unknown, id: number) {
  if (body instanceof FormData) {
    // Laravel requires _method=PUT + POST when using FormData
    body.append('_method', 'PUT')
    return {
      data: body,
      url: `/admin/companies/${id}`,
      method: 'post' as const,
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  }
  return {
    data: body,
    url: `/admin/companies/${id}`,
    method: 'put' as const,
  }
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
    const body = toBackend(payload)
    const { data, headers } = getPostConfig(body)
    const response = await api.post<{ company: BackendCompany }>(
      '/admin/companies',
      data,
      headers ? { headers } : undefined,
    )
    return toFrontend(response.data.company)
  },

  async update(id: number, payload: UpdateCompanyPayload): Promise<Company> {
    const body = toBackend(payload)

    // Per API docs: omit email on update unless actually changing it.
    const email = (payload as Record<string, unknown>).email
    if (!email && !(body instanceof FormData)) {
      delete (body as Record<string, unknown>).email
    }

    const { url, method, data, headers } = getPutConfig(body, id)
    const response = await api.request<BackendUpdateResponse>({
      url,
      method,
      data,
      ...(headers ? { headers } : {}),
    })
    return toFrontend(response.data.company)
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/admin/companies/${id}`)
  },
}
