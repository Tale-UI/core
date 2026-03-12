import * as React from 'react';
import { randomBaseColor, generatePalette, NAMED_SHADES } from '@tale-ui/utils/color';

export const CONTAINER_COLORS = [
  'brand', 'random',
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald',
  'teal', 'cyan', 'sky', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
] as const;

export type ContainerColor = typeof CONTAINER_COLORS[number];

// Computed once per page load — changes on hard refresh
const randomBase = randomBaseColor('named');
const randomPalette = generatePalette(randomBase, 'named');
const randomColorVars = Object.fromEntries(
  randomPalette.map(({ shade, hex }) => [`--color-${shade}`, hex]),
) as React.CSSProperties;

function getColorVars(color: ContainerColor): React.CSSProperties | undefined {
  if (color === 'brand') return undefined;
  if (color === 'random') return randomColorVars;
  return Object.fromEntries(
    NAMED_SHADES.map((shade) => [`--color-${shade}`, `var(--${color}-${shade})`]),
  ) as React.CSSProperties;
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
