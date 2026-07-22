import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { tokenService } from '@/services/token'

const app = createApp(App)

app.use(router)
app.use(createPinia())

// ── Laravel Echo (Reverb WebSocket) ────────────────────────────
declare global {
  interface Window {
    Pusher: typeof Pusher
    Echo: Echo<'reverb'>
  }
}

window.Pusher = Pusher

const reverbKey = import.meta.env.VITE_REVERB_APP_KEY
if (reverbKey) {
  const echo = new Echo<'reverb'>({
    broadcaster: 'reverb',
    key: reverbKey,
    wsHost: import.meta.env.VITE_REVERB_HOST || '127.0.0.1',
    wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
    wssPort: 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'http') === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${tokenService.getAccessToken()}`,
        Accept: 'application/json',
      },
    },
  })

  window.Echo = echo
}

app.mount('#app')
