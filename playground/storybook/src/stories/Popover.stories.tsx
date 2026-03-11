import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Popover } from '@tale-ui/react/popover';
import { Button } from '@tale-ui/react/button';

const XIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="14" height="14">
    <line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" />
  </svg>
);

type Args = {
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
};

const meta: Meta<Args> = {
  title: 'Overlay/Popover',
  parameters: { layout: 'centered' },
  argTypes: {
    side: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    align: { control: 'select', options: ['start', 'center', 'end'] },
    sideOffset: { control: { type: 'number', min: 0, max: 20 } },
  },
  args: {
    side: 'bottom',
    align: 'start',
    sideOffset: 8,
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Popover.Root>
      <Popover.Trigger render={<Button className="tale-button tale-button--neutral">Open Popover</Button>} />
      <Popover.Portal>
        <Popover.Positioner side={args.side} align={args.align} sideOffset={args.sideOffset}>
          <Popover.Popup className="tale-popover__popup">
            <Popover.Close className="tale-popover__close" aria-label="Close"><XIcon /></Popover.Close>
            <Popover.Title className="tale-popover__title">Popover Title</Popover.Title>
            <Popover.Description className="tale-popover__description">
              This is a popover. It's anchored to the trigger button above and closes when you click outside.
            </Popover.Description>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  ),
};

export const Top: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger render={<Button className="tale-button tale-button--neutral">Open (top)</Button>} />
      <Popover.Portal>
        <Popover.Positioner side="top" align="center" sideOffset={8}>
          <Popover.Popup className="tale-popover__popup">
            <Popover.Title className="tale-popover__title">Above trigger</Popover.Title>
            <Popover.Description className="tale-popover__description">
              This popover appears above the trigger.
            </Popover.Description>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  ),
};
