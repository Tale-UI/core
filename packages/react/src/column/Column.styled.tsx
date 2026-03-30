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

export interface ColumnProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  /** Gap between children, mapped to `--space-*` tokens. @default 'm' */
  gap?: Gap | undefined;
  /** Cross-axis alignment. @default 'stretch' */
  align?: Align | undefined;
  /** Main-axis distribution. @default 'start' */
  justify?: Justify | undefined;
  className?: string | undefined;
}

/**
 * Vertical flex-column layout wrapper using design-system spacing tokens.
 *
 * @example
 * ```tsx
 * import { Column } from '@tale-ui/react/column';
 * import { Text } from '@tale-ui/react/text';
 *
 * <Column gap="s">
 *   <Text variant="heading" size="m" as="h2">Settings</Text>
 *   <Text color="muted">Configure your preferences below.</Text>
 * </Column>
 * ```
 */
export const Column = React.forwardRef<HTMLDivElement, ColumnProps>(
  ({ gap = 'm', align = 'stretch', justify = 'start', className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cx('tale-column', className)}
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
Column.displayName = 'Column';
