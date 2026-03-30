import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '@tale-ui/react/card';
import { Button } from '@tale-ui/react/button';

type Args = {
  variant: 'outlined' | 'elevated' | 'filled';
  padding: 'sm' | 'md' | 'lg';
};

const meta: Meta<Args> = {
  title: 'Components/Card',
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['outlined', 'elevated', 'filled'] },
    padding: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { variant: 'outlined', padding: 'md' },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <Card.Root variant={args.variant} padding={args.padding} style={{ maxWidth: '36rem' }}>
        <Card.Header>Card title</Card.Header>
        <Card.Body>This is the card body content. It can contain any elements.</Card.Body>
        <Card.Footer>
          <Button variant="ghost" size="sm">Cancel</Button>
          <Button variant="primary" size="sm">Confirm</Button>
        </Card.Footer>
      </Card.Root>
    );
  },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const variants = ['outlined', 'elevated', 'filled'] as const;
    return (
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        {variants.map((v) => (
          <Card.Root key={v} variant={v} style={{ maxWidth: '24rem' }}>
            <Card.Header>{v}</Card.Header>
            <Card.Body>Card content with the {v} variant.</Card.Body>
          </Card.Root>
        ))}
      </div>
    );
  },
};

export const AllPaddings: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const paddings = ['sm', 'md', 'lg'] as const;
    return (
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        {paddings.map((p) => (
          <Card.Root key={p} padding={p} style={{ maxWidth: '24rem' }}>
            <Card.Header>Padding: {p}</Card.Header>
            <Card.Body>Card with {p} padding.</Card.Body>
          </Card.Root>
        ))}
      </div>
    );
  },
};
