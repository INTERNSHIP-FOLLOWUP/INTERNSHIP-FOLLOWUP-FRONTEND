export interface Attachment {
  id?: number
  filename: string
  file_path?: string
  url?: string
  file_type?: string
  file_size?: number
}

export interface IssueHistoryEvent {
  time: string
  user: string
  text: string
}

export interface Issue {
  id: string
  title: string
  description: string
  reporter: string
  studentName?: string
  assignedTo: string
  createdAt: string
  updatedAt: string
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  attachments?: number
  attachmentList?: Attachment[]
  history?: IssueHistoryEvent[]
  studentId?: string | number
  assignedUserId?: string | number
  due_date?: string
}

export interface IssueStats {
  total: number
  open: number
  inProgress: number
  resolved: number
}

export interface IssueForm {
  title: string
  description: string
  priority: Issue['priority'] | ''
  status: Issue['status'] | ''
  studentId: string | number
  assignedUserId: string | number
  dueDate: string
  files: File[]
}

export interface IssueFilters {
  search: string
  status: string
  priority: string
}

export interface PaginationMeta {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
}

export interface IssueListResponse {
  data: Issue[]
  meta?: PaginationMeta
}

export interface FormModalState {
  open: boolean
  mode: 'create' | 'update'
  item?: Issue
  form: IssueForm
}
