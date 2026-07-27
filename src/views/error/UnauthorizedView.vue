<template>
  <main class="flex min-h-screen items-center justify-center dark:bg-slate-800 bg-slate-50 px-4 py-12">
    <section
      class="w-full max-w-md rounded-2xl border dark:border-slate-700 border-slate-100 dark:bg-slate-900 bg-white p-6 text-center shadow-sm"
    >
      <div
        class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600"
      >
        <svg
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v4m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
          />
        </svg>
      </div>
      <h1 class="mt-4 text-xl font-bold dark:text-slate-100 text-slate-900">Access denied</h1>
      <p class="mt-2 text-sm leading-6 dark:text-slate-400 text-slate-600">Your current role cannot open this page.</p>
      <router-link
        :to="dashboardPath"
        class="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
      >
        Back to dashboard
      </router-link>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { ROLE_ROUTES } from '@/types/auth'

const auth = useAuthStore()

const dashboardPath = computed(() => {
  return auth.userRole ? ROLE_ROUTES[auth.userRole] : '/login'
})
</script>
