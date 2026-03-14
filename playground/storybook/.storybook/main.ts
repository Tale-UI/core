import fs from 'node:fs';
import path from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  managerHead: (head) => {
    const cssDir = path.resolve(__dirname, '../../../packages/css/src');
    const files = [
      'tokens/_colors.css',
      'tokens/_neutrals.css',
      'tokens/_effects.css',
      'tokens/_typography.css',
      'themes/_color-modes.css',
    ];
    const css = files.map((f) => fs.readFileSync(path.join(cssDir, f), 'utf-8')).join('\n');
    // Override CSS variables that Storybook sets dynamically from the theme object and
    // that cannot be controlled via create(). The !important is required because emotion
    // sets these on individual elements (higher specificity than :root), but !important
    // in author styles always wins over non-!important author styles regardless of specificity.
    // :root { !important } only affects the html element — child elements with their own
    // matching declarations (from emotion CSS classes) still win via the cascade because
    // inheritance only fills in when NO matching rule exists. Using * targets elements
    // directly, making the !important win over emotion's normal author declarations.
    const overrides = `
* {
  /* Storybook computes lighten(45%, colorSecondary) for sidebar tree-node hover, which
     produces a vivid teal when colorSecondary is our dark brand (#025768). Override with
     a neutral that reads correctly in both light and dark mode via _color-modes.css. */
  --tree-node-background-hover: var(--neutral-16) !important;
}
*[data-selected="true"] {
  /* Selected nodes use white text (Storybook hardcodes color.lightest). Restoring the
     brand background on hover keeps white text readable. Both rules are !important so
     specificity decides: attribute selector (0,1,0) beats universal (0,0,0). */
  --tree-node-background-hover: var(--color-60) !important;
}`;
    return `${head}<style id="tale-ui-tokens">${css}${overrides}</style>`;
  },
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
