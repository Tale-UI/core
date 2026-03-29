import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from '@tale-ui/react/slider';

type Args = {
  value?: number;
  minValue?: number;
  maxValue?: number;
  step?: number;
  orientation?: 'horizontal' | 'vertical';
  isDisabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/Slider',
  argTypes: {
    value: { control: 'number' },
    minValue: { control: 'number' },
    maxValue: { control: 'number' },
    step: { control: 'number' },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    isDisabled: { control: 'boolean' },
  },
  args: {
    value: 50,
    minValue: 0,
    maxValue: 100,
    step: 1,
    orientation: 'horizontal',
    isDisabled: false,
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <div className="story-slider-wide">
      <Slider.Root
        key={`${args.value}-${args.minValue}-${args.maxValue}-${args.step}-${args.orientation}`}
        defaultValue={args.value}
        minValue={args.minValue}
        maxValue={args.maxValue}
        step={args.step}
        orientation={args.orientation}
        isDisabled={args.isDisabled}
      >
        <Slider.Header>
          <Slider.Label>Volume</Slider.Label>
          <Slider.Output />
        </Slider.Header>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};

export const WithLabel: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-slider-wide">
      <Slider.Root defaultValue={30}>
        <Slider.Header>
          <Slider.Label>Brightness</Slider.Label>
          <Slider.Output />
        </Slider.Header>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};

export const Range: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-slider-wide">
      <Slider.Root defaultValue={[20, 80]}>
        <Slider.Header>
          <Slider.Label>Price Range</Slider.Label>
          <Slider.Output />
        </Slider.Header>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb />
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};

export const Steps: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-slider-wide">
      <Slider.Root defaultValue={50} step={10}>
        <Slider.Header>
          <Slider.Label>Quality</Slider.Label>
          <Slider.Output />
        </Slider.Header>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-slider-wide">
      <Slider.Root defaultValue={60} isDisabled>
        <Slider.Header>
          <Slider.Label>Disabled Slider</Slider.Label>
          <Slider.Output />
        </Slider.Header>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};

export const ThumbLabelBottom: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-slider-wide">
      <Slider.Root defaultValue={50}>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb>
              <Slider.Output position="bottom" />
            </Slider.Thumb>
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};

export const ThumbLabelTop: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-slider-wide">
      <Slider.Root defaultValue={50}>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb>
              <Slider.Output position="top" />
            </Slider.Thumb>
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};

export const ThumbLabelRange: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-slider-wide">
      <Slider.Root defaultValue={[20, 80]}>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb index={0}>
              <Slider.Output position="top" index={0} />
            </Slider.Thumb>
            <Slider.Thumb index={1}>
              <Slider.Output position="top" index={1} />
            </Slider.Thumb>
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};

export const Vertical: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-slider-vertical">
      <Slider.Root defaultValue={40} orientation="vertical">
        <Slider.Header>
          <Slider.Label>Vertical</Slider.Label>
          <Slider.Output />
        </Slider.Header>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};


export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)', width: 400 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <span className="story-label">Single value</span>
          <Slider.Root defaultValue={50}>
            <Slider.Header>
              <Slider.Label>Volume</Slider.Label>
              <Slider.Output />
            </Slider.Header>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
                <Slider.Thumb />
              </Slider.Track>
            </Slider.Control>
          </Slider.Root>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <span className="story-label">Range (two thumbs)</span>
          <Slider.Root defaultValue={[20, 80]}>
            <Slider.Header>
              <Slider.Label>Price Range</Slider.Label>
              <Slider.Output />
            </Slider.Header>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
                <Slider.Thumb />
                <Slider.Thumb />
              </Slider.Track>
            </Slider.Control>
          </Slider.Root>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <span className="story-label">Disabled</span>
          <Slider.Root defaultValue={60} isDisabled>
            <Slider.Header>
              <Slider.Label>Disabled</Slider.Label>
              <Slider.Output />
            </Slider.Header>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
                <Slider.Thumb />
              </Slider.Track>
            </Slider.Control>
          </Slider.Root>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <span className="story-label">With output labels on thumbs</span>
          <Slider.Root defaultValue={[25, 75]}>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
                <Slider.Thumb index={0}>
                  <Slider.Output position="top" index={0} />
                </Slider.Thumb>
                <Slider.Thumb index={1}>
                  <Slider.Output position="top" index={1} />
                </Slider.Thumb>
              </Slider.Track>
            </Slider.Control>
          </Slider.Root>
        </div>
      </div>
    );
  },
};
