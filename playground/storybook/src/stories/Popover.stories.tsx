import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Popover } from '@tale-ui/react-styled/popover';
import { Button } from '@tale-ui/react-styled/button';

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
      <Popover.Trigger render={<Button variant="neutral">Open Popover</Button>} />
      <Popover.Portal>
        <Popover.Positioner side={args.side} align={args.align} sideOffset={args.sideOffset}>
          <Popover.Popup>
            <Popover.Close aria-label="Close">×</Popover.Close>
            <Popover.Title>Popover Title</Popover.Title>
            <Popover.Description>
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
      <Popover.Trigger render={<Button variant="neutral">Open (top)</Button>} />
      <Popover.Portal>
        <Popover.Positioner side="top" align="center" sideOffset={8}>
          <Popover.Popup>
            <Popover.Title>Above trigger</Popover.Title>
            <Popover.Description>
              This popover appears above the trigger.
            </Popover.Description>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  ),
};
