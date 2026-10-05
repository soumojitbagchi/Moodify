import { defineConfig } from 'vite'
import { env } from 'node:process'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': env.BACKEND_URL || 'http://localhost:8080',
    },
  },
})
