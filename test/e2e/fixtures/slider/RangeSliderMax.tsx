import * as React from 'react';
import { Slider } from '@tale-ui/react/slider';

export default function RangeSliderMax() {
  const controlStyle: React.CSSProperties = {
    alignItems: 'center',
    background: '#e5e7eb',
    display: 'flex',
    height: 20,
    position: 'relative',
    touchAction: 'none',
    userSelect: 'none',
    width: 100,
  };
  const trackStyle: React.CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    height: 20,
    position: 'relative',
    width: 100,
  };
  const thumbStyle: React.CSSProperties = {
    borderRadius: '50%',
    height: 20,
    width: 20,
  };

  return (
    <Slider.Root defaultValue={[100, 100]}>
      <Slider.Control style={controlStyle}>
        <Slider.Track style={trackStyle}>
          <Slider.Thumb
            index={0}
            style={{ ...thumbStyle, background: 'red' }}
          />
          <Slider.Thumb
            index={1}
            style={{ ...thumbStyle, background: 'blue' }}
          />
        </Slider.Track>
      </Slider.Control>
      <Slider.Output role="status" data-testid="output" />
    </Slider.Root>
  );
}
