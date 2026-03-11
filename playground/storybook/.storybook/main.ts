import path from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  typescript: { reactDocgen: false },
  async viteFinal(config) {
    config.resolve ??= {};
    config.resolve.alias = {
      ...((config.resolve.alias as Record<string, string>) ?? {}),
      '@tale-ui/react': path.resolve(__dirname, '../../../packages/react/src'),
      '@tale-ui/utils': path.resolve(__dirname, '../../../packages/utils/src'),
      '@tale-ui/react-styles': path.resolve(__dirname, '../../../packages/styles/src'),
    };
    return config;
  },
};

export default config;
