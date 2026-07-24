<template>
  <div class="relative" ref="bellRef">
    <!-- Slot for the bell button - layouts pass their original styled bell icon here -->
    <div @click.stop="toggleDropdown">
      <slot />
    </div>

    <!-- Desktop Dropdown -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="dropdownOpen && !isMobile"
        class="absolute right-0 z-50 mt-2 hidden sm:block"
        @click.stop
      >
        <NotificationDropdown @viewAll="viewAllNotifications" />
      </div>
    </transition>

    <!-- Mobile Bottom Sheet -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="dropdownOpen && isMobile"
        class="fixed inset-x-0 bottom-0 z-50 sm:hidden"
        @click.stop
      >
        <div class="max-h-[80vh] rounded-t-2xl border-t border-gray-100 bg-white shadow-2xl">
          <!-- Handle -->
          <div class="flex justify-center pt-2 pb-1">
            <div class="h-1.5 w-12 rounded-full bg-gray-300" />
          </div>
          <NotificationDropdown @viewAll="viewAllNotifications" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notificationStore'
import NotificationDropdown from './NotificationDropdown.vue'

const router = useRouter()
const notificationStore = useNotificationStore()

const dropdownOpen = ref(false)
const bellRef = ref<HTMLElement | null>(null)
const isMobile = ref(false)

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
  if (dropdownOpen.value) {
    notificationStore.fetchNotifications()
  }
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (bellRef.value && !bellRef.value.contains(target)) {
    dropdownOpen.value = false
  }
}

function viewAllNotifications() {
  dropdownOpen.value = false
  router.push('/notifications')
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', checkMobile)
})

function checkMobile() {
  isMobile.value = window.innerWidth < 640
}
</script>
