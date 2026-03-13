import '@tale-ui/react-styles/index.css';
import './preview.css';
import type { Preview, Decorator } from '@storybook/react';

const withColorMode: Decorator = (Story, context) => {
  const colorMode = (context.globals['colorMode'] as string) ?? 'light';
  document.documentElement.setAttribute('data-color-mode', colorMode);
  return Story(context);
};

const preview: Preview = {
  decorators: [withColorMode],
  globalTypes: {
    colorMode: {
      description: 'Color mode',
      toolbar: {
        title: 'Color mode',
        icon: 'sun',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    colorMode: 'light',
  },
  parameters: {
    layout: 'centered',
    backgrounds: { disable: true },
    options: {
      storySort: {
        order: ['Foundations', '*'],
      },
    },
  },
};

export default preview;
