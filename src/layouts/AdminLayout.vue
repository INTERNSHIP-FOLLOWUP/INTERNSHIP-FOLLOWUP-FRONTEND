<template>
  <div class="flex h-screen overflow-hidden bg-slate-50/50">
    <!-- Mobile overlay -->
    <transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
        @click="sidebarOpen = false"
      />
    </transition>

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-30 flex w-64 flex-col shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      :style="sidebarStyles"
    >
      <!-- Logo / Branding -->
      <div class="flex h-16 items-center gap-3 px-6" :style="{ borderBottom: '1px solid var(--sidebar-border)' }">
        <div
          class="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white shadow-lg shadow-indigo-500/25 animate-float"
          :style="{ background: `linear-gradient(135deg, var(--sidebar-logo-gradient-from), var(--sidebar-logo-gradient-to))` }"
        >
          A
        </div>
        <div>
          <h1 class="text-base font-semibold tracking-tight text-white">Admin Portal</h1>
          <p class="text-xs" :style="{ color: 'var(--sidebar-logo-text)' }">Internship Management</p>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p class="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider" :style="{ color: 'var(--sidebar-section-text)' }">
          Core Modules
        </p>
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.to"
          @click="sidebarOpen = false"
          class="sidebar-nav-link group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200"
          :class="isActive(item.to) ? 'shadow-sm border-l-2' : ''"
          :style="navLinkStyle(item.to)"
        >
          <span
            class="flex h-5 w-5 items-center justify-center transition-transform duration-200"
            :class="isActive(item.to) ? 'scale-110' : 'group-hover:scale-110'"
          >
            <component :is="item.icon" />
          </span>
          {{ item.label }}
        </router-link>
      </nav>

      <!-- Bottom User details -->
      <div class="p-4" :style="{ borderTop: '1px solid var(--sidebar-border)' }">
        <div
          class="flex items-center gap-3 rounded-xl p-3 transition-colors"
          :style="{ backgroundColor: 'var(--sidebar-user-bg)' }"
        >
          <div
            class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
            :style="{ background: `linear-gradient(135deg, var(--sidebar-logo-gradient-from), var(--sidebar-logo-gradient-to))` }"
          >
            {{ userInitials }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold text-white">
              {{ user?.name || 'Administrator' }}
            </p>
            <p class="truncate text-xs" :style="{ color: 'var(--sidebar-logo-text)' }">System Admin</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Panel -->
    <div class="flex flex-1 flex-col lg:pl-0">
      <!-- Header -->
      <header
        class="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-4 shadow-sm backdrop-blur-lg lg:px-6"
      >
        <div class="flex items-center gap-3">
          <button
            class="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 lg:hidden"
            @click="sidebarOpen = !sidebarOpen"
            aria-label="Toggle navigation"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="!sidebarOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div class="flex flex-col">
            <h2 class="text-lg font-bold text-slate-900">{{ pageTitle }}</h2>
          </div>
        </div>

        <!-- User Controls / Notifications -->
        <div class="flex items-center gap-3">
          <!-- Theme Settings Button -->
          <button
            @click.stop="themeSettingsOpen = !themeSettingsOpen"
            class="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-600"
            :class="{ 'bg-slate-50 text-slate-700 ring-2 ring-slate-200': themeSettingsOpen }"
            title="Theme Settings"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
            <!-- Color swatch indicator -->
            <span
              class="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white shadow-sm"
              :style="{ backgroundColor: themeStore.currentTheme().shades[500] }"
            />
          </button>

          <!-- Notification Bell -->
          <div class="relative">
            <button
              class="relative rounded-xl p-2.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600 focus:outline-none"
            >
              <svg class="h-5.5 w-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span class="absolute right-2.5 top-2.5 flex h-2 w-2">
                <span
                  class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                  :style="{ backgroundColor: themeStore.currentTheme().shades[400] }"
                />
                <span
                  class="relative inline-flex h-2 w-2 rounded-full"
                  :style="{ backgroundColor: themeStore.currentTheme().shades[500] }"
                />
              </span>
            </button>
          </div>

          <!-- Vertical Separator -->
          <div class="h-6 w-[1px] bg-slate-200" />

          <!-- Dropdown Profile -->
          <div class="relative">
            <button
              class="flex items-center gap-2.5 rounded-xl p-1.5 transition-colors hover:bg-slate-50"
              @click.stop="dropdownOpen = !dropdownOpen"
            >
              <div
                class="flex h-8.5 w-8.5 items-center justify-center rounded-xl text-xs font-bold text-white shadow-sm"
                :style="{ background: `linear-gradient(135deg, var(--sidebar-logo-gradient-from), var(--sidebar-logo-gradient-to))` }"
              >
                {{ userInitials }}
              </div>
              <div class="hidden text-left md:block">
                <p class="text-sm font-semibold leading-tight text-slate-800">
                  {{ user?.name || 'Admin User' }}
                </p>
                <p class="text-[11px] font-medium leading-tight text-slate-400">System Admin</p>
              </div>
              <svg
                class="h-4 w-4 text-slate-400 transition-transform duration-200"
                :class="{ 'rotate-180': dropdownOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <transition name="dropdown">
              <div
                v-if="dropdownOpen"
                class="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-2xl border border-slate-100 bg-white py-1.5 shadow-xl ring-1 ring-black/5"
                @click="dropdownOpen = false"
              >
                <div class="border-b border-slate-50 px-4 py-3">
                  <p class="text-sm font-semibold text-slate-900">
                    {{ user?.name || 'Admin User' }}
                  </p>
                  <p class="truncate text-xs text-slate-500">
                    {{ user?.email || 'admin@example.com' }}
                  </p>
                </div>
                <router-link
                  to="/admin/profile"
                  class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <svg
                    class="h-4.5 w-4.5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Profile Settings
                </router-link>
                <hr class="my-1 border-slate-100" />
                <button
                  @click="handleLogout"
                  class="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <svg
                    class="h-4.5 w-4.5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </button>
              </div>
            </transition>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto">
        <div class="mx-auto max-w-7xl p-4 lg:p-6">
          <router-view />
        </div>
      </main>
    </div>

    <!-- Theme Settings Panel -->
    <ThemeSettingsPanel :is-open="themeSettingsOpen" @close="themeSettingsOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, h, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import ThemeSettingsPanel from '@/components/admin/ThemeSettingsPanel.vue'

const route = useRoute()
const auth = useAuthStore()
const themeStore = useThemeStore()

const sidebarOpen = ref(false)
const dropdownOpen = ref(false)
const themeSettingsOpen = ref(false)

const sidebarStyles = computed(() => ({
  backgroundColor: 'var(--sidebar-bg)',
}))

function navLinkStyle(to: string): Record<string, string> {
  if (isActive(to)) {
    return {
      background: 'var(--sidebar-nav-active-bg)',
      color: 'var(--sidebar-nav-active-text)',
      borderColor: 'var(--sidebar-nav-active-border)',
    }
  }
  return {
    color: 'var(--sidebar-nav-text)',
  }
}

function handleClickOutside() {
  if (dropdownOpen.value) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const user = computed(() => auth.user)

const userInitials = computed(() => {
  const name = user.value?.name || 'Admin User'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const pageTitle = computed(() => {
  const title = route.meta?.title
  return typeof title === 'string' ? title : 'Admin Dashboard'
})

function isActive(path: string) {
  if (path === '/admin/dashboard') {
    return route.path === '/admin/dashboard'
  }
  return route.path.startsWith(path)
}

async function handleLogout() {
  dropdownOpen.value = false
  await auth.logout()
}

function createIcon(path: string) {
  return defineComponent({
    setup() {
      return () =>
        h(
          'svg',
          {
            class: 'h-5.5 w-5.5',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24',
          },
          [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              'stroke-width': 2,
              d: path,
            }),
          ],
        )
    },
  })
}

interface NavItem {
  name: string
  label: string
  to: string
  icon: ReturnType<typeof defineComponent>
}

const navItems: NavItem[] = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    to: '/admin/dashboard',
    icon: createIcon(
      'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    ),
  },
  {
    name: 'companies',
    label: 'Companies',
    to: '/admin/companies',
    icon: createIcon(
      'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    ),
  },
  {
    name: 'students',
    label: 'Students',
    to: '/admin/students',
    icon: createIcon(
      'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
    ),
  },
  {
    name: 'batches',
    label: 'Batches',
    to: '/admin/batches',
    icon: createIcon(
      'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    ),
  },
  {
    name: 'assignments',
    label: 'Assignments',
    to: '/admin/assignments',
    icon: createIcon(
      'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    ),
  },
  {
    name: 'reports',
    label: 'Reports',
    to: '/admin/reports',
    icon: createIcon(
      'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    ),
  },
]
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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

.sidebar-nav-link:hover {
  background-color: var(--sidebar-nav-hover-bg) !important;
  color: var(--sidebar-nav-text-hover) !important;
}
</style>
