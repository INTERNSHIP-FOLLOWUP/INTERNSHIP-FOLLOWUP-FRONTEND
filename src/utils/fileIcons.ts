/**
 * Shared helpers for file type detection and styling.
 * Used by FileUpload.vue and AttachmentList.vue
 */

/** Get the Tailwind background color class for the file type icon container */
export function fileIconBgClass(filename: string): string {
  const name = filename.toLowerCase()
  if (name.endsWith('.pdf')) return 'bg-red-50'
  if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'bg-emerald-50'
  if (name.endsWith('.doc') || name.endsWith('.docx')) return 'bg-blue-50'
  if (name.endsWith('.zip')) return 'bg-amber-50'
  return 'bg-slate-50'
}

/** Get the Tailwind text color class for the file type icon */
export function fileIconTextClass(filename: string): string {
  const name = filename.toLowerCase()
  if (name.endsWith('.pdf')) return 'text-red-500'
  if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'text-emerald-500'
  if (name.endsWith('.doc') || name.endsWith('.docx')) return 'text-blue-500'
  if (name.endsWith('.zip')) return 'text-amber-500'
  return 'text-slate-400'
}

/** Get a human-readable type label (PDF, PNG, DOCX, etc.) */
export function fileTypeLabel(filename: string): string {
  const name = filename.toLowerCase()
  if (name.endsWith('.pdf')) return 'PDF'
  if (name.endsWith('.png')) return 'PNG'
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'JPG'
  if (name.endsWith('.doc')) return 'DOC'
  if (name.endsWith('.docx')) return 'DOCX'
  if (name.endsWith('.zip')) return 'ZIP'
  return 'FILE'
}

/** Get the Tailwind badge background class for the type label */
export function fileTypeBadgeClass(filename: string): string {
  const name = filename.toLowerCase()
  if (name.endsWith('.pdf')) return 'bg-red-50 text-red-600'
  if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'bg-emerald-50 text-emerald-600'
  if (name.endsWith('.doc') || name.endsWith('.docx')) return 'bg-blue-50 text-blue-600'
  if (name.endsWith('.zip')) return 'bg-amber-50 text-amber-600'
  return 'bg-slate-50 text-slate-500'
}

/** Check if a filename matches an allowed upload type */
export function isAllowedFileType(filename: string): boolean {
  const name = filename.toLowerCase()
  return (
    name.endsWith('.pdf') ||
    name.endsWith('.doc') ||
    name.endsWith('.docx') ||
    name.endsWith('.png') ||
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg') ||
    name.endsWith('.zip')
  )
}

/** Format bytes to a human-readable string */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let v = bytes
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i++
  }
  return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${units[i]}`
}
