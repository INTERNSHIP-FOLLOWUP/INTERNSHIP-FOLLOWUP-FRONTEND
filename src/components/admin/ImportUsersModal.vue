<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="$emit('close')">
      <div class="w-[92%] max-w-lg rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-lg font-bold text-slate-900">Import Users</h3>
          <button @click="$emit('close')" class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="mb-4 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-700">
          <p class="font-semibold">Format</p>
          <p class="mt-1 text-indigo-600">Upload an .xlsx file with columns: First Name, Last Name, Email, Role</p>
          <a :href="templateUrl" class="mt-2 inline-flex items-center gap-1.5 font-semibold text-indigo-700 hover:text-indigo-900 underline">
            Download template
          </a>
        </div>

        <div
          class="relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 transition-colors"
          :class="dragOver ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'"
          @dragover.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop.prevent="handleDrop"
        >
          <input ref="fileInput" type="file" accept=".xlsx,.xls,.csv" class="absolute inset-0 cursor-pointer opacity-0" @change="handleFile" />
          <svg class="mb-3 h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <p class="text-sm font-semibold text-slate-700">{{ file ? file.name : 'Drop file here or click to browse' }}</p>
          <p class="mt-1 text-xs text-slate-400">.xlsx, .xls, or .csv</p>
        </div>

        <div v-if="result" class="mt-4 space-y-2 rounded-xl border p-4" :class="result.success_count > 0 && result.failed_count === 0 ? 'border-emerald-100 bg-emerald-50' : 'border-amber-100 bg-amber-50'">
          <p class="text-sm font-bold" :class="result.failed_count > 0 ? 'text-amber-800' : 'text-emerald-800'">
            Import Complete
          </p>
          <p class="text-sm" :class="result.failed_count > 0 ? 'text-amber-700' : 'text-emerald-700'">
            {{ result.success_count }} succeeded, {{ result.failed_count }} failed
          </p>
          <div v-if="result.failed_rows && result.failed_rows.length > 0" class="mt-2 max-h-32 overflow-y-auto space-y-1">
            <div v-for="fr in result.failed_rows" :key="fr.row" class="text-xs text-amber-600">
              Row {{ fr.row }}: {{ fr.errors?.join(', ') }}
            </div>
          </div>
        </div>

        <div v-if="uploadError" class="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
          {{ uploadError }}
        </div>

        <div class="mt-5 flex justify-end gap-2">
          <button @click="$emit('close')" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
            Cancel
          </button>
          <button @click="upload" :disabled="!file || uploading"
            class="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ uploading ? 'Uploading...' : 'Import' }}
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

const templateUrl = `${api.defaults.baseURL}/admin/users/import/template`
const fileInput = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const dragOver = ref(false)
const uploading = ref(false)
const uploadError = ref('')
const result = ref<{ success_count: number; failed_count: number; failed_rows: { row: number; errors: string[] }[] } | null>(null)

function handleDrop(e: DragEvent) {
  dragOver.value = false
  const f = e.dataTransfer?.files?.[0]
  if (f && (f.name.endsWith('.xlsx') || f.name.endsWith('.xls') || f.name.endsWith('.csv'))) {
    file.value = f
    uploadError.value = ''
    result.value = null
  } else {
    uploadError.value = 'Please select a valid .xlsx, .xls, or .csv file.'
  }
}

function handleFile(e: Event) {
  const input = e.target as HTMLInputElement
  const f = input.files?.[0]
  if (f) {
    file.value = f
    uploadError.value = ''
    result.value = null
  }
}

async function upload() {
  if (!file.value) return
  uploading.value = true
  uploadError.value = ''
  result.value = null

  try {
    const formData = new FormData()
    formData.append('file', file.value)
    const res = await api.post('/admin/users/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    result.value = res.data
    file.value = null
    if (fileInput.value) fileInput.value.value = ''
  } catch (err: unknown) {
    uploadError.value = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Import failed.'
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
