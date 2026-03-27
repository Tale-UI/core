import type { Meta, StoryObj } from '@storybook/react';
import { BarChart } from '@tale-ui/charts/bar-chart';
import '@tale-ui/charts/chart.css';

const monthlyData = [
  { month: 'Jan', revenue: 4000, profit: 2400, expenses: 1600 },
  { month: 'Feb', revenue: 3000, profit: 1398, expenses: 1602 },
  { month: 'Mar', revenue: 5000, profit: 3200, expenses: 1800 },
  { month: 'Apr', revenue: 4500, profit: 2800, expenses: 1700 },
  { month: 'May', revenue: 6000, profit: 3900, expenses: 2100 },
  { month: 'Jun', revenue: 5500, profit: 3500, expenses: 2000 },
];

const meta: Meta = {
  title: 'Charts/BarChart',
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render() {
    return (
      <BarChart.Root data={monthlyData} width={600} height={300}>
        <BarChart.Grid />
        <BarChart.XAxis dataKey="month" />
        <BarChart.YAxis />
        <BarChart.Tooltip />
        <BarChart.Bar dataKey="revenue" />
      </BarChart.Root>
    );
  },
};

export const MultipleSeries: Story = {
  render() {
    return (
      <BarChart.Root data={monthlyData} width={600} height={300}>
        <BarChart.Grid strokeDasharray="3 3" />
        <BarChart.XAxis dataKey="month" />
        <BarChart.YAxis />
        <BarChart.Tooltip />
        <BarChart.Legend />
        <BarChart.Bar dataKey="revenue" />
        <BarChart.Bar dataKey="profit" />
        <BarChart.Bar dataKey="expenses" />
      </BarChart.Root>
    );
  },
};

export const CustomPalette: Story = {
  render() {
    return (
      <BarChart.Root data={monthlyData} width={600} height={300} palette={['#3b82f6', '#10b981', '#f59e0b']}>
        <BarChart.Grid />
        <BarChart.XAxis dataKey="month" />
        <BarChart.YAxis />
        <BarChart.Tooltip />
        <BarChart.Legend />
        <BarChart.Bar dataKey="revenue" />
        <BarChart.Bar dataKey="profit" />
        <BarChart.Bar dataKey="expenses" />
      </BarChart.Root>
    );
  },
};
