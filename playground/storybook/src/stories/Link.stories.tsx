import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import { Icon } from '@tale-ui/react/icon';
import { Link } from '@tale-ui/react/link';

type Args = {
  href: string;
  isDisabled: boolean;
  target?: string;
  rel?: string;
  children: string;
};

const meta: Meta<Args> = {
  title: 'Components/Link',
  parameters: { layout: 'centered' },
  render(args) {
    return (
      <Link
        href={args.href}
        isDisabled={args.isDisabled}
        target={args.target}
        rel={args.rel}
      >
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
    rel: { control: 'text' },
    children: { control: 'text' },
  },
  args: {
    href: '#',
    isDisabled: false,
    target: '_self',
    rel: undefined,
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
    rel: 'noopener noreferrer',
    children: 'Open in new tab',
  },
  render(args) {
    return (
      <Link
        href={args.href}
        isDisabled={args.isDisabled}
        target={args.target}
        rel={args.rel}
        iconTrailing={<Icon icon={ExternalLink} size="sm" />}
      >
        {args.children}
      </Link>
    );
  },
};

export const WithIcons: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-col story-col--m">
        <Link href="/docs" iconLeading={<Icon icon={BookOpen} size="sm" />}>
          Documentation
        </Link>
        <Link href="/changelog" iconTrailing={<Icon icon={ArrowRight} size="sm" />}>
          View changelog
        </Link>
        <Link
          href="https://example.com"
          target="_blank"
          rel="noopener noreferrer"
          iconTrailing={<Icon icon={ExternalLink} size="sm" />}
        >
          External link
        </Link>
      </div>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-col story-col--m">
        <Link href="#">Default link</Link>
        <Link href="#" isDisabled>Disabled link</Link>
        <Link href="/docs" iconLeading={<Icon icon={BookOpen} size="sm" />}>
          Documentation
        </Link>
        <Link href="/changelog" iconTrailing={<Icon icon={ArrowRight} size="sm" />}>
          View changelog
        </Link>
        <Link
          href="https://example.com"
          target="_blank"
          rel="noopener noreferrer"
          iconTrailing={<Icon icon={ExternalLink} size="sm" />}
        >
          External link (new tab)
        </Link>
      </div>
    );
  },
};
