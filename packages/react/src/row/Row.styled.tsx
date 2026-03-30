import * as React from 'react';
import { cx } from '../_cx';

type Gap = '4xs' | '3xs' | '2xs' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl';
type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type Justify = 'start' | 'center' | 'end' | 'between';

const JUSTIFY_MAP: Record<Justify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
};

export interface RowProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  /** Gap between children, mapped to `--space-*` tokens. @default 'm' */
  gap?: Gap | undefined;
  /** Cross-axis alignment. @default 'center' */
  align?: Align | undefined;
  /** Main-axis distribution. @default 'start' */
  justify?: Justify | undefined;
  /** Whether children should wrap. @default false */
  wrap?: boolean | undefined;
  className?: string | undefined;
}

/**
 * Horizontal flex-row layout wrapper using design-system spacing tokens.
 *
 * @example
 * ```tsx
 * import { Row } from '@tale-ui/react/row';
 * import { Button } from '@tale-ui/react/button';
 *
 * <Row gap="s" justify="end">
 *   <Button variant="ghost">Cancel</Button>
 *   <Button variant="primary">Save</Button>
 * </Row>
 * ```
 */
export const Row = React.forwardRef<HTMLDivElement, RowProps>(
  ({ gap = 'm', align = 'center', justify = 'start', wrap = false, className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cx(wrap ? 'tale-row tale-row--wrap' : 'tale-row', className)}
      style={{
        gap: `var(--space-${gap})`,
        alignItems: align,
        justifyContent: JUSTIFY_MAP[justify],
        ...style,
      }}
      {...props}
    />
  ),
);
Row.displayName = 'Row';
