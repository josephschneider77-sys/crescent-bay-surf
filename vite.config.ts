import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'apple-touch-icon.png',
        'brand/city-seal-256.png',
        'brand/city-seal.png',
        'icons/favicon-64.png',
      ],
      manifest: {
        name: 'Laguna Beach Surf Conditions',
        short_name: 'LB Surf',
        description:
          'Unofficial community tides, waves, and weather for Laguna Beach beaches. Not an official City publication.',
        theme_color: '#034A46',
        background_color: '#F5F8F8',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        categories: ['weather', 'lifestyle'],
        lang: 'en-US',
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
            src: 'icons/icon-512-maskable.png',
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
