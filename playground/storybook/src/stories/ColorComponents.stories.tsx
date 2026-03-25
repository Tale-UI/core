import type { Meta, StoryObj } from '@storybook/react';
import { ColorArea } from '@tale-ui/react/color-area';
import { ColorField } from '@tale-ui/react/color-field';
import { ColorSlider } from '@tale-ui/react/color-slider';
import { ColorSwatch } from '@tale-ui/react/color-swatch';
import { ColorSwatchPicker } from '@tale-ui/react/color-swatch-picker';
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

export const ColorFieldStory: Story = {
  name: 'Color Field',
  render() {
    return (
      <div className="story-field">
        <ColorField.Root defaultValue={parseColor('#ff0000')}>
          <ColorField.Label>Hex colour</ColorField.Label>
          <ColorField.Input />
        </ColorField.Root>
      </div>
    );
  },
};

export const ColorSwatchStory: Story = {
  name: 'Color Swatch',
  render() {
    return (
      <div className="story-row story-row--s">
        {['#ff0000', '#00ff00', '#0000ff', '#ff8800', '#8800ff'].map((c) => (
          <ColorSwatch key={c} color={c} />
        ))}
      </div>
    );
  },
};

export const ColorSwatchPickerStory: Story = {
  name: 'Color Swatch Picker',
  render() {
    return (
      <ColorSwatchPicker.Root defaultValue={parseColor('#ff0000')}>
        {['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff', '#8800ff'].map((c) => (
          <ColorSwatchPicker.Item key={c} color={c} />
        ))}
      </ColorSwatchPicker.Root>
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
