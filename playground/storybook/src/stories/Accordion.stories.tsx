import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from '@tale-ui/react/accordion';

const ChevronIcon = () => (
  <svg className="tale-accordion__trigger-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="4,6 8,10 12,6" />
  </svg>
);

const items = [
  { value: 'a', title: 'What is Tale UI?', content: 'Tale UI is a styled component library forked from MUI Base UI, providing accessible headless components with opinionated CSS via @tale-ui/core design tokens.' },
  { value: 'b', title: 'How does styling work?', content: 'Styling lives in @tale-ui/react-styles. Components are headless — you apply CSS classes like .tale-button or .tale-accordion__trigger to your elements.' },
  { value: 'c', title: 'Can I use dark mode?', content: 'Yes! Set data-color-mode="dark" on the <html> element. The --neutral-* and --color-* tokens automatically invert.' },
];

type Args = {
  multiple?: boolean;
  disabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Layout/Accordion',
  parameters: { layout: 'centered' },
  argTypes: {
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    multiple: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: '48rem' }}>
      <Accordion.Root className="tale-accordion" multiple={args.multiple} disabled={args.disabled}>
        {items.map(({ value, title, content }) => (
          <Accordion.Item key={value} className="tale-accordion__item" value={value}>
            <Accordion.Header>
              <Accordion.Trigger className="tale-accordion__trigger">
                {title}
                <ChevronIcon />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel className="tale-accordion__panel">{content}</Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  ),
};

export const Multiple: Story = {
  name: 'Multiple Open',
  render: () => (
    <div style={{ width: '48rem' }}>
      <Accordion.Root className="tale-accordion" multiple>
        {items.map(({ value, title, content }) => (
          <Accordion.Item key={value} className="tale-accordion__item" value={value}>
            <Accordion.Header>
              <Accordion.Trigger className="tale-accordion__trigger">
                {title}
                <ChevronIcon />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel className="tale-accordion__panel">{content}</Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  ),
};

export const DefaultOpen: Story = {
  name: 'Default Open',
  render: () => (
    <div style={{ width: '48rem' }}>
      <Accordion.Root className="tale-accordion" defaultValue={['a']}>
        {items.map(({ value, title, content }) => (
          <Accordion.Item key={value} className="tale-accordion__item" value={value}>
            <Accordion.Header>
              <Accordion.Trigger className="tale-accordion__trigger">
                {title}
                <ChevronIcon />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel className="tale-accordion__panel">{content}</Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  ),
};
