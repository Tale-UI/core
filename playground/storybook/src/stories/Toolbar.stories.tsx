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
    <Toolbar.Root className="tale-toolbar" aria-label="Text formatting" orientation={args.orientation}>
      <Toolbar.Button className="tale-toolbar__button" aria-label="Bold" disabled={args.disabled}>
        <strong>B</strong>
      </Toolbar.Button>
      <Toolbar.Button className="tale-toolbar__button" aria-label="Italic" disabled={args.disabled}>
        <em>I</em>
      </Toolbar.Button>
      <Toolbar.Button className="tale-toolbar__button" aria-label="Underline" disabled={args.disabled}>
        <u>U</u>
      </Toolbar.Button>
      <Toolbar.Separator className="tale-toolbar__separator" />
      <Toolbar.Button className="tale-toolbar__button" aria-label="Align left" disabled={args.disabled}>⬅</Toolbar.Button>
      <Toolbar.Button className="tale-toolbar__button" aria-label="Align center" disabled={args.disabled}>≡</Toolbar.Button>
      <Toolbar.Button className="tale-toolbar__button" aria-label="Align right" disabled={args.disabled}>➡</Toolbar.Button>
      <Toolbar.Separator className="tale-toolbar__separator" />
      <Toolbar.Link className="tale-toolbar__link" href="#">Help</Toolbar.Link>
    </Toolbar.Root>
  ),
};

export const WithInput: Story = {
  name: 'With Input',
  render: () => (
    <Toolbar.Root className="tale-toolbar" aria-label="Search toolbar">
      <Toolbar.Button className="tale-toolbar__button">Filter</Toolbar.Button>
      <Toolbar.Button className="tale-toolbar__button">Sort</Toolbar.Button>
      <Toolbar.Separator className="tale-toolbar__separator" />
      <Toolbar.Input
        className="tale-toolbar__input tale-input"
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
      <Toolbar.Root className="tale-toolbar" aria-label="Alignment">
        <Toolbar.Group>
          {(['left', 'center', 'right'] as const).map((align) => (
            <Toolbar.Button
              key={align}
              className="tale-toolbar__button"
              aria-pressed={active === align}
              onClick={() => setActive(align)}
            >
              {align === 'left' ? '⬅' : align === 'center' ? '≡' : '➡'}
            </Toolbar.Button>
          ))}
        </Toolbar.Group>
        <Toolbar.Separator className="tale-toolbar__separator" />
        <Toolbar.Button className="tale-toolbar__button" disabled>Undo</Toolbar.Button>
        <Toolbar.Button className="tale-toolbar__button" disabled>Redo</Toolbar.Button>
      </Toolbar.Root>
    );
  },
};
