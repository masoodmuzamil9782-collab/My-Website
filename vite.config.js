import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
  },
});
