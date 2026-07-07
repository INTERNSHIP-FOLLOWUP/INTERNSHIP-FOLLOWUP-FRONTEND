export const AUTH_TOKEN_KEY = 'auth_token'
export const AUTH_SESSION_KEY = 'auth_has_session'

export const AUTH_CONFIG = {
  STORAGE_KEYS: {
    ACCESS_TOKEN: AUTH_TOKEN_KEY,
    REFRESH_TOKEN: 'auth_refresh_token',
    EXPIRES_AT: 'auth_expires_at',
  } as const,

  SESSION_TIMEOUT_MS: 30 * 60 * 1000,
  REFRESH_THRESHOLD_MS: 5 * 60 * 1000,
  TOKEN_EXPIRY_BUFFER_MS: 60 * 1000,

  ENDPOINTS: {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    USER: '/user',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  } as const,

  ROLE_HIERARCHY: {
    admin: 100,
    tutor: 50,
    student: 10,
    'company representative': 30,
  } as const,
} as const
