import * as path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const shouldDisableWorkspaceAliases = Boolean(process.env.TALE_UI_DISABLE_WORKSPACE_ALIASES);

export default defineConfig({
  mode: process.env.NODE_ENV || 'development',
  plugins: [react()],
  resolve: {
    alias: {
      ...(shouldDisableWorkspaceAliases
        ? // TODO Temporal: Remove and revert to `undefined` when calendar is publicly exported
          {
            '@tale-ui/react/calendar': path.join(process.cwd(), 'packages/react/src/calendar'),
            '@tale-ui/react/localization-provider': path.join(
              process.cwd(),
              'packages/react/src/localization-provider',
            ),
          }
        : {
            '@tale-ui/react': path.join(process.cwd(), 'packages/react/src'),
            '@tale-ui/utils': path.join(process.cwd(), 'packages/utils/src'),
          }),
      './fonts': path.join(process.cwd(), '/docs/src/fonts'),
      docs: path.join(process.cwd(), '/docs'),
      stream: null,
      zlib: null,
    },
  },
  build: { outDir: 'build', chunkSizeWarningLimit: 9999 },
});
