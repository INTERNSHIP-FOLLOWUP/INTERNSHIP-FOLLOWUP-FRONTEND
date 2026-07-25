<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click.stop="open = !open"
      class="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all duration-200"
      :class="[
        variant === 'header'
          ? 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
          : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800 shadow-sm',
      ]"
      :title="$t('language.switchTo')"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span class="hidden sm:inline">{{ languageStore.isKhmer ? 'KH' : 'EN' }}</span>
      <svg
        class="h-3 w-3 transition-transform duration-200"
        :class="{ 'rotate-180': open }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <transition name="dropdown">
      <div
        v-if="open"
        class="absolute right-0 z-50 mt-1.5 w-36 origin-top-right rounded-xl border border-slate-100 bg-white py-1 shadow-lg ring-1 ring-black/5"
        @click="open = false"
      >
        <button
          @click="switchTo('en')"
          class="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors hover:bg-slate-50"
          :class="languageStore.isEnglish ? 'font-semibold text-primary-600' : 'text-slate-600'"
        >
          <span
            class="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
            :class="languageStore.isEnglish ? 'bg-primary-500' : 'bg-slate-300'"
          >EN</span>
          <span>{{ $t('language.en') }}</span>
          <svg
            v-if="languageStore.isEnglish"
            class="ml-auto h-4 w-4 text-primary-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <button
          @click="switchTo('km')"
          class="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors hover:bg-slate-50"
          :class="languageStore.isKhmer ? 'font-semibold text-primary-600' : 'text-slate-600'"
        >
          <span
            class="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
            :class="languageStore.isKhmer ? 'bg-primary-500' : 'bg-slate-300'"
          >KH</span>
          <span>{{ $t('language.km') }}</span>
          <svg
            v-if="languageStore.isKhmer"
            class="ml-auto h-4 w-4 text-primary-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useLanguageStore } from '@/stores/language'
import type { Locale } from '@/i18n'

defineProps<{
  variant?: 'header' | 'standalone'
}>()

const languageStore = useLanguageStore()

const open = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function switchTo(locale: Locale) {
  languageStore.setLocale(locale)
  open.value = false
}

function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active {
  transition: all 0.2s ease-out;
}
.dropdown-leave-active {
  transition: all 0.15s ease-in;
}
.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
