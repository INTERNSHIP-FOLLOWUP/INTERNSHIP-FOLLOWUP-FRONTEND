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
      class="fixed inset-y-0 left-0 z-30 flex flex-col shadow-2xl transition-all duration-300 lg:static lg:translate-x-0"
      :class="[
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        sidebarCollapsed ? 'w-16' : 'w-64',
      ]"
      :style="sidebarStyles"
    >
      <!-- Logo / Branding -->
      <div
        class="relative flex h-16 items-center transition-all duration-300"
        :class="sidebarCollapsed ? 'justify-center px-4' : 'gap-3 px-6'"
        :style="{ borderBottom: '1px solid var(--sidebar-border)' }"
      >
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white shadow-lg shadow-indigo-500/25 animate-float"
          :style="{
            background: `linear-gradient(135deg, var(--sidebar-logo-gradient-from), var(--sidebar-logo-gradient-to))`,
          }"
        >
          A
        </div>
        <div v-show="!sidebarCollapsed" class="min-w-0">
          <h1 class="truncate text-base font-semibold tracking-tight text-white">Admin Portal</h1>
          <p class="truncate text-xs" :style="{ color: 'var(--sidebar-logo-text)' }">
            Internship Management
          </p>
        </div>
        <!-- Collapse toggle -->
        <button
          @click="toggleSidebarCollapse"
          class="sidebar-nav-link absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-xl p-2 text-sm font-medium transition-all duration-200"
          :style="{ color: 'var(--sidebar-nav-text)' }"
          :title="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <svg
            class="h-4 w-4 transition-transform duration-300"
            :class="sidebarCollapsed ? 'rotate-180' : ''"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 overflow-y-auto px-2 py-4">
        <p
          v-show="!sidebarCollapsed"
          class="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider"
          :style="{ color: 'var(--sidebar-section-text)' }"
        >
          Core Modules
        </p>

        <div class="space-y-1">
          <!-- Single items (no children) -->
          <template v-for="item in flatItems" :key="item.name">
            <router-link
              :to="item.to!"
              @click="sidebarOpen = false"
              class="sidebar-nav-link group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200"
              :class="[
                isActive(item.to!) ? 'shadow-sm border-l-2' : '',
                sidebarCollapsed ? 'justify-center px-2' : '',
              ]"
              :style="navLinkStyle(item.to!, undefined, item)"
            >
              <span
                class="flex h-5 w-5 shrink-0 items-center justify-center transition-transform duration-200"
                :class="isActive(item.to!) ? 'scale-110' : 'group-hover:scale-110'"
                :style="
                  isActive(item.to!) && item.trackShade ? { color: resolveTrackColor(item) } : {}
                "
              >
                <component :is="item.icon" />
              </span>
              <span v-show="!sidebarCollapsed" class="truncate">{{ item.label }}</span>
            </router-link>
          </template>

          <!-- Parent items (with children) -->
          <template v-for="parent in parentItems" :key="parent.name">
            <div>
              <button
                @click.stop="toggleSubMenu(parent.name)"
                class="sidebar-nav-link group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200"
                :class="[
                  isParentActive(parent) ? 'shadow-sm border-l-2' : '',
                  sidebarCollapsed ? 'justify-center px-2' : '',
                ]"
                :style="navLinkStyle(parent.to || '', parent)"
              >
                <span
                  class="flex h-5 w-5 shrink-0 items-center justify-center transition-transform duration-200"
                  :class="isParentActive(parent) ? 'scale-110' : 'group-hover:scale-110'"
                  :style="
                    isParentActive(parent) && parent.trackShade
                      ? { color: resolveTrackColor(parent) }
                      : {}
                  "
                >
                  <component :is="parent.icon" />
                </span>
                <span v-show="!sidebarCollapsed" class="flex-1 truncate text-left">{{
                  parent.label
                }}</span>
                <!-- Chevron -->
                <svg
                  v-show="!sidebarCollapsed"
                  class="h-3.5 w-3.5 transition-transform duration-200"
                  :class="isSubMenuOpen(parent.name) ? 'rotate-90' : ''"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <!-- Sub-menu children -->
              <transition name="submenu">
                <div
                  v-if="isSubMenuOpen(parent.name) && !sidebarCollapsed"
                  class="mt-0.5 space-y-0.5 overflow-hidden pl-3"
                >
                  <router-link
                    v-for="child in parent.children!"
                    :key="child.name"
                    :to="child.to"
                    @click="sidebarOpen = false"
                    class="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200"
                    :class="[route.path === child.to ? 'shadow-sm' : '', 'pl-8']"
                    :style="navChildStyle(child.to, parent)"
                  >
                    <span
                      class="h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200"
                      :class="route.path === child.to ? 'scale-125' : 'group-hover:scale-125'"
                      :style="{
                        backgroundColor:
                          route.path === child.to
                            ? resolveTrackColor(parent)
                            : 'var(--sidebar-nav-text)',
                      }"
                    />
                    <span class="truncate">{{ child.label }}</span>
                  </router-link>
                </div>
              </transition>
            </div>
          </template>
        </div>
      </nav>

      <!-- Bottom: User -->
      <div class="border-t p-3" :style="{ borderColor: 'var(--sidebar-border)' }">
        <!-- User info -->
        <div
          class="flex items-center rounded-xl p-2.5 transition-colors"
          :class="sidebarCollapsed ? 'justify-center' : 'gap-3'"
          :style="{ backgroundColor: 'var(--sidebar-user-bg)' }"
        >
          <div
            class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-bold text-white shadow-md"
            :style="{
              background: userAvatar ? 'transparent' : `linear-gradient(135deg, var(--sidebar-logo-gradient-from), var(--sidebar-logo-gradient-to))`,
            }"
          >
            <img
              v-if="userAvatar"
              :src="userAvatar"
              :alt="user?.name ?? 'Avatar'"
              class="h-full w-full rounded-full object-cover"
            />
            <span v-else>{{ userInitials }}</span>
          </div>
          <div v-show="!sidebarCollapsed" class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold text-white">
              {{ user?.name || 'Administrator' }}
            </p>
            <p class="truncate text-xs" :style="{ color: 'var(--sidebar-logo-text)' }">
              System Admin
            </p>
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
          <!-- Dark Mode Toggle -->
          <button
            @click="themeStore.setDarkMode(!themeStore.darkMode)"
            class="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-600"
            :title="themeStore.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          >
            <svg v-if="!themeStore.darkMode" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <svg v-else class="h-5 w-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
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
                class="flex h-8.5 w-8.5 items-center justify-center overflow-hidden rounded-xl text-xs font-bold text-white shadow-sm"
                :style="{
                  background: userAvatar ? 'transparent' : `linear-gradient(135deg, var(--sidebar-logo-gradient-from), var(--sidebar-logo-gradient-to))`,
                }"
              >
                <img
                  v-if="userAvatar"
                  :src="userAvatar"
                  :alt="user?.name ?? 'Avatar'"
                  class="h-full w-full rounded-xl object-cover"
                />
                <span v-else>{{ userInitials }}</span>
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
                  @click="openLogoutModal"
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
                  Log Out
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

    <!-- Logout Confirmation Modal -->
    <transition name="fade">
      <div
        v-if="logoutModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
        @click="closeLogoutModal"
      >
        <div
          class="w-[92%] max-w-md rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl"
          @click.stop
        >
          <h3 id="logout-modal-title" class="text-base font-semibold text-slate-900">
            Are you sure you want to log out?
          </h3>
          <p class="mt-1 text-sm text-slate-600">You can cancel if you changed your mind.</p>

          <div class="mt-5 flex items-center justify-end gap-3">
            <button
              class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              @click="closeLogoutModal"
              :disabled="loggingOut"
            >
              Cancel
            </button>
            <button
              class="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
              @click="confirmLogout"
              :disabled="loggingOut"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { NAV_ITEMS, type NavItem } from '@/composables/useNavigation'
import ThemeSettingsPanel from '@/components/admin/ThemeSettingsPanel.vue'

const SIDEBAR_COLLAPSED_KEY = 'admin-sidebar-collapsed'

const route = useRoute()
const auth = useAuthStore()
const themeStore = useThemeStore()

const sidebarOpen = ref(false)
const dropdownOpen = ref(false)
const themeSettingsOpen = ref(false)
const sidebarCollapsed = ref(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true')

const expandedMenus = ref<Record<string, boolean>>({})

function isParentActive(parent: NavItem): boolean {
  if (!parent.children) return false
  return parent.children.some((child) => route.path.startsWith(child.to))
}

function isActive(path: string): boolean {
  if (path === '/admin/dashboard') {
    return route.path === '/admin/dashboard'
  }
  return route.path.startsWith(path)
}

const flatItems = computed(() => NAV_ITEMS.filter((item) => !item.children))
const parentItems = computed(() => NAV_ITEMS.filter((item) => item.children))

function toggleSubMenu(name: string): void {
  expandedMenus.value[name] = !expandedMenus.value[name]
}

function isSubMenuOpen(name: string): boolean {
  return !!expandedMenus.value[name]
}

const sidebarStyles = computed(() => ({
  backgroundColor: 'var(--sidebar-bg)',
}))

function resolveTrackColor(item?: NavItem): string {
  if (!item?.trackShade) return 'var(--sidebar-nav-active-border)'
  return themeStore.currentTheme().shades[item.trackShade]
}

function navLinkStyle(to: string, _parent?: NavItem, item?: NavItem): Record<string, string> {
  const navItem = item || _parent
  const active = _parent ? isParentActive(_parent) : isActive(to)
  if (active) {
    const color = resolveTrackColor(navItem)
    return {
      background: `linear-gradient(to right, ${color}18, ${color}0a)`,
      color,
      borderLeftColor: color,
    }
  }
  return { color: 'var(--sidebar-nav-text)' }
}

function navChildStyle(to: string, parent?: NavItem): Record<string, string> {
  if (route.path === to) {
    const color = resolveTrackColor(parent)
    return {
      background: `linear-gradient(to right, ${color}12, ${color}06)`,
      color,
    }
  }
  return { color: 'var(--sidebar-nav-text)' }
}

function toggleSidebarCollapse(): void {
  sidebarCollapsed.value = !sidebarCollapsed.value
  localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(sidebarCollapsed.value))
}

function handleClickOutside(): void {
  dropdownOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Auto-open submenu if a child is active
  for (const parent of parentItems.value) {
    if (parent.children!.some((child) => route.path.startsWith(child.to))) {
      expandedMenus.value[parent.name] = true
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const user = computed(() => auth.user)

const userAvatar = computed(() => auth.userAvatar)

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

const logoutModalOpen = ref(false)
const loggingOut = ref(false)

function openLogoutModal(): void {
  dropdownOpen.value = false
  logoutModalOpen.value = true
}

function closeLogoutModal(): void {
  if (loggingOut.value) return
  logoutModalOpen.value = false
}

async function confirmLogout(): Promise<void> {
  loggingOut.value = true
  try {
    await auth.logout()
  } finally {
    loggingOut.value = false
    logoutModalOpen.value = false
  }
}
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

.submenu-enter-active {
  transition: all 0.2s ease-out;
}
.submenu-leave-active {
  transition: all 0.15s ease-in;
}
.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.sidebar-nav-link:hover {
  background-color: var(--sidebar-nav-hover-bg) !important;
  color: var(--sidebar-nav-text-hover) !important;
}
</style>
