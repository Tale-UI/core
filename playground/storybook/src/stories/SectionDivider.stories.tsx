import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionDivider } from '@tale-ui/react/section-divider';

const meta: Meta = {
  title: 'Components/SectionDivider',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render() {
    return (
      <div style={{ padding: '3rem 0' }}>
        <div style={{ padding: '0 2rem', marginBottom: '2rem' }}>
          <p style={{ margin: 0 }}>Content above the divider</p>
        </div>
        <SectionDivider />
        <div style={{ padding: '0 2rem', marginTop: '2rem' }}>
          <p style={{ margin: 0 }}>Content below the divider</p>
        </div>
      </div>
    );
  },
};

export const BetweenSections: Story = {
  render() {
    return (
      <div>
        <section style={{ padding: '4rem 2rem' }}>
          <h2>Features</h2>
          <p>Everything you need to build amazing products.</p>
        </section>
        <SectionDivider />
        <section style={{ padding: '4rem 2rem' }}>
          <h2>Pricing</h2>
          <p>Simple and transparent pricing.</p>
        </section>
        <SectionDivider />
        <section style={{ padding: '4rem 2rem' }}>
          <h2>FAQ</h2>
          <p>Answers to common questions.</p>
        </section>
      </div>
    );
  },
};
