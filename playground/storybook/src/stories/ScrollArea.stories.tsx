import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from '@tale-ui/react/scroll-area';

const meta: Meta = {
  title: 'Layout/ScrollArea',
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <ScrollArea.Root style={{ width: '32rem', height: '20rem', border: '1px solid var(--neutral-20)', borderRadius: '0.8rem' }}>
      <ScrollArea.Viewport>
        <div style={{ padding: '1.6rem' }}>
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i} style={{ margin: '0 0 0.8rem', color: 'var(--neutral-70)', fontFamily: 'var(--body-font-family)', fontSize: 'var(--text-m-font-size)' }}>
              Line {i + 1}: This is a scrollable content area with custom styled scrollbars.
            </p>
          ))}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner />
    </ScrollArea.Root>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea.Root style={{ width: '36rem', height: '12rem', border: '1px solid var(--neutral-20)', borderRadius: '0.8rem' }}>
      <ScrollArea.Viewport>
        <div style={{ padding: '1.6rem', whiteSpace: 'nowrap' }}>
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} style={{ display: 'inline-block', marginRight: '2.4rem', padding: '0.8rem 1.6rem', background: 'var(--neutral-14)', borderRadius: '0.6rem', color: 'var(--neutral-80)', fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-m-font-size)' }}>
              Item {i + 1}
            </span>
          ))}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="horizontal">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  ),
};
