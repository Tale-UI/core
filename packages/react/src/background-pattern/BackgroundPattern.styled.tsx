import * as React from 'react';
import { Circle } from './patterns/Circle';
import { Square } from './patterns/Square';
import { Grid } from './patterns/Grid';
import { GridCheck } from './patterns/GridCheck';

type Pattern = 'circle' | 'square' | 'grid' | 'grid-check';
type Size = 'sm' | 'md' | 'lg';

const patterns = { circle: Circle, square: Square, grid: Grid, 'grid-check': GridCheck } as const;

export interface BackgroundPatternProps extends Omit<React.SVGProps<SVGSVGElement>, 'size'> {
  /** The decorative pattern to render. */
  pattern: Pattern;
  /**
   * Size of the SVG canvas.
   * Note: `grid-check` only supports `'sm'` and `'md'`.
   * @default 'lg'
   */
  size?: Size | undefined;
}

/**
 * Decorative SVG background pattern — circle rings, nested squares, grid lines, or grid with checkmark cells.
 * Uses `currentColor` so it inherits text colour from CSS (`color: var(--neutral-22)` by default).
 *
 * @example
 * ```tsx
 * import { BackgroundPattern } from '@tale-ui/react/background-pattern';
 *
 * <BackgroundPattern pattern="circle" size="lg" />
 * <BackgroundPattern pattern="grid" size="md" />
 * <BackgroundPattern pattern="grid-check" size="md" />
 * <BackgroundPattern pattern="square" size="sm" />
 * ```
 */
export const BackgroundPattern = React.forwardRef<SVGSVGElement, BackgroundPatternProps>(
  ({ pattern, size = 'lg', ...props }, _ref) => {
    const Comp = patterns[pattern];
    return <Comp size={size as 'sm' | 'md'} {...props} />;
  },
);
BackgroundPattern.displayName = 'BackgroundPattern';
