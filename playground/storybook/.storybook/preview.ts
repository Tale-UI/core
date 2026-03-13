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
      storySort: (a, b) => {
        const colorOrder = [
          'Named Colors',
          'Neutral Colors',
          'Semantic Colors',
          'Dark & Light Mode',
          'Color Families',
        ];
        const introOrder = ['Welcome', 'Getting Started', 'Catalog'];

        const aIsIntro = a.title.startsWith('Introduction');
        const bIsIntro = b.title.startsWith('Introduction');
        const aIsFoundations = a.title.startsWith('Foundations');
        const bIsFoundations = b.title.startsWith('Foundations');

        if (aIsIntro !== bIsIntro) return aIsIntro ? -1 : 1;
        if (aIsIntro && bIsIntro) {
          const ai = introOrder.indexOf(a.title.split('/')[1] ?? '');
          const bi = introOrder.indexOf(b.title.split('/')[1] ?? '');
          return (ai === -1 ? introOrder.length : ai) - (bi === -1 ? introOrder.length : bi);
        }
        if (aIsFoundations !== bIsFoundations) return aIsFoundations ? -1 : 1;
        if (a.title === 'Foundations/Colors' && b.title === 'Foundations/Colors') {
          const ai = colorOrder.indexOf(a.name);
          const bi = colorOrder.indexOf(b.name);
          return (ai === -1 ? colorOrder.length : ai) - (bi === -1 ? colorOrder.length : bi);
        }
        return 0;
      },
    },
  },
};

export default preview;
