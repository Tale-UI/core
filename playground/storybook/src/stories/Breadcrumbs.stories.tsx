import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from '@tale-ui/react/breadcrumbs';

type Args = Record<string, never>;

const meta: Meta<Args> = {
  title: 'Components/Breadcrumbs',
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render() {
    return (
      <Breadcrumbs.Root>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href="#">Products</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link>Widget</Breadcrumbs.Link>
        </Breadcrumbs.Item>
      </Breadcrumbs.Root>
    );
  },
};

export const LongPath: Story = {
  render() {
    return (
      <Breadcrumbs.Root>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href="#">Category</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href="#">Subcategory</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href="#">Products</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link>Widget Pro</Breadcrumbs.Link>
        </Breadcrumbs.Item>
      </Breadcrumbs.Root>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-sections">
        <div>
          <p className="story-label">Short (2 items)</p>
          <Breadcrumbs.Root>
            <Breadcrumbs.Item>
              <Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>
              <Breadcrumbs.Link>Products</Breadcrumbs.Link>
            </Breadcrumbs.Item>
          </Breadcrumbs.Root>
        </div>
        <div>
          <p className="story-label">Long (5 items)</p>
          <Breadcrumbs.Root>
            <Breadcrumbs.Item>
              <Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>
              <Breadcrumbs.Link href="#">Category</Breadcrumbs.Link>
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>
              <Breadcrumbs.Link href="#">Subcategory</Breadcrumbs.Link>
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>
              <Breadcrumbs.Link href="#">Products</Breadcrumbs.Link>
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>
              <Breadcrumbs.Link>Widget Pro</Breadcrumbs.Link>
            </Breadcrumbs.Item>
          </Breadcrumbs.Root>
        </div>
        <div>
          <p className="story-label">With current page (no link)</p>
          <Breadcrumbs.Root>
            <Breadcrumbs.Item>
              <Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>
              <Breadcrumbs.Link href="#">Products</Breadcrumbs.Link>
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>
              <Breadcrumbs.Link>Current Page</Breadcrumbs.Link>
            </Breadcrumbs.Item>
          </Breadcrumbs.Root>
        </div>
      </div>
    );
  },
};
