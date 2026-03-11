import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '@tale-ui/react/select';

const ChevronIcon = () => (
  <svg className="tale-select__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
    <polyline points="4,6 8,10 12,6" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="14" height="14">
    <polyline points="2,7 5.5,10.5 12,3.5" />
  </svg>
);

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
      <Select.Trigger className="tale-select__trigger">
        <Select.Value className="tale-select__value" placeholder={args.placeholder} />
        <ChevronIcon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={4}>
          <Select.Popup className="tale-select__popup">
            <Select.List className="tale-select__list">
              {fruits.map((fruit) => (
                <Select.Item key={fruit} className="tale-select__item" value={fruit.toLowerCase()}>
                  <Select.ItemText className="tale-select__item-text">{fruit}</Select.ItemText>
                  <Select.ItemIndicator className="tale-select__item-indicator"><CheckIcon /></Select.ItemIndicator>
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
      <Select.Trigger className="tale-select__trigger">
        <Select.Value className="tale-select__value" placeholder="Select a country…" />
        <ChevronIcon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={4}>
          <Select.Popup className="tale-select__popup">
            <Select.List className="tale-select__list">
              <Select.Group>
                <Select.GroupLabel className="tale-select__group-label">Europe</Select.GroupLabel>
                {['France', 'Germany', 'Spain'].map((c) => (
                  <Select.Item key={c} className="tale-select__item" value={c.toLowerCase()}>
                    <Select.ItemText className="tale-select__item-text">{c}</Select.ItemText>
                    <Select.ItemIndicator className="tale-select__item-indicator"><CheckIcon /></Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Group>
              <Select.Separator className="tale-select__separator" />
              <Select.Group>
                <Select.GroupLabel className="tale-select__group-label">Americas</Select.GroupLabel>
                {['Brazil', 'Canada', 'Mexico'].map((c) => (
                  <Select.Item key={c} className="tale-select__item" value={c.toLowerCase()}>
                    <Select.ItemText className="tale-select__item-text">{c}</Select.ItemText>
                    <Select.ItemIndicator className="tale-select__item-indicator"><CheckIcon /></Select.ItemIndicator>
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
      <Select.Trigger className="tale-select__trigger">
        <Select.Value className="tale-select__value" placeholder="Select a plan…" />
        <ChevronIcon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={4}>
          <Select.Popup className="tale-select__popup">
            <Select.List className="tale-select__list">
              {[
                { value: 'free', label: 'Free' },
                { value: 'pro', label: 'Pro' },
                { value: 'enterprise', label: 'Enterprise (coming soon)', disabled: true },
              ].map(({ value, label, disabled }) => (
                <Select.Item key={value} className="tale-select__item" value={value} disabled={disabled}>
                  <Select.ItemText className="tale-select__item-text">{label}</Select.ItemText>
                  <Select.ItemIndicator className="tale-select__item-indicator"><CheckIcon /></Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  ),
};
