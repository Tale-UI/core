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
    href: { control: 'text' },
    isDisabled: { control: 'boolean' },
    target: {
      control: 'select',
      options: ['_self', '_blank'],
    },
    children: { control: 'text' },
  },
  args: {
    href: '#',
    isDisabled: false,
    target: '_self',
    children: 'Click here',
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

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-col story-col--m">
        <Link href="#">Default link</Link>
        <Link href="#" isDisabled>Disabled link</Link>
        <Link href="https://example.com" target="_blank">External link (new tab)</Link>
      </div>
    );
  },
};
