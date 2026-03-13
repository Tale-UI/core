import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  const baseUrl = process.env.PLAYGROUND_BASE ?? '/';
  const outDir = process.env.PLAYGROUND_OUT_DIR ?? 'dist';
  const resolvedOutDir = path.isAbsolute(outDir) ? outDir : path.resolve(__dirname, outDir);

  return {
    base: baseUrl,
    plugins: [react()],
    build: {
      outDir: resolvedOutDir,
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@tale-ui/react': path.resolve(__dirname, '..', '..', 'packages', 'react', 'src'),
        '@tale-ui/react-styled': path.resolve(__dirname, '..', '..', 'packages', 'styled', 'src'),
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
  };
});
