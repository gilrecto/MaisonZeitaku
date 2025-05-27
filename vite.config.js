import { defineConfig } from 'vite';
import shopify from 'vite-plugin-shopify';
import cleanup from '@by-association-only/vite-plugin-shopify-clean';

export default defineConfig({
  server: {
    cors: {
      origin: '*', // Allow all origins (or specify your Shopify local URL)
      methods: ['GET', 'HEAD', 'OPTIONS'],
    },
  },
  build: {
    emptyOutDir: false,
  },
  plugins: [cleanup(), shopify({ versionNumbers: true })],
  optimizeDeps: {
    include: [
      'swiper',
    ],
  },
});