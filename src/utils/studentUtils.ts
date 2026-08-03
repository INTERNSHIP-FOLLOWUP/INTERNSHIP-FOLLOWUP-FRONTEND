/**
 * Format student code/ID to match batch format e.g. PNC2026-001
 * @param code Raw student code like STU001 or 001 or PNC2026-001
 * @param batch Batch name string or object containing batch name
 */
export function formatStudentId(
  code?: string | null,
  batch?: string | { name?: string | null; batch_name?: string | null } | null
): string {
  if (!code && !batch) return '—'

  let numStr = '001'
  if (code) {
    const match = code.match(/\d+$/)
    if (match) {
      numStr = match[0].padStart(3, '0')
    }
  }

  let batchPrefix = ''
  if (typeof batch === 'string' && batch.trim()) {
    batchPrefix = batch.trim()
  } else if (batch && typeof batch === 'object') {
    batchPrefix = (batch.name || batch.batch_name || '').trim()
  }

  if (!batchPrefix) {
    if (code && code.toUpperCase().startsWith('PNC')) {
      return code
    }
    batchPrefix = 'PNC2026'
  }

  return `${batchPrefix}-${numStr}`
}
