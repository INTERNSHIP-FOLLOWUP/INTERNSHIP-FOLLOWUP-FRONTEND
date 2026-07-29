<template>
  <div class="space-y-3">
    <!-- Empty state -->
    <div v-if="!attachments.length"
      class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-10 text-center dark:border-slate-600 dark:bg-slate-800/30">
      <svg class="mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
      </svg>
      <p class="text-sm font-medium text-slate-400 dark:text-slate-500">No attachments</p>
    </div>

    <!-- Attachment cards -->
    <div v-for="att in attachments" :key="att.id ?? att.filename"
      class="group flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 transition-all duration-200 hover:border-slate-200 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600">
      
      <!-- File type icon -->
      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        :class="fileIconBgClass(att.filename)">
        <!-- PDF icon -->
        <svg v-if="/\.pdf$/i.test(att.filename)" class="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <!-- Image icon -->
        <svg v-else-if="/\.(png|jpg|jpeg)$/i.test(att.filename)" class="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <!-- Document icon -->
        <svg v-else-if="/\.(doc|docx)$/i.test(att.filename)" class="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <!-- ZIP icon -->
        <svg v-else-if="/\.zip$/i.test(att.filename)" class="h-4 w-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <!-- Generic file icon -->
        <svg v-else class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <!-- File info -->
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">{{ att.filename }}</p>
        <div class="flex items-center gap-2 mt-0.5">
          <span class="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            :class="fileTypeBadgeClass(att.filename)">
            {{ fileTypeLabel(att.filename) }}
          </span>
          <span class="text-xs text-slate-400 dark:text-slate-500">{{ formatFileSize(att.size_bytes ?? 0) }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600 dark:hover:text-slate-200"
          @click="download(att)">
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download
        </button>
        <button
          v-if="isPreviewable(att)"
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-indigo-600 shadow-sm transition-all hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-600 dark:bg-slate-700 dark:text-indigo-400 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-300"
          @click="preview(att)">
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fileIconBgClass, formatFileSize, fileTypeLabel, fileTypeBadgeClass } from '@/utils/fileIcons'
import type { Attachment } from '@/types/worklog'

defineProps<{
  attachments: Attachment[]
}>()


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
