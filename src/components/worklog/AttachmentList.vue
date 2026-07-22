<template>
  <div class="space-y-3">
    <div v-if="!attachments.length" class="text-sm font-semibold text-slate-500">No attachments.</div>
    <div v-for="att in attachments" :key="att.id ?? att.filename ?? att.file_path" class="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3">
      <div class="min-w-0">
        <p class="truncate text-xs font-semibold text-slate-800">📄 {{ att.filename || att.file_path || 'attachment' }}</p>
        <p class="text-xs text-slate-500">{{ att.mime_type || att.file_type || guessType(att.filename || att.file_path || '') }} • {{ formatBytes(att.size_bytes ?? att.file_size) }}</p>
      </div>

      <div class="flex items-center gap-2">
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
          class="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
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

function download(att: Attachment) {
  if (!att.url) return
  window.open(att.url, '_blank')
}

function isPreviewable(att: Attachment): boolean {
  const name = (att.filename || att.file_path || '').toLowerCase()
  return name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.pdf')
}

function preview(att: Attachment) {
  if (!att.url) return
  window.open(att.url, '_blank')
}
</script>
