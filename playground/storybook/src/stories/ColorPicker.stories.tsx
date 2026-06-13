import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorPicker } from '@tale-ui/react/color-picker';
import { ColorArea } from '@tale-ui/react/color-area';
import { ColorSlider } from '@tale-ui/react/color-slider';
import { parseColor, type Color } from 'react-aria-components';

type Args = Record<string, unknown>;

const meta: Meta<Args> = {
  title: 'Components/Color Picker',
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<Args>;

/**
 * ColorPicker.Root provides shared state to nested color controls.
 */
export const Root: Story = {
  name: 'ColorPicker.Root',
  argTypes: {
    initialColor: { control: 'color' },
    xChannel: {
      control: 'select',
      options: ['red', 'green', 'blue', 'hue', 'saturation', 'lightness', 'brightness'],
    },
    yChannel: {
      control: 'select',
      options: ['red', 'green', 'blue', 'hue', 'saturation', 'lightness', 'brightness'],
    },
  },
  args: {
    initialColor: '#33ccff',
    xChannel: 'saturation',
    yChannel: 'brightness',
  },
  render(args) {
    const [color, setColor] = React.useState<Color>(parseColor(args.initialColor as string));

    return (
      <ColorPicker.Root value={color} onChange={setColor}>
        <div className="story-col story-col--m">
          <ColorArea.Root xChannel={args.xChannel as 'saturation'} yChannel={args.yChannel as 'brightness'}>
            <ColorArea.Thumb />
          </ColorArea.Root>
          <ColorSlider.Root channel="hue">
            <ColorSlider.Label>Hue</ColorSlider.Label>
            <ColorSlider.Output />
            <ColorSlider.Track>
              <ColorSlider.Thumb />
            </ColorSlider.Track>
          </ColorSlider.Root>
        </div>
      </ColorPicker.Root>
    );
  },
};

/**
 * Standalone ColorArea and ColorSlider components can still share explicit
 * value/onChange state when they live outside a common ColorPicker.Root.
 */
export const SharedState: Story = {
  name: 'Standalone Shared State',
  argTypes: {
    initialColor: { control: 'color' },
    showHue: { control: 'boolean' },
    showSaturation: { control: 'boolean' },
    showBrightness: { control: 'boolean' },
  },
  args: {
    initialColor: '#33ccff',
    showHue: true,
    showSaturation: true,
    showBrightness: true,
  },
  render(args) {
    const [color, setColor] = React.useState<Color>(parseColor(args.initialColor as string));

    return (
      <div className="story-col story-col--m">
        <ColorArea.Root value={color} onChange={setColor}>
          <ColorArea.Thumb />
        </ColorArea.Root>
        {(args.showHue as boolean) && (
          <ColorSlider.Root channel="hue" value={color} onChange={setColor}>
            <ColorSlider.Label>Hue</ColorSlider.Label>
            <ColorSlider.Output />
            <ColorSlider.Track>
              <ColorSlider.Thumb />
            </ColorSlider.Track>
          </ColorSlider.Root>
        )}
        {(args.showSaturation as boolean) && (
          <ColorSlider.Root channel="saturation" value={color} onChange={setColor}>
            <ColorSlider.Label>Saturation</ColorSlider.Label>
            <ColorSlider.Output />
            <ColorSlider.Track>
              <ColorSlider.Thumb />
            </ColorSlider.Track>
          </ColorSlider.Root>
        )}
        {(args.showBrightness as boolean) && (
          <ColorSlider.Root channel="brightness" value={color} onChange={setColor}>
            <ColorSlider.Label>Brightness</ColorSlider.Label>
            <ColorSlider.Output />
            <ColorSlider.Track>
              <ColorSlider.Thumb />
            </ColorSlider.Track>
          </ColorSlider.Root>
        )}
      </div>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const [color, setColor] = React.useState<Color>(parseColor('hsb(200, 100%, 100%)'));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
        <span className="story-label">Standalone Shared State Color Picker</span>
        <div className="story-col story-col--m">
          <ColorArea.Root value={color} onChange={setColor}>
            <ColorArea.Thumb />
          </ColorArea.Root>
          <ColorSlider.Root channel="hue" value={color} onChange={setColor}>
            <ColorSlider.Label>Hue</ColorSlider.Label>
            <ColorSlider.Output />
            <ColorSlider.Track>
              <ColorSlider.Thumb />
            </ColorSlider.Track>
          </ColorSlider.Root>
          <ColorSlider.Root channel="saturation" value={color} onChange={setColor}>
            <ColorSlider.Label>Saturation</ColorSlider.Label>
            <ColorSlider.Output />
            <ColorSlider.Track>
              <ColorSlider.Thumb />
            </ColorSlider.Track>
          </ColorSlider.Root>
          <ColorSlider.Root channel="brightness" value={color} onChange={setColor}>
            <ColorSlider.Label>Brightness</ColorSlider.Label>
            <ColorSlider.Output />
            <ColorSlider.Track>
              <ColorSlider.Thumb />
            </ColorSlider.Track>
          </ColorSlider.Root>
        </div>
      </div>
    );
  },
};
