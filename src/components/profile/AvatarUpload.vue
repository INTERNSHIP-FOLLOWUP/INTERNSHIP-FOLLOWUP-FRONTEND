<template>
  <div class="rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <div class="border-b border-slate-100 px-6 py-4 dark:border-slate-700">
      <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Avatar</h2>
      <p class="text-xs text-slate-500 dark:text-slate-400">Upload a new avatar image.</p>
    </div>
    <div class="px-6 py-5">
      <ErrorAlert :message="store.error" />
      <div class="flex items-center gap-4">
        <div class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="h-full w-full object-cover" />
          <svg v-else class="h-10 w-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
          <button
            type="button"
            @click="fileInput?.click()"
            :disabled="store.loading"
            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <svg v-if="store.loading" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ store.loading ? 'Uploading...' : 'Upload Avatar' }}
          </button>
          <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">JPG, JPEG, PNG up to 2MB.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProfileStore } from '@/stores/profile'
import ErrorAlert from '@/components/common/ErrorAlert.vue'
import { useToastStore } from '@/stores/toast'

const store = useProfileStore()
const toast = useToastStore()
const fileInput = ref(null)

const avatarUrl = computed(() => {
  const avatar = store.profile?.avatar
  if (!avatar) return ''
  if (/^https?:\/\//.test(avatar)) return avatar
  const base = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/?api\/?$/, '')
  return `${base}/storage/${avatar.replace(/^\//, '')}`
})

function onFileChange(event) {
  const files = event.target?.files
  const file = files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    toast.error('Please select a valid image file.', 'Invalid File')
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    toast.error('Image must not exceed 2MB.', 'File Too Large')
    return
  }

  const formData = new FormData()
  formData.append('avatar', file)

  store.uploadAvatar(formData).then(() => {
    toast.success('Avatar updated successfully.', 'Avatar')
  })
}
</script>
