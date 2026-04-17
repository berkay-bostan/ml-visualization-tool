import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // During local dev, proxy all backend paths to FastAPI on :8000
      '/domains': 'http://localhost:8000',
      '/dataset': 'http://localhost:8000',
      '/preprocess': 'http://localhost:8000',
      '/train': 'http://localhost:8000',
      '/explain': 'http://localhost:8000',
      '/bias': 'http://localhost:8000',
      '/training-distribution': 'http://localhost:8000',
      '/api': 'http://localhost:8000',
    },
  },
})
