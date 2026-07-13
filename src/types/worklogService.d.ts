declare module '@/services/worklogService' {
  export const worklogService: {
    getWorklogs(params?: any): Promise<any>
    getWorklog(id: number): Promise<any>
    createWorklog(formData: FormData): Promise<any>
    updateWorklog(id: number, formData: FormData): Promise<any>
    deleteWorklog(id: number): Promise<any>
  }
}

