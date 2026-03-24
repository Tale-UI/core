import * as React from 'react';
import { randomBaseColor, generatePalette, getContrastRatio, NAMED_SHADES } from '@tale-ui/utils/color';

export const CONTAINER_COLORS = [
  'brand', 'random',
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald',
  'teal', 'cyan', 'sky', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
] as const;

export type ContainerColor = typeof CONTAINER_COLORS[number];

/**
 * Fg pivot overrides for named colors — matches _color-modes.css lines 91-114.
 * Colors whose shade-60 (or shade-70) is too light for white foreground text
 * need --color-{shade}-fg flipped to var(--color-100) (dark text).
 *
 * 60 = only --color-60-fg overridden
 * 70 = both --color-60-fg and --color-70-fg overridden
 */
const FG_PIVOT: Partial<Record<ContainerColor, 60 | 70>> = {
  orange: 60,
  sky: 60,
  amber: 70,
  yellow: 70,
  lime: 70,
  green: 70,
  emerald: 70,
  teal: 70,
  cyan: 70,
};

function getFgOverrides(pivot: 60 | 70): Record<string, string> {
  const overrides: Record<string, string> = {
    '--color-60-fg': 'var(--color-100)',
  };
  if (pivot >= 70) {
    overrides['--color-70-fg'] = 'var(--color-100)';
  }
  return overrides;
}

/**
 * Compute fg pivot overrides for a random palette by measuring WCAG contrast.
 * Returns the same override map as getFgOverrides, or {} if no override needed.
 */
function computeRandomFgOverrides(palette: Array<{ shade: number; hex: string }>): Record<string, string> {
  const get = (shade: number) => palette.find(p => p.shade === shade)?.hex;
  const s5 = get(5);
  const s60 = get(60);
  const s70 = get(70);
  const s100 = get(100);
  if (!s5 || !s60 || !s100) return {};

  const overrides: Record<string, string> = {};

  // shade-60: if white text (--color-5) doesn't meet 4.5:1 contrast, flip to dark text
  if (getContrastRatio(s60, s5) < 4.5) {
    overrides['--color-60-fg'] = 'var(--color-100)';
  }

  // shade-70: same check
  if (s70 && getContrastRatio(s70, s5) < 4.5) {
    overrides['--color-70-fg'] = 'var(--color-100)';
  }

  return overrides;
}

// Computed once per page load — changes on hard refresh
const randomBase = randomBaseColor('named');
const randomPalette = generatePalette(randomBase, 'named');
const randomColorVars = Object.fromEntries([
  ...randomPalette.map(({ shade, hex }) => [`--color-${shade}`, hex]),
  ...Object.entries(computeRandomFgOverrides(randomPalette)),
]) as React.CSSProperties;

function getColorVars(color: ContainerColor): React.CSSProperties | undefined {
  if (color === 'brand') return undefined;
  if (color === 'random') return randomColorVars;

  const pivot = FG_PIVOT[color];
  const entries: [string, string][] = NAMED_SHADES.map((shade) => [`--color-${shade}`, `var(--${color}-${shade})`]);
  if (pivot) {
    Object.entries(getFgOverrides(pivot)).forEach(([k, v]) => entries.push([k, v]));
  }
  return Object.fromEntries(entries) as React.CSSProperties;
}

export type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  color?: ContainerColor;
};

export function Container({ color = 'brand', children, style, ...props }: ContainerProps) {
  const colorVars = getColorVars(color);
  return (
    <div style={{ ...colorVars, ...style }} {...props}>
      {children}
    </div>
  );
}
