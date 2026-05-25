import { defineConfig } from 'vite';

export default defineConfig({
  // Root of the project is the current directory
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    open: true,
  }
});
