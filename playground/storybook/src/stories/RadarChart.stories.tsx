import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadarChart } from '@tale-ui/charts/radar-chart';
import '@tale-ui/charts/chart.css';

const radarData = [
  { subject: 'Speed', A: 120, B: 110, fullMark: 150 },
  { subject: 'Reliability', A: 98, B: 130, fullMark: 150 },
  { subject: 'Comfort', A: 86, B: 130, fullMark: 150 },
  { subject: 'Safety', A: 99, B: 100, fullMark: 150 },
  { subject: 'Efficiency', A: 85, B: 90, fullMark: 150 },
];

const meta: Meta = {
  title: 'Charts/RadarChart',
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render() {
    return (
      <RadarChart.Root data={radarData} width={600} height={400}>
        <RadarChart.PolarGrid />
        <RadarChart.PolarAngleAxis dataKey="subject" />
        <RadarChart.Tooltip />
        <RadarChart.Legend />
        <RadarChart.Radar dataKey="A" />
        <RadarChart.Radar dataKey="B" />
      </RadarChart.Root>
    );
  },
};

export const SingleSeries: Story = {
  render() {
    return (
      <RadarChart.Root data={radarData} width={600} height={400}>
        <RadarChart.PolarGrid />
        <RadarChart.PolarAngleAxis dataKey="subject" />
        <RadarChart.PolarRadiusAxis />
        <RadarChart.Tooltip />
        <RadarChart.Radar dataKey="A" />
      </RadarChart.Root>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Multiple Series</span>
          <RadarChart.Root data={radarData} width={600} height={350}>
            <RadarChart.PolarGrid />
            <RadarChart.PolarAngleAxis dataKey="subject" />
            <RadarChart.Tooltip />
            <RadarChart.Legend />
            <RadarChart.Radar dataKey="A" />
            <RadarChart.Radar dataKey="B" />
          </RadarChart.Root>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Single Series</span>
          <RadarChart.Root data={radarData} width={600} height={350}>
            <RadarChart.PolarGrid />
            <RadarChart.PolarAngleAxis dataKey="subject" />
            <RadarChart.PolarRadiusAxis />
            <RadarChart.Tooltip />
            <RadarChart.Radar dataKey="A" />
          </RadarChart.Root>
        </div>
      </div>
    );
  },
};
