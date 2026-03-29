import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Disclosure } from '@tale-ui/react/disclosure';

type Args = {
  defaultExpanded?: boolean;
  isDisabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/Disclosure',
  argTypes: {
    defaultExpanded: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
  },
  args: {
    defaultExpanded: false,
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
    <Disclosure.Root defaultExpanded={args.defaultExpanded} isDisabled={args.isDisabled}>
      <Disclosure.Trigger>Show more</Disclosure.Trigger>
      <Disclosure.Panel>
        <p className="story-disclosure-content">
          This is the hidden content that is revealed when the disclosure is expanded.
        </p>
      </Disclosure.Panel>
    </Disclosure.Root>
  ),
};

export const DefaultExpanded: Story = {
  args: {
    defaultExpanded: true,
    isDisabled: false,
  },
  render: Default.render,
};

export const Disabled: Story = {
  args: {
    defaultExpanded: false,
    isDisabled: true,
  },
  render: Default.render,
};

export const Controlled: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
      <div>
        <p className="story-disclosure-status">
          Expanded: {String(isExpanded)}
        </p>
        <Disclosure.Root isExpanded={isExpanded} onExpandedChange={setIsExpanded}>
          <Disclosure.Trigger>{isExpanded ? 'Collapse' : 'Expand'}</Disclosure.Trigger>
          <Disclosure.Panel>
            <p className="story-disclosure-content">
              This disclosure is controlled externally via useState.
            </p>
          </Disclosure.Panel>
        </Disclosure.Root>
      </div>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px' }}>
          <p className="story-label">Default (closed)</p>
          <Disclosure.Root>
            <Disclosure.Trigger>Show more</Disclosure.Trigger>
            <Disclosure.Panel>
              <p>This is the hidden content revealed when expanded.</p>
            </Disclosure.Panel>
          </Disclosure.Root>
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <p className="story-label">Default (open)</p>
          <Disclosure.Root defaultExpanded>
            <Disclosure.Trigger>Show more</Disclosure.Trigger>
            <Disclosure.Panel>
              <p>This disclosure starts in the expanded state.</p>
            </Disclosure.Panel>
          </Disclosure.Root>
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <p className="story-label">Disabled</p>
          <Disclosure.Root isDisabled>
            <Disclosure.Trigger>Show more</Disclosure.Trigger>
            <Disclosure.Panel>
              <p>This content cannot be toggled.</p>
            </Disclosure.Panel>
          </Disclosure.Root>
        </div>
      </div>
    );
  },
};
