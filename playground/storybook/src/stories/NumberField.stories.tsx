import type { Meta, StoryObj } from '@storybook/react-vite';
import { NumberField } from '@tale-ui/react/number-field';

type Args = {
  value?: number;
  minValue?: number;
  maxValue?: number;
  step?: number;
  isDisabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/NumberField',
  decorators: [
    (Story) => (
      <div className="story-field">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    value: { control: 'number' },
    minValue: { control: 'number' },
    maxValue: { control: 'number' },
    step: { control: 'number' },
    isDisabled: { control: 'boolean' },
  },
  args: {
    value: 0,
    isDisabled: false,
  },
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <NumberField.Root
      key={`${args.value}-${args.minValue}-${args.maxValue}-${args.step}`}
      defaultValue={args.value}
      minValue={args.minValue}
      maxValue={args.maxValue}
      step={args.step}
      isDisabled={args.isDisabled}
    >
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  ),
};

export const WithLabel: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <NumberField.Root defaultValue={1}>
      <NumberField.Label>Quantity</NumberField.Label>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  ),
};

export const MinMax: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <NumberField.Root defaultValue={5} minValue={0} maxValue={10}>
      <NumberField.Label>Rating (0–10)</NumberField.Label>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  ),
};

export const Step: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <NumberField.Root defaultValue={0} step={5}>
      <NumberField.Label>Step by 5</NumberField.Label>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  ),
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <NumberField.Root defaultValue={42} isDisabled>
      <NumberField.Label>Disabled</NumberField.Label>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  ),
};

export const WithFormat: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <NumberField.Root
      defaultValue={99.99}
      formatOptions={{ style: 'currency', currency: 'USD' }}
    >
      <NumberField.Label>Price</NumberField.Label>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-cards">
        <div style={{ width: 200 }}>
          <div className="story-label" style={{ marginBottom: '0.4rem' }}>Default</div>
          <NumberField.Root defaultValue={0}>
            <NumberField.Label>Quantity</NumberField.Label>
            <NumberField.Group>
              <NumberField.Decrement />
              <NumberField.Input />
              <NumberField.Increment />
            </NumberField.Group>
          </NumberField.Root>
        </div>
        <div style={{ width: 200 }}>
          <div className="story-label" style={{ marginBottom: '0.4rem' }}>Min/Max (0-10)</div>
          <NumberField.Root defaultValue={5} minValue={0} maxValue={10}>
            <NumberField.Label>Rating</NumberField.Label>
            <NumberField.Group>
              <NumberField.Decrement />
              <NumberField.Input />
              <NumberField.Increment />
            </NumberField.Group>
          </NumberField.Root>
        </div>
        <div style={{ width: 200 }}>
          <div className="story-label" style={{ marginBottom: '0.4rem' }}>Step by 5</div>
          <NumberField.Root defaultValue={0} step={5}>
            <NumberField.Label>Amount</NumberField.Label>
            <NumberField.Group>
              <NumberField.Decrement />
              <NumberField.Input />
              <NumberField.Increment />
            </NumberField.Group>
          </NumberField.Root>
        </div>
        <div style={{ width: 200 }}>
          <div className="story-label" style={{ marginBottom: '0.4rem' }}>Currency</div>
          <NumberField.Root defaultValue={99.99} formatOptions={{ style: 'currency', currency: 'USD' }}>
            <NumberField.Label>Price</NumberField.Label>
            <NumberField.Group>
              <NumberField.Decrement />
              <NumberField.Input />
              <NumberField.Increment />
            </NumberField.Group>
          </NumberField.Root>
        </div>
        <div style={{ width: 200 }}>
          <div className="story-label" style={{ marginBottom: '0.4rem' }}>Disabled</div>
          <NumberField.Root defaultValue={42} isDisabled>
            <NumberField.Label>Disabled</NumberField.Label>
            <NumberField.Group>
              <NumberField.Decrement />
              <NumberField.Input />
              <NumberField.Increment />
            </NumberField.Group>
          </NumberField.Root>
        </div>
      </div>
    );
  },
};
