<template>
  <div class="flex-shrink-0">
    <div
      v-if="senderType === 'system'"
      class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
    >
      <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <div
      v-else-if="senderType === 'company'"
      class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"
    >
      <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    </div>
    <img
      v-else-if="senderAvatar"
      :src="senderAvatar"
      :alt="senderName"
      class="w-10 h-10 rounded-full object-cover"
    />
    <div
      v-else
      class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-medium"
    >
      {{ initials }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  senderType: string;
  senderAvatar?: string;
  senderName: string;
}>();

const initials = computed(() => {
  const names = props.senderName.split(' ');
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return props.senderName.substring(0, 2).toUpperCase();
});
</script>