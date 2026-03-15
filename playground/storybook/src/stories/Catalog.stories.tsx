import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Introduction/Catalog',
  parameters: { layout: 'fullscreen', backgrounds: { disable: true }, controls: { disable: true }, actions: { disable: true }, a11y: { disable: true } },
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
      { name: 'Input', storyTitle: 'Components/Input' },
      { name: 'TextField', storyTitle: 'Components/TextField' },
      { name: 'TextArea', storyTitle: 'Components/TextArea' },
      { name: 'SearchField', storyTitle: 'Components/SearchField' },
      { name: 'Checkbox', storyTitle: 'Components/Checkbox' },
      { name: 'Checkbox Group', storyTitle: 'Components/CheckboxGroup' },
      { name: 'Radio', storyTitle: 'Components/Radio' },
      { name: 'Switch', storyTitle: 'Components/Switch' },
      { name: 'Toggle Button', storyTitle: 'Components/ToggleButton' },
      { name: 'Select', storyTitle: 'Components/Select' },
      { name: 'Combobox', storyTitle: 'Components/Combobox' },
      { name: 'Autocomplete', storyTitle: 'Components/Autocomplete' },
      { name: 'Number Field', storyTitle: 'Components/NumberField' },
      { name: 'Slider', storyTitle: 'Components/Slider' },
    ],
  },
  {
    name: 'Date & Time',
    components: [
      { name: 'Calendar', storyTitle: 'Components/Calendar' },
      { name: 'Range Calendar', storyTitle: 'Components/RangeCalendar' },
      { name: 'Date Field', storyTitle: 'Components/DateField' },
      { name: 'Date Picker', storyTitle: 'Components/DatePicker' },
      { name: 'Date Range Picker', storyTitle: 'Components/DateRangePicker' },
      { name: 'Time Field', storyTitle: 'Components/TimeField' },
    ],
  },
  {
    name: 'Layout',
    components: [
      { name: 'Accordion', storyTitle: 'Components/Accordion' },
      { name: 'Disclosure', storyTitle: 'Components/Disclosure' },
      { name: 'Tabs', storyTitle: 'Components/Tabs' },
      { name: 'Scroll Area', storyTitle: 'Components/ScrollArea' },
      { name: 'Separator', storyTitle: 'Components/Separator' },
    ],
  },
  {
    name: 'Overlay',
    components: [
      { name: 'Dialog', storyTitle: 'Components/Dialog' },
      { name: 'Alert Dialog', storyTitle: 'Components/AlertDialog' },
      { name: 'Popover', storyTitle: 'Components/Popover' },
      { name: 'Drawer', storyTitle: 'Components/Drawer' },
      { name: 'Tooltip', storyTitle: 'Components/Tooltip' },
      { name: 'Preview Card', storyTitle: 'Components/PreviewCard' },
    ],
  },
  {
    name: 'Navigation',
    components: [
      { name: 'Link', storyTitle: 'Components/Link' },
      { name: 'Breadcrumbs', storyTitle: 'Components/Breadcrumbs' },
      { name: 'Menu', storyTitle: 'Components/Menu' },
      { name: 'Context Menu', storyTitle: 'Components/ContextMenu' },
      { name: 'Menubar', storyTitle: 'Components/Menubar' },
      { name: 'Navigation Menu', storyTitle: 'Components/NavigationMenu' },
      { name: 'Toolbar', storyTitle: 'Components/Toolbar' },
    ],
  },
  {
    name: 'Data Display',
    components: [
      { name: 'Table', storyTitle: 'Components/Table' },
      { name: 'Grid List', storyTitle: 'Components/GridList' },
      { name: 'Tree', storyTitle: 'Components/Tree' },
      { name: 'Tag Group', storyTitle: 'Components/TagGroup' },
    ],
  },
  {
    name: 'Feedback & Display',
    components: [
      { name: 'Progress Bar', storyTitle: 'Components/ProgressBar' },
      { name: 'Meter', storyTitle: 'Components/Meter' },
      { name: 'Avatar', storyTitle: 'Components/Avatar' },
    ],
  },
  {
    name: 'Color',
    components: [
      { name: 'Color Components', storyTitle: 'Components/Color Components' },
    ],
  },
  {
    name: 'File',
    components: [
      { name: 'File Components', storyTitle: 'Components/File Components' },
    ],
  },
  {
    name: 'Form Structure',
    components: [
      { name: 'Field', storyTitle: 'Components/Field' },
      { name: 'Fieldset', storyTitle: 'Components/Fieldset' },
      { name: 'Form', storyTitle: 'Components/Form' },
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
