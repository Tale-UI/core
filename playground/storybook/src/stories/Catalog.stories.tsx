import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Introduction/Catalog',
  parameters: { layout: 'fullscreen', backgrounds: { disable: true } },
};
export default meta;
type Story = StoryObj;

/** Navigate the Storybook manager to a story by its title. */
function goTo(storyTitle: string) {
  const id = storyTitle
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\//g, '-')
    .replace(/[^a-z0-9-]/g, '');
  window.parent.location.href = `?path=/story/${id}`;
}

interface ComponentEntry {
  name: string;
  storyTitle: string;
}

interface Category {
  name: string;
  components: ComponentEntry[];
}

const categories: Category[] = [
  {
    name: 'Form Controls',
    components: [
      { name: 'Button', storyTitle: 'Components/Button' },
      { name: 'Input', storyTitle: 'Form Controls/Input' },
      { name: 'Checkbox', storyTitle: 'Form Controls/Checkbox' },
      { name: 'Radio', storyTitle: 'Form Controls/Radio' },
      { name: 'Switch', storyTitle: 'Form Controls/Switch' },
      { name: 'Toggle', storyTitle: 'Form Controls/Toggle' },
      { name: 'Select', storyTitle: 'Form Controls/Select' },
      { name: 'Combobox', storyTitle: 'Form Controls/Combobox' },
      { name: 'Autocomplete', storyTitle: 'Form Controls/Autocomplete' },
      { name: 'Number Field', storyTitle: 'Form Controls/NumberField' },
      { name: 'Slider', storyTitle: 'Form Controls/Slider' },
      { name: 'Calendar', storyTitle: 'Form Controls/Calendar' },
    ],
  },
  {
    name: 'Layout',
    components: [
      { name: 'Accordion', storyTitle: 'Layout/Accordion' },
      { name: 'Collapsible', storyTitle: 'Layout/Collapsible' },
      { name: 'Tabs', storyTitle: 'Layout/Tabs' },
      { name: 'Scroll Area', storyTitle: 'Layout/ScrollArea' },
      { name: 'Separator', storyTitle: 'Layout/Separator' },
    ],
  },
  {
    name: 'Overlay',
    components: [
      { name: 'Dialog', storyTitle: 'Overlay/Dialog' },
      { name: 'Alert Dialog', storyTitle: 'Overlay/AlertDialog' },
      { name: 'Popover', storyTitle: 'Overlay/Popover' },
      { name: 'Drawer', storyTitle: 'Overlay/Drawer' },
      { name: 'Tooltip', storyTitle: 'Overlay/Tooltip' },
      { name: 'Preview Card', storyTitle: 'Overlay/PreviewCard' },
    ],
  },
  {
    name: 'Navigation',
    components: [
      { name: 'Menu', storyTitle: 'Navigation/Menu' },
      { name: 'Context Menu', storyTitle: 'Navigation/ContextMenu' },
      { name: 'Menubar', storyTitle: 'Navigation/Menubar' },
      { name: 'Navigation Menu', storyTitle: 'Navigation/NavigationMenu' },
      { name: 'Toolbar', storyTitle: 'Components/Toolbar' },
    ],
  },
  {
    name: 'Feedback & Display',
    components: [
      { name: 'Progress', storyTitle: 'Feedback/Progress' },
      { name: 'Meter', storyTitle: 'Feedback/Meter' },
      { name: 'Avatar', storyTitle: 'Display/Avatar' },
      { name: 'Toast', storyTitle: 'Feedback/Toast' },
    ],
  },
  {
    name: 'Form Structure',
    components: [
      { name: 'Field', storyTitle: 'Form/Field' },
      { name: 'Fieldset', storyTitle: 'Form/Fieldset' },
      { name: 'Form', storyTitle: 'Form/Form' },
    ],
  },
];

function ComponentCard({ name, storyTitle }: ComponentEntry) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      style={{
        background: hovered ? 'var(--neutral-14)' : 'var(--neutral-10)',
        border: `1px solid ${hovered ? 'var(--neutral-22)' : 'var(--neutral-16)'}`,
        borderRadius: 'var(--radius-m)',
        padding: 'var(--space-s) var(--space-m)',
        cursor: 'pointer',
        transition: 'background 100ms ease, border-color 100ms ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-s)',
      }}
      onClick={() => goTo(storyTitle)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') goTo(storyTitle); }}
    >
      <span className="text--label-s" style={{ color: 'var(--neutral-75)' }}>{name}</span>
      <span style={{ color: 'var(--neutral-35)', fontSize: 'var(--label-xs-font-size)' }}>→</span>
    </div>
  );
}

export const CatalogPage: Story = {
  name: 'Catalog',
  render: () => (
    <div
      style={{
        padding: 'var(--space-2xl)',
        maxWidth: '960px',
        margin: '0 auto',
        color: 'var(--neutral-80)',
      }}
    >
      <h1
        className="text--heading-m"
        style={{ marginTop: 'var(--space-2xl)', marginBottom: 'var(--space-xs)' }}
      >
        Component Catalog
      </h1>
      <p
        className="text--body-m"
        style={{
          color: 'var(--neutral-50)',
          marginBottom: 'var(--space-2xl)',
          borderBottom: '1px solid var(--neutral-14)',
          paddingBottom: 'var(--space-2xl)',
        }}
      >
        All components in the Tale library. Click any card to open its story.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
        {categories.map((category) => (
          <section key={category.name}>
            <h2
              className="text--title-l"
              style={{
                marginBottom: 'var(--space-m)',
                marginTop: 0,
                color: 'var(--neutral-65)',
              }}
            >
              {category.name}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: 'var(--space-xs)',
              }}
            >
              {category.components.map((comp) => (
                <ComponentCard key={comp.name} {...comp} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  ),
};
