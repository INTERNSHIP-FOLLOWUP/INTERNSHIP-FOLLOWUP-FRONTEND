<template>
  <!-- Backdrop -->
  <transition name="backdrop-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
      @click="$emit('close')"
    />
  </transition>

  <!-- Panel -->
  <transition name="panel-slide">
    <div
      v-if="isOpen"
      class="fixed right-0 top-0 z-50 flex h-full w-80 flex-col bg-white shadow-2xl shadow-slate-900/20"
    >
      <!-- Panel Header -->
      <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div class="flex items-center gap-2.5">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg"
            :style="{
              backgroundColor: themeStore.currentTheme().shades[100],
              color: themeStore.currentTheme().shades[600],
            }"
          >
            <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-900">Theme Settings</h3>
            <p class="text-[11px] text-slate-400">Customize your dashboard</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Panel Body -->
      <div class="flex-1 overflow-y-auto px-5 py-5">
        <!-- Active Preview Strip -->
        <div
          class="mb-5 overflow-hidden rounded-xl shadow-sm"
          :style="{
            background: `linear-gradient(135deg, ${themeStore.currentTheme().shades[600]}, ${themeStore.currentTheme().shades[400]})`,
          }"
        >
          <div class="px-4 py-3">
            <p class="text-[10px] font-semibold uppercase tracking-widest text-white/70">
              Active Theme
            </p>
            <p class="text-base font-bold text-white">{{ themeStore.currentTheme().label }}</p>
          </div>
          <div class="flex h-2">
            <div
              v-for="shade in [950, 800, 600, 500, 400, 300, 200, 100]"
              :key="shade"
              class="flex-1"
              :style="{ backgroundColor: getThemeShade(themeStore.currentTheme(), shade) }"
            />
          </div>
        </div>

        <!-- Color Palette Presets -->
        <p class="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Color Palettes
        </p>
        <div class="grid grid-cols-2 gap-2.5">
          <button
            v-for="theme in themeStore.COLOR_THEMES"
            :key="theme.id"
            @click="selectTheme(theme.id)"
            class="group relative flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-200"
            :class="
              themeStore.currentThemeId === theme.id
                ? 'border-transparent shadow-md ring-2'
                : 'border-slate-100 hover:border-slate-200 hover:shadow-sm'
            "
            :style="
              themeStore.currentThemeId === theme.id
                ? {
                    borderColor: theme.shades[200],
                    backgroundColor: theme.shades[50],
                    outlineColor: theme.shades[400],
                  }
                : {}
            "
          >
            <!-- Color Swatch -->
            <span
              class="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg shadow-sm"
              :style="{
                background: `linear-gradient(135deg, ${theme.shades[500]}, ${theme.shades[700]})`,
              }"
            >
              <!-- Active checkmark -->
              <svg
                v-if="themeStore.currentThemeId === theme.id"
                class="h-4 w-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
            <div>
              <p
                class="text-xs font-bold leading-tight"
                :style="themeStore.currentThemeId === theme.id ? { color: theme.shades[700] } : {}"
                :class="themeStore.currentThemeId !== theme.id ? 'text-slate-700' : ''"
              >
                {{ theme.label }}
              </p>
              <div class="mt-1.5 flex gap-0.5">
                <span
                  v-for="shade in [400, 500, 600, 700]"
                  :key="shade"
                  class="h-1.5 w-3.5 rounded-full"
                  :style="{ backgroundColor: getThemeShade(theme, shade) }"
                />
              </div>
            </div>
          </button>
        </div>

        <!-- Divider -->
        <div class="my-5 border-t border-slate-100" />

        <!-- Sidebar Style Options -->
        <p class="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Sidebar Style
        </p>
        <div class="flex gap-2.5">
          <button
            v-for="style in sidebarStyles"
            :key="style.id"
            @click="setSidebarStyle(style.id)"
            class="flex flex-1 flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all"
            :class="
              themeStore.sidebarStyle === style.id
                ? 'border-transparent shadow-sm ring-2'
                : 'border-slate-100 hover:border-slate-200'
            "
            :style="
              themeStore.sidebarStyle === style.id
                ? { outlineColor: themeStore.currentTheme().shades[400] }
                : {}
            "
          >
            <!-- Mini Sidebar Preview -->
            <div class="flex h-12 w-full overflow-hidden rounded-lg border border-slate-200">
              <div
                class="flex w-8 flex-col gap-1 p-1"
                :style="{
                  background:
                    style.id === 'dark'
                      ? '#0f172a'
                      : style.id === 'colored'
                        ? themeStore.currentTheme().shades[700]
                        : '#ffffff',
                }"
              >
                <div
                  class="h-1.5 w-full rounded-sm opacity-80"
                  :style="{ background: style.id === 'light' ? '#e2e8f0' : '#ffffff40' }"
                />
                <div
                  class="h-1 w-3/4 rounded-sm opacity-60"
                  :style="{ background: style.id === 'light' ? '#e2e8f0' : '#ffffff30' }"
                />
                <div
                  class="h-1 w-full rounded-sm opacity-60"
                  :style="{ background: style.id === 'light' ? '#e2e8f0' : '#ffffff30' }"
                />
              </div>
              <div class="flex-1 bg-slate-50" />
            </div>
            <span class="text-[10px] font-semibold text-slate-600">{{ style.label }}</span>
          </button>
        </div>

        <!-- Divider -->
        <div class="my-5 border-t border-slate-100" />

        <!-- Reset -->
        <button
          @click="resetTheme"
          class="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-2.5 text-xs font-semibold text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
        >
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.228 5.672L21 9m0 0H9"
            />
          </svg>
          Reset to Default
        </button>
      </div>

      <!-- Panel Footer -->
      <div class="border-t border-slate-100 px-5 py-3">
        <p class="text-center text-[10px] text-slate-400">
          Theme preferences are saved automatically
        </p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

defineProps<{ isOpen: boolean }>()
defineEmits<{ close: [] }>()

const themeStore = useThemeStore()

const sidebarStyles = [
  { id: 'dark', label: 'Dark' },
  { id: 'colored', label: 'Colored' },
  { id: 'light', label: 'Light' },
]

type ShadeKey = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950

function getThemeShade(theme: ReturnType<typeof themeStore.currentTheme>, shade: number): string {
  return theme.shades[shade as ShadeKey] ?? ''
}

function selectTheme(id: string) {
  themeStore.setTheme(id)
}

function setSidebarStyle(style: string) {
  themeStore.setSidebarStyle(style as 'dark' | 'colored' | 'light')
}

function resetTheme() {
  themeStore.setTheme('indigo')
  themeStore.setSidebarStyle('dark')
}
</script>

<style scoped>
.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: opacity 0.25s ease;
}
.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}

.panel-slide-enter-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.panel-slide-leave-active {
  transition: transform 0.2s ease-in;
}
.panel-slide-enter-from,
.panel-slide-leave-to {
  transform: translateX(100%);
}
</style>
