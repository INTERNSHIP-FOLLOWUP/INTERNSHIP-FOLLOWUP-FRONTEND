<template>
  <div class="flex min-h-screen max-h-screen overflow-hidden bg-[#F8FAFC]">
    <div
      class="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400"
    >
      <div class="relative z-10 w-full px-16">
        <div class="animate-float">
          <svg
            viewBox="0 0 800 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="w-full h-auto drop-shadow-2xl"
            aria-hidden="true"
          >
            <g opacity="0.08">
              <circle cx="100" cy="100" r="200" fill="white" />
              <circle cx="700" cy="500" r="150" fill="white" />
              <circle cx="650" cy="100" r="100" fill="white" />
            </g>

            <rect x="180" y="100" width="440" height="320" rx="20" fill="white" opacity="0.95" />
            <rect x="200" y="130" width="120" height="12" rx="6" fill="#2563EB" opacity="0.6" />
            <rect x="200" y="155" width="200" height="12" rx="6" fill="#E2E8F0" />
            <rect x="200" y="180" width="180" height="12" rx="6" fill="#E2E8F0" />

            <rect x="200" y="220" width="400" height="60" rx="10" fill="#F1F5F9" />
            <rect x="220" y="240" width="80" height="8" rx="4" fill="#94A3B8" />
            <circle cx="210" cy="250" r="8" fill="#22C55E" />

            <rect x="200" y="290" width="400" height="60" rx="10" fill="#F1F5F9" />
            <rect x="220" y="310" width="80" height="8" rx="4" fill="#94A3B8" />
            <circle cx="210" cy="320" r="8" fill="#60A5FA" />

            <rect x="200" y="360" width="400" height="60" rx="10" fill="#F1F5F9" />
            <rect x="220" y="380" width="80" height="8" rx="4" fill="#94A3B8" />
            <circle cx="210" cy="390" r="8" fill="#F59E0B" />

            <rect x="250" y="440" width="300" height="60" rx="30" fill="white" opacity="0.3" />

            <circle cx="140" cy="480" r="30" fill="white" opacity="0.2" />
            <circle cx="660" cy="450" r="20" fill="white" opacity="0.15" />

            <g transform="translate(180, 100)">
              <path
                d="M0 0 L440 0"
                stroke="#2563EB"
                stroke-width="3"
                opacity="0.3"
                stroke-dasharray="8 4"
              />
            </g>
          </svg>
        </div>

        <div class="mt-8 text-center text-white">
          <h2 class="text-2xl font-semibold">Track Your Internship Journey</h2>
          <p class="mt-2 text-primary-100 text-sm max-w-md mx-auto">
            Connect students with companies, manage internships, and monitor progress all in one place.
          </p>
        </div>
      </div>

      <div
        class="absolute top-20 left-16 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float-delayed"
      />
      <div
        class="absolute bottom-20 right-16 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-float-slow"
      />
      <div
        class="absolute top-1/2 left-1/3 w-40 h-40 bg-white/5 rounded-full blur-2xl"
      />
    </div>

    <div class="flex-1 flex items-center justify-center px-8 lg:px-16">
      <div class="w-full max-w-[520px] animate-slide-up">
        <slot />
      </div>
    </div>
  </div>
</template>
