const SNAKE_TO_CAMEL: Record<string, string> = {
  company_name: 'companyName',
  company_email: 'companyEmail',
  student_code: 'studentCode',
  batch_id: 'batchId',
  tutor_id: 'tutorId',
  start_date: 'startDate',
  end_date: 'endDate',
  student_id: 'studentId',
  company_id: 'companyId',
  password_confirmation: 'passwordConfirmation',
  company_profile_image: 'companyProfileImage',
  telegram_link: 'telegramLink',
}

function snakeToCamel(key: string): string {
  return SNAKE_TO_CAMEL[key] ?? key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

export interface ApiFieldErrors {
  [snakeField: string]: string[]
}

export function mapValidationErrors(apiErrors: ApiFieldErrors | undefined): Record<string, string> {
  if (!apiErrors) return {}
  const result: Record<string, string> = {}
  for (const [snakeKey, messages] of Object.entries(apiErrors)) {
    if (messages.length > 0) {
      const firstMsg = messages[0]
      if (firstMsg) result[snakeToCamel(snakeKey)] = firstMsg
    }
  }
  return result
}
