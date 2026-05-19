import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api/wazuh': {
        target: 'https://10.0.0.4:55000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/wazuh/, ''),
      },
      '/api/ollama': {
        target: 'http://10.0.0.4:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ollama/, ''),
      },
    },
  },
})
