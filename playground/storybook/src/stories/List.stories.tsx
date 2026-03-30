import type { Meta, StoryObj } from '@storybook/react-vite';
import { List } from '@tale-ui/react/list';

type Args = {
  variant: 'plain' | 'divided';
  density: 'compact' | 'default' | 'spacious';
};

const meta: Meta<Args> = {
  title: 'Components/List',
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['plain', 'divided'] },
    density: { control: 'select', options: ['compact', 'default', 'spacious'] },
  },
  args: { variant: 'plain', density: 'default' },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <List.Root variant={args.variant} density={args.density} style={{ minWidth: '24rem' }}>
        <List.Item>First item</List.Item>
        <List.Item>Second item</List.Item>
        <List.Item>Third item</List.Item>
      </List.Root>
    );
  },
};

export const Divided: Story = {
  render() {
    return (
      <List.Root variant="divided" style={{ minWidth: '24rem' }}>
        <List.Item>Apple</List.Item>
        <List.Item>Banana</List.Item>
        <List.Item>Cherry</List.Item>
        <List.Item>Date</List.Item>
      </List.Root>
    );
  },
};

export const AllDensities: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const densities = ['compact', 'default', 'spacious'] as const;
    return (
      <div style={{ display: 'flex', gap: '4rem' }}>
        {densities.map((d) => (
          <div key={d}>
            <div className="story-heading">{d}</div>
            <List.Root variant="divided" density={d} style={{ minWidth: '20rem' }}>
              <List.Item>Item one</List.Item>
              <List.Item>Item two</List.Item>
              <List.Item>Item three</List.Item>
            </List.Root>
          </div>
        ))}
      </div>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const variants = ['plain', 'divided'] as const;
    return (
      <div style={{ display: 'flex', gap: '4rem' }}>
        {variants.map((v) => (
          <div key={v}>
            <div className="story-heading">{v}</div>
            <List.Root variant={v} style={{ minWidth: '20rem' }}>
              <List.Item>Item one</List.Item>
              <List.Item>Item two</List.Item>
              <List.Item>Item three</List.Item>
            </List.Root>
          </div>
        ))}
      </div>
    );
  },
};
