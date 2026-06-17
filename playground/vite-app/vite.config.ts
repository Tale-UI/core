import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(() => {
  const isProfiling = process.env.REACT_PROFILING === '1' || process.env.REACT_PROFILING === 'true';
  const baseUrl = process.env.PLAYGROUND_BASE ?? '/';
  const outDir = process.env.PLAYGROUND_OUT_DIR ?? 'dist';
  const resolvedOutDir = path.isAbsolute(outDir) ? outDir : path.resolve(__dirname, outDir);

  return {
    base: baseUrl,
    plugins: [react()],
    build: {
      sourcemap: true,
      outDir: resolvedOutDir,
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@tale-ui/react': path.resolve(__dirname, '..', '..', 'packages', 'react', 'src'),
        '@tale-ui/charts': path.resolve(__dirname, '..', '..', 'packages', 'charts', 'src'),
        '@tale-ui/utils': path.resolve(__dirname, '..', '..', 'packages', 'utils', 'src'),
        '@tale-ui/react-styles': path.resolve(__dirname, '..', '..', 'packages', 'styles', 'src'),
        // Point @tale-ui/core to source so CSS @import resolves without needing a dist build
        '@tale-ui/core': path.resolve(__dirname, '..', '..', 'packages', 'css', 'src', 'index.css'),
        '@tale-ui/a2ui/renderer': path.resolve(__dirname, '..', '..', 'packages', 'a2ui', 'src', 'renderer', 'index.ts'),
        '@tale-ui/a2ui/catalog': path.resolve(__dirname, '..', '..', 'packages', 'a2ui', 'src', 'catalog.ts'),
        '@tale-ui/a2ui/validation': path.resolve(__dirname, '..', '..', 'packages', 'a2ui', 'src', 'validation', 'validate.ts'),
        '@tale-ui/a2ui/types': path.resolve(__dirname, '..', '..', 'packages', 'a2ui', 'src', 'types.ts'),
        '@tale-ui/a2ui/src': path.resolve(__dirname, '..', '..', 'packages', 'a2ui', 'src'),
        '@tale-ui/a2ui': path.resolve(__dirname, '..', '..', 'packages', 'a2ui', 'src', 'index.ts'),
        ...(isProfiling ? { 'react-dom/client': 'react-dom/profiling' } : {}),
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      fs: {
        // Allow serving Tale UI source from the monorepo root.
        allow: [path.resolve(__dirname, '..', '..')],
      },
      proxy: {
        // Proxy Straico API requests to bypass CORS (Straico doesn't set CORS headers)
        '/api/straico': {
          target: 'https://api.straico.com',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/straico/, ''),
        },
      },
    },
  };
});
