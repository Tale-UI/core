import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { ColorPicker } from '../color-picker';
import { ColorSlider } from '../color-slider';

describe('RAC 1.18 ColorPicker nesting check (Tale UI wrappers)', () => {
  it('renders ColorSlider.Root inside ColorPicker.Root without "Unknown color channel" error', () => {
    expect(() =>
      render(
        <ColorPicker.Root defaultValue="hsb(200, 100%, 100%)">
          <ColorSlider.Root channel="hue">
            <ColorSlider.Track>
              <ColorSlider.Thumb />
            </ColorSlider.Track>
          </ColorSlider.Root>
        </ColorPicker.Root>,
      ),
    ).not.toThrow();
  });
});
