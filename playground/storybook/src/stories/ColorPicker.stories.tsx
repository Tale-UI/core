import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorArea } from '@tale-ui/react/color-area';
import { ColorSlider } from '@tale-ui/react/color-slider';
import { parseColor, type Color } from 'react-aria-components';

type Args = Record<string, never>;

const meta: Meta<Args> = {
  title: 'Components/Color Picker',
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<Args>;

/**
 * The recommended color picker pattern uses standalone ColorArea and ColorSlider
 * components with shared state, rather than nesting inside ColorPicker.Root.
 *
 * See docs/components/color-picker.md for the known ColorSlider nesting issue.
 */
export const SharedState: Story = {
  name: 'Shared State (Recommended)',
  render() {
    const [color, setColor] = useState<Color>(parseColor('hsb(200, 100%, 100%)'));

    return (
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
