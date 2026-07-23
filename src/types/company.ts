export interface Company {
  id: number
  companyName: string
  role?: string | null
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
  position?: string
  start_date?: string
  end_date?: string
  tutor_name?: string
}

export interface CompanyEvaluationItem {
  id: number
  student_id: number
  company_id: number
  technical_skill: number
  communication: number
  professionalism: number
  attendance: number
  overall_score: number
  feedback?: string | null
  created_at?: string
  updated_at?: string
  student?: {
    id: number
    name: string
    email?: string
  }
}

export interface CompanyFeedbackItem {
  id: number
  company_id: number
  student_id?: number
  title?: string | null
  message: string
  strengths?: string[]
  improvement_areas?: string[]
  created_at?: string
  updated_at?: string
  student?: {
    id: number
    name: string
    email?: string
    student_code?: string
    photo_url?: string | null
    photo?: string | null
  }
}

export interface CompanyEvaluationPayload {
  student_id: number
  technical_skill: number
  communication: number
  professionalism: number
  attendance: number
  feedback?: string | null
}

export interface CompanyFeedbackPayload {
  student_id: number
  message: string
  strengths: string[]
  improvement_areas: string[]
}
