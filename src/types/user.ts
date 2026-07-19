// src/types/user.ts (add to existing file)
export interface TutorWorkload {
  id: number
  name: string
  email: string
  students_count: number
}

export interface TutorOption {
  value: number
  label: string
}
