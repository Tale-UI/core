import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DrawerPreview as Drawer } from '@tale-ui/react/drawer';
import { Button } from '@tale-ui/react/button';

type Args = {
  title?: string;
  description?: string;
};

const meta: Meta<Args> = {
  title: 'Overlay/Drawer',
  parameters: { layout: 'centered' },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    title: 'Drawer',
    description: 'This is a bottom sheet drawer. Swipe down or click outside to close.',
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Drawer.Root>
      <Drawer.Trigger render={<Button className="tale-button tale-button--neutral">Open Drawer</Button>} />
      <Drawer.Portal>
        <Drawer.Backdrop className="tale-drawer__backdrop" />
        <Drawer.Popup className="tale-drawer__popup">
          <div className="tale-drawer__handle" />
          <Drawer.Title className="tale-drawer__title">{args.title}</Drawer.Title>
          <Drawer.Description className="tale-drawer__description">
            {args.description}
          </Drawer.Description>
          <div style={{ marginTop: '1.6rem', display: 'flex', gap: '1.2rem' }}>
            <Drawer.Close render={<Button className="tale-button tale-button--neutral" style={{ flex: 1 }}>Cancel</Button>} />
            <Drawer.Close render={<Button className="tale-button tale-button--primary" style={{ flex: 1 }}>Confirm</Button>} />
          </div>
        </Drawer.Popup>
      </Drawer.Portal>
    </Drawer.Root>
  ),
};

export const WithContent: Story = {
  name: 'With Rich Content',
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger render={<Button className="tale-button tale-button--primary">Share</Button>} />
      <Drawer.Portal>
        <Drawer.Backdrop className="tale-drawer__backdrop" />
        <Drawer.Popup className="tale-drawer__popup">
          <div className="tale-drawer__handle" />
          <Drawer.Title className="tale-drawer__title">Share</Drawer.Title>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.2rem', marginTop: '1.6rem' }}>
            {['Twitter', 'LinkedIn', 'Facebook', 'Email'].map((platform) => (
              <div key={platform} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '4.8rem', height: '4.8rem', borderRadius: '50%', background: 'var(--neutral-14)', border: '1px solid var(--neutral-20)' }} />
                <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-70)' }}>{platform}</span>
              </div>
            ))}
          </div>
        </Drawer.Popup>
      </Drawer.Portal>
    </Drawer.Root>
  ),
};
