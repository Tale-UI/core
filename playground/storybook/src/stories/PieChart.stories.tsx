import type { Meta, StoryObj } from '@storybook/react-vite';
import { PieChart } from '@tale-ui/charts/pie-chart';
import '@tale-ui/charts/chart.css';

const channelData = [
  { name: 'Direct', value: 400 },
  { name: 'Organic', value: 300 },
  { name: 'Referral', value: 200 },
  { name: 'Social', value: 100 },
];

const meta: Meta = {
  title: 'Charts/PieChart',
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render() {
    return (
      <PieChart.Root width={600} height={300}>
        <PieChart.Pie data={channelData} dataKey="value" nameKey="name" />
        <PieChart.Tooltip />
        <PieChart.Legend />
      </PieChart.Root>
    );
  },
};

export const Donut: Story = {
  render() {
    return (
      <PieChart.Root width={600} height={300}>
        <PieChart.Pie data={channelData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} />
        <PieChart.Tooltip />
        <PieChart.Legend />
      </PieChart.Root>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Default Pie</span>
          <PieChart.Root width={600} height={250}>
            <PieChart.Pie data={channelData} dataKey="value" nameKey="name" />
            <PieChart.Tooltip />
            <PieChart.Legend />
          </PieChart.Root>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Donut</span>
          <PieChart.Root width={600} height={250}>
            <PieChart.Pie data={channelData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} />
            <PieChart.Tooltip />
            <PieChart.Legend />
          </PieChart.Root>
        </div>
      </div>
    );
  },
};
