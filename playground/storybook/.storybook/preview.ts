import '@tale-ui/react-styles/index.css';
import './preview.css';
import '../src/stories/stories.css';
import type { Preview, Decorator } from '@storybook/react-vite';
import { buildTheme } from './theme';

const withColorMode: Decorator = (Story, context) => {
  const colorMode = (context.globals.colorMode as string) ?? 'light';
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
    backgrounds: { disabled: true },
    docs: { theme: buildTheme('light') },
    options: {
      storySort: (a, b) => {
        const topLevel = ['Welcome', 'Getting Started'];

        const aTop = topLevel.indexOf(a.title);
        const bTop = topLevel.indexOf(b.title);
        const aIsTop = aTop !== -1;
        const bIsTop = bTop !== -1;

        if (aIsTop || bIsTop) {
          if (aIsTop && bIsTop) return aTop - bTop;
          return aIsTop ? -1 : 1;
        }

        const aIsFoundations = a.title.startsWith('Foundations');
        const bIsFoundations = b.title.startsWith('Foundations');
        const aIsComponents = a.title.startsWith('Components');
        const bIsComponents = b.title.startsWith('Components');

        // Section order: Foundations → Playground → Components → rest
        var sectionOf = function(t) {
          if (t.startsWith('Foundations')) return 0;
          if (t.startsWith('Playground')) return 1;
          if (t.startsWith('Components')) return 2;
          return 3;
        };
        var aRank = sectionOf(a.title);
        var bRank = sectionOf(b.title);
        if (aRank !== bRank) return aRank - bRank;

        if (aIsFoundations && bIsFoundations) {
          const foundationsOrder = [
            'Foundations/Color System',
            'Foundations/Named Colors',
            'Foundations/Neutral Colors',
            'Foundations/Semantic Colors',
          ];
          const ai = foundationsOrder.indexOf(a.title);
          const bi = foundationsOrder.indexOf(b.title);
          if (ai !== -1 && bi !== -1) return ai - bi;
          if (ai !== -1) return -1;
          if (bi !== -1) return 1;
          return a.title.localeCompare(b.title) || a.name.localeCompare(b.name);
        }

        if (aIsComponents && bIsComponents) {
          const byTitle = a.title.localeCompare(b.title);
          if (byTitle !== 0) return byTitle;
          if (a.name === 'All Variations') return -1;
          if (b.name === 'All Variations') return 1;
          return a.name.localeCompare(b.name);
        }

        return a.title.localeCompare(b.title) || a.name.localeCompare(b.name);
      },
    },
  },
};

export default preview;
