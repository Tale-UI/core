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
      <Tabs.Root defaultValue="overview" orientation={args.orientation}>
        <Tabs.List>
          {tabItems.map(({ value, label }) => (
            <Tabs.Tab key={value} value={value}>{label}</Tabs.Tab>
          ))}
          <Tabs.Indicator />
        </Tabs.List>
        {tabItems.map(({ value, content }) => (
          <Tabs.Panel key={value} value={value}>{content}</Tabs.Panel>
        ))}
      </Tabs.Root>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ width: '52rem', height: '24rem' }}>
      <Tabs.Root defaultValue="overview" orientation="vertical">
        <Tabs.List>
          {tabItems.map(({ value, label }) => (
            <Tabs.Tab key={value} value={value}>{label}</Tabs.Tab>
          ))}
          <Tabs.Indicator />
        </Tabs.List>
        {tabItems.map(({ value, content }) => (
          <Tabs.Panel key={value} value={value}>{content}</Tabs.Panel>
        ))}
      </Tabs.Root>
    </div>
  ),
};

export const WithDisabledTab: Story = {
  name: 'With Disabled Tab',
  render: () => (
    <div style={{ width: '52rem' }}>
      <Tabs.Root defaultValue="overview">
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="features" disabled>Features (disabled)</Tabs.Tab>
          <Tabs.Tab value="docs">Docs</Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Panel value="overview">Overview content.</Tabs.Panel>
        <Tabs.Panel value="features">Features content.</Tabs.Panel>
        <Tabs.Panel value="docs">Docs content.</Tabs.Panel>
      </Tabs.Root>
    </div>
  ),
};
