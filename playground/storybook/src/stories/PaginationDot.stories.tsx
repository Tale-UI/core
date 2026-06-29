import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaginationDot } from '@tale-ui/react/pagination-dot';

type Args = {
  page: number;
  total: number;
  size: 'md' | 'lg';
  framed: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/PaginationDot',
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['md', 'lg'] },
    page: { control: 'number', min: 1 },
    total: { control: 'number', min: 1 },
    framed: { control: 'boolean' },
  },
  args: {
    page: 2,
    total: 5,
    size: 'md',
    framed: false,
  },
};

export default meta;

type Story = StoryObj<Args>;

function Controlled(args: Args) {
  const [page, setPage] = React.useState(args.page);
  React.useEffect(() => { setPage(args.page); }, [args.page]);
  return (
    <PaginationDot
      page={page}
      total={args.total}
      size={args.size}
      framed={args.framed}
      onPageChange={setPage}
    />
  );
}

export const Default: Story = {
  render(args) {
    return <Controlled {...args} />;
  },
};

export const AllSizes: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const [page, setPage] = React.useState(2);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9375rem', alignItems: 'center' }}>
        <PaginationDot page={page} total={5} size="md" onPageChange={setPage} />
        <PaginationDot page={page} total={5} size="lg" onPageChange={setPage} />
      </div>
    );
  },
};

export const Framed: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const [page, setPage] = React.useState(2);
    return (
      <div
        style={{
          padding: '1.25rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 12,
        }}
      >
        <PaginationDot page={page} total={5} framed onPageChange={setPage} />
      </div>
    );
  },
};

export const FramedLarge: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const [page, setPage] = React.useState(1);
    return (
      <div
        style={{
          padding: '1.25rem',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          borderRadius: 12,
        }}
      >
        <PaginationDot page={page} total={4} size="lg" framed onPageChange={setPage} />
      </div>
    );
  },
};
