import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills()
  ],
  build: {
    rollupOptions: {
      external: ['vite-plugin-node-polyfills/shims/global'],
      output: {
        globals: {
          'vite-plugin-node-polyfills/shims/global': 'global'
        }
      }
    }
  }
})
