import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@reiki-goddess/shared-components': path.resolve(__dirname, '../../packages/shared-components/src'),
      '@reiki-goddess/shared-assets': path.resolve(__dirname, '../../packages/shared-assets/src'),
      '@reiki-goddess/design-system': path.resolve(__dirname, '../../packages/design-system/src'),
      '@reiki-goddess/shared-utils': path.resolve(__dirname, '../../packages/shared-utils/src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});