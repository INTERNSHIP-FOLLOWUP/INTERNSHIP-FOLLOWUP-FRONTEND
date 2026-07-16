<template>
  <div class="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-4 transition-all duration-200" :class="isDragging ? 'border-indigo-400 bg-indigo-50/70' : ''">
    <div
      class="flex flex-col items-center justify-center gap-2 rounded-xl p-6 text-center"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V8a2 2 0 012-2h6a2 2 0 012 2v8M9 14l3-3 3 3M12 11v9" />
        </svg>
      </div>
      <p class="text-sm font-semibold text-slate-700">
        Drag files here or <button type="button" class="text-indigo-600 hover:underline" @click="openPicker">browse</button>
      </p>
      <p class="text-xs text-slate-500">Allowed: PDF, DOC/DOCX, PNG/JPG, ZIP • Max size: {{ maxSizeMB }}MB per file</p>
    </div>

    <input
      ref="inputRef"
      class="hidden"
      type="file"
      multiple
      :accept="accept"
      @change="onFileChange"
    />

    <div v-if="internalFiles.length" class="mt-4 space-y-2">
      <div class="flex items-center justify-between gap-3">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Selected files</p>
        <button type="button" class="text-xs font-semibold text-red-600 hover:text-red-800" @click="clear">
          Remove all
        </button>
      </div>

      <div class="space-y-2">
        <div
          v-for="(f, idx) in internalFiles"
          :key="`${f.name}-${f.size}-${idx}`"
          class="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3"
        >
          <div class="min-w-0">
            <p class="truncate text-xs font-semibold text-slate-800">{{ f.name }}</p>
            <p class="text-xs text-slate-500">{{ formatBytes(f.size) }}</p>
          </div>
          <button
            type="button"
            class="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100"
            @click="remove(idx)"
            :aria-label="`Remove ${f.name}`"
          >
            Remove
          </button>
        </div>
      </div>
    </div>

    <div v-if="validationError" class="mt-3 text-xs font-semibold text-red-600">
      {{ validationError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const emit = defineEmits<{
  (e: 'update:modelValue', value: File[]): void
  (e: 'validation', value: string | null): void
}>()

const props = withDefaults(
  defineProps<{
    modelValue: File[]
    maxSizeMB?: number
    acceptTypes?: string[]
  }>(),
  {
    maxSizeMB: 10,
    acceptTypes: () => ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.zip'],
  },
)

const internalFiles = computed<File[]>(() => props.modelValue ?? [])

const inputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const validationError = ref('')

const accept = computed(() => props.acceptTypes.join(','))

watch(
  () => props.modelValue,
  () => {
    validationError.value = ''
    emit('validation', null)
  },
)

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes)) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let v = bytes
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i++
  }
  return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${units[i]}`
}

function isAllowed(file: File): boolean {
  const name = file.name.toLowerCase()
  const acceptList = props.acceptTypes.map((value) => value.toLowerCase())
  const matches = acceptList.some((value) => name.endsWith(value))
  return matches
}

function validateFiles(files: File[]): { allowed: File[]; message: string | null } {
  const allowed = files.filter((file) => {
    if (!isAllowed(file)) return false
    const maxBytes = props.maxSizeMB * 1024 * 1024
    return file.size <= maxBytes
  })

  const invalidTypeCount = files.filter((file) => !isAllowed(file)).length
  const tooLargeCount = files.filter((file) => isAllowed(file) && file.size > props.maxSizeMB * 1024 * 1024).length

  let message: string | null = null
  if (invalidTypeCount > 0 && tooLargeCount > 0) {
    message = `Some files were rejected. Use supported types and keep uploads under ${props.maxSizeMB}MB.`
  } else if (invalidTypeCount > 0) {
    message = 'Some files were rejected because their type is not supported.'
  } else if (tooLargeCount > 0) {
    message = `Some files exceed the ${props.maxSizeMB}MB size limit.`
  }

  return { allowed, message }
}

function addFiles(files: File[]) {
  validationError.value = ''
  emit('validation', null)

  const { allowed, message } = validateFiles(files)
  if (message) {
    validationError.value = message
    emit('validation', message)
  }

  const next = [...internalFiles.value, ...allowed]
  emit('update:modelValue', next)
}

function openPicker() {
  inputRef.value?.click()
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

function remove(idx: number) {
  const next = internalFiles.value.filter((_, i) => i !== idx)
  emit('update:modelValue', next)
}

function clear() {
  emit('update:modelValue', [])
}
</script>

