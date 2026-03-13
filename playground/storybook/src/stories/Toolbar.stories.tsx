import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toolbar } from '@tale-ui/react/toolbar';

type Args = {
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/Toolbar',
  parameters: { layout: 'centered' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    disabled: { control: 'boolean' },
  },
  args: {
    orientation: 'horizontal',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Toolbar.Root aria-label="Text formatting" orientation={args.orientation}>
      <Toolbar.Button aria-label="Bold" disabled={args.disabled}>
        <strong>B</strong>
      </Toolbar.Button>
      <Toolbar.Button aria-label="Italic" disabled={args.disabled}>
        <em>I</em>
      </Toolbar.Button>
      <Toolbar.Button aria-label="Underline" disabled={args.disabled}>
        <u>U</u>
      </Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Button aria-label="Align left" disabled={args.disabled}>⬅</Toolbar.Button>
      <Toolbar.Button aria-label="Align center" disabled={args.disabled}>≡</Toolbar.Button>
      <Toolbar.Button aria-label="Align right" disabled={args.disabled}>➡</Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Link href="#">Help</Toolbar.Link>
    </Toolbar.Root>
  ),
};

export const WithInput: Story = {
  name: 'With Input',
  render: () => (
    <Toolbar.Root aria-label="Search toolbar">
      <Toolbar.Button>Filter</Toolbar.Button>
      <Toolbar.Button>Sort</Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Input
       
        placeholder="Search…"
        aria-label="Search"
      />
    </Toolbar.Root>
  ),
};

export const WithToggleGroup: Story = {
  name: 'With Toggle Group',
  render: () => {
    const [active, setActive] = React.useState<string>('left');
    return (
      <Toolbar.Root aria-label="Alignment">
        <Toolbar.Group>
          {(['left', 'center', 'right'] as const).map((align) => (
            <Toolbar.Button
              key={align}
             
              aria-pressed={active === align}
              onClick={() => setActive(align)}
            >
              {align === 'left' ? '⬅' : align === 'center' ? '≡' : '➡'}
            </Toolbar.Button>
          ))}
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.Button disabled>Undo</Toolbar.Button>
        <Toolbar.Button disabled>Redo</Toolbar.Button>
      </Toolbar.Root>
    );
  },
};
