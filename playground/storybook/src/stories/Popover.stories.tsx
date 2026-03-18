import type { Meta, StoryObj } from '@storybook/react';
import { Popover } from '@tale-ui/react/popover';

const XIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="16" height="16">
    <line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" />
  </svg>
);

type Args = {
  placement?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
};

const meta: Meta<Args> = {
  title: 'Components/Popover',
  parameters: { layout: 'centered' },
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    offset: { control: 'number' },
  },
  args: {
    placement: 'bottom',
    offset: 8,
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <div style={{ padding: 'var(--space-4xl)', display: 'flex', justifyContent: 'center' }}>
      <Popover.Root>
        <Popover.Trigger className="tale-button tale-button--neutral tale-button--md">Open Popover</Popover.Trigger>
        <Popover.Popup placement={args.placement} offset={args.offset}>
          <Popover.Title>Popover Title</Popover.Title>
          <Popover.Description>
            This is a basic popover with a title and description.
          </Popover.Description>
        </Popover.Popup>
      </Popover.Root>
    </div>
  ),
};

export const WithArrow: Story = {
  render: (args) => (
    <div style={{ padding: 'var(--space-4xl)', display: 'flex', justifyContent: 'center' }}>
      <Popover.Root>
        <Popover.Trigger className="tale-button tale-button--neutral tale-button--md">With Arrow</Popover.Trigger>
        <Popover.Popup placement={args.placement} offset={args.offset}>
          <Popover.Arrow />
          <Popover.Title>Arrow Popover</Popover.Title>
          <Popover.Description>
            This popover includes an arrow pointing to the trigger.
          </Popover.Description>
        </Popover.Popup>
      </Popover.Root>
    </div>
  ),
};

export const AllPlacements: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div
      style={{
        padding: 'var(--space-4xl)',
        display: 'flex',
        gap: 'var(--space-m)',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}
    >
      {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
        <Popover.Root key={placement}>
          <Popover.Trigger className="tale-button tale-button--neutral tale-button--md">{placement}</Popover.Trigger>
          <Popover.Popup placement={placement} offset={8}>
            <Popover.Arrow />
            <Popover.Title>Placement: {placement}</Popover.Title>
            <Popover.Description>
              This popover is placed on the {placement}.
            </Popover.Description>
          </Popover.Popup>
        </Popover.Root>
      ))}
    </div>
  ),
};

export const WithCloseButton: Story = {
  name: 'With Close Button',
  render: (args) => (
    <div style={{ padding: 'var(--space-4xl)', display: 'flex', justifyContent: 'center' }}>
      <Popover.Root>
        <Popover.Trigger className="tale-button tale-button--neutral tale-button--md">Open Popover</Popover.Trigger>
        <Popover.Popup placement={args.placement} offset={args.offset}>
          <Popover.Close aria-label="Close"><XIcon /></Popover.Close>
          <Popover.Title>Dismissible Popover</Popover.Title>
          <Popover.Description>
            Click the close button to dismiss this popover.
          </Popover.Description>
        </Popover.Popup>
      </Popover.Root>
    </div>
  ),
};
