import type { Meta, StoryObj } from '@storybook/react';
import { GridList } from '@tale-ui/react/grid-list';
import { Icon } from '@tale-ui/react/icon';
import { Star, Heart, Bell, Settings, Mail } from 'lucide-react';

type Args = {
  selectionMode?: 'none' | 'single' | 'multiple';
};

const items = [
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
  { id: '3', name: 'Item 3' },
  { id: '4', name: 'Item 4' },
  { id: '5', name: 'Item 5' },
];

const meta: Meta<Args> = {
  title: 'Components/GridList',
  parameters: { layout: 'centered' },
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['none', 'single', 'multiple'],
    },
  },
  args: {
    selectionMode: 'none',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <GridList.Root aria-label="Items" selectionMode={args.selectionMode}>
        {items.map((item) => (
          <GridList.Item key={item.id} id={item.id} textValue={item.name}>
            {item.name}
          </GridList.Item>
        ))}
      </GridList.Root>
    );
  },
};

export const WithSelection: Story = {
  args: {
    selectionMode: 'multiple',
  },
  render(args) {
    return (
      <GridList.Root aria-label="Items" selectionMode={args.selectionMode}>
        {items.map((item) => (
          <GridList.Item key={item.id} id={item.id} textValue={item.name}>
            {item.name}
          </GridList.Item>
        ))}
      </GridList.Root>
    );
  },
};

const iconItems = [
  { id: '1', name: 'Favorites', icon: Star },
  { id: '2', name: 'Liked', icon: Heart },
  { id: '3', name: 'Alerts', icon: Bell },
  { id: '4', name: 'Settings', icon: Settings },
  { id: '5', name: 'Messages', icon: Mail },
];

export const WithIcons: Story = {
  render(args) {
    return (
      <GridList.Root aria-label="Items" selectionMode={args.selectionMode}>
        {iconItems.map((item) => (
          <GridList.Item key={item.id} id={item.id} textValue={item.name}>
            <Icon icon={item.icon} size="sm" />
            {item.name}
          </GridList.Item>
        ))}
      </GridList.Root>
    );
  },
};
