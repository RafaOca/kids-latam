import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 'prompt' (not 'autoUpdate'): a new service worker installs but stays
      // in "waiting" until the app calls updateSW() from the in-app banner —
      // this is what lets us surface a visible "update available" prompt
      // instead of silently swapping versions underneath the user.
      registerType: 'prompt',
      includeAssets: ['icons/favicon-32.png', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Ruta de Lectura Implacable',
        short_name: 'Ruta Lectura',
        description: 'Aprende a leer jugando: letras, sílabas y palabras.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#5AA9E6',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precache the app shell + fonts/images; navigation requests fall back
        // to index.html (SPA), so a deep link still loads offline once cached.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
      },
      // Keep the SW active in dev too, so the update-lifecycle flow (and the
      // iOS foreground-update-check workaround) can be exercised without a
      // production build.
      devOptions: { enabled: true, type: 'module' },
    }),
  ],
});
