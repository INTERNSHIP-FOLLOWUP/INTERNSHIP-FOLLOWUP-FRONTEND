import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Locale } from '@/i18n'

export const useLanguageStore = defineStore('language', () => {
  const { locale } = useI18n()

  const currentLocale = ref<Locale>((localStorage.getItem('locale') as Locale) || 'en')

  const isKhmer = computed(() => currentLocale.value === 'km')
  const isEnglish = computed(() => currentLocale.value === 'en')

  function setLocale(localeValue: Locale) {
    currentLocale.value = localeValue
    locale.value = localeValue
    localStorage.setItem('locale', localeValue)
    document.documentElement.lang = localeValue
  }

  function toggleLanguage() {
    const newLocale: Locale = currentLocale.value === 'en' ? 'km' : 'en'
    setLocale(newLocale)
  }

  // Initialize
  document.documentElement.lang = currentLocale.value

  return {
    currentLocale,
    isKhmer,
    isEnglish,
    setLocale,
    toggleLanguage,
  }
})
