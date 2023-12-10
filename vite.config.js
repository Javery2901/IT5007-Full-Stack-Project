import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, '/src') }]
  },
  build: {
    rollupOptions: {
      external: ['@apollo/client'], // Add the libraries or modules you want to exclude from the bundle
    },
  }, 
  server: {
    port: 5173, 
    host: true, 
  }
})
