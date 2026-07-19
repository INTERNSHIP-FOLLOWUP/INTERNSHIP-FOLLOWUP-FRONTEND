export interface Company {
  id: number
  companyName: string
  role: string | null
  address: string | null
  industry: string | null
  contactPerson: string | null
  phone: string | null
  email: string | null
  website: string | null
  companyProfileImage: string | null
  companyProfileImageUrl: string | null
  companyImage: string | null
  companyImageUrl: string | null
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
  password?: string | null
  role?: string | null
  website?: string | null
  companyProfileImage?: File | string | null
  companyImage?: File | string | null
  avatar?: File | string | null
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

export interface CompanyStudentItem {
  id: number
  name: string
  email?: string
  student_name?: string
  student_email?: string
  batch?: string
  program?: string
  status?: string
  assignedDate?: string
  created_at?: string
}

export interface CompanyEvaluationItem {
  id: number
  student_id: number
  rating: number
  remarks?: string
  created_at?: string
}

export interface CompanyFeedbackItem {
  id: number
  message: string
  status?: string | null
  created_at?: string
}

export interface CompanyEvaluationPayload {
  studentId: number
  rating: number
  remarks?: string | null
}

export interface CompanyFeedbackPayload {
  message: string
  status?: string | null
}
