import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from '@tale-ui/react/tooltip';
import { Button } from '@tale-ui/react/button';

type Args = {
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  content?: string;
};

const meta: Meta<Args> = {
  title: 'Overlay/Tooltip',
  parameters: { layout: 'centered' },
  argTypes: {
    side: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    sideOffset: { control: { type: 'number', min: 0, max: 20 } },
    content: { control: 'text' },
  },
  args: {
    side: 'top',
    sideOffset: 8,
    content: 'This is a tooltip',
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger render={<Button className="tale-button tale-button--neutral">Hover me</Button>} />
        <Tooltip.Portal>
          <Tooltip.Positioner side={args.side} sideOffset={args.sideOffset}>
            <Tooltip.Popup className="tale-tooltip__popup">
              {args.content}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  ),
};

export const AllSides: Story = {
  name: 'All Sides',
  render: () => (
    <Tooltip.Provider>
      <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', justifyContent: 'center', padding: '4rem' }}>
        {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
          <Tooltip.Root key={side}>
            <Tooltip.Trigger render={<Button className="tale-button tale-button--neutral">{side}</Button>} />
            <Tooltip.Portal>
              <Tooltip.Positioner side={side} sideOffset={8}>
                <Tooltip.Popup className="tale-tooltip__popup">
                  Appears on the {side}
                </Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
        ))}
      </div>
    </Tooltip.Provider>
  ),
};

export const LongText: Story = {
  name: 'Long Text',
  render: () => (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger render={<Button className="tale-button tale-button--neutral">Info</Button>} />
        <Tooltip.Portal>
          <Tooltip.Positioner side="right" sideOffset={8}>
            <Tooltip.Popup className="tale-tooltip__popup">
              This tooltip has longer text that wraps to multiple lines to show the max-width behavior.
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  ),
};
