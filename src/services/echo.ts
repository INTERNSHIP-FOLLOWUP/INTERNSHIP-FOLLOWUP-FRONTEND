import { tokenService } from './token'

/**
 * Returns an Echo auth callback that reads the current token on every auth request.
 * This ensures private channel subscriptions always use the freshest access token.
 */
export function getEchoAuthCallback(): (
  callback: (error: null, data: { headers: Record<string, string> }) => void,
) => void {
  return (callback) => {
    callback(null, {
      headers: {
        Authorization: `Bearer ${tokenService.getAccessToken()}`,
        Accept: 'application/json',
      },
    })
  }
}

/**
 * Update Echo's internal Pusher auth headers after a token refresh.
 * This is a fallback for already-established connections.
 */
export function updateEchoAuth(token: string): void {
  if (typeof window === 'undefined') return

  try {
    const echo = (window as Window & typeof globalThis).Echo
    if (!echo) return

    const connector = (echo as unknown as Record<string, unknown>).connector as Record<string, unknown> | undefined
    const pusher = connector?.pusher as Record<string, unknown> | undefined
    const config = pusher?.config as Record<string, unknown> | undefined
    const auth = config?.auth as Record<string, unknown> | undefined
    const headers = auth?.headers as Record<string, string> | undefined

    if (headers) {
      headers.Authorization = `Bearer ${token}`
    }
  } catch {
    // Graceful degradation — Echo auth update is non-critical
  }
}
