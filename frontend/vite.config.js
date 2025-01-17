import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    eslint({
      lintOnStart: true,
      failOnError: mode === 'production',
    }),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:8000', // Proxy all requests starting with `/api` to the backend server
    },
  },
  build: {
    rollupOptions: {
      external: [
        'slick-carousel/slick/slick.css',
        'slick-carousel/slick/slick-theme.css',
      ],
    },
  },
}));