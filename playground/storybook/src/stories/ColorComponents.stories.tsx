import type { Meta, StoryObj } from '@storybook/react';
import { ColorArea } from '@tale-ui/react/color-area';
import { ColorSlider } from '@tale-ui/react/color-slider';
import { ColorWheel } from '@tale-ui/react/color-wheel';
import { parseColor } from 'react-aria-components';

type Args = Record<string, never>;

const meta: Meta<Args> = {
  title: 'Components/Color Components',
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<Args>;

export const ColorAreaStory: Story = {
  name: 'Color Area',
  render() {
    return (
      <ColorArea.Root defaultValue={parseColor('hsl(0, 100%, 50%)')}>
        <ColorArea.Thumb />
      </ColorArea.Root>
    );
  },
};

export const ColorSliderStory: Story = {
  name: 'Color Slider',
  render() {
    return (
      <ColorSlider.Root
        channel="hue"
        defaultValue={parseColor('hsl(0, 100%, 50%)')}
      >
        <ColorSlider.Label>Hue</ColorSlider.Label>
        <ColorSlider.Output />
        <ColorSlider.Track>
          <ColorSlider.Thumb />
        </ColorSlider.Track>
      </ColorSlider.Root>
    );
  },
};

export const ColorWheelStory: Story = {
  name: 'Color Wheel',
  render() {
    return (
      <ColorWheel.Root
        defaultValue={parseColor('hsl(0, 100%, 50%)')}
        outerRadius={100}
        innerRadius={70}
      >
        <ColorWheel.Track />
        <ColorWheel.Thumb />
      </ColorWheel.Root>
    );
  },
};

export const CombinedPicker: Story = {
  name: 'Combined Picker',
  render() {
    return (
      <div className="story-col story-col--m">
        <ColorArea.Root defaultValue={parseColor('hsl(0, 100%, 50%)')}>
          <ColorArea.Thumb />
        </ColorArea.Root>
        <ColorSlider.Root
          channel="hue"
          defaultValue={parseColor('hsl(0, 100%, 50%)')}
        >
          <ColorSlider.Label>Hue</ColorSlider.Label>
          <ColorSlider.Output />
          <ColorSlider.Track>
            <ColorSlider.Thumb />
          </ColorSlider.Track>
        </ColorSlider.Root>
        <ColorSlider.Root
          channel="saturation"
          defaultValue={parseColor('hsl(0, 100%, 50%)')}
        >
          <ColorSlider.Label>Saturation</ColorSlider.Label>
          <ColorSlider.Output />
          <ColorSlider.Track>
            <ColorSlider.Thumb />
          </ColorSlider.Track>
        </ColorSlider.Root>
      </div>
    );
  },
};
