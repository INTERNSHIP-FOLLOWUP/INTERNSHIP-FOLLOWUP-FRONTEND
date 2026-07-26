<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in"
        @click.self="cancel"
      >
        <div class="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 transition-all duration-200 scale-100">
          <!-- Modal Header -->
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Edit & Confirm Photo</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Adjust, rotate, and confirm your profile picture before saving.</p>
            </div>
            <button
              type="button"
              @click="cancel"
              class="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition-colors"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Preview & Crop Guide Container -->
          <div class="my-6 flex flex-col items-center justify-center">
            <div class="relative flex h-64 w-64 items-center justify-center overflow-hidden rounded-full border-4 border-indigo-500/80 bg-slate-950 shadow-2xl ring-4 ring-indigo-500/20">
              <img
                v-if="previewUrl"
                ref="imageRef"
                :src="previewUrl"
                alt="Selected Photo"
                class="max-h-full max-w-full object-cover transition-transform duration-150"
                :style="{ transform: `scale(${zoomScale}) rotate(${rotationDeg}deg)` }"
              />
            </div>

            <!-- Image Info -->
            <p v-if="file" class="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
              {{ file.name }} • {{ (file.size / 1024).toFixed(1) }} KB
            </p>

            <!-- Editing Controls Toolbar -->
            <div class="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-800/80">
              <button
                type="button"
                @click="rotateLeft"
                title="Rotate Left 90°"
                class="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-white hover:text-indigo-600 shadow-xs dark:text-slate-300 dark:hover:bg-slate-700 transition-all active:scale-95"
              >
                <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>

              <button
                type="button"
                @click="rotateRight"
                title="Rotate Right 90°"
                class="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-white hover:text-indigo-600 shadow-xs dark:text-slate-300 dark:hover:bg-slate-700 transition-all active:scale-95"
              >
                <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                </svg>
              </button>

              <div class="h-5 w-px bg-slate-200 dark:bg-slate-700"></div>

              <button
                type="button"
                @click="zoomOut"
                title="Zoom Out"
                class="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-white hover:text-indigo-600 shadow-xs dark:text-slate-300 dark:hover:bg-slate-700 transition-all active:scale-95"
              >
                <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
              </button>

              <span class="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 min-w-[42px] text-center">
                {{ Math.round(zoomScale * 100) }}%
              </span>

              <button
                type="button"
                @click="zoomIn"
                title="Zoom In"
                class="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-white hover:text-indigo-600 shadow-xs dark:text-slate-300 dark:hover:bg-slate-700 transition-all active:scale-95"
              >
                <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </button>

              <div class="h-5 w-px bg-slate-200 dark:bg-slate-700"></div>

              <button
                type="button"
                @click="reset"
                title="Reset Adjustments"
                class="flex h-9 px-2.5 items-center justify-center rounded-xl text-xs font-semibold text-slate-500 hover:bg-white hover:text-slate-800 shadow-xs dark:text-slate-400 dark:hover:bg-slate-700 transition-all active:scale-95"
              >
                Reset
              </button>
            </div>
          </div>

          <!-- Modal Action Buttons (Confirm Save & Cancel) -->
          <div class="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
            <button
              type="button"
              @click="cancel"
              :disabled="saving"
              class="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              @click="confirmSave"
              :disabled="saving"
              class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
            >
              <svg v-if="saving" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ saving ? 'Saving Photo...' : 'Save & Confirm' }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps<{
  show: boolean
  file: File | null
  saving?: boolean
}>()

const emit = defineEmits<{
  confirm: [editedFile: File]
  cancel: []
}>()

const previewUrl = ref<string | null>(null)
const zoomScale = ref(1)
const rotationDeg = ref(0)
const imageRef = ref<HTMLImageElement | null>(null)

watch(() => props.file, (newFile) => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
  if (newFile) {
    previewUrl.value = URL.createObjectURL(newFile)
    zoomScale.value = 1
    rotationDeg.value = 0
  }
}, { immediate: true })

onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})

function zoomIn() {
  if (zoomScale.value < 2.5) zoomScale.value += 0.15
}

function zoomOut() {
  if (zoomScale.value > 0.6) zoomScale.value -= 0.15
}

function rotateLeft() {
  rotationDeg.value = (rotationDeg.value - 90 + 360) % 360
}

function rotateRight() {
  rotationDeg.value = (rotationDeg.value + 90) % 360
}

function reset() {
  zoomScale.value = 1
  rotationDeg.value = 0
}

function cancel() {
  emit('cancel')
}

async function confirmSave() {
  if (!props.file || !previewUrl.value) {
    cancel()
    return
  }

  // If rotated or scaled, render to HTML Canvas to produce edited File
  if (rotationDeg.value !== 0 || zoomScale.value !== 1) {
    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = previewUrl.value
      await new Promise((res, rej) => {
        img.onload = res
        img.onerror = rej
      })

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (ctx) {
        const size = Math.max(img.width, img.height)
        canvas.width = size
        canvas.height = size

        ctx.translate(size / 2, size / 2)
        ctx.rotate((rotationDeg.value * Math.PI) / 180)
        ctx.scale(zoomScale.value, zoomScale.value)
        ctx.drawImage(img, -img.width / 2, -img.height / 2)

        canvas.toBlob((blob) => {
          if (blob) {
            const edited = new File([blob], props.file!.name, { type: props.file!.type || 'image/jpeg' })
            emit('confirm', edited)
          } else {
            emit('confirm', props.file!)
          }
        }, props.file.type || 'image/jpeg', 0.92)
        return
      }
    } catch {
      // Fallback if canvas transformation fails
    }
  }

  emit('confirm', props.file)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
