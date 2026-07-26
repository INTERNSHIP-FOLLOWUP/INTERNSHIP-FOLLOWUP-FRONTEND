<template>
  <div class="rounded-2xl border-2 border-dashed bg-white p-4 transition-all duration-200"
    :class="isDragging ? 'border-indigo-400 bg-indigo-50/30 scale-[1.01]' : 'border-slate-200 hover:border-indigo-300'">
    
    <!-- Upload Area -->
    <div
      class="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl p-8 text-center transition-all duration-200"
      :class="isDragging ? 'bg-indigo-50/50' : 'hover:bg-slate-50/50'"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="inputRef?.click()"
    >
      <div class="flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300"
        :class="isDragging ? 'bg-indigo-100 scale-110 shadow-lg shadow-indigo-200/50' : 'bg-indigo-50'">
        <svg class="h-6 w-6 text-indigo-500 transition-transform duration-300" :class="isDragging ? 'translate-y-1' : ''"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      
      <div>
        <p class="text-sm font-semibold text-slate-700">
          <span class="text-indigo-600 hover:text-indigo-700 transition-colors">Click to upload files</span>
          <span class="text-slate-400"> or drag & drop</span>
        </p>
        <p class="mt-1 text-xs text-slate-400">PDF, DOC/DOCX, PNG/JPG, ZIP — Max 10MB per file</p>
      </div>
    </div>

    <input
      ref="inputRef"
      class="hidden"
      type="file"
      multiple
      :accept="accept"
      @change="onFileChange"
    />

    <!-- Selected Files -->
    <div v-if="internalFiles.length" class="mt-4 space-y-3">
      <div class="flex items-center justify-between border-b border-slate-100 pb-2">
        <p class="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          <span>{{ internalFiles.length }} file{{ internalFiles.length !== 1 ? 's' : '' }} selected</span>
        </p>
        <button
          type="button"
          class="text-xs font-medium text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
          @click="clear">
          <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Remove all
        </button>
      </div>

      <div class="space-y-2">
        <div
          v-for="(f, idx) in internalFiles"
          :key="`${f.name}-${f.size}-${idx}`"
          class="group flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 transition-all duration-200 hover:border-slate-200 hover:shadow-sm"
        >
          <!-- File type icon -->
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            :class="fileIconBgClass(f.name)">
            <!-- PDF icon -->
            <svg v-if="/\.pdf$/i.test(f.name)" class="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <!-- Image icon -->
            <svg v-else-if="/\.(png|jpg|jpeg)$/i.test(f.name)" class="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <!-- Document icon -->
            <svg v-else-if="/\.(doc|docx)$/i.test(f.name)" class="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <!-- ZIP icon -->
            <svg v-else-if="/\.zip$/i.test(f.name)" class="h-4 w-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <!-- Generic file icon -->
            <svg v-else class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div class="min-w-0 flex-1">
            <p class="truncate text-xs font-semibold text-slate-800">{{ f.name }}</p>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class="text-xs text-slate-400">{{ formatFileSize(f.size) }}</span>
              <span v-if="isOverSize(f)" class="text-xs font-medium text-red-500">(too large)</span>
            </div>
          </div>

          <button
            type="button"
            class="shrink-0 rounded-lg p-1.5 text-slate-300 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
            @click="remove(idx)"
            :aria-label="`Remove ${f.name}`"
            title="Remove file"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Validation Error -->
    <transition name="slide-fade">
      <div v-if="validationError"
        class="mt-3 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
        <svg class="h-4 w-4 shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        {{ validationError }}
      </div>
    </transition>

    <!-- Uploading Spinner -->
    <transition name="slide-fade">
      <div v-if="submitting"
        class="mt-3 flex items-center gap-2.5 rounded-xl border border-indigo-100 bg-indigo-50 px-3.5 py-2.5 text-xs font-medium text-indigo-700">
        <svg class="h-4 w-4 animate-spin text-indigo-500" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Uploading files...
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { fileIconBgClass, formatFileSize, isAllowedFileType } from '@/utils/fileIcons'

const emit = defineEmits<{
  (e: 'update:modelValue', value: File[]): void
}>()

const props = defineProps<{
  modelValue: File[]
}>()

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const internalFiles = computed<File[]>(() => props.modelValue ?? [])

const inputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const validationError = ref('')
const submitting = ref(false)

const accept = '.pdf,.doc,.docx,.png,.jpg,.jpeg,.zip'

watch(
  () => props.modelValue,
  () => {
    validationError.value = ''
  },
)

function isOverSize(file: File): boolean {
  return file.size > MAX_FILE_SIZE
}

function isAllowed(file: File): boolean {
  return isAllowedFileType(file.name) && !isOverSize(file)
}

function addFiles(files: File[]) {
  validationError.value = ''

  // Check file size
  const overSize = files.filter((f) => isOverSize(f))
  const allowed = files.filter((f) => isAllowed(f))
  const rejectedType = files.length - allowed.length - overSize.length

  const errors: string[] = []
  if (overSize.length > 0) {
    errors.push(`${overSize.length} file${overSize.length > 1 ? 's' : ''} exceed${overSize.length > 1 ? '' : 's'} the 10MB limit.`)
  }
  if (rejectedType > 0) {
    errors.push(`${rejectedType} file${rejectedType > 1 ? 's' : ''} ha${rejectedType > 1 ? 've' : 's'} an unsupported format.`)
  }
  if (errors.length > 0) {
    validationError.value = errors.join(' ') + ' Allowed: PDF, DOC/DOCX, PNG/JPG, ZIP.'
  }

  const next = [...internalFiles.value, ...allowed]
  emit('update:modelValue', next)
}

function onDragOver() {
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  const list = e.dataTransfer?.files
  if (!list || list.length === 0) return
  addFiles(Array.from(list))
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const list = input.files
  if (!list || list.length === 0) return
  addFiles(Array.from(list))
  input.value = ''
}

function browse() {
  inputRef.value?.click()
}

function remove(idx: number) {
  const next = internalFiles.value.filter((_, i) => i !== idx)
  emit('update:modelValue', next)
}

function clear() {
  emit('update:modelValue', [])
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.25s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.15s ease-in;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
