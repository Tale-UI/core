import path from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  typescript: { reactDocgen: false },
  async viteFinal(config) {
    const baseUrl = process.env.STORYBOOK_BASE ?? '/';

    config.base = baseUrl;
    config.resolve ??= {};
    config.resolve.alias = {
      ...((config.resolve.alias as Record<string, string>) ?? {}),
      '@tale-ui/react': path.resolve(__dirname, '../../../packages/react/src'),
      '@tale-ui/utils': path.resolve(__dirname, '../../../packages/utils/src'),
      '@tale-ui/react-styles': path.resolve(__dirname, '../../../packages/styles/src'),
      '@tale-ui/core': path.resolve(__dirname, '../../../packages/css/src/index.css'),
    };
    // Allow Vite's dev server to read files from the monorepo root so that
    // CSS @import chains (e.g. @import '@tale-ui/core' inside packages/styles)
    // can resolve into packages/css/src without being blocked by fs restrictions.
    config.server ??= {};
    config.server.fs ??= {};
    config.server.fs.allow = [
      ...(config.server.fs.allow ?? []),
      path.resolve(__dirname, '../../..'),
    ];
    return config;
  },
};

export default config;
