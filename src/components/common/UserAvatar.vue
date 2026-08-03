<template>
  <div
    class="flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full dark:bg-slate-700 bg-slate-100"
    :class="[sizeClass, clickable ? 'cursor-pointer hover:opacity-90 transition-opacity' : '']"
    @click="handleClick"
  >
    <img
      v-if="src && hasImage"
      :src="src"
      alt="Avatar"
      class="h-full w-full object-cover"
      @error="onError"
    />
    <span v-else class="text-xs font-bold dark:text-slate-400 text-slate-500">{{ initials }}</span>

    <AvatarLightboxModal
      v-if="clickable"
      :show="showLightbox"
      :image-url="src"
      :title="name || 'User Avatar'"
      :editable="editable"
      @close="showLightbox = false"
      @upload="$emit('upload')"
      @delete="$emit('delete')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AvatarLightboxModal from '@/components/common/AvatarLightboxModal.vue'

const props = defineProps<{
  avatar?: string | null
  name?: string | null
  size?: 'sm' | 'md' | 'lg'
  clickable?: boolean
  editable?: boolean
}>()

const emit = defineEmits<{
  upload: []
  delete: []
}>()

const showLightbox = ref(false)
const hasImage = ref(true)

function handleClick() {
  if (props.clickable) {
    showLightbox.value = true
  }
}

const sizeMap: Record<string, string> = {
  sm: 'h-8 w-8 text-[10px]',
  md: 'h-10 w-10 text-xs',
  lg: 'h-16 w-16 text-sm',
}
const sizeClass = computed(() => sizeMap[props.size || 'md'] || sizeMap['md'])

function buildSrc(avatar: string | null | undefined): string | '' {
  if (!avatar) return ''
  if (/^https?:\/\//.test(avatar)) return avatar
  const base = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/?api\/?$/, '')
  return `${base}/storage/${(avatar as string).replace(/^\//, '')}`
}

const src = computed(() => buildSrc(props.avatar))
const initials = computed(() => {
  const name = (props.name || '').trim()
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => (n ? n[0] : ''))
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

function onError() {
  hasImage.value = false
}
</script>

<style scoped>
img {
  display: block;
}
</style>