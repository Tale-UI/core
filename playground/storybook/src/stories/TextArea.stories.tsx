import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextArea } from '@tale-ui/react/text-area';

type Args = {
  isRequired?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/TextArea',
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="story-field">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    isRequired: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <TextArea.Root {...args}>
      <TextArea.TextArea placeholder="Enter text…" />
    </TextArea.Root>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <TextArea.Root {...args}>
      <TextArea.Label>Bio</TextArea.Label>
      <TextArea.TextArea />
      <TextArea.Description>Max 500 chars</TextArea.Description>
    </TextArea.Root>
  ),
};

export const WithError: Story = {
  args: {
    isInvalid: true,
  },
  render: (args) => (
    <TextArea.Root {...args}>
      <TextArea.Label>Bio</TextArea.Label>
      <TextArea.TextArea />
      <TextArea.ErrorMessage>This field is required</TextArea.ErrorMessage>
    </TextArea.Root>
  ),
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
  render: (args) => (
    <TextArea.Root {...args}>
      <TextArea.Label>Bio</TextArea.Label>
      <TextArea.TextArea placeholder="Disabled field" />
    </TextArea.Root>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-cards">
        <div style={{ width: 240 }}>
          <div className="story-heading">Default</div>
          <TextArea.Root>
            <TextArea.Label>Bio</TextArea.Label>
            <TextArea.TextArea placeholder="Enter text…" />
            <TextArea.Description>Max 500 chars</TextArea.Description>
          </TextArea.Root>
        </div>
        <div style={{ width: 240 }}>
          <div className="story-heading">Invalid</div>
          <TextArea.Root isInvalid>
            <TextArea.Label>Bio</TextArea.Label>
            <TextArea.TextArea />
            <TextArea.ErrorMessage>This field is required</TextArea.ErrorMessage>
          </TextArea.Root>
        </div>
        <div style={{ width: 240 }}>
          <div className="story-heading">Disabled</div>
          <TextArea.Root isDisabled>
            <TextArea.Label>Bio</TextArea.Label>
            <TextArea.TextArea placeholder="Disabled" />
          </TextArea.Root>
        </div>
        <div style={{ width: 240 }}>
          <div className="story-heading">Read-only</div>
          <TextArea.Root isReadOnly>
            <TextArea.Label>Bio</TextArea.Label>
            <TextArea.TextArea value="Read-only content" />
          </TextArea.Root>
        </div>
      </div>
    );
  },
};
