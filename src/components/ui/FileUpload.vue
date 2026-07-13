<template>
  <div class="space-y-1.5">
    <label v-if="label" class="block text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="ml-0.5 text-error">*</span>
    </label>

    <div
      class="relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 ease-in-out"
      :class="[
        isDragOver
          ? 'border-primary-500 bg-primary-50'
          : error
            ? 'border-error bg-error/5'
            : 'border-slate-300 hover:border-slate-400',
        disabled ? 'cursor-not-allowed opacity-60' : '',
      ]"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="openFileDialog"
      @keydown.enter.prevent="openFileDialog"
      @keydown.space.prevent="openFileDialog"
      role="button"
      tabindex="0"
      :aria-label="`Upload ${label || 'file'}${multiple ? 's' : ''}`"
    >
      <input
        ref="fileInputRef"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        class="sr-only"
        @change="onFileChange"
      />

      <div class="flex flex-col items-center justify-center px-4 py-8">
        <svg
          class="mb-3 h-10 w-10 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 16V4m0 0L8 8m4-4l4 4m-4 12H6a2 2 0 01-2-2v-2a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2h-4"
          />
        </svg>
        <p class="text-sm font-medium text-slate-600">
          <span class="text-primary-600">{{ isDragOver ? 'Drop files here' : 'Click to upload' }}</span>
          {{ isDragOver ? '' : ' or drag and drop' }}
        </p>
        <p v-if="!isDragOver" class="mt-1 text-xs text-slate-400">
          {{ acceptDescription }}
        </p>
      </div>
    </div>

    <p v-if="error" class="mt-1 flex items-center gap-1 text-sm text-error" role="alert">
      <svg class="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
          clip-rule="evenodd"
        />
      </svg>
      <span>{{ error }}</span>
    </p>

    <div v-if="hasFiles" class="mt-2 space-y-2">
      <div
        v-for="(file, index) in fileList"
        :key="index"
        class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-all"
      >
        <div v-if="isImageFile(file)" class="h-10 w-10 shrink-0 overflow-hidden rounded-lg">
          <img :src="getFileUrl(file)" :alt="file.name" class="h-full w-full object-cover" />
        </div>
        <div v-else class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
          <svg class="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>

        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium text-slate-900">{{ file.name }}</p>
          <p class="text-xs text-slate-500">{{ formatFileSize(file.size) }}</p>
        </div>

        <div v-if="sizeWarning[index]" class="text-xs text-error">
          Exceeds {{ maxSize }}MB
        </div>

        <button
          v-if="!disabled"
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-error"
          :aria-label="`Remove ${file.name}`"
          @click.stop="removeFile(index)"
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
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: File | File[] | null
    label?: string
    accept?: string
    multiple?: boolean
    maxSize?: number
    required?: boolean
    disabled?: boolean
    error?: string
  }>(),
  {
    modelValue: null,
    label: '',
    accept: '*/*',
    multiple: false,
    maxSize: 10,
    required: false,
    disabled: false,
    error: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: File | File[] | null]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragOver = ref(false)
const internalFiles = ref<File[]>([])

const fileList = computed(() => {
  if (props.modelValue) {
    if (Array.isArray(props.modelValue)) return props.modelValue as File[]
    return [props.modelValue as File]
  }
  return internalFiles.value
})

const hasFiles = computed(() => fileList.value.length > 0)

const sizeWarning = computed(() => {
  const maxBytes = props.maxSize * 1024 * 1024
  return fileList.value.map((f) => f.size > maxBytes)
})

const acceptDescription = computed(() => {
  if (!props.accept || props.accept === '*/*') return 'All file types'
  return props.accept
    .split(',')
    .map((a) => a.trim().toUpperCase())
    .join(', ')
})

function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

function getFileUrl(file: File): string {
  return URL.createObjectURL(file)
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function openFileDialog() {
  if (props.disabled) return
  fileInputRef.value?.click()
}

function onDragOver() {
  if (props.disabled) return
  isDragOver.value = true
}

function onDragLeave() {
  isDragOver.value = false
}

function onDrop(event: DragEvent) {
  isDragOver.value = false
  if (props.disabled) return
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    processFiles(Array.from(files))
  }
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    processFiles(Array.from(files))
  }
  target.value = ''
}

function processFiles(files: File[]) {
  if (files.length === 0) return

  if (props.multiple) {
    const combined = [...fileList.value, ...files]
    internalFiles.value = combined
    emit('update:modelValue', combined)
  } else {
    const file = files[0]!
    internalFiles.value = [file]
    emit('update:modelValue', file)
  }
}

function removeFile(index: number) {
  const current = [...fileList.value]
  current.splice(index, 1)
  internalFiles.value = current
  if (current.length === 0) {
    emit('update:modelValue', null)
  } else if (props.multiple) {
    emit('update:modelValue', current)
  } else {
    const file = current[0]!
    emit('update:modelValue', file)
  }
}
</script>
