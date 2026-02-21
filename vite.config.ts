import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'HomeSync',
        short_name: 'HomeSync',
        description: 'Nowoczesna aplikacja do zarządzania domem',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'https://cdn.iconscout.com/icon/free/png-256/free-home-1767940-1502276.png',
            sizes: '256x256',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'https://cdn.iconscout.com/icon/free/png-512/free-home-1767940-1502276.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
