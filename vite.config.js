import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    strictPort: true,
    proxy: {
      // Laravel Sanctum & API proxy
      '/sanctum': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/storage': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/login': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/logout': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      // Legacy PHP API proxy
      '/Aiss': {
        target: 'http://localhost:80',
        changeOrigin: true
      }
    }
  }
})
