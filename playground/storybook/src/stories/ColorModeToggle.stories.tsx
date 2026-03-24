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
