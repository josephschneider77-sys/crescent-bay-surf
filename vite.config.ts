import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Crescent Bay Surf',
        short_name: 'Crescent Bay',
        description:
          'Live tides, waves, and weather for Crescent Bay, Laguna Beach, CA',
        theme_color: '#0a1628',
        background_color: '#0a1628',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'open-meteo-weather',
              expiration: { maxEntries: 32, maxAgeSeconds: 60 * 30 },
              networkTimeoutSeconds: 8,
            },
          },
          {
            urlPattern: /^https:\/\/marine-api\.open-meteo\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'open-meteo-marine',
              expiration: { maxEntries: 32, maxAgeSeconds: 60 * 30 },
              networkTimeoutSeconds: 8,
            },
          },
          {
            urlPattern: /^https:\/\/api\.tidesandcurrents\.noaa\.gov\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'noaa-tides',
              expiration: { maxEntries: 16, maxAgeSeconds: 60 * 60 },
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
    proxy: {
      '/api/noaa': {
        target: 'https://api.tidesandcurrents.noaa.gov',
        changeOrigin: true,
        secure: true,
        rewrite: (path) =>
          path.replace(/^\/api\/noaa/, '/api/prod/datagetter'),
      },
    },
  },
  preview: {
    host: true,
  },
})
