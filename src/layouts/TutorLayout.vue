<template>
  <div class="flex h-screen overflow-hidden bg-gray-50">
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
      class="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-slate-900 shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Logo -->
      <div class="flex h-16 items-center gap-3 border-b border-slate-700/50 px-6">
        <div
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/25"
        >
          S
        </div>
        <div>
          <h1 class="text-base font-semibold tracking-tight text-white">Tutor Panel</h1>
          <p class="text-xs text-slate-400">Internship System</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p class="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Menu
        </p>
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.to"
          @click="sidebarOpen = false"
          class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200"
          :class="
            isActive(item.to)
              ? 'bg-gradient-to-r from-indigo-500/15 to-purple-500/10 text-indigo-400 shadow-sm'
              : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
          "
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

      <!-- Bottom user card -->
      <div class="border-t border-slate-700/50 p-4">
        <div class="flex items-center gap-3 rounded-lg bg-slate-800/50 p-3">
          <div
            class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-sm font-bold text-white shadow-lg"
          >
            {{ userInitials }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-white">{{ user?.name }}</p>
            <p class="truncate text-xs text-slate-400">Tutor</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main content area -->
    <div class="flex flex-1 flex-col lg:pl-0">
      <!-- Header -->
      <header
        class="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 shadow-sm backdrop-blur-lg lg:px-6"
      >
        <div class="flex items-center gap-3">
          <button
            class="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
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
          <h2 class="text-lg font-semibold text-gray-800">{{ pageTitle }}</h2>
        </div>

        <div class="flex items-center gap-2">
          <!-- Notifications -->
          <button
            class="relative rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span class="absolute right-2 top-2 flex h-2 w-2">
              <span
                class="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"
              />
              <span class="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
            </span>
          </button>

          <!-- User dropdown -->
          <div class="relative">
            <button
              class="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-gray-100"
              @click.stop="dropdownOpen = !dropdownOpen"
            >
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-xs font-bold text-white shadow-sm"
              >
                {{ userInitials }}
              </div>
              <div class="hidden text-left md:block">
                <p class="text-sm font-medium leading-tight text-gray-700">
                  {{ user?.name }}
                </p>
                <p class="text-xs leading-tight text-gray-400">Tutor</p>
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
                class="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl border border-gray-100 bg-white py-1 shadow-lg ring-1 ring-black/5"
                @click="dropdownOpen = false"
              >
                <div class="border-b border-gray-100 px-4 py-3">
                  <p class="text-sm font-medium text-gray-900">{{ user?.name }}</p>
                  <p class="truncate text-xs text-gray-500">{{ user?.email }}</p>
                </div>
                <router-link
                  to="/tutor/profile"
                  class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Profile Settings
                </router-link>
                <hr class="my-1 border-gray-100" />
                <button
                  @click="openLogoutModal"
                  class="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
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
          class="w-[92%] max-w-md rounded-2xl border border-gray-100 bg-white p-5 shadow-2xl"
          @click.stop
        >
          <h3 id="logout-modal-title" class="text-base font-semibold text-gray-900">
            Are you sure you want to log out?
          </h3>
          <p class="mt-1 text-sm text-gray-600">You can cancel if you changed your mind.</p>

          <div class="mt-5 flex items-center justify-end gap-3">
            <button
              class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
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
import { ref, computed, onMounted, onUnmounted, h, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const auth = useAuthStore()

const sidebarOpen = ref(false)
const dropdownOpen = ref(false)

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
  if (!user.value?.name) return '?'
  return user.value.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const pageTitle = computed(() => {
  const title = route.meta?.title
  return typeof title === 'string' ? title : 'Dashboard'
})

function isActive(path: string) {
  if (path === '/tutor') {
    return route.path === '/tutor'
  }
  return route.path.startsWith(path)
}

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
    label: 'Issues',
    to: '/tutor/issues',
    icon: createIcon(
      'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
    ),
  },
  {
    name: 'profile',
    label: 'Profile',
    to: '/tutor/profile',
    icon: createIcon(
      'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
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
</style>
