import type { Meta, StoryObj } from '@storybook/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Icon } from '@tale-ui/react/icon';
import { Pagination } from '@tale-ui/react/pagination';

type Args = Record<string, never>;

const meta: Meta<Args> = {
  title: 'Components/Pagination',
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render() {
    return (
      <Pagination.Root aria-label="Pagination">
        <Pagination.PreviousTrigger />
        <Pagination.Item page={1} />
        <Pagination.Item page={2} current />
        <Pagination.Item page={3} />
        <Pagination.NextTrigger />
      </Pagination.Root>
    );
  },
};

export const ManyPages: Story = {
  render() {
    return (
      <Pagination.Root aria-label="Pagination">
        <Pagination.PreviousTrigger />
        <Pagination.Item page={1} />
        <Pagination.Ellipsis />
        <Pagination.Item page={4} />
        <Pagination.Item page={5} current />
        <Pagination.Item page={6} />
        <Pagination.Ellipsis />
        <Pagination.Item page={20} />
        <Pagination.NextTrigger />
      </Pagination.Root>
    );
  },
};

export const FirstPage: Story = {
  render() {
    return (
      <Pagination.Root aria-label="Pagination">
        <Pagination.PreviousTrigger disabled />
        <Pagination.Item page={1} current />
        <Pagination.Item page={2} />
        <Pagination.Item page={3} />
        <Pagination.NextTrigger />
      </Pagination.Root>
    );
  },
};

export const LastPage: Story = {
  render() {
    return (
      <Pagination.Root aria-label="Pagination">
        <Pagination.PreviousTrigger />
        <Pagination.Item page={8} />
        <Pagination.Item page={9} />
        <Pagination.Item page={10} current />
        <Pagination.NextTrigger disabled />
      </Pagination.Root>
    );
  },
};

export const CustomLabels: Story = {
  render() {
    return (
      <Pagination.Root aria-label="Pagination">
        <Pagination.PreviousTrigger><Icon icon={ChevronLeft} size="sm" /> Prev</Pagination.PreviousTrigger>
        <Pagination.Item page={1} />
        <Pagination.Item page={2} current />
        <Pagination.Item page={3} />
        <Pagination.NextTrigger>Next <Icon icon={ChevronRight} size="sm" /></Pagination.NextTrigger>
      </Pagination.Root>
    );
  },
};
