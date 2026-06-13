import * as React from 'react';
import { randomBaseColor, generatePalette, getContrastRatio, NAMED_SHADES } from '@tale-ui/utils/color';

export const CONTAINER_COLORS = [
  'brand', 'random',
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald',
  'teal', 'cyan', 'sky', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
] as const;

export type ContainerColor = typeof CONTAINER_COLORS[number];

/**
 * Per-shade fg overrides for a palette — compare each shade's contrast against
 * both endpoints (shade-5 and shade-100) and override when the non-default
 * endpoint has better contrast.
 *
 * Design system defaults: shades <60 get var(--color-100) (dark text),
 * shades >=60 get var(--color-5) (light text). We override individual shades
 * where the opposite endpoint wins.
 */
function computeFgOverrides(palette: Array<{ shade: number; hex: string }>): Record<string, string> {
  const get = (shade: number) => palette.find(p => p.shade === shade)?.hex;
  const s5 = get(5);
  const s100 = get(100);
  if (!s5 || !s100) {return {};}

  const overrides: Record<string, string> = {};

  for (const { shade, hex } of palette) {
    const defaultFg = shade < 60 ? s100 : s5;
    const altFg     = shade < 60 ? s5   : s100;
    const altToken  = shade < 60 ? 'var(--color-5)' : 'var(--color-100)';
    if (getContrastRatio(hex, altFg) > getContrastRatio(hex, defaultFg)) {
      overrides[`--color-${shade}-fg`] = altToken;
    }
  }

  return overrides;
}

// Computed once per page load — changes on hard refresh
const randomBase = randomBaseColor('named');
const randomPalette = generatePalette(randomBase, 'named');
const randomColorVars = Object.fromEntries([
  ...randomPalette.map(({ shade, hex }) => [`--color-${shade}`, hex]),
  ...Object.entries(computeFgOverrides(randomPalette)),
]) as React.CSSProperties;

/**
 * Named-colour palettes: we can't compute contrast at runtime because the
 * hex values live in CSS variables (var(--green-50) etc.). Instead, generate
 * the palette from the design system's known base-60 hex for each colour
 * and pre-compute the fg overrides once at module load.
 */
const NAMED_BASE_HEX: Partial<Record<ContainerColor, string>> = {
  red:     '#dc2626', orange:  '#f97316', amber:   '#f59e0b',
  yellow:  '#eab308', lime:    '#84cc16', green:   '#22c55e',
  emerald: '#10b981', teal:    '#14b8a6', cyan:    '#06b6d4',
  sky:     '#0ea5e9', indigo:  '#6366f1', violet:  '#8b5cf6',
  purple:  '#a855f7', fuchsia: '#d946ef', pink:    '#ec4899',
  rose:    '#f43f5e',
};

const NAMED_FG_OVERRIDES: Partial<Record<ContainerColor, Record<string, string>>> = {};
for (const [color, baseHex] of Object.entries(NAMED_BASE_HEX) as [ContainerColor, string][]) {
  const palette = generatePalette(baseHex, 'named');
  const overrides = computeFgOverrides(palette);
  if (Object.keys(overrides).length > 0) {
    NAMED_FG_OVERRIDES[color] = overrides;
  }
}

function getColorVars(color: ContainerColor): React.CSSProperties | undefined {
  if (color === 'brand') {return undefined;}
  if (color === 'random') {return randomColorVars;}

  const entries: [string, string][] = NAMED_SHADES.map((shade) => [`--color-${shade}`, `var(--${color}-${shade})`]);
  const fgOverrides = NAMED_FG_OVERRIDES[color];
  if (fgOverrides) {
    Object.entries(fgOverrides).forEach(([k, v]) => entries.push([k, v]));
  }
  return Object.fromEntries(entries) as React.CSSProperties;
}

export type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  color?: ContainerColor;
};

/**
 * A wrapper that overrides `--color-*` design tokens for its descendants.
 *
 * @example
 * ```tsx
 * import { Container } from '@tale-ui/react/container';
 *
 * <Container color="indigo">
 *   <Button variant="primary">Indigo Button</Button>
 * </Container>
 * ```
 */
export function Container({ color = 'brand', children, style, ...props }: ContainerProps) {
  const colorVars = getColorVars(color);
  return (
    <div style={{ ...colorVars, ...style }} {...props}>
      {children}
    </div>
  );
}
