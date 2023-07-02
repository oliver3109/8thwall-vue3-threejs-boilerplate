import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    open: true,
    port: 8080,
    host: '0.0.0.0'
  },
  assetsInclude: [
    '**/*.json',
    '**/*.glb',
    '**/*.gltf',
    '**/*.fbx',
    '**/*.mp4',
    '**/*.webp',
    '**/*.png',
    '**/*.jpg'
  ]
})
