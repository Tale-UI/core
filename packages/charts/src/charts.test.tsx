import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

// Mock recharts to just render children in a div
vi.mock('recharts', () => {
  const MockChart = React.forwardRef(({ children, data, width, height, innerRadius, outerRadius, aspect, cx: _cx, cy: _cy, className, ...rest }: any, ref: any) => (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  ));
  const MockComponent: React.FC<any> = () => null;
  return {
    BarChart: MockChart,
    Bar: MockComponent,
    LineChart: MockChart,
    Line: MockComponent,
    AreaChart: MockChart,
    Area: MockComponent,
    PieChart: MockChart,
    Pie: MockComponent,
    Cell: MockComponent,
    RadarChart: MockChart,
    Radar: MockComponent,
    RadialBarChart: MockChart,
    RadialBar: MockComponent,
    XAxis: MockComponent,
    YAxis: MockComponent,
    CartesianGrid: MockComponent,
    Tooltip: MockComponent,
    Legend: MockComponent,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    PolarGrid: MockComponent,
    PolarAngleAxis: MockComponent,
    PolarRadiusAxis: MockComponent,
  };
});

import { BarChart } from './bar-chart';
import { LineChart } from './line-chart';
import { AreaChart } from './area-chart';
import { PieChart } from './pie-chart';
import { RadarChart } from './radar-chart';
import { RadialBarChart } from './radial-bar-chart';
import { ChartTooltip } from './shared/ChartTooltip';
import { ChartLegend } from './shared/ChartLegend';

function hasClass(el: Element | null, cls: string) {
  return el?.classList.contains(cls) ?? false;
}

/* ─── BarChart ──────────────────────────────────────────────────────────────── */

describe('BarChart', () => {
  it('Root renders with tale-chart--bar class', () => {
    const { container } = render(
      <BarChart.Root data={[]}>
        <BarChart.Bar dataKey="value" />
      </BarChart.Root>,
    );
    const el = container.firstElementChild;
    expect(hasClass(el, 'tale-chart')).toBe(true);
    expect(hasClass(el, 'tale-chart--bar')).toBe(true);
  });

  it('Root merges custom className', () => {
    const { container } = render(
      <BarChart.Root data={[]} className="custom">
        <BarChart.Bar dataKey="value" />
      </BarChart.Root>,
    );
    expect(hasClass(container.firstElementChild, 'custom')).toBe(true);
  });
});

/* ─── LineChart ─────────────────────────────────────────────────────────────── */

describe('LineChart', () => {
  it('Root renders with tale-chart--line class', () => {
    const { container } = render(
      <LineChart.Root data={[]}>
        <LineChart.Line dataKey="value" />
      </LineChart.Root>,
    );
    const el = container.firstElementChild;
    expect(hasClass(el, 'tale-chart')).toBe(true);
    expect(hasClass(el, 'tale-chart--line')).toBe(true);
  });

  it('Root merges custom className', () => {
    const { container } = render(
      <LineChart.Root data={[]} className="custom">
        <LineChart.Line dataKey="value" />
      </LineChart.Root>,
    );
    expect(hasClass(container.firstElementChild, 'custom')).toBe(true);
  });
});

/* ─── AreaChart ─────────────────────────────────────────────────────────────── */

describe('AreaChart', () => {
  it('Root renders with tale-chart--area class', () => {
    const { container } = render(
      <AreaChart.Root data={[]}>
        <AreaChart.Area dataKey="value" />
      </AreaChart.Root>,
    );
    const el = container.firstElementChild;
    expect(hasClass(el, 'tale-chart')).toBe(true);
    expect(hasClass(el, 'tale-chart--area')).toBe(true);
  });

  it('Root merges custom className', () => {
    const { container } = render(
      <AreaChart.Root data={[]} className="custom">
        <AreaChart.Area dataKey="value" />
      </AreaChart.Root>,
    );
    expect(hasClass(container.firstElementChild, 'custom')).toBe(true);
  });
});

/* ─── PieChart ──────────────────────────────────────────────────────────────── */

describe('PieChart', () => {
  it('Root renders with tale-chart--pie class', () => {
    const { container } = render(
      <PieChart.Root>
        <PieChart.Pie dataKey="value" />
      </PieChart.Root>,
    );
    const el = container.firstElementChild;
    expect(hasClass(el, 'tale-chart')).toBe(true);
    expect(hasClass(el, 'tale-chart--pie')).toBe(true);
  });

  it('Root merges custom className', () => {
    const { container } = render(
      <PieChart.Root className="custom">
        <PieChart.Pie dataKey="value" />
      </PieChart.Root>,
    );
    expect(hasClass(container.firstElementChild, 'custom')).toBe(true);
  });
});

/* ─── RadarChart ────────────────────────────────────────────────────────────── */

describe('RadarChart', () => {
  it('Root renders with tale-chart--radar class', () => {
    const { container } = render(
      <RadarChart.Root data={[]}>
        <RadarChart.Radar dataKey="value" />
      </RadarChart.Root>,
    );
    const el = container.firstElementChild;
    expect(hasClass(el, 'tale-chart')).toBe(true);
    expect(hasClass(el, 'tale-chart--radar')).toBe(true);
  });

  it('Root merges custom className', () => {
    const { container } = render(
      <RadarChart.Root data={[]} className="custom">
        <RadarChart.Radar dataKey="value" />
      </RadarChart.Root>,
    );
    expect(hasClass(container.firstElementChild, 'custom')).toBe(true);
  });
});

/* ─── RadialBarChart ────────────────────────────────────────────────────────── */

describe('RadialBarChart', () => {
  it('Root renders with tale-chart--radial-bar class', () => {
    const { container } = render(
      <RadialBarChart.Root data={[]}>
        <RadialBarChart.RadialBar dataKey="value" />
      </RadialBarChart.Root>,
    );
    const el = container.firstElementChild;
    expect(hasClass(el, 'tale-chart')).toBe(true);
    expect(hasClass(el, 'tale-chart--radial-bar')).toBe(true);
  });

  it('Root merges custom className', () => {
    const { container } = render(
      <RadialBarChart.Root data={[]} className="custom">
        <RadialBarChart.RadialBar dataKey="value" />
      </RadialBarChart.Root>,
    );
    expect(hasClass(container.firstElementChild, 'custom')).toBe(true);
  });
});

/* ─── ChartTooltip ──────────────────────────────────────────────────────────── */

describe('ChartTooltip', () => {
  it('renders tooltip with tale-chart__tooltip class when active', () => {
    const { container } = render(
      <ChartTooltip active payload={[{ name: 'Revenue', value: 100, color: '#f00' }]} label="Jan" />,
    );
    expect(container.querySelector('.tale-chart__tooltip')).toBeTruthy();
  });

  it('renders nothing when not active', () => {
    const { container } = render(<ChartTooltip active={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when payload is empty', () => {
    const { container } = render(<ChartTooltip active payload={[]} />);
    expect(container.innerHTML).toBe('');
  });
});

/* ─── ChartLegend ───────────────────────────────────────────────────────────── */

describe('ChartLegend', () => {
  it('renders legend with tale-chart__legend class', () => {
    const { container } = render(
      <ChartLegend payload={[{ value: 'Revenue', color: '#f00' }]} />,
    );
    expect(container.querySelector('.tale-chart__legend')).toBeTruthy();
  });

  it('renders nothing when payload is empty', () => {
    const { container } = render(<ChartLegend payload={[]} />);
    expect(container.innerHTML).toBe('');
  });
});
