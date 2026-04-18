import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { expect } from 'chai';
import { Slider } from '@tale-ui/react/slider';
import '../styles.css';
import { createRenderer, isJSDOM } from '#test-utils';

describe('<Slider />', () => {
  const { render } = createRenderer();

  it.skipIf(isJSDOM)('keeps a vertical header sized to its contents', async () => {
    await render(
      <div style={{ width: '20rem' }}>
        <Slider.Root defaultValue={53} orientation="vertical" data-testid="slider">
          <Slider.Header data-testid="header">
            <Slider.Label data-testid="label">Level</Slider.Label>
            <Slider.Output data-testid="output" />
          </Slider.Header>
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
              <Slider.Thumb />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>
      </div>,
    );

    const slider = screen.getByTestId('slider');
    const header = screen.getByTestId('header');
    const label = screen.getByTestId('label');
    const output = screen.getByTestId('output');

    const sliderWidth = slider.getBoundingClientRect().width;
    const headerWidth = header.getBoundingClientRect().width;
    const contentsWidth =
      label.getBoundingClientRect().width + output.getBoundingClientRect().width;

    expect(sliderWidth).to.be.lessThan(120);
    expect(headerWidth).to.be.lessThan(contentsWidth + 32);
  });
});
