import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import windiCSS from 'vite-plugin-windicss'
import { execSync } from 'node:child_process'

const hash = execSync('git rev-parse --short HEAD').toString().trim()
process.env.VITE_GIT_HASH = hash
process.env.VITE_BUILD_TIME = new Date().toISOString()

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext'
  },
  plugins: [vue(), windiCSS()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
