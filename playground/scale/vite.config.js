import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@tale-ui/react': path.resolve(__dirname, '..', '..', 'packages', 'react', 'src'),
      '@tale-ui/utils': path.resolve(__dirname, '..', '..', 'packages', 'utils', 'src'),
      '@tale-ui/react-styles': path.resolve(__dirname, '..', '..', 'packages', 'styles', 'src'),
      '@tale-ui/core': path.resolve(__dirname, '..', '..', 'packages', 'css', 'src', 'index.css'),
    },
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, '..', '..')],
    },
  },
});
