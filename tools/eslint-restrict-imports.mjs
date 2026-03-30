/**
 * Tale UI — ESLint Import Restriction Config
 *
 * Prevents accidental use of non-Tale UI component libraries.
 * Spread this into your ESLint flat config to warn when importing
 * from common component libraries that should be replaced by @tale-ui/react.
 *
 * Usage (eslint.config.mjs):
 *
 *   import taleUiRestrictions from '@tale-ui/react/eslint-restrict-imports';
 *   // or copy the config object below directly
 *
 *   export default [
 *     ...yourConfig,
 *     taleUiRestrictions,
 *   ];
 */

export default {
  rules: {
    'no-restricted-imports': ['warn', {
      patterns: [
        {
          group: ['@chakra-ui/*'],
          message: 'Use @tale-ui/react instead of Chakra UI.',
        },
        {
          group: ['@mui/*', '@material-ui/*'],
          message: 'Use @tale-ui/react instead of Material UI.',
        },
        {
          group: ['@radix-ui/*'],
          message: 'Use @tale-ui/react instead of Radix UI primitives. Tale UI wraps React Aria Components.',
        },
        {
          group: ['@headlessui/*'],
          message: 'Use @tale-ui/react instead of Headless UI.',
        },
        {
          group: ['@mantine/*'],
          message: 'Use @tale-ui/react instead of Mantine.',
        },
        {
          group: ['antd', 'antd/*'],
          message: 'Use @tale-ui/react instead of Ant Design.',
        },
        {
          group: ['@nextui-org/*'],
          message: 'Use @tale-ui/react instead of NextUI.',
        },
        {
          group: ['@shadcn/*'],
          message: 'Use @tale-ui/react instead of shadcn/ui.',
        },
      ],
    }],
  },
};
