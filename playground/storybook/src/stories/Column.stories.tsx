import type { Meta, StoryObj } from '@storybook/react-vite';
import { Column } from '@tale-ui/react/column';
import { Text } from '@tale-ui/react/text';
import { Button } from '@tale-ui/react/button';

type Args = {
  gap: '4xs' | '3xs' | '2xs' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl';
  align: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify: 'start' | 'center' | 'end' | 'between';
};

const meta: Meta<Args> = {
  title: 'Components/Column',
  parameters: { layout: 'padded' },
  argTypes: {
    gap: { control: 'select', options: ['4xs', '3xs', '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'between'] },
  },
  args: { gap: 'm', align: 'stretch', justify: 'start' },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <Column gap={args.gap} align={args.align} justify={args.justify} style={{ maxWidth: '32rem' }}>
        <Text variant="heading" size="m" as="h2">Settings</Text>
        <Text color="muted">Configure your preferences below.</Text>
        <Button variant="primary">Save changes</Button>
      </Column>
    );
  },
};

export const Centered: Story = {
  render() {
    return (
      <Column gap="s" align="center">
        <Text variant="heading" size="l" as="h1">Welcome</Text>
        <Text color="muted">Get started with your project.</Text>
        <Button variant="primary">Get started</Button>
      </Column>
    );
  },
};
