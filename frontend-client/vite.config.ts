import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // This is where the files go for Nginx
  },
  server: {
    host: true,
    port: 3000
  }
})