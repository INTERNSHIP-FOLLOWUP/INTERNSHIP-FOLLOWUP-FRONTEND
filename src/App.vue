<template>
  <div id="app">
    <router-view />
    <Toast />
  </div>
</template>

<script lang="ts" setup>
import Toast from '@/components/ui/Toast.vue'
</script>
