import type { Meta, StoryObj } from '@storybook/react';
import { LineChart } from '@tale-ui/charts/line-chart';
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
  title: 'Charts/LineChart',
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render() {
    return (
      <LineChart.Root data={monthlyData} width={600} height={300}>
        <LineChart.Grid />
        <LineChart.XAxis dataKey="month" />
        <LineChart.YAxis />
        <LineChart.Tooltip />
        <LineChart.Line dataKey="revenue" />
      </LineChart.Root>
    );
  },
};

export const MultipleSeries: Story = {
  render() {
    return (
      <LineChart.Root data={monthlyData} width={600} height={300}>
        <LineChart.Grid strokeDasharray="3 3" />
        <LineChart.XAxis dataKey="month" />
        <LineChart.YAxis />
        <LineChart.Tooltip />
        <LineChart.Legend />
        <LineChart.Line dataKey="revenue" />
        <LineChart.Line dataKey="profit" />
      </LineChart.Root>
    );
  },
};
