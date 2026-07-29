import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import km from '@/locales/km.json'

export type Locale = 'en' | 'km'

const storedLocale = (localStorage.getItem('locale') as Locale) || 'en'

const i18n = createI18n({
  legacy: false,
  locale: storedLocale,
  fallbackLocale: 'en',
  warnHtmlMessage: false,
  messages: {
    en,
    km,
  },
})

export default i18n
