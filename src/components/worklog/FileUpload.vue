<template>
  <div class="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-4">
    <div
      class="flex flex-col items-center justify-center gap-2 rounded-xl p-6 text-center"
      :class="isDragging ? 'bg-indigo-50 border-indigo-200' : 'bg-white'"
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
        Drag files here or <button type="button" class="text-indigo-600 hover:underline">browse</button>
      </p>
      <p class="text-xs text-slate-500">Allowed: PDF, DOC/DOCX, PNG/JPG, ZIP</p>
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
        <p class="text-xs font-semibold text-slate-500">Selected files</p>
        <button
          type="button"
          class="text-xs font-semibold text-red-600 hover:text-red-800"
          @click="clear"
        >
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

    <div v-if="submitting" class="mt-4 text-xs font-semibold text-slate-500 flex items-center gap-2">
      <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      Uploading...
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const emit = defineEmits<{
  (e: 'update:modelValue', value: File[]): void
}>()

const props = defineProps<{
  modelValue: File[]
}>()

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

function addFiles(files: File[]) {
  validationError.value = ''
  const allowed = files.filter((f) => isAllowed(f))
  const rejected = files.length - allowed.length
  if (rejected > 0) {
    validationError.value = `Some files were rejected. Allowed types: PDF, DOC/DOCX, PNG/JPG, ZIP.`
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

function remove(idx: number) {
  const next = internalFiles.value.filter((_, i) => i !== idx)
  emit('update:modelValue', next)
}

function clear() {
  emit('update:modelValue', [])
}
</script>

