/**
 * Normalize an image URL from the backend by cleaning up common path issues.
 *
 * The backend's Storage::url() returns relative paths like `/storage/companies/xyz.jpg`.
 * If the database value already includes a `storage/` prefix (e.g. `storage/companies/xyz.jpg`),
 * Storage::url() would return `/storage/storage/companies/xyz.jpg` — a broken double path.
 *
 * This function strips the duplicate `/storage/` prefix so the URL is always clean.
 */
export function normalizeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null

  // Remove patterns like /storage//storage/ or /storage/storage/
  return url
    .replace(/\/storage\/\/?storage\//g, '/storage/')
    .replace(/\/storage\/storage\//g, '/storage/')
    || null
}
