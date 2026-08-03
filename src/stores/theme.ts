import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export interface ColorTheme {
  id: string
  name: string
  label: string
  // CSS hex values for each shade
  shades: {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
    950: string
  }
  // Sidebar gradient "from" and "via" and "to" colors
  sidebarFrom: string
  sidebarVia?: string
  // Preview swatch color (main shade)
  swatch: string
}

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'indigo',
    name: 'indigo',
    label: 'Indigo Blue',
    swatch: '#4f46e5',
    sidebarFrom: '#1e1b4b',
    shades: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      950: '#1e1b4b',
    },
  },
  {
    id: 'violet',
    name: 'violet',
    label: 'Royal Violet',
    swatch: '#7c3aed',
    sidebarFrom: '#1e1030',
    shades: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
      950: '#1e1030',
    },
  },
  {
    id: 'sky',
    name: 'sky',
    label: 'Sky Blue',
    swatch: '#0284c7',
    sidebarFrom: '#082f49',
    shades: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49',
    },
  },
  {
    id: 'teal',
    name: 'teal',
    label: 'Ocean Teal',
    swatch: '#0d9488',
    sidebarFrom: '#042f2e',
    shades: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
      950: '#042f2e',
    },
  },
  {
    id: 'emerald',
    name: 'emerald',
    label: 'Emerald Green',
    swatch: '#059669',
    sidebarFrom: '#022c22',
    shades: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      950: '#022c22',
    },
  },
  {
    id: 'rose',
    name: 'rose',
    label: 'Rose Red',
    swatch: '#e11d48',
    sidebarFrom: '#1f0010',
    shades: {
      50: '#fff1f2',
      100: '#ffe4e6',
      200: '#fecdd3',
      300: '#fda4af',
      400: '#fb7185',
      500: '#f43f5e',
      600: '#e11d48',
      700: '#be123c',
      800: '#9f1239',
      900: '#881337',
      950: '#1f0010',
    },
  },
  {
    id: 'amber',
    name: 'amber',
    label: 'Warm Amber',
    swatch: '#d97706',
    sidebarFrom: '#1c1003',
    shades: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#1c1003',
    },
  },
  {
    id: 'slate',
    name: 'slate',
    label: 'Graphite Slate',
    swatch: '#475569',
    sidebarFrom: '#0f172a',
    shades: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
  },
]

const STORAGE_KEY = 'admin-theme'
const SIDEBAR_STORAGE_KEY = 'admin-sidebar-style'
const DARK_MODE_KEY = 'admin-dark-mode'

export const useThemeStore = defineStore('theme', () => {
  const savedId = localStorage.getItem(STORAGE_KEY) || 'indigo'
  const currentThemeId = ref<string>(savedId)

  const savedSidebarStyle = localStorage.getItem(SIDEBAR_STORAGE_KEY) || 'dark'
  const sidebarStyle = ref<'dark' | 'colored' | 'light'>(
    savedSidebarStyle as 'dark' | 'colored' | 'light',
  )

  const savedDarkMode = localStorage.getItem(DARK_MODE_KEY) === 'true'
  const darkMode = ref<boolean>(savedDarkMode)

  function applyDarkMode(value: boolean) {
    if (value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  async function setDarkMode(value: boolean) {
    darkMode.value = value
    applyDarkMode(value)
    localStorage.setItem(DARK_MODE_KEY, String(value))
    const theme = value ? 'dark' : 'light'
    try {
      await api.put('/auth/profile/theme', { theme })
    } catch {
      // silently fail
    }
  }

  function currentTheme(): ColorTheme {
    return COLOR_THEMES.find((t) => t.id === currentThemeId.value)!
  }

  function applySidebarTheme(theme: ColorTheme, style: 'dark' | 'colored' | 'light') {
    const root = document.documentElement
    const s = theme.shades

    if (style === 'dark') {
      root.style.setProperty('--sidebar-bg', '#0f172a')
      root.style.setProperty('--sidebar-border', 'rgba(30, 41, 59, 0.8)')
      root.style.setProperty('--sidebar-nav-text', '#94a3b8')
      root.style.setProperty('--sidebar-nav-text-hover', '#e2e8f0')
      root.style.setProperty('--sidebar-nav-hover-bg', 'rgba(30, 41, 59, 0.6)')
      root.style.setProperty('--sidebar-user-bg', 'rgba(30, 41, 59, 0.4)')
      root.style.setProperty('--sidebar-nav-active-text', s[400])
      root.style.setProperty('--sidebar-nav-active-border', s[500])
      root.style.setProperty(
        '--sidebar-nav-active-bg',
        `linear-gradient(to right, ${s[500]}26, ${s[400]}1a)`,
      )
      root.style.setProperty('--sidebar-section-text', '#64748b')
      root.style.setProperty('--sidebar-logo-text', '#94a3b8')
      root.style.setProperty('--sidebar-heading', '#ffffff')
      root.style.setProperty('--sidebar-subheading', '#94a3b8')
      root.style.setProperty('--sidebar-user-name', '#ffffff')
      root.style.setProperty('--sidebar-user-role', '#94a3b8')
      root.style.setProperty('--sidebar-avatar-bg', `linear-gradient(135deg, ${s[500]}, ${s[700]})`)
    } else if (style === 'colored') {
      root.style.setProperty('--sidebar-bg', theme.sidebarFrom)
      root.style.setProperty('--sidebar-border', 'rgba(255, 255, 255, 0.08)')
      root.style.setProperty('--sidebar-nav-text', 'rgba(255, 255, 255, 0.6)')
      root.style.setProperty('--sidebar-nav-text-hover', 'rgba(255, 255, 255, 0.9)')
      root.style.setProperty('--sidebar-nav-hover-bg', 'rgba(255, 255, 255, 0.08)')
      root.style.setProperty('--sidebar-user-bg', 'rgba(255, 255, 255, 0.06)')
      root.style.setProperty('--sidebar-nav-active-text', s[300])
      root.style.setProperty('--sidebar-nav-active-border', s[400])
      root.style.setProperty(
        '--sidebar-nav-active-bg',
        `linear-gradient(to right, ${s[500]}33, ${s[400]}1a)`,
      )
      root.style.setProperty('--sidebar-section-text', 'rgba(255, 255, 255, 0.35)')
      root.style.setProperty('--sidebar-logo-text', 'rgba(255, 255, 255, 0.5)')
      root.style.setProperty('--sidebar-heading', '#ffffff')
      root.style.setProperty('--sidebar-subheading', 'rgba(255, 255, 255, 0.5)')
      root.style.setProperty('--sidebar-user-name', '#ffffff')
      root.style.setProperty('--sidebar-user-role', 'rgba(255, 255, 255, 0.5)')
      root.style.setProperty('--sidebar-avatar-bg', `linear-gradient(135deg, ${s[500]}, ${s[700]})`)
    } else {
      // light
      root.style.setProperty('--sidebar-bg', '#ffffff')
      root.style.setProperty('--sidebar-border', '#e2e8f0')
      root.style.setProperty('--sidebar-nav-text', '#64748b')
      root.style.setProperty('--sidebar-nav-text-hover', '#334155')
      root.style.setProperty('--sidebar-nav-hover-bg', '#f1f5f9')
      root.style.setProperty('--sidebar-user-bg', '#f8fafc')
      root.style.setProperty('--sidebar-nav-active-text', s[600])
      root.style.setProperty('--sidebar-nav-active-border', s[500])
      root.style.setProperty(
        '--sidebar-nav-active-bg',
        `linear-gradient(to right, ${s[500]}15, ${s[400]}0d)`,
      )
      root.style.setProperty('--sidebar-section-text', '#94a3b8')
      root.style.setProperty('--sidebar-logo-text', '#64748b')
      root.style.setProperty('--sidebar-heading', '#1e293b')
      root.style.setProperty('--sidebar-subheading', '#64748b')
      root.style.setProperty('--sidebar-user-name', '#1e293b')
      root.style.setProperty('--sidebar-user-role', '#64748b')
      root.style.setProperty('--sidebar-avatar-bg', `linear-gradient(135deg, ${s[500]}, ${s[700]})`)
    }

    // Common theme-aware sidebar properties
    root.style.setProperty('--sidebar-logo-gradient-from', s[500])
    root.style.setProperty('--sidebar-logo-gradient-to', s[700])
    root.style.setProperty('--sidebar-accent', s[500])
  }

  function applyTheme(theme: ColorTheme) {
    const root = document.documentElement
    const s = theme.shades
    root.style.setProperty('--color-primary-50', s[50])
    root.style.setProperty('--color-primary-100', s[100])
    root.style.setProperty('--color-primary-200', s[200])
    root.style.setProperty('--color-primary-300', s[300])
    root.style.setProperty('--color-primary-400', s[400])
    root.style.setProperty('--color-primary-500', s[500])
    root.style.setProperty('--color-primary-600', s[600])
    root.style.setProperty('--color-primary-700', s[700])
    root.style.setProperty('--color-primary-800', s[800])
    root.style.setProperty('--color-primary-900', s[900])
    root.style.setProperty('--color-primary-950', s[950])
    root.style.setProperty('--sidebar-accent', s[500])

    // Apply sidebar style as well
    applySidebarTheme(theme, sidebarStyle.value)
  }

  function setTheme(id: string) {
    currentThemeId.value = id
    const theme = currentTheme()
    applyTheme(theme)
    localStorage.setItem(STORAGE_KEY, id)
  }

  function setSidebarStyle(style: 'dark' | 'colored' | 'light') {
    sidebarStyle.value = style
    applySidebarTheme(currentTheme(), style)
    localStorage.setItem(SIDEBAR_STORAGE_KEY, style)
  }

  // Apply on init
  applyTheme(currentTheme())
  applyDarkMode(darkMode.value)

  watch(currentThemeId, () => {
    applyTheme(currentTheme())
  })

  return {
    currentThemeId,
    sidebarStyle,
    darkMode,
    currentTheme,
    setTheme,
    setSidebarStyle,
    setDarkMode,
    COLOR_THEMES,
  }
})
