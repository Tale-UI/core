import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Carousel } from '@tale-ui/react/carousel';

type Args = {
  loop: boolean;
  autoplay: boolean;
  orientation: 'horizontal' | 'vertical';
  slidesPerView: number;
};

const slideStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 200,
  borderRadius: 'var(--radius-m)',
  backgroundColor: 'var(--neutral-12)',
  fontSize: 'var(--text-l-font-size)',
  fontWeight: 500,
  color: 'var(--neutral-70)',
};

const meta: Meta<Args> = {
  title: 'Components/Carousel',
  parameters: { layout: 'centered' },
  argTypes: {
    loop: { control: 'boolean' },
    autoplay: { control: 'boolean' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    slidesPerView: { control: 'number' },
  },
  args: {
    loop: false,
    autoplay: false,
    orientation: 'horizontal',
    slidesPerView: 1,
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <Carousel.Root {...args} style={{ maxWidth: 500 }}>
        <Carousel.Content>
          {[1, 2, 3, 4, 5].map((n) => (
            <Carousel.Item key={n}>
              <div style={slideStyle}>Slide {n}</div>
            </Carousel.Item>
          ))}
        </Carousel.Content>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-xs)', marginTop: 'var(--space-xs)' }}>
          <Carousel.PreviousTrigger />
          <Carousel.NextTrigger />
        </div>
      </Carousel.Root>
    );
  },
};

export const WithIndicators: Story = {
  render() {
    return (
      <Carousel.Root loop style={{ maxWidth: 500 }}>
        <Carousel.Content>
          {[1, 2, 3, 4].map((n) => (
            <Carousel.Item key={n}>
              <div style={slideStyle}>Slide {n}</div>
            </Carousel.Item>
          ))}
        </Carousel.Content>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-xs)', marginTop: 'var(--space-xs)' }}>
          <Carousel.PreviousTrigger />
          <Carousel.NextTrigger />
        </div>
        <Carousel.Indicators>
          {[0, 1, 2, 3].map((i) => (
            <Carousel.Indicator key={i} index={i} />
          ))}
        </Carousel.Indicators>
      </Carousel.Root>
    );
  },
};

export const Vertical: Story = {
  render() {
    return (
      <Carousel.Root orientation="vertical" style={{ maxWidth: 500, height: 300 }}>
        <Carousel.Content>
          {[1, 2, 3].map((n) => (
            <Carousel.Item key={n}>
              <div style={{ ...slideStyle, height: 300 }}>Slide {n}</div>
            </Carousel.Item>
          ))}
        </Carousel.Content>
      </Carousel.Root>
    );
  },
};

export const Autoplay: Story = {
  render() {
    return (
      <Carousel.Root autoplay loop style={{ maxWidth: 500 }}>
        <Carousel.Content>
          {[1, 2, 3, 4].map((n) => (
            <Carousel.Item key={n}>
              <div style={slideStyle}>Slide {n}</div>
            </Carousel.Item>
          ))}
        </Carousel.Content>
        <Carousel.Indicators>
          {[0, 1, 2, 3].map((i) => (
            <Carousel.Indicator key={i} index={i} />
          ))}
        </Carousel.Indicators>
      </Carousel.Root>
    );
  },
};
