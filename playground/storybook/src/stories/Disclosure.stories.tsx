import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
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
