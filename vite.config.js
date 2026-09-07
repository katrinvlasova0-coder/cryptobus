import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import { prerenderBlog } from './vite-plugin-prerender-blog.js'

export default defineConfig({
  plugins: [react(), prerenderBlog()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  base: process.env.VITE_BASE || '/',
  server: {
    watch: {
      ignored: ['**/content-factory/**'],
    },
  },
})
