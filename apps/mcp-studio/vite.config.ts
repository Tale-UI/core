import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { studioApiPlugin } from './vite-plugin-studio-api';

export default defineConfig({
  plugins: [react(), studioApiPlugin()],
  resolve: {
    alias: [
      {
        find: '@tale-ui/react',
        replacement: path.resolve(__dirname, '..', '..', 'packages', 'react', 'src'),
      },
      {
        find: '@tale-ui/charts',
        replacement: path.resolve(__dirname, '..', '..', 'packages', 'charts', 'src'),
      },
      {
        find: '@tale-ui/utils',
        replacement: path.resolve(__dirname, '..', '..', 'packages', 'utils', 'src'),
      },
      {
        find: '@tale-ui/react-styles',
        replacement: path.resolve(__dirname, '..', '..', 'packages', 'styles', 'src'),
      },
      {
        find: '@tale-ui/css',
        replacement: path.resolve(__dirname, '..', '..', 'packages', 'css', 'src', 'index.css'),
      },
    ],
  },
  server: {
    port: 5175,
    strictPort: true,
    fs: {
      allow: [path.resolve(__dirname, '..', '..')],
    },
  },
});
