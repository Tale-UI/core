import type { Meta, StoryObj } from '@storybook/react-vite';
import { Row } from '@tale-ui/react/row';
import { Button } from '@tale-ui/react/button';
import { Badge } from '@tale-ui/react/badge';

type Args = {
  gap: '4xs' | '3xs' | '2xs' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl';
  align: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify: 'start' | 'center' | 'end' | 'between';
  wrap: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/Row',
  parameters: { layout: 'padded' },
  argTypes: {
    gap: { control: 'select', options: ['4xs', '3xs', '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'between'] },
    wrap: { control: 'boolean' },
  },
  args: { gap: 'm', align: 'center', justify: 'start', wrap: false },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <Row gap={args.gap} align={args.align} justify={args.justify} wrap={args.wrap}>
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary">Save</Button>
      </Row>
    );
  },
};

export const JustifyEnd: Story = {
  render() {
    return (
      <Row gap="s" justify="end">
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary">Save</Button>
      </Row>
    );
  },
};

export const SpaceBetween: Story = {
  render() {
    return (
      <Row gap="m" justify="between">
        <Badge>Status</Badge>
        <Button variant="ghost" size="sm">Edit</Button>
      </Row>
    );
  },
};

export const Wrapped: Story = {
  render() {
    return (
      <Row gap="xs" wrap style={{ maxWidth: '20rem' }}>
        {Array.from({ length: 8 }, (_, i) => (
          <Badge key={i} variant="brand">Tag {i + 1}</Badge>
        ))}
      </Row>
    );
  },
};
