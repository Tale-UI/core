import * as React from 'react';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { expect } from 'chai';
import { Carousel } from '@tale-ui/react/carousel';
import { createRenderer } from '#test-utils';

// Mock embla-carousel-react since it relies on DOM measurement
vi.mock('embla-carousel-react', () => ({
  default: () => {
    const ref = React.useCallback(() => {}, []);
    return [ref, undefined] as const;
  },
}));

describe('<Carousel />', () => {
  const { render } = createRenderer();

  it('Root renders with tale-carousel class', async () => {
    await render(
      <Carousel.Root data-testid="root">
        <Carousel.Content>
          <Carousel.Item>Slide</Carousel.Item>
        </Carousel.Content>
      </Carousel.Root>,
    );
    expect(screen.getByTestId('root')).to.have.class('tale-carousel');
  });

  it('Root merges additional className', async () => {
    await render(
      <Carousel.Root className="custom" data-testid="root">
        <Carousel.Content>
          <Carousel.Item>Slide</Carousel.Item>
        </Carousel.Content>
      </Carousel.Root>,
    );
    expect(screen.getByTestId('root')).to.have.class('custom');
  });

  it('Root has role="region", aria-roledescription, and default aria-label', async () => {
    await render(
      <Carousel.Root data-testid="root">
        <Carousel.Content>
          <Carousel.Item>Slide</Carousel.Item>
        </Carousel.Content>
      </Carousel.Root>,
    );
    const root = screen.getByTestId('root');
    expect(root).to.have.attribute('role', 'region');
    expect(root).to.have.attribute('aria-roledescription', 'carousel');
    expect(root).to.have.attribute('aria-label', 'Carousel');
  });

  it('Root sets data-orientation', async () => {
    await render(
      <Carousel.Root orientation="vertical" data-testid="root">
        <Carousel.Content>
          <Carousel.Item>Slide</Carousel.Item>
        </Carousel.Content>
      </Carousel.Root>,
    );
    expect(screen.getByTestId('root')).to.have.attribute('data-orientation', 'vertical');
  });

  it('Content renders with tale-carousel__content class', async () => {
    await render(
      <Carousel.Root>
        <Carousel.Content data-testid="content">
          <Carousel.Item>Slide</Carousel.Item>
        </Carousel.Content>
      </Carousel.Root>,
    );
    expect(screen.getByTestId('content')).to.have.class('tale-carousel__content');
  });

  it('Item renders with tale-carousel__item class and slide role', async () => {
    await render(
      <Carousel.Root>
        <Carousel.Content>
          <Carousel.Item data-testid="item">Slide</Carousel.Item>
        </Carousel.Content>
      </Carousel.Root>,
    );
    const item = screen.getByTestId('item');
    expect(item).to.have.class('tale-carousel__item');
    expect(item).to.have.attribute('role', 'group');
    expect(item).to.have.attribute('aria-roledescription', 'slide');
  });

  it('PreviousTrigger renders with correct class and aria-label', async () => {
    await render(
      <Carousel.Root>
        <Carousel.Content>
          <Carousel.Item>Slide</Carousel.Item>
        </Carousel.Content>
        <Carousel.PreviousTrigger data-testid="prev" />
      </Carousel.Root>,
    );
    const prev = screen.getByTestId('prev');
    expect(prev).to.have.class('tale-carousel__previous');
    expect(prev).to.have.attribute('aria-label', 'Previous slide');
  });

  it('NextTrigger renders with correct class and aria-label', async () => {
    await render(
      <Carousel.Root>
        <Carousel.Content>
          <Carousel.Item>Slide</Carousel.Item>
        </Carousel.Content>
        <Carousel.NextTrigger data-testid="next" />
      </Carousel.Root>,
    );
    const next = screen.getByTestId('next');
    expect(next).to.have.class('tale-carousel__next');
    expect(next).to.have.attribute('aria-label', 'Next slide');
  });

  it('Indicators renders with tale-carousel__indicators class and tablist role', async () => {
    await render(
      <Carousel.Root>
        <Carousel.Content>
          <Carousel.Item>Slide</Carousel.Item>
        </Carousel.Content>
        <Carousel.Indicators data-testid="indicators">
          <Carousel.Indicator index={0} />
        </Carousel.Indicators>
      </Carousel.Root>,
    );
    const indicators = screen.getByTestId('indicators');
    expect(indicators).to.have.class('tale-carousel__indicators');
    expect(indicators).to.have.attribute('role', 'tablist');
  });

  it('Indicator renders with correct class and tab role', async () => {
    await render(
      <Carousel.Root>
        <Carousel.Content>
          <Carousel.Item>Slide</Carousel.Item>
        </Carousel.Content>
        <Carousel.Indicators>
          <Carousel.Indicator index={0} data-testid="dot" />
        </Carousel.Indicators>
      </Carousel.Root>,
    );
    const dot = screen.getByTestId('dot');
    expect(dot).to.have.class('tale-carousel__indicator');
    expect(dot).to.have.attribute('role', 'tab');
    expect(dot).to.have.attribute('aria-label', 'Go to slide 1');
  });
});
