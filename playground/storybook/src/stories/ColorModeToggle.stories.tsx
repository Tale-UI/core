import type { Meta, StoryObj } from '@storybook/react';
import { ColorModeToggle } from '@tale-ui/react/color-mode-toggle';

type Args = {
  isDisabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/ColorModeToggle',
  parameters: { layout: 'centered' },
  argTypes: {
    isDisabled: { control: 'boolean' },
  },
  args: {
    isDisabled: false,
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => <ColorModeToggle isDisabled={args.isDisabled} />,
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
  render: (args) => <ColorModeToggle isDisabled={args.isDisabled} />,
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-row story-row--m">
        <div className="story-col" style={{ alignItems: 'center' }}>
          <ColorModeToggle />
          <span style={{ fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-60)' }}>Default</span>
        </div>
        <div className="story-col" style={{ alignItems: 'center' }}>
          <ColorModeToggle isDisabled />
          <span style={{ fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-60)' }}>Disabled</span>
        </div>
      </div>
    );
  },
};
