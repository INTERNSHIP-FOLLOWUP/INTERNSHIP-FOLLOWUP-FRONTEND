<template>
  <div v-if="attachments.length === 0" class="py-8 text-center">
    <svg
      class="mx-auto h-10 w-10 text-slate-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
      />
    </svg>
    <p class="mt-2 text-sm text-slate-500">No files attached</p>
  </div>

  <div v-else class="space-y-2">
    <div
      v-for="attachment in attachments"
      :key="attachment.id"
      class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-all hover:border-slate-300"
    >
      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
        <!-- Image icon -->
        <svg
          v-if="isMimeType(attachment, 'image/')"
          class="h-5 w-5 text-primary-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <!-- PDF icon -->
        <svg
          v-else-if="isMimeType(attachment, 'pdf')"
          class="h-5 w-5 text-primary-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
          <text x="12" y="16" text-anchor="middle" font-size="7" font-weight="bold" fill="currentColor">PDF</text>
        </svg>
        <!-- Archive icon -->
        <svg
          v-else-if="isMimeType(attachment, 'zip') || isMimeType(attachment, 'rar') || isMimeType(attachment, 'tar')"
          class="h-5 w-5 text-primary-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
        <!-- Document icon -->
        <svg
          v-else
          class="h-5 w-5 text-primary-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </div>

      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium text-slate-900">
          {{ attachment.name ?? attachment.original_name ?? attachment.originalName ?? 'Unnamed file' }}
        </p>
        <p class="text-xs text-slate-500">
          {{ formatFileSize(attachment.size ?? attachment.file_size ?? attachment.fileSize ?? 0) }}
          <template v-if="attachment.created_at || attachment.createdAt">
            &middot; {{ formatDate(attachment.created_at ?? attachment.createdAt) }}
          </template>
        </p>
      </div>

      <div class="flex items-center gap-1">
        <button
          class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary-600"
          :aria-label="`Download ${attachment.name ?? attachment.original_name ?? attachment.originalName ?? 'file'}`"
          @click="$emit('download', attachment.id ?? 0)"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </button>

        <button
          v-if="removable && !readonly"
          class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-error"
          :aria-label="`Remove ${attachment.name ?? attachment.original_name ?? attachment.originalName ?? 'file'}`"
          @click="$emit('remove', attachment.id ?? 0)"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Attachment {
  id?: number
  name?: string
  original_name?: string
  originalName?: string
  size?: number
  file_size?: number
  fileSize?: number
  mime_type?: string
  mimeType?: string
  url?: string
  created_at?: string | null
  createdAt?: string | null
}

withDefaults(
  defineProps<{
    attachments: Attachment[]
    removable?: boolean
    readonly?: boolean
  }>(),
  {
    removable: true,
    readonly: false,
  },
)

defineEmits<{
  remove: [id: number]
  download: [id: number]
}>()

function isMimeType(attachment: Attachment, prefix: string): boolean {
  const mime = (attachment.mime_type ?? attachment.mimeType ?? '').toLowerCase()
  return mime.startsWith(prefix)
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function formatDate(value?: string | null): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString()
}
</script>
