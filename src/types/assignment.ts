export type AssignmentStatus = 'Assigned' | 'In Progress' | 'Completed' | 'Terminated'

export interface Assignment {
  id: number
  student_id: number
  company_supervisors_id: number
  company_supervisor_id?: number
  company_id?: number
  tutor_id: number
  student_name: string
  company_name: string
  tutor_name: string
  position: string
  start_date: string
  end_date: string
  status: AssignmentStatus
  created_at?: string
  updated_at?: string
  student?: { id: number; name: string }
  company?: { id: number; company_name: string }
  tutor?: { id: number; name: string }
}

export interface CreateAssignmentPayload {
  student_id: number
  company_supervisors_id: number
  tutor_id: number
  position: string
  start_date: string
  end_date: string
}

export type UpdateAssignmentPayload = Partial<CreateAssignmentPayload> & {
  status?: AssignmentStatus
}

export interface AssignmentPaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

export interface AssignmentListResponse {
  data: Assignment[]
  meta: AssignmentPaginationMeta
}
