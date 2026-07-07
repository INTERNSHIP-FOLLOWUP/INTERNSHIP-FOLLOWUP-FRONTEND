export interface ParsedApiError {
  message: string
  fields?: Record<string, string>
}

// ── Friendly field error mapper ─────────────────────────────

const FIELD_ERROR_MAP: Record<string, Record<string, string>> = {
  email: {
    'required': 'Please enter your email address.',
    'email': 'Please enter a valid email address.',
    'unique': 'An account with this email already exists. Please sign in or use a different email.',
    'exists': 'We couldn\'t find an account with that email. Please check your email or create a new account.',
    'The email has already been taken.': 'An account with this email already exists.',
    'The selected email is invalid.': 'We couldn\'t find an account with that email.',
    'The provided credentials are incorrect.': 'Your email or password is incorrect. Please try again.',
  },
  password: {
    'required': 'Please enter your password.',
    'min': 'Password must be at least 8 characters long.',
    'current_password': 'The password you entered is incorrect. Please try again.',
    'The provided credentials are incorrect.': 'Your email or password is incorrect. Please try again.',
    'incorrect': 'The password you entered is incorrect. Please try again.',
  },
  name: {
    'required': 'Please enter your full name.',
    'min': 'Name must be at least 2 characters long.',
    'max': 'Name is too long. Please use a shorter name.',
  },
  password_confirmation: {
    'required': 'Please confirm your password.',
    'same': 'Passwords do not match. Please try again.',
  },
}

function findFriendlyMessage(field: string, rawMessage: string): string | null {
  const fieldMap = FIELD_ERROR_MAP[field]
  if (!fieldMap) return null

  // Exact match first
  if (fieldMap[rawMessage]) return fieldMap[rawMessage]

  // Partial match (e.g. "min:8" matches "min")
  for (const [key, friendly] of Object.entries(fieldMap)) {
    if (rawMessage.includes(key)) return friendly
  }

  return null
}

// ── Main parser ─────────────────────────────────────────────

export function parseApiError(err: unknown): ParsedApiError {
  const axiosErr = err as {
    response?: {
      status?: number
      data?: {
        message?: string
        errors?: Record<string, string[]>
      }
    }
    message?: string
    code?: string
  }

  const status = axiosErr.response?.status
  const data = axiosErr.response?.data

  // ── Network / no response ──
  if (!axiosErr.response) {
    const isNetworkError =
      axiosErr.message === 'Network Error' ||
      axiosErr.code === 'ERR_NETWORK' ||
      axiosErr.code === 'ECONNABORTED'

    return {
      message: isNetworkError
        ? 'We couldn\'t connect to the server. Please check your internet connection and try again.'
        : 'An unexpected error occurred. Please try again later.',
    }
  }

  // ── 422 Validation ──
  if (status === 422) {
    const fields: Record<string, string> = {}
    let hasFields = false

    if (data?.errors) {
      for (const [field, messages] of Object.entries(data.errors)) {
        if (messages.length > 0) {
          // Try friendly mapping, fall back to raw
          const friendly = findFriendlyMessage(field, messages[0])
          fields[field] = friendly || messages[0]
          hasFields = true
        }
      }
    }

    // If field errors exist, use a general message and return fields
    if (hasFields) {
      // Check if the primary issue is credentials (no need for banner when field errors cover it)
      const hasCredentialsError = Object.values(fields).some(
        (m) => m.includes('email or password') || m.includes('incorrect')
      )

      return {
        message: hasCredentialsError
          ? 'Your email or password is incorrect. Please try again.'
          : 'Please review the highlighted fields and try again.',
        fields,
      }
    }

    // 422 with message but no field errors
    if (data?.message) {
      return { message: friendlyGlobalMessage(data.message) }
    }

    return { message: 'Please review the highlighted fields and try again.' }
  }

  // ── 401 Unauthorized ──
  if (status === 401) {
    return { message: 'Your session has expired. Please sign in again.' }
  }

  // ── 403 Forbidden ──
  if (status === 403) {
    return { message: 'You don\'t have permission to access this resource.' }
  }

  // ── 419 CSRF mismatch ──
  if (status === 419) {
    return { message: 'Your session has expired. Please refresh the page and try again.' }
  }

  // ── 429 Rate limited ──
  if (status === 429) {
    return { message: 'Too many attempts. Please wait a few minutes before trying again.' }
  }

  // ── 423 Account inactive / locked ──
  if (status === 423) {
    return { message: 'Your account is currently unavailable. Please contact support if you believe this is a mistake.' }
  }

  // ── 500+ Server ──
  if (status && status >= 500) {
    return { message: 'Something went wrong on our side. Please try again in a few moments.' }
  }

  // ── Backend message fallback ──
  if (data?.message) {
    return { message: friendlyGlobalMessage(data.message) }
  }

  return { message: 'An unexpected error occurred. Please try again later.' }
}

function friendlyGlobalMessage(raw: string): string {
  const lower = raw.toLowerCase()

  if (lower.includes('credentials are incorrect') || lower.includes('invalid email') || lower.includes('invalid password')) {
    return 'Your email or password is incorrect. Please try again.'
  }
  if (lower.includes('too many attempts') || lower.includes('throttle')) {
    return 'Too many attempts. Please wait a few minutes before trying again.'
  }
  if (lower.includes('inactive') || lower.includes('suspended') || lower.includes('locked')) {
    return 'Your account is currently unavailable. Please contact support.'
  }
  if (lower.includes('validation')) {
    return 'Please review the highlighted fields and try again.'
  }
  if (lower.includes('not found') || lower.includes('no record')) {
    return 'We couldn\'t find what you\'re looking for. Please check your information.'
  }

  return raw
}
