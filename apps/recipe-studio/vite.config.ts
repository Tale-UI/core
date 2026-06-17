import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { recipeApiPlugin } from './vite-plugin-recipe-api';

export default defineConfig({
  plugins: [react(), recipeApiPlugin()],
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
        find: '@tale-ui/core',
        replacement: path.resolve(__dirname, '..', '..', 'packages', 'css', 'src', 'index.css'),
      },
      {
        find: '@tale-ui/mcp-studio',
        replacement: path.resolve(__dirname, '..', 'mcp-studio'),
      },
    ],
  },
  server: {
    port: 5177,
    strictPort: true,
    fs: {
      allow: [path.resolve(__dirname, '..', '..')],
    },
  },
});
