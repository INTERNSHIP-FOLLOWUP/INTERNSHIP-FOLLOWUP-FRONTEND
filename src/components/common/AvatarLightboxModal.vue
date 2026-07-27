<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex flex-col bg-black text-white select-none"
        tabindex="0"
        @keydown.esc="close"
        @click.self="close"
      >
        <!-- Top bar: left = back arrow + title, right = close -->
        <div class="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent">
          <!-- Back / Close left -->
          <button
            type="button"
            @click="close"
            title="Close (Esc)"
            class="flex h-9 w-9 items-center justify-center rounded-full text-white hover:bg-white/15 transition-all active:scale-90"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Right: close X -->
          <button
            type="button"
            @click="close"
            title="Close (Esc)"
            class="flex h-9 w-9 items-center justify-center rounded-full text-white hover:bg-white/15 transition-all active:scale-90"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Center: Photo -->
        <div
          class="flex flex-1 items-center justify-center overflow-hidden"
          @click.self="close"
        >
          <!-- Right nav arrow (for future multi-photo use) -->
          <button
            v-if="imageUrl && !imageError"
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/70 transition-all active:scale-90"
            title="Next"
            @click.stop
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <img
            v-if="imageUrl && !imageError"
            :src="imageUrl"
            :alt="title"
            @error="imageError = true"
            class="max-h-[calc(100vh-120px)] max-w-[calc(100vw-40px)] object-contain transition-transform duration-300"
            :style="{ transform: `scale(${zoomScale}) rotate(${rotationDeg}deg)` }"
            @click.stop
          />

          <!-- Fallback initials circle -->
          <div
            v-else
            class="flex h-72 w-72 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 via-teal-600 to-emerald-500 text-7xl font-bold text-white shadow-2xl"
          >
            {{ getInitials(title) }}
          </div>
        </div>

        <!-- Bottom bar: left = name + date, right = action toolbar -->
        <div class="absolute bottom-0 left-0 right-0 z-20 flex items-end justify-between px-4 py-3 bg-gradient-to-t from-black/70 to-transparent">
          <!-- Left: name + subtitle -->
          <div class="flex flex-col gap-0.5 max-w-[55%]">
            <span class="text-[13px] font-semibold text-white leading-tight truncate">{{ title }}</span>
            <span v-if="subtitle" class="text-[11px] text-slate-400 font-mono truncate">{{ subtitle }}</span>
          </div>

          <!-- Right: toolbar icons — share (copy image), zoom-out, zoom-in, rotate, ... -->
          <div class="flex items-center gap-1">
            <!-- Share / Copy Image -->
            <button
              v-if="imageUrl"
              type="button"
              @click="copyImage"
              title="Copy Image"
              class="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/15 transition-all active:scale-90"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>

            <!-- Zoom Out -->
            <button
              v-if="imageUrl && !imageError"
              type="button"
              @click="zoomOut"
              title="Zoom Out"
              class="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/15 transition-all active:scale-90"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>

            <!-- Zoom In -->
            <button
              v-if="imageUrl && !imageError"
              type="button"
              @click="zoomIn"
              title="Zoom In"
              class="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/15 transition-all active:scale-90"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </button>

            <!-- Rotate -->
            <button
              v-if="imageUrl && !imageError"
              type="button"
              @click="rotate"
              title="Rotate"
              class="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/15 transition-all active:scale-90"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <!-- ... More menu -->
            <div class="relative">
              <button
                type="button"
                @click.stop="showContextMenu = !showContextMenu"
                title="More"
                class="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/15 transition-all active:scale-90"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
                </svg>
              </button>

              <!-- Dropdown -->
              <transition name="fade">
                <div
                  v-if="showContextMenu"
                  class="absolute bottom-12 right-0 z-50 w-52 rounded-2xl border border-white/10 bg-[#1e2430]/95 p-1.5 shadow-2xl backdrop-blur-xl text-left"
                  @click.stop
                >
                  <!-- Save As -->
                  <button
                    v-if="imageUrl"
                    type="button"
                    @click="downloadImage"
                    class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-200 hover:bg-white/10 transition-colors"
                  >
                    <div class="flex items-center gap-2.5">
                      <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Save As...</span>
                    </div>
                    <span class="text-[10px] font-mono text-slate-500">Ctrl+S</span>
                  </button>

                  <!-- Upload (editable only) -->
                  <button
                    v-if="editable"
                    type="button"
                    @click="triggerUpload"
                    class="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-200 hover:bg-white/10 transition-colors"
                  >
                    <svg class="h-4 w-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Upload Photo</span>
                  </button>

                  <!-- Divider + Delete -->
                  <template v-if="editable && imageUrl">
                    <div class="my-1 border-t border-white/10"></div>
                    <button
                      type="button"
                      @click="triggerDelete"
                      class="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-rose-400 hover:bg-rose-500/15 transition-colors"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete Photo</span>
                    </button>
                  </template>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- Upload Photo top-center button (editable only, when no image or as CTA) -->
        <div v-if="editable" class="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          <button
            type="button"
            @click="triggerUpload"
            class="flex h-9 items-center gap-2 rounded-full bg-indigo-600/90 px-4 text-xs font-semibold text-white hover:bg-indigo-500 transition-all active:scale-95 shadow-lg backdrop-blur"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Upload Photo
          </button>
        </div>

      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useToastStore } from '@/stores/toast'
import { tokenService } from '@/services/token'

const props = defineProps<{
  show: boolean
  imageUrl?: string | null
  title: string
  subtitle?: string
  editable?: boolean
}>()

const emit = defineEmits<{
  close: []
  upload: []
  delete: []
}>()

const toast = useToastStore()
const showContextMenu = ref(false)
const imageError = ref(false)
const zoomScale = ref(1)
const rotationDeg = ref(0)

watch(() => props.show, (newVal) => {
  if (newVal) {
    showContextMenu.value = false
    imageError.value = false
    zoomScale.value = 1
    rotationDeg.value = 0
  }
})

function close() {
  emit('close')
}

function triggerUpload() {
  showContextMenu.value = false
  emit('upload')
}

function triggerDelete() {
  showContextMenu.value = false
  emit('delete')
}

function zoomIn() {
  if (zoomScale.value < 3) zoomScale.value += 0.25
}

function zoomOut() {
  if (zoomScale.value > 0.5) zoomScale.value -= 0.25
}

function rotate() {
  rotationDeg.value = (rotationDeg.value + 90) % 360
}

function getInitials(name: string): string {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// Helper: fetch image blob — try API download endpoint first (no CORS issues),
// fall back to direct URL fetch with auth token
async function fetchImageBlob(url: string): Promise<Blob> {
  const token = tokenService.getAccessToken()
  const headers: Record<string, string> = {
    Accept: 'image/*,*/*',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(url, {
    headers,
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.blob()
}

async function copyImage() {
  if (!props.imageUrl) return
  showContextMenu.value = false
  try {
    const blob = await fetchImageBlob(props.imageUrl)
    if (navigator.clipboard && window.ClipboardItem) {
      const item = new ClipboardItem({ [blob.type || 'image/png']: blob })
      await navigator.clipboard.write([item])
      toast.success('Image copied to clipboard.', 'Copied')
    } else {
      const img = new Image()
      const url = URL.createObjectURL(blob)
      img.src = url
      await new Promise((res) => { img.onload = res })
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      canvas.toBlob(async (pngBlob) => {
        if (pngBlob && navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlob })])
          toast.success('Image copied to clipboard.', 'Copied')
        } else {
          toast.error('Copy image not supported in this browser.')
        }
      }, 'image/png')
    }
  } catch {
    toast.error('Failed to copy image. Try right-clicking the photo.')
  }
}

async function downloadImage() {
  showContextMenu.value = false
  const token = tokenService.getAccessToken()

  try {
    // ── Strategy 1: Use the dedicated API download endpoint (like PDF export) ──
    const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
    const res = await fetch(`${apiBase}/profile/avatar/download`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        Accept: '*/*',
      },
      credentials: 'include',
    })

    if (!res.ok) throw new Error(`API returned ${res.status}`)

    const blob = await res.blob()

    // Extract filename from Content-Disposition header if available
    const disposition = res.headers.get('Content-Disposition') ?? ''
    const match = disposition.match(/filename="?([^";\n]+)"?/i)
    const filename = match?.[1] ?? `${props.title.replace(/[^a-zA-Z0-9]/g, '_')}_photo.jpg`

    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = filename
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(blobUrl), 2000)
    toast.success(`Saved "${filename}" to Downloads.`, 'Saved')
  } catch {
    // ── Strategy 2: Fallback — direct URL fetch with auth token ──
    if (!props.imageUrl) {
      toast.error('No photo to download.')
      return
    }
    try {
      const blob = await fetchImageBlob(props.imageUrl)
      const ext = blob.type.includes('png') ? '.png' : blob.type.includes('webp') ? '.webp' : '.jpg'
      const filename = `${props.title.replace(/[^a-zA-Z0-9]/g, '_')}_photo${ext}`
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = filename
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000)
      toast.success(`Saved "${filename}" to Downloads.`, 'Saved')
    } catch {
      // ── Strategy 3: Last resort — open in new tab ──
      window.open(props.imageUrl, '_blank')
      toast.success('Photo opened — right-click → Save image as...', 'Save As')
    }
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (!props.show) return
  if (e.key === 'Escape') close()
  if (e.ctrlKey && e.key.toLowerCase() === 's') {
    e.preventDefault()
    downloadImage()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
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
