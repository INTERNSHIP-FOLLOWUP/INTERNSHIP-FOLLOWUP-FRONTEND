<template>
  <div class="flex min-h-screen max-h-screen overflow-hidden dark:bg-slate-900 bg-white">
    <!-- Left Hero Banner with photoLoginForm.png -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden dark:bg-slate-900/50 bg-white select-none flex-col justify-between p-10 xl:p-14">
      <img
        src="@/assets/images/photoLoginForm.png"
        alt="Student Internship"
        class="absolute inset-0 w-full h-full object-cover object-left"
      />

      <!-- Soft gradient overlay fading from left image smoothly into white on the right -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-white/10 via-white/40 via-65% to-white pointer-events-none"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent pointer-events-none"
      />

      <!-- Top Header Badges -->
      <div class="relative z-10 flex items-center justify-between animate-fade-in">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full dark:bg-slate-800/80 bg-white/80 backdrop-blur-xl dark:text-slate-200 text-slate-800 text-xs font-semibold dark:border-slate-700/50 border border-white/90 shadow-md">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#21BAEA] opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-[#21BAEA]"></span>
          </span>
          Passerelles Numériques Cambodia
        </div>

        <div class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#21BAEA]/15 backdrop-blur-md text-[#21BAEA] text-xs font-semibold border border-[#21BAEA]/25 shadow-xs">
          <svg class="w-3.5 h-3.5 text-[#FF9933]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          PNC Portal
        </div>
      </div>

      <!-- Bottom Frosted Light Glass Card (Flawlessly matching the light form theme) -->
      <div class="relative z-10 max-w-lg p-7.5 rounded-3xl dark:bg-slate-800/80 bg-white/80 backdrop-blur-xl dark:border-slate-700/50 border border-white/90 shadow-xl shadow-slate-900/5 animate-slide-up transition-all hover:shadow-2xl">
        <!-- Title with Luminous #21BAEA & #FF9933 Gradient Accent -->
        <h2 class="text-2xl sm:text-3xl font-extrabold dark:text-slate-100 text-slate-900 leading-tight tracking-tight">
          Student Internship<br />
          <span class="bg-gradient-to-r from-[#21BAEA] to-[#FF9933] bg-clip-text text-transparent">
            Follow-up System
          </span>
        </h2>

        <p class="mt-3 text-sm dark:text-slate-400 text-slate-600 font-normal leading-relaxed">
          Empowering students, tutors, and partner companies to seamlessly connect, track daily worklogs, and monitor progress in real-time.
        </p>

        <!-- Stats / Feature Pill Grid -->
        <div class="mt-5 pt-4 border-t dark:border-slate-600 border-slate-200/60 grid grid-cols-3 gap-2.5">
          <div class="dark:bg-slate-800/70 bg-white/70 backdrop-blur-md rounded-2xl p-2.5 text-center dark:border-slate-700/50 border border-white/80 shadow-2xs">
            <p class="text-base sm:text-lg font-bold text-[#21BAEA]">100%</p>
            <p class="text-[11px] dark:text-slate-400 text-slate-600 font-medium">Digital Tracking</p>
          </div>
          <div class="dark:bg-slate-800/70 bg-white/70 backdrop-blur-md rounded-2xl p-2.5 text-center dark:border-slate-700/50 border border-white/80 shadow-2xs">
            <p class="text-base sm:text-lg font-bold text-[#FF9933]">Real-time</p>
            <p class="text-[11px] dark:text-slate-400 text-slate-600 font-medium">Evaluations</p>
          </div>
          <div class="dark:bg-slate-800/70 bg-white/70 backdrop-blur-md rounded-2xl p-2.5 text-center dark:border-slate-700/50 border border-white/80 shadow-2xs">
            <p class="text-base sm:text-lg font-bold text-[#21BAEA]">PNC</p>
            <p class="text-[11px] dark:text-slate-400 text-slate-600 font-medium">Tutor Support</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Login Form Area -->
    <div class="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-16 dark:bg-slate-900 bg-white overflow-y-auto">
      <div class="w-full max-w-[440px] py-8 animate-slide-up">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// AuthLayout wrapper
</script>

