<template>
  <div class="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900">
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
      <!-- Logo -->
      <div
        class="flex h-16 items-center gap-3 px-6"
        :style="{ borderBottom: '1px solid var(--sidebar-border)' }"
      >
        <div
          class="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white shadow-lg"
          :style="{
            background: `linear-gradient(135deg, var(--sidebar-logo-gradient-from), var(--sidebar-logo-gradient-to))`,
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          }"
        >
          S
        </div>
        <div>
          <h1 class="text-base font-semibold tracking-tight" :style="{ color: 'var(--sidebar-heading)' }">
            Tutor Panel
          </h1>
          <p class="text-xs" :style="{ color: 'var(--sidebar-subheading)' }">Internship System</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-4" :class="{ 'pointer-events-none opacity-40 select-none': isInactive }">
        <p
          class="px-3 pb-2 text-xs font-semibold uppercase tracking-wider"
          :style="{ color: 'var(--sidebar-section-text)' }"
        >
          Menu
        </p>
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.to"
          @click="sidebarOpen = false"
          class="sidebar-nav-link group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200"
          :class="isActive(item.to) ? 'sidebar-nav-active' : ''"
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

        <!-- Inactive overlay on sidebar nav -->
        <div v-if="isInactive" class="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2.5 text-center mt-4">
          <p class="text-xs font-medium text-amber-300">Activate your account</p>
          <p class="text-[10px] text-amber-400/70 mt-0.5">Set a new password to unlock all features</p>
        </div>

        <!-- Messages submenu -->
        <div>
          <button
            @click="toggleMessagesSubmenu"
            class="sidebar-nav-link group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200"
            :class="(messagesSubmenuOpen || isMessagesActive) ? 'sidebar-nav-active' : ''"
            :style="navMenuButtonStyle"
          >
            <span
              class="flex h-5 w-5 items-center justify-center transition-transform duration-200"
              :class="messagesSubmenuOpen || isMessagesActive ? 'scale-110' : 'group-hover:scale-110'"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </span>
            <span class="flex-1 text-left">Messages</span>
            <svg
              class="h-4 w-4 transition-transform duration-200"
              :class="{ 'rotate-180': messagesSubmenuOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <transition name="submenu">
            <div v-if="messagesSubmenuOpen" class="mt-1 space-y-0.5 pl-10">
              <router-link
                v-for="sub in messagesSubItems"
                :key="sub.name"
                :to="sub.to"
                @click="sidebarOpen = false"
                class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200"
                :class="isMessagesSubActive(sub.type) ? 'shadow-sm' : ''"
                :style="navChildStyle(sub.type)"
              >
                <span
                  class="flex h-1.5 w-1.5 rounded-full transition-all duration-200"
                  :class="isMessagesSubActive(sub.type) ? 'scale-125' : ''"
                  :style="{
                    backgroundColor: isMessagesSubActive(sub.type) ? 'var(--sidebar-nav-active-border)' : 'var(--sidebar-nav-text)',
                  }"
                />
                {{ sub.label }}
              </router-link>
            </div>
          </transition>
        </div>
      </nav>

      <!-- Bottom user card -->
      <div class="border-t p-4" :style="{ borderColor: 'var(--sidebar-border)' }">
        <div
          class="flex items-center gap-3 rounded-xl p-3"
          :style="{ backgroundColor: 'var(--sidebar-user-bg)' }"
        >
          <UserAvatar :avatar="user?.avatar" :name="user?.name" size="sm" />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium" :style="{ color: 'var(--sidebar-user-name)' }">
              {{ user?.name }}
            </p>
            <p class="truncate text-xs" :style="{ color: 'var(--sidebar-user-role)' }">Tutor</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main content area -->
    <div class="flex flex-1 flex-col lg:pl-0">
      <!-- Header -->
      <header
        class="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 shadow-sm backdrop-blur-lg lg:px-6 dark:border-slate-700 dark:bg-slate-800/80"
      >
        <div class="flex items-center gap-3">
          <button
            class="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
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
          <h2 class="text-lg font-semibold text-gray-800 dark:text-slate-100">{{ pageTitle }}</h2>
        </div>

        <div class="flex items-center gap-2">
          <!-- Notifications -->
          <NotificationBell />

          <!-- Language Switcher -->
              <LanguageSwitcher variant="header" />
              <!-- Dark Mode Toggle -->
          <button
            @click="themeStore.setDarkMode(!themeStore.darkMode)"
            class="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
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
            class="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            :class="{ 'bg-slate-100 text-slate-700 ring-2 ring-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:ring-slate-600': themeSettingsOpen }"
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
              class="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white shadow-sm dark:border-slate-700"
              :style="{ backgroundColor: themeStore.currentTheme().shades[500] }"
            />
          </button>

          <!-- User dropdown -->
          <div class="relative">
            <button
              class="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-slate-700"
              @click.stop="dropdownOpen = !dropdownOpen"
            >
          <UserAvatar :avatar="user?.avatar" :name="user?.name" size="sm" />
              <div class="hidden text-left md:block">
                <p class="text-sm font-medium leading-tight text-gray-700 dark:text-slate-300">
                  {{ user?.name }}
                </p>
                <p class="text-xs leading-tight text-gray-400 dark:text-slate-500">Tutor</p>
              </div>
              <svg
                class="h-4 w-4 text-gray-400 transition-transform"
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

            <transition name="dropdown">
              <div
                v-if="dropdownOpen"
                class="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl border border-gray-100 bg-white py-1 shadow-lg ring-1 ring-black/5 dark:border-slate-700 dark:bg-slate-800"
                @click="dropdownOpen = false"
              >
                <div class="border-b border-gray-100 px-4 py-3 dark:border-slate-700">
                  <p class="text-sm font-medium text-gray-900 dark:text-slate-100">{{ user?.name }}</p>
                  <p class="truncate text-xs text-gray-500 dark:text-slate-400">{{ user?.email }}</p>
                </div>
                <router-link
                  to="/tutor/profile"
                  class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
                >
                  <svg
                    class="h-4.5 w-4.5 text-gray-400 dark:text-slate-500"
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
                <hr class="my-1 border-gray-100 dark:border-slate-700" />
                <button
                  @click="openLogoutModal"
                  class="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
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

      <!-- Page content -->
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
          class="w-[92%] max-w-md rounded-2xl border border-gray-100 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
          @click.stop
        >
          <h3 id="logout-modal-title" class="text-base font-semibold text-gray-900 dark:text-slate-100">
            Are you sure you want to log out?
          </h3>
          <p class="mt-1 text-sm text-gray-600 dark:text-slate-400">You can cancel if you changed your mind.</p>

          <div class="mt-5 flex items-center justify-end gap-3">
            <button
              class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
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
import { ref, computed, watch, onMounted, onUnmounted, h, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import UserAvatar from '@/components/common/UserAvatar.vue'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import NotificationBell from '@/components/common/NotificationBell.vue'
import ThemeSettingsPanel from '@/components/admin/ThemeSettingsPanel.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const route = useRoute()
const auth = useAuthStore()
const themeStore = useThemeStore()

const sidebarOpen = ref(false)
const dropdownOpen = ref(false)
const themeSettingsOpen = ref(false)

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

const isInactive = computed(() => auth.user?.status === 'inactive')

const userInitials = computed(() => {
  if (!user.value?.name) return '?'
  return user.value.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const messagesSubmenuOpen = ref(false)

function toggleMessagesSubmenu() {
  messagesSubmenuOpen.value = !messagesSubmenuOpen.value
}

const isMessagesActive = computed(() => route.path.startsWith('/tutor/messages'))

function isMessagesSubActive(type: string) {
  return route.query.type === type || (!route.query.type && type === 'company')
}

// Auto-open submenu when navigating to a messages page
watch(
  () => route.path,
  (path) => {
    if (path.startsWith('/tutor/messages')) {
      messagesSubmenuOpen.value = true
    }
  },
  { immediate: true }
)

const messagesSubItems = [
  {
    name: 'company-messages',
    label: 'Company',
    to: '/tutor/messages?type=company',
    type: 'company',
  },
  {
    name: 'student-messages',
    label: 'Students',
    to: '/tutor/messages?type=students',
    type: 'students',
  },
]

const sidebarStyles = computed(() => ({
  backgroundColor: 'var(--sidebar-bg)',
}))

function isActive(path: string) {
  if (path === '/tutor') {
    return route.path === '/tutor'
  }
  return route.path.startsWith(path)
}

function navLinkStyle(to: string): Record<string, string> {
  if (isActive(to)) {
    return {
      background: 'var(--sidebar-nav-active-bg)',
      color: 'var(--sidebar-nav-active-text)',
      borderLeft: '2px solid var(--sidebar-nav-active-border)',
    }
  }
  return {
    color: 'var(--sidebar-nav-text)',
  }
}

const navMenuButtonStyle = computed((): Record<string, string> => {
  if (messagesSubmenuOpen.value || isMessagesActive.value) {
    return {
      background: 'var(--sidebar-nav-active-bg)',
      color: 'var(--sidebar-nav-active-text)',
      borderLeft: '2px solid var(--sidebar-nav-active-border)',
    }
  }
  return {
    color: 'var(--sidebar-nav-text)',
  }
})

function navChildStyle(type: string): Record<string, string> {
  const isSubActive = isMessagesSubActive(type)
  if (isSubActive) {
    return {
      background: 'var(--sidebar-nav-active-bg)',
      color: 'var(--sidebar-nav-active-text)',
    }
  }
  return {
    color: 'var(--sidebar-nav-text)',
  }
}

const pageTitle = computed(() => {
  const map: Record<string, string> = {
    TutorDashboard: 'nav.tutor.dashboard',
    TutorStudents: 'nav.tutor.myStudents',
    TutorStudentDetail: 'nav.tutor.studentDetails',
    TutorWorklogs: 'nav.tutor.worklogs',
    TutorEvaluations: 'nav.tutor.evaluations',
    TutorWorklogDetail: 'nav.tutor.reviewWorklog',
    TutorFollowups: 'nav.tutor.followups',
    TutorIssues: 'nav.tutor.issues',
    TutorFeedback: 'nav.tutor.companyFeedback',
    TutorMessages: 'nav.tutor.messages',
    TutorSelfProfile: 'nav.tutor.profile',
    TutorProfile: 'nav.tutor.profile',
  }
  const name = route.name
  if (typeof name === 'string' && map[name]) {
    return t(map[name])
  }
  const title = route.meta?.title
  return typeof title === 'string' ? title : 'Dashboard'
})

const logoutModalOpen = ref(false)
const loggingOut = ref(false)

function openLogoutModal() {
  dropdownOpen.value = false
  logoutModalOpen.value = true
}

function closeLogoutModal() {
  if (loggingOut.value) return
  logoutModalOpen.value = false
}

async function confirmLogout() {
  loggingOut.value = true
  try {
    await auth.logout()
  } finally {
    loggingOut.value = false
    logoutModalOpen.value = false
  }
}

function createIcon(path: string) {
  return defineComponent({
    setup() {
      return () =>
        h(
          'svg',
          {
            class: 'h-5 w-5',
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
    to: '/tutor',
    icon: createIcon(
      'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    ),
  },
  {
    name: 'students',
    label: 'My Students',
    to: '/tutor/students',
    icon: createIcon(
      'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
    ),
  },
  {
    name: 'worklogs',
    label: 'Worklogs',
    to: '/tutor/worklogs',
    icon: createIcon(
      'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    ),
  },
  {
    name: 'followups',
    label: 'Follow-ups',
    to: '/tutor/followups',
    icon: createIcon(
      'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    ),
  },
  {
    name: 'issues',
    label: 'Issue Tracker',
    to: '/tutor/issues',
    icon: createIcon(
      'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
    ),
  },
  {
    name: 'evaluations',
    label: 'Company Evaluations',
    to: '/tutor/evaluations',
    icon: createIcon(
      'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    ),
  },
  {
    name: 'feedback',
    label: 'Company Feedback',
    to: '/tutor/feedback',
    icon: createIcon(
      'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
    ),
  },
  // Messages is rendered separately as a submenu item below
  {
    name: 'profile',
    label: 'Profile',
    to: '/tutor/profile',
    icon: createIcon('M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'),
  },
]
</script>

<style scoped>
.submenu-enter-active {
  transition: all 0.2s ease-out;
}
.submenu-leave-active {
  transition: all 0.15s ease-in;
}
.submenu-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.submenu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

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
  background: var(--sidebar-nav-hover-bg) !important;
  color: var(--sidebar-nav-text-hover) !important;
}

.sidebar-nav-active {
  background: var(--sidebar-nav-active-bg) !important;
  color: var(--sidebar-nav-active-text) !important;
}
</style>
