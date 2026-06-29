import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToggleButton, ToggleButtonGroup } from '@tale-ui/react/toggle-button';

type Args = {
  size?: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
  defaultSelected?: boolean;
  children?: string;
};

const meta: Meta<Args> = {
  title: 'Components/ToggleButton',
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isDisabled: { control: 'boolean' },
    defaultSelected: { control: 'boolean' },
  },
  args: {
    size: 'md',
    isDisabled: false,
    defaultSelected: false,
    children: 'Toggle me',
  },
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <ToggleButton key={String(args.defaultSelected)} size={args.size} isDisabled={args.isDisabled} defaultSelected={args.defaultSelected}>
      {args.children}
    </ToggleButton>
  ),
};

export const Pressed: Story = {
  args: {
    defaultSelected: true,
    children: 'Pressed',
  },
  render: Default.render,
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    children: 'Disabled',
  },
  render: Default.render,
};

export const Group: Story = {
  render: (args) => (
    <ToggleButtonGroup aria-label="Text formatting">
      <ToggleButton key={`bold-${args.defaultSelected}`} size={args.size} isDisabled={args.isDisabled} defaultSelected={args.defaultSelected}>
        Bold
      </ToggleButton>
      <ToggleButton size={args.size} isDisabled={args.isDisabled}>
        Italic
      </ToggleButton>
      <ToggleButton size={args.size} isDisabled={args.isDisabled}>
        Underline
      </ToggleButton>
    </ToggleButtonGroup>
  ),
};

export const AllSizes: Story = {
  render: (args) => (
    <div className="story-row story-row--s">
      <ToggleButton key={`sm-${args.defaultSelected}`} size="sm" isDisabled={args.isDisabled} defaultSelected={args.defaultSelected}>
        Small
      </ToggleButton>
      <ToggleButton key={`md-${args.defaultSelected}`} size="md" isDisabled={args.isDisabled} defaultSelected={args.defaultSelected}>
        Medium
      </ToggleButton>
      <ToggleButton key={`lg-${args.defaultSelected}`} size="lg" isDisabled={args.isDisabled} defaultSelected={args.defaultSelected}>
        Large
      </ToggleButton>
    </div>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const sizes = ['sm', 'md', 'lg'] as const;
    const states = [
      { label: 'Default', props: {} },
      { label: 'Pressed', props: { defaultSelected: true } },
      { label: 'Disabled', props: { isDisabled: true } },
      { label: 'Disabled + Pressed', props: { isDisabled: true, defaultSelected: true } },
    ] as const;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Individual buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(3, auto)', gap: '0.5rem 0.75rem', alignItems: 'center' }}>
          <div />
          {sizes.map((s) => <div key={s} className="story-label">{s}</div>)}
          {states.map((state) => (
            <React.Fragment>
              <div key={`label-${state.label}`} className="story-label">{state.label}</div>
              {sizes.map((s) => (
                <ToggleButton key={`${state.label}-${s}`} size={s} {...state.props}>{state.label}</ToggleButton>
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* Grouped buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '0.5rem 0.75rem', alignItems: 'center' }}>
          {sizes.map((s) => (
            <React.Fragment>
              <div key={`group-label-${s}`} className="story-label">Group ({s})</div>
              <ToggleButtonGroup key={`group-${s}`} aria-label={`Formatting ${s}`}>
                <ToggleButton size={s}>Bold</ToggleButton>
                <ToggleButton size={s} defaultSelected>Italic</ToggleButton>
                <ToggleButton size={s}>Underline</ToggleButton>
              </ToggleButtonGroup>
            </React.Fragment>
          ))}
          <div className="story-label">Group (disabled)</div>
          <ToggleButtonGroup aria-label="Formatting disabled">
            <ToggleButton isDisabled>Bold</ToggleButton>
            <ToggleButton isDisabled defaultSelected>Italic</ToggleButton>
            <ToggleButton isDisabled>Underline</ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
    );
  },
};
