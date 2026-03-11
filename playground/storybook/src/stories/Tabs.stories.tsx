import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from '@tale-ui/react/tabs';

type Args = {
  orientation?: 'horizontal' | 'vertical';
};

const meta: Meta<Args> = {
  title: 'Layout/Tabs',
  parameters: { layout: 'centered' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
  args: {
    orientation: 'horizontal',
  },
};

export default meta;
type Story = StoryObj<Args>;

const tabItems = [
  { value: 'overview', label: 'Overview', content: 'Overview content goes here. This tab is active by default.' },
  { value: 'features', label: 'Features', content: 'A list of all available features in Tale UI.' },
  { value: 'docs', label: 'Docs', content: 'Full documentation, API reference, and usage examples.' },
];

export const Default: Story = {
  render: (args) => (
    <div style={{ width: '52rem', height: args.orientation === 'vertical' ? '24rem' : undefined }}>
      <Tabs.Root className="tale-tabs" defaultValue="overview" orientation={args.orientation}>
        <Tabs.List className="tale-tabs__list">
          {tabItems.map(({ value, label }) => (
            <Tabs.Tab key={value} className="tale-tabs__tab" value={value}>{label}</Tabs.Tab>
          ))}
          <Tabs.Indicator className="tale-tabs__indicator" />
        </Tabs.List>
        {tabItems.map(({ value, content }) => (
          <Tabs.Panel key={value} className="tale-tabs__panel" value={value}>{content}</Tabs.Panel>
        ))}
      </Tabs.Root>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ width: '52rem', height: '24rem' }}>
      <Tabs.Root className="tale-tabs" defaultValue="overview" orientation="vertical">
        <Tabs.List className="tale-tabs__list">
          {tabItems.map(({ value, label }) => (
            <Tabs.Tab key={value} className="tale-tabs__tab" value={value}>{label}</Tabs.Tab>
          ))}
          <Tabs.Indicator className="tale-tabs__indicator" />
        </Tabs.List>
        {tabItems.map(({ value, content }) => (
          <Tabs.Panel key={value} className="tale-tabs__panel" value={value}>{content}</Tabs.Panel>
        ))}
      </Tabs.Root>
    </div>
  ),
};

export const WithDisabledTab: Story = {
  name: 'With Disabled Tab',
  render: () => (
    <div style={{ width: '52rem' }}>
      <Tabs.Root className="tale-tabs" defaultValue="overview">
        <Tabs.List className="tale-tabs__list">
          <Tabs.Tab className="tale-tabs__tab" value="overview">Overview</Tabs.Tab>
          <Tabs.Tab className="tale-tabs__tab" value="features" disabled>Features (disabled)</Tabs.Tab>
          <Tabs.Tab className="tale-tabs__tab" value="docs">Docs</Tabs.Tab>
          <Tabs.Indicator className="tale-tabs__indicator" />
        </Tabs.List>
        <Tabs.Panel className="tale-tabs__panel" value="overview">Overview content.</Tabs.Panel>
        <Tabs.Panel className="tale-tabs__panel" value="features">Features content.</Tabs.Panel>
        <Tabs.Panel className="tale-tabs__panel" value="docs">Docs content.</Tabs.Panel>
      </Tabs.Root>
    </div>
  ),
};
