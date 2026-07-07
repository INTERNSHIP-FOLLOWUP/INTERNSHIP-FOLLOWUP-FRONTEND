import { AUTH_CONFIG } from '@/constants/auth'
import type { AuthTokens } from '@/types/auth'

const { STORAGE_KEYS, TOKEN_EXPIRY_BUFFER_MS } = AUTH_CONFIG

/**
 * TokenService
 *
 * Manages token storage and lifecycle.
 * Access token is kept in memory (preferred) with localStorage fallback
 * for page reload resilience.
 *
 * SECURITY NOTE:
 * - The refresh token should ideally be stored in an httpOnly cookie
 *   (set by the backend). This service stores it in localStorage as
 *   a fallback, but that is XSS-vulnerable.
 * - For production, migrate refresh tokens to httpOnly cookies.
 */
class TokenService {
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private expiresAt: number | null = null

  constructor() {
    this.restore()
  }

  // ── Persistence ──────────────────────────────────────────────

  private persist(key: string, value: string | null) {
    if (value) {
      localStorage.setItem(key, value)
    } else {
      localStorage.removeItem(key)
    }
  }

  private restore() {
    this.accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    this.refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    const exp = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT)
    this.expiresAt = exp ? Number(exp) : null
  }

  // ── Accessors ────────────────────────────────────────────────

  getAccessToken(): string | null {
    return this.accessToken
  }

  getRefreshToken(): string | null {
    return this.refreshToken
  }

  // ── Mutators ─────────────────────────────────────────────────

  setTokens(tokens: AuthTokens) {
    this.accessToken = tokens.accessToken
    this.refreshToken = tokens.refreshToken ?? this.refreshToken
    this.expiresAt = tokens.expiresAt ?? null

    this.persist(STORAGE_KEYS.ACCESS_TOKEN, this.accessToken)
    this.persist(STORAGE_KEYS.REFRESH_TOKEN, this.refreshToken)
    if (this.expiresAt) {
      this.persist(STORAGE_KEYS.EXPIRES_AT, String(this.expiresAt))
    }
  }

  clearTokens() {
    this.accessToken = null
    this.refreshToken = null
    this.expiresAt = null

    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT)
  }

  // ── Expiry ───────────────────────────────────────────────────

  isExpired(): boolean {
    if (!this.expiresAt) return false
    return Date.now() >= this.expiresAt - TOKEN_EXPIRY_BUFFER_MS
  }

  shouldRefresh(): boolean {
    if (!this.expiresAt) return false
    return Date.now() >= this.expiresAt - AUTH_CONFIG.REFRESH_THRESHOLD_MS
  }

  hasValidToken(): boolean {
    return !!this.accessToken && !this.isExpired()
  }

  hasRefreshToken(): boolean {
    return !!this.refreshToken
  }
}

export const tokenService = new TokenService()
