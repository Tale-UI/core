import * as React from 'react';
import { Slider } from '@tale-ui/react/slider';

export default function InsetSlider() {
  const controlStyle: React.CSSProperties = {
    alignItems: 'center',
    background: '#e5e7eb',
    display: 'flex',
    height: 20,
    position: 'relative',
    touchAction: 'none',
    userSelect: 'none',
    width: 120,
  };
  const trackStyle: React.CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    height: 20,
    position: 'relative',
    width: 120,
  };
  const thumbStyle: React.CSSProperties = {
    background: 'red',
    borderRadius: '50%',
    height: 20,
    width: 20,
  };

  return (
    <Slider.Root thumbAlignment="edge" defaultValue={30}>
      <Slider.Control style={controlStyle}>
        <Slider.Track style={trackStyle}>
          <Slider.Thumb data-testid="thumb" style={thumbStyle} />
        </Slider.Track>
      </Slider.Control>
      <Slider.Output role="status" data-testid="output" />
    </Slider.Root>
  );
}
