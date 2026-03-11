import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from '@tale-ui/react/toast';
import { Button } from '@tale-ui/react/button';

const XIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="14" height="14">
    <line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" />
  </svg>
);

/** Renders the live toast stack. Must be inside Toast.Provider. */
function ToastStack() {
  const { toasts } = Toast.useToastManager();
  return (
    <div className="tale-toast__positioner">
      {toasts.map((toast) => (
        <Toast.Positioner key={toast.id} toast={toast}>
          <Toast.Root className="tale-toast__root" toast={toast}>
            <Toast.Content className="tale-toast__content">
              <Toast.Title className="tale-toast__title">{toast.title}</Toast.Title>
              {toast.description && (
                <Toast.Description className="tale-toast__description">
                  {toast.description}
                </Toast.Description>
              )}
            </Toast.Content>
            <Toast.Close className="tale-toast__close" aria-label="Close">
              <XIcon />
            </Toast.Close>
          </Toast.Root>
        </Toast.Positioner>
      ))}
    </div>
  );
}

function ToastTrigger({ type }: { type?: string }) {
  const { add } = Toast.useToastManager();
  const variantClass = type === 'error' ? 'danger' : type === 'success' ? 'primary' : 'neutral';
  return (
    <Button
      className={`tale-button tale-button--${variantClass}`}
      onClick={() =>
        add({
          title: type ? `${type.charAt(0).toUpperCase() + type.slice(1)}!` : 'Notification',
          description: 'This is a toast notification.',
          type,
        })
      }
    >
      Show {type ?? 'default'} toast
    </Button>
  );
}

type Args = {
  type?: 'default' | 'success' | 'error' | 'warning';
  title?: string;
  description?: string;
};

const meta: Meta<Args> = {
  title: 'Feedback/Toast',
  parameters: { layout: 'centered' },
  argTypes: {
    type: { control: 'select', options: ['default', 'success', 'error', 'warning'] },
    title: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    type: 'success',
    title: 'Success!',
    description: 'Operation completed successfully.',
  },
  decorators: [
    (Story) => (
      <Toast.Provider>
        <Story />
        <ToastStack />
      </Toast.Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => {
    const { add } = Toast.useToastManager();
    const variantClass = args.type === 'error' ? 'danger' : args.type === 'success' ? 'primary' : 'neutral';
    return (
      <Button
        className={`tale-button tale-button--${variantClass}`}
        onClick={() => add({ title: args.title ?? 'Notification', description: args.description, type: args.type === 'default' ? undefined : args.type })}
      >
        Show toast
      </Button>
    );
  },
};

export const Success: Story = {
  render: () => <ToastTrigger type="success" />,
};

export const Error: Story = {
  render: () => <ToastTrigger type="error" />,
};

export const Warning: Story = {
  render: () => <ToastTrigger type="warning" />,
};

export const AllTypes: Story = {
  name: 'All Types',
  render: () => (
    <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
      <ToastTrigger />
      <ToastTrigger type="success" />
      <ToastTrigger type="error" />
      <ToastTrigger type="warning" />
    </div>
  ),
};
