import { useState } from 'react';
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
 * ColorPicker.Root wraps ColorArea for controlled color selection.
 * Note: nesting ColorSlider inside ColorPicker.Root has a known issue —
 * use the shared-state pattern below instead.
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
    const [color, setColor] = useState<Color>(parseColor(args.initialColor as string));

    return (
      <ColorPicker.Root value={color} onChange={setColor}>
        <ColorArea.Root xChannel={args.xChannel as 'saturation'} yChannel={args.yChannel as 'brightness'}>
          <ColorArea.Thumb />
        </ColorArea.Root>
      </ColorPicker.Root>
    );
  },
};

/**
 * The recommended color picker pattern uses standalone ColorArea and ColorSlider
 * components with shared state, rather than nesting inside ColorPicker.Root.
 *
 * See docs/components/color-picker.md for the known ColorSlider nesting issue.
 */
export const SharedState: Story = {
  name: 'Shared State (Recommended)',
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
    const [color, setColor] = useState<Color>(parseColor(args.initialColor as string));

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
    const [color, setColor] = useState<Color>(parseColor('hsb(200, 100%, 100%)'));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
        <span className="story-label">Shared State Color Picker</span>
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
