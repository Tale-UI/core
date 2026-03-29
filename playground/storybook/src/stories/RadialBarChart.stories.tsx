import type { Meta, StoryObj } from '@storybook/react';
import { RadialBarChart } from '@tale-ui/charts/radial-bar-chart';
import '@tale-ui/charts/chart.css';

const data = [
  { name: 'Direct', value: 400 },
  { name: 'Organic', value: 300 },
  { name: 'Referral', value: 200 },
  { name: 'Social', value: 100 },
];

const meta: Meta = {
  title: 'Charts/RadialBarChart',
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render() {
    return (
      <RadialBarChart.Root data={data} width={600} height={400}>
        <RadialBarChart.RadialBar dataKey="value" />
        <RadialBarChart.Tooltip />
        <RadialBarChart.Legend />
      </RadialBarChart.Root>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Default</span>
          <RadialBarChart.Root data={data} width={600} height={350}>
            <RadialBarChart.RadialBar dataKey="value" />
            <RadialBarChart.Tooltip />
            <RadialBarChart.Legend />
          </RadialBarChart.Root>
        </div>
      </div>
    );
  },
};
