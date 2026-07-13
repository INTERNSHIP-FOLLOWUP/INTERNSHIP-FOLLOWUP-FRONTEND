declare module '@/services/worklogService' {
  export const worklogService: {
    // Student
    getWorklogs(params?: any): Promise<any>
    getWorklog(id: number): Promise<any>
    createWorklog(formData: FormData): Promise<any>
    updateWorklog(id: number, formData: FormData): Promise<any>
    deleteWorklog(id: number): Promise<any>

    // Tutor
    getTutorWorklogs(params?: any): Promise<any>
    getTutorWorklog(id: number): Promise<any>
    reviewWorklog(id: number, data: any): Promise<any>
  }
}


