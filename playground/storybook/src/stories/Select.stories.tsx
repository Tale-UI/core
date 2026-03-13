import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '@tale-ui/react-styled/select';

const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];

type Args = {
  disabled?: boolean;
  placeholder?: string;
};

const meta: Meta<Args> = {
  title: 'Form Controls/Select',
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  args: {
    disabled: false,
    placeholder: 'Select a fruit…',
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Select.Root disabled={args.disabled}>
      <Select.Trigger>
        <Select.Value placeholder={args.placeholder} />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={4}>
          <Select.Popup>
            <Select.List>
              {fruits.map((fruit) => (
                <Select.Item key={fruit} value={fruit.toLowerCase()}>
                  <Select.ItemText>{fruit}</Select.ItemText>
                  <Select.ItemIndicator>✓</Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  ),
};

export const WithGroups: Story = {
  name: 'With Groups',
  render: () => (
    <Select.Root>
      <Select.Trigger>
        <Select.Value placeholder="Select a country…" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={4}>
          <Select.Popup>
            <Select.List>
              <Select.Group>
                <Select.GroupLabel>Europe</Select.GroupLabel>
                {['France', 'Germany', 'Spain'].map((c) => (
                  <Select.Item key={c} value={c.toLowerCase()}>
                    <Select.ItemText>{c}</Select.ItemText>
                    <Select.ItemIndicator>✓</Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Group>
              <Select.Separator />
              <Select.Group>
                <Select.GroupLabel>Americas</Select.GroupLabel>
                {['Brazil', 'Canada', 'Mexico'].map((c) => (
                  <Select.Item key={c} value={c.toLowerCase()}>
                    <Select.ItemText>{c}</Select.ItemText>
                    <Select.ItemIndicator>✓</Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  ),
};

export const WithDisabledItems: Story = {
  name: 'With Disabled Items',
  render: () => (
    <Select.Root>
      <Select.Trigger>
        <Select.Value placeholder="Select a plan…" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={4}>
          <Select.Popup>
            <Select.List>
              {[
                { value: 'free', label: 'Free' },
                { value: 'pro', label: 'Pro' },
                { value: 'enterprise', label: 'Enterprise (coming soon)', disabled: true },
              ].map(({ value, label, disabled }) => (
                <Select.Item key={value} value={value} disabled={disabled}>
                  <Select.ItemText>{label}</Select.ItemText>
                  <Select.ItemIndicator>✓</Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  ),
};
