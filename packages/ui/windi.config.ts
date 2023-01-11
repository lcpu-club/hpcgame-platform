import { defineConfig } from 'vite-plugin-windicss'

export default defineConfig({
  preflight: {
    blocklist: 'h1 h2 h3 ul ol li p'
  },
  safelist: 'flex justify-between items-center text-xs'
})
