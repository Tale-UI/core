import type { Meta, StoryObj } from '@storybook/react';
import { Link } from '@tale-ui/react/link';

type Args = {
  href: string;
  isDisabled: boolean;
  target?: string;
  children: string;
};

const meta: Meta<Args> = {
  title: 'Components/Link',
  parameters: { layout: 'centered' },
  render(args) {
    return (
      <Link href={args.href} isDisabled={args.isDisabled} target={args.target}>
        {args.children}
      </Link>
    );
  },
  argTypes: {
    isDisabled: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  args: {
    href: '#',
    isDisabled: false,
    children: 'Click here',
  },
};

export const Disabled: Story = {
  args: {
    href: '#',
    isDisabled: true,
    children: 'Click here',
  },
};

export const External: Story = {
  args: {
    href: 'https://example.com',
    isDisabled: false,
    target: '_blank',
    children: 'Open in new tab',
  },
};
