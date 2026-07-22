<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="$emit('close')">
      <div class="w-[92%] max-w-2xl rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h3 class="text-lg font-bold text-slate-900">Import Students</h3>
            <p class="text-sm text-slate-500 mt-1">Bulk import students from Excel file</p>
          </div>
          <button @click="$emit('close')" class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Format Instructions -->
        <div class="mb-4 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-700">
          <div class="flex items-start gap-2">
            <svg class="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex-1">
              <p class="font-semibold">Required Format</p>
              <p class="mt-1 text-indigo-600">Upload an .xlsx file with these exact columns:</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span class="inline-flex items-center px-2 py-1 rounded-md bg-indigo-100 text-indigo-800 text-xs font-medium">First Name</span>
                <span class="inline-flex items-center px-2 py-1 rounded-md bg-indigo-100 text-indigo-800 text-xs font-medium">Last Name</span>
                <span class="inline-flex items-center px-2 py-1 rounded-md bg-indigo-100 text-indigo-800 text-xs font-medium">Email</span>
                <span class="inline-flex items-center px-2 py-1 rounded-md bg-indigo-100 text-indigo-800 text-xs font-medium">Phone</span>
                <span class="inline-flex items-center px-2 py-1 rounded-md bg-indigo-100 text-indigo-800 text-xs font-medium">Gender</span>
                <span class="inline-flex items-center px-2 py-1 rounded-md bg-indigo-100 text-indigo-800 text-xs font-medium">Batches</span>
              </div>
              <div class="mt-3 space-y-1 text-xs text-indigo-600">
                <p>• <strong>Batches</strong> must match existing batch names (e.g., "PNC2026")</p>
                <p>• <strong>Email</strong> must be unique - duplicates will be skipped</p>
                <p>• Default password <strong>12345678</strong> will be set for all students</p>
                <p>• Student codes will auto-generate as STU001, STU002, etc.</p>
              </div>
              <a :href="templateUrl" class="mt-3 inline-flex items-center gap-1.5 font-semibold text-indigo-700 hover:text-indigo-900 underline">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Download template
              </a>
            </div>
          </div>
        </div>

        <!-- File Upload Area -->
        <div
          class="relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 transition-colors"
          :class="dragOver ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'"
          @dragover.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop.prevent="handleDrop"
        >
          <input ref="fileInput" type="file" accept=".xlsx,.xls" class="absolute inset-0 cursor-pointer opacity-0" @change="handleFile" />
          <div v-if="!file" class="text-center">
            <svg class="mx-auto mb-3 h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p class="text-sm font-semibold text-slate-700">Drop file here or click to browse</p>
            <p class="mt-1 text-xs text-slate-400">.xlsx or .xls files only (Max 20MB)</p>
          </div>
          <div v-else class="text-center">
            <svg class="mx-auto mb-3 h-10 w-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm font-semibold text-slate-700">{{ file.name }}</p>
            <p class="mt-1 text-xs text-slate-400">{{ formatFileSize(file.size) }}</p>
            <button @click.stop="removeFile" class="mt-2 text-xs text-red-600 hover:text-red-700 underline">Remove</button>
          </div>
        </div>

        <!-- Import Progress -->
        <div v-if="uploading" class="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <div class="flex items-center gap-3">
            <svg class="h-5 w-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <div class="flex-1">
              <p class="text-sm font-semibold text-blue-800">Importing students...</p>
              <p class="text-xs text-blue-600">Please wait while we process your file</p>
            </div>
          </div>
        </div>

        <!-- Import Results -->
        <div v-if="result" class="mt-4 space-y-3">
          <!-- Success Message -->
          <div v-if="result.imported > 0" class="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <div class="flex items-start gap-3">
              <svg class="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="flex-1">
                <p class="text-sm font-bold text-emerald-800">Import Successful!</p>
                <p class="text-sm text-emerald-700">{{ result.imported }} student(s) imported successfully</p>
                <p class="text-xs text-emerald-600 mt-1">Default password: 12345678</p>
              </div>
            </div>
          </div>

          <!-- Warning/Partial Success -->
          <div v-if="result.failed > 0" class="rounded-xl border border-amber-100 bg-amber-50 p-4">
            <div class="flex items-start gap-3">
              <svg class="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div class="flex-1">
                <p class="text-sm font-bold text-amber-800">{{ result.imported > 0 ? 'Partial Success' : 'Import Failed' }}</p>
                <p class="text-sm text-amber-700">{{ result.failed }} row(s) could not be imported</p>
                <div v-if="result.errors && result.errors.length > 0" class="mt-3">
                  <button @click="showErrors = !showErrors" class="text-xs font-semibold text-amber-800 hover:text-amber-900 underline">
                    {{ showErrors ? 'Hide' : 'Show' }} {{ result.errors.length }} error(s)
                  </button>
                  <div v-if="showErrors" class="mt-2 max-h-40 overflow-y-auto space-y-1 rounded-lg bg-amber-100 p-2">
                    <div v-for="(error, index) in result.errors" :key="index" class="text-xs text-amber-700">
                      <span class="font-semibold">Row {{ error.row }}:</span> {{ error.reason }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Data -->
          <div v-if="result.imported === 0 && result.failed === 0" class="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div class="flex items-start gap-3">
              <svg class="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="flex-1">
                <p class="text-sm font-bold text-slate-800">No Data Found</p>
                <p class="text-sm text-slate-600">The file appears to be empty or has no valid data rows</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="uploadError" class="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
          <div class="flex items-center gap-2">
            <svg class="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ uploadError }}
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-5 flex justify-end gap-2">
          <button @click="$emit('close')" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
            {{ result && result.imported > 0 ? 'Done' : 'Cancel' }}
          </button>
          <button 
            @click="upload" 
            :disabled="!file || uploading"
            class="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <svg v-if="uploading" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            {{ uploading ? 'Importing...' : 'Import Students' }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@/services/api'

defineProps<{ show: boolean }>()
const emit = defineEmits<{ close: [] }>()

const templateUrl = `${api.defaults.baseURL}/admin/students/import/template`
const fileInput = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const dragOver = ref(false)
const uploading = ref(false)
const uploadError = ref('')
const result = ref<{ imported: number; failed: number; errors: { row: number; reason: string }[]; message: string } | null>(null)
const showErrors = ref(false)

function handleDrop(e: DragEvent) {
  dragOver.value = false
  const f = e.dataTransfer?.files?.[0]
  if (f && (f.name.endsWith('.xlsx') || f.name.endsWith('.xls'))) {
    file.value = f
    uploadError.value = ''
    result.value = null
    showErrors.value = false
  } else {
    uploadError.value = 'Please select a valid .xlsx or .xls file.'
  }
}

function handleFile(e: Event) {
  const input = e.target as HTMLInputElement
  const f = input.files?.[0]
  if (f) {
    file.value = f
    uploadError.value = ''
    result.value = null
    showErrors.value = false
  }
}

function removeFile() {
  file.value = null
  if (fileInput.value) fileInput.value.value = ''
  uploadError.value = ''
  result.value = null
  showErrors.value = false
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

async function upload() {
  if (!file.value) return
  uploading.value = true
  uploadError.value = ''
  result.value = null
  showErrors.value = false

  try {
    const formData = new FormData()
    formData.append('file', file.value)
    
    // Increase timeout for large file uploads (10 minutes)
    const res = await api.post('/admin/students/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 600000, // 10 minutes timeout
    })
    result.value = res.data
    file.value = null
    if (fileInput.value) fileInput.value.value = ''
    
    // Auto-close on success after a delay
    if (res.data.imported > 0 && res.data.failed === 0) {
      setTimeout(() => {
        emit('close')
      }, 2000)
    }
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string; errors?: { row: number; reason: string }[] } } }
    
    if (error?.response?.data?.errors && error.response.data.errors.length > 0) {
      uploadError.value = `Import failed: ${error.response.data.errors[0].reason}`
    } else {
      uploadError.value = error?.response?.data?.message || error?.response?.data?.error || 'Import failed. Please try again.'
    }
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
