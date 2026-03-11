import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PreviewCard } from '@tale-ui/react/preview-card';

type Args = {
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
};

const meta: Meta<Args> = {
  title: 'Overlay/PreviewCard',
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
    <PreviewCard.Root>
      <PreviewCard.Trigger
        style={{ color: 'var(--color-60)', fontFamily: 'var(--body-font-family)', fontSize: 'var(--text-m-font-size)', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none' }}
      >
        @tale-ui/react
      </PreviewCard.Trigger>
      <PreviewCard.Portal>
        <PreviewCard.Positioner side={args.side} align={args.align} sideOffset={args.sideOffset}>
          <PreviewCard.Popup className="tale-preview-card__popup">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: 'var(--neutral-22)' }} />
              <div>
                <div style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-m-font-size)', fontWeight: 'var(--label-font-weight)', color: 'var(--neutral-90)' }}>
                  @tale-ui/react
                </div>
                <div style={{ fontFamily: 'var(--body-font-family)', fontSize: 'var(--text-s-font-size)', color: 'var(--neutral-60)', marginTop: '0.4rem' }}>
                  A styled React component library forked from MUI Base UI.
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.6rem', marginTop: '0.4rem' }}>
                <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-70)' }}>
                  <strong style={{ color: 'var(--neutral-90)' }}>240</strong> stars
                </span>
                <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-70)' }}>
                  <strong style={{ color: 'var(--neutral-90)' }}>18</strong> forks
                </span>
              </div>
            </div>
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  ),
};
