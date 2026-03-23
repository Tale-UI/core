import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from '@tale-ui/react/accordion';

type Args = {
  isDisabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/Accordion',
  argTypes: {
    isDisabled: { control: 'boolean' },
  },
  args: {
    isDisabled: false,
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="story-center">
        <div className="story-inner">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <div className="story-medium">
      <Accordion.Root isDisabled={args.isDisabled}>
        <Accordion.Item id="a">
          <Accordion.Header>
            <Accordion.Trigger>What is Tale UI?</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            Tale UI is a comprehensive design system and component library built
            with React and CSS custom properties.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="b">
          <Accordion.Header>
            <Accordion.Trigger>How do I install it?</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            Install via npm or pnpm: <code>pnpm add @tale-ui/react @tale-ui/react-styles</code>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="c">
          <Accordion.Header>
            <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            Yes, all components follow WAI-ARIA patterns and are built on top of
            React Aria Components for robust accessibility support.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ),
};

export const MultipleOpen: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-medium">
      <Accordion.Root allowsMultiple>
        <Accordion.Item id="a">
          <Accordion.Header>
            <Accordion.Trigger>Section One</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            Multiple items can be open at the same time when the multiple prop is set.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="b">
          <Accordion.Header>
            <Accordion.Trigger>Section Two</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            Try opening this while the first section is still open.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="c">
          <Accordion.Header>
            <Accordion.Trigger>Section Three</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            All three sections can be expanded simultaneously.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ),
};

export const DefaultOpen: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-medium">
      <Accordion.Root defaultExpandedKeys={['a']}>
        <Accordion.Item id="a">
          <Accordion.Header>
            <Accordion.Trigger>Initially Open</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            This section is open by default via the defaultValue prop.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="b">
          <Accordion.Header>
            <Accordion.Trigger>Initially Closed</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            This section starts closed but can be opened by clicking.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="c">
          <Accordion.Header>
            <Accordion.Trigger>Also Closed</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            Another section that starts in the closed state.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ),
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-medium">
      <Accordion.Root isDisabled>
        <Accordion.Item id="a">
          <Accordion.Header>
            <Accordion.Trigger>Disabled Item</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            This content cannot be revealed because the accordion is disabled.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="b">
          <Accordion.Header>
            <Accordion.Trigger>Also Disabled</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            None of the items in a disabled accordion can be toggled.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="c">
          <Accordion.Header>
            <Accordion.Trigger>Still Disabled</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            The entire accordion group is non-interactive.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ),
};
