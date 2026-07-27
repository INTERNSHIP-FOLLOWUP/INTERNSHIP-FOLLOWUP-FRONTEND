<template>
  <div
    class="flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100"
    :class="sizeClass"
  >
    <img
      v-if="src"
      :src="src"
      :alt="$t('common.avatar')"
      class="h-full w-full object-cover"
      @error="onError"
    />
    <span v-else class="text-xs font-bold text-slate-500">{{ initials }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  avatar?: string | null
  name?: string | null
  size?: 'sm' | 'md' | 'lg'
}>()

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

const hasImage = ref(true)
function onError() {
  hasImage.value = false
}
</script>

<style scoped>
img {
  display: block;
}
</style>