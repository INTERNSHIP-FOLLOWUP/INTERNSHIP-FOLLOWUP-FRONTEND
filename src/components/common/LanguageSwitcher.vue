<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click.stop="open = !open"
      class="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/60"
      :class="[variantClasses]"
      :title="$t('language.switchTo')"
    >
      <svg class="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" />
        <path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10" />
      </svg>
      <span class="hidden sm:inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide" :class="languageStore.isKhmer ? 'text-amber-600' : 'text-primary-600'">{{ languageStore.isKhmer ? 'KH' : 'EN' }}</span>
      <svg
        class="h-3 w-3 text-slate-400 transition-transform duration-200"
        :class="{ 'rotate-180': open }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <transition name="dropdown">
      <div
        v-if="open"
        class="absolute right-0 z-50 mt-1.5 w-40 origin-top-right rounded-xl border border-slate-100 bg-white py-1 shadow-lg ring-1 ring-black/5"
        @click="open = false"
      >
        <button
          @click="switchTo('en')"
          class="flex w-full items-center gap-3 px-3.5 py-2.5 text-sm transition-colors hover:bg-slate-50"
          :class="languageStore.isEnglish ? 'font-semibold text-slate-900' : 'text-slate-600'"
        >
          <span
            class="flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-bold text-white"
            :class="languageStore.isEnglish ? 'bg-primary-500' : 'bg-slate-300'"
          >EN</span>
          <span>{{ $t('language.en') }}</span>
          <svg
            v-if="languageStore.isEnglish"
            class="ml-auto h-4 w-4 text-primary-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <div class="mx-3 border-t border-slate-100"></div>
        <button
          @click="switchTo('km')"
          class="flex w-full items-center gap-3 px-3.5 py-2.5 text-sm transition-colors hover:bg-slate-50"
          :class="languageStore.isKhmer ? 'font-semibold text-slate-900' : 'text-slate-600'"
        >
          <span
            class="flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-bold text-white"
            :class="languageStore.isKhmer ? 'bg-amber-500' : 'bg-slate-300'"
          >KH</span>
          <span>{{ $t('language.km') }}</span>
          <svg
            v-if="languageStore.isKhmer"
            class="ml-auto h-4 w-4 text-amber-500"
            viewBox="0 0 20 20"
            fill="currentColor"
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLanguageStore } from '@/stores/language'
import type { Locale } from '@/i18n'

const props = withDefaults(defineProps<{
  variant?: 'header' | 'standalone'
}>(), {
  variant: 'header',
})

const variantClasses = computed(() => {
  if (props.variant === 'header') {
    return 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
  }
  return 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800 shadow-sm shadow-slate-200/50'
})

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
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-leave-active {
  transition: all 0.1s ease-in;
}
.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-6px) scale(0.95);
}
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-3px) scale(0.97);
}
</style>
