import type { Meta, StoryObj } from '@storybook/react-vite';
import { AreaChart } from '@tale-ui/charts/area-chart';
import '@tale-ui/charts/chart.css';

const monthlyData = [
  { month: 'Jan', revenue: 4000, profit: 2400 },
  { month: 'Feb', revenue: 3000, profit: 1398 },
  { month: 'Mar', revenue: 5000, profit: 3200 },
  { month: 'Apr', revenue: 4500, profit: 2800 },
  { month: 'May', revenue: 6000, profit: 3900 },
  { month: 'Jun', revenue: 5500, profit: 3500 },
];

const meta: Meta = {
  title: 'Charts/AreaChart',
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render() {
    return (
      <AreaChart.Root data={monthlyData} width={600} height={300}>
        <AreaChart.Grid />
        <AreaChart.XAxis dataKey="month" />
        <AreaChart.YAxis />
        <AreaChart.Tooltip />
        <AreaChart.Area dataKey="revenue" />
      </AreaChart.Root>
    );
  },
};

export const MultipleSeries: Story = {
  render() {
    return (
      <AreaChart.Root data={monthlyData} width={600} height={300}>
        <AreaChart.Grid strokeDasharray="3 3" />
        <AreaChart.XAxis dataKey="month" />
        <AreaChart.YAxis />
        <AreaChart.Tooltip />
        <AreaChart.Legend />
        <AreaChart.Area dataKey="revenue" />
        <AreaChart.Area dataKey="profit" />
      </AreaChart.Root>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Single Series</span>
          <AreaChart.Root data={monthlyData} width={600} height={250}>
            <AreaChart.Grid />
            <AreaChart.XAxis dataKey="month" />
            <AreaChart.YAxis />
            <AreaChart.Tooltip />
            <AreaChart.Area dataKey="revenue" />
          </AreaChart.Root>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Multiple Series</span>
          <AreaChart.Root data={monthlyData} width={600} height={250}>
            <AreaChart.Grid strokeDasharray="3 3" />
            <AreaChart.XAxis dataKey="month" />
            <AreaChart.YAxis />
            <AreaChart.Tooltip />
            <AreaChart.Legend />
            <AreaChart.Area dataKey="revenue" />
            <AreaChart.Area dataKey="profit" />
          </AreaChart.Root>
        </div>
      </div>
    );
  },
};
