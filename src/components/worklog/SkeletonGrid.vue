<template>
  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 p-6">
    <div v-for="i in 6" :key="i" class="rounded-2xl border border-slate-100 bg-white p-5">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 animate-pulse rounded-full bg-slate-100"></div>
        <div class="space-y-2">
          <div class="h-4 w-28 rounded-lg bg-slate-100"></div>
          <div class="h-3 w-20 rounded-lg bg-slate-100"></div>
        </div>
      </div>
      <div class="mt-4 space-y-2">
        <div class="h-3 w-24 rounded-lg bg-slate-100"></div>
        <div class="h-3 w-40 rounded-lg bg-slate-100"></div>
        <div class="h-3 w-36 rounded-lg bg-slate-100"></div>
        <div class="h-3 w-full rounded-lg bg-slate-100"></div>
      </div>
      <div class="mt-5 flex gap-2">
        <div class="h-10 flex-1 rounded-xl bg-slate-100"></div>
        <div class="h-10 flex-1 rounded-xl bg-slate-100"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
