<template>
  <div class="space-y-3">
    <div v-if="!attachments.length" class="text-sm font-semibold text-slate-500">No attachments.</div>
    <div
      v-for="att in attachments"
      :key="att.id ?? att.filename ?? att.file_path"
      class="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3"
    >
      <div class="flex min-w-0 items-center gap-3">
        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </span>
        <div class="min-w-0">
          <p class="truncate text-xs font-semibold text-slate-800">
            {{ att.filename || att.file_path || 'attachment' }}
          </p>
          <p class="text-xs text-slate-500">
            {{ att.mime_type || att.file_type || guessType(att.filename || att.file_path || '') }}
            • {{ formatBytes(Number(att.size_bytes ?? att.file_size)) }}
          </p>
        </div>
      </div>

      <div class="flex shrink-0 items-center gap-2">
        <button
          type="button"
          class="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100"
          @click="download(att)"
        >
          Download
        </button>
        <button
          v-if="isPreviewable(att)"
          type="button"
          class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
          @click="preview(att)"
        >
          Preview
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Attachment } from '@/types/worklog'

const props = defineProps<{
  attachments: Attachment[]
}>()

function apiBase(): string {
  const base = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
  return base.replace(/\/api\/?$/, '')
}

function fileUrl(att: Attachment): string | null {
  if (att.url) return att.url
  if (att.file_path) return `${apiBase()}/storage/${att.file_path}`
  return null
}

function downloadName(att: Attachment): string {
  const raw = att.filename || att.file_path || 'download'
  return raw.split('/').pop() || 'download'
}

function formatBytes(bytes?: number): string {
  if (!bytes || !Number.isFinite(bytes) || bytes <= 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB'] as const
  let i = 0
  let v = bytes
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i++
  }
  return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${units[i]}`
}

function guessType(filename?: string): string {
  const name = (filename || '').toLowerCase()
  if (name.endsWith('.pdf')) return 'application/pdf'
  if (name.endsWith('.png')) return 'image/png'
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'image/jpeg'
  if (name.endsWith('.doc') || name.endsWith('.docx')) return 'application/msword'
  if (name.endsWith('.zip')) return 'application/zip'
  return 'file'
}

function isPreviewable(att: Attachment): boolean {
  const name = (att.filename || att.file_path || '').toLowerCase()
  return (
    name.endsWith('.png') ||
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg') ||
    name.endsWith('.pdf')
  )
}

async function download(att: Attachment) {
  const url = fileUrl(att)
  if (!url) return
  try {
    // Files in storage/app/public are publicly served; fetch as a simple
    // (header-less) GET so it stays a non-preflighted cross-origin request.
    const res = await fetch(url)
    if (!res.ok) throw new Error('download failed')
    const blob = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = objectUrl
    a.download = downloadName(att)
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(objectUrl)
  } catch {
    // Fallback: open in a new tab (works for publicly served files)
    window.open(url, '_blank')
  }
}

function preview(att: Attachment) {
  const url = fileUrl(att)
  if (url) window.open(url, '_blank')
}
</script>
