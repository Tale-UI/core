import * as React from 'react';
import { useIsoLayoutEffect } from '@tale-ui/utils/useIsoLayoutEffect';
import { useMergedRefs } from '@tale-ui/utils/useMergedRefs';
import { useStableCallback } from '@tale-ui/utils/useStableCallback';
import { cx } from '../_cx';

/* ─── Root ────────────────────────────────────────────────────────────────── */

type Columns = 1 | 2 | 3 | 4;
type Variant = 'plain' | 'divided';
type Density = 'compact' | 'default' | 'spacious';

type KeyValuePairsStyle = React.CSSProperties & {
  '--tale-key-value-pairs-columns'?: number;
};

export interface RootProps extends Omit<React.ComponentPropsWithoutRef<'dl'>, 'className'> {
  /** Maximum number of columns. @default 1 */
  columns?: Columns | undefined;
  /** Desired minimum column width in pixels. @default 150 */
  minColumnWidth?: number | undefined;
  /** Visual style. `divided` adds separators between visual rows. @default 'plain' */
  variant?: Variant | undefined;
  /** Vertical spacing density. @default 'default' */
  density?: Density | undefined;
  className?: string | undefined;
}

function normalizeColumns(value: Columns | undefined): Columns {
  const numeric = typeof value === 'number' && Number.isFinite(value) ? Math.trunc(value) : 1;
  if (numeric <= 1) {return 1;}
  if (numeric === 2) {return 2;}
  if (numeric === 3) {return 3;}
  return 4;
}

function normalizeMinColumnWidth(value: number | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 150;
}

function getColumnGap(element: HTMLElement): number {
  const styles = getComputedStyle(element);
  const gap = Number.parseFloat(styles.columnGap || styles.gap || '0');
  return Number.isFinite(gap) ? gap : 0;
}

function getResolvedColumns(element: HTMLElement, columns: Columns, minColumnWidth: number): Columns {
  const width = element.getBoundingClientRect().width;
  const gap = getColumnGap(element);
  const resolved = Math.floor((width + gap) / (minColumnWidth + gap));
  return normalizeColumns(Math.min(columns, Math.max(1, resolved)) as Columns);
}

/**
 * A semantic description-list display for labels and corresponding values.
 *
 * @example
 * ```tsx
 * import { KeyValuePairs } from '@tale-ui/react/key-value-pairs';
 *
 * <KeyValuePairs.Root columns={2}>
 *   <KeyValuePairs.Item>
 *     <KeyValuePairs.Term>Status</KeyValuePairs.Term>
 *     <KeyValuePairs.Details>Active</KeyValuePairs.Details>
 *   </KeyValuePairs.Item>
 * </KeyValuePairs.Root>
 * ```
 *
 * @status stable
 */
export const Root = React.forwardRef<HTMLDListElement, RootProps>(
  (
    {
      columns: columnsProp = 1,
      minColumnWidth: minColumnWidthProp = 150,
      variant = 'plain',
      density = 'default',
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const columns = normalizeColumns(columnsProp);
    const minColumnWidth = normalizeMinColumnWidth(minColumnWidthProp);
    const rootRef = React.useRef<HTMLDListElement | null>(null);
    const mergedRef = useMergedRefs(rootRef, ref);
    const [resolvedColumns, setResolvedColumns] = React.useState<Columns>(columns);

    const updateColumns = useStableCallback(() => {
      const element = rootRef.current;
      if (element == null) {
        return;
      }
      setResolvedColumns(getResolvedColumns(element, columns, minColumnWidth));
    });

    useIsoLayoutEffect(() => {
      const element = rootRef.current;
      if (element == null) {
        setResolvedColumns(columns);
        return undefined;
      }

      updateColumns();

      if (typeof ResizeObserver === 'undefined') {
        return undefined;
      }

      const resizeObserver = new ResizeObserver(updateColumns);
      resizeObserver.observe(element);
      return () => {
        resizeObserver.disconnect();
      };
    }, [columns, minColumnWidth, updateColumns]);

    const classes = ['tale-key-value-pairs'];
    if (variant !== 'plain') {classes.push(`tale-key-value-pairs--${variant}`);}
    if (density !== 'default') {classes.push(`tale-key-value-pairs--${density}`);}

    const rootStyle: KeyValuePairsStyle = {
      ...style,
      '--tale-key-value-pairs-columns': resolvedColumns,
    };

    return (
      <dl
        ref={mergedRef}
        className={cx(classes.join(' '), className)}
        data-columns={resolvedColumns}
        style={rootStyle}
        {...props}
      />
    );
  },
);
Root.displayName = 'KeyValuePairs.Root';

/* ─── Item ────────────────────────────────────────────────────────────────── */

export interface ItemProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  className?: string | undefined;
}

/**
 * A single key-value pair wrapper. Place `KeyValuePairs.Term` before `KeyValuePairs.Details`.
 */
export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cx('tale-key-value-pairs__item', className)}
      {...props}
    />
  ),
);
Item.displayName = 'KeyValuePairs.Item';

/* ─── Term ────────────────────────────────────────────────────────────────── */

export interface TermProps extends Omit<React.ComponentPropsWithoutRef<'dt'>, 'className'> {
  className?: string | undefined;
}

/** The label/key for a key-value pair. Renders a `<dt>`. */
export const Term = React.forwardRef<HTMLElement, TermProps>(
  ({ className, ...props }, ref) => (
    <dt
      ref={ref}
      className={cx('tale-key-value-pairs__term', className)}
      {...props}
    />
  ),
);
Term.displayName = 'KeyValuePairs.Term';

/* ─── Details ─────────────────────────────────────────────────────────────── */

export interface DetailsProps extends Omit<React.ComponentPropsWithoutRef<'dd'>, 'className'> {
  className?: string | undefined;
}

/** The value/details for a key-value pair. Renders a `<dd>`. */
export const Details = React.forwardRef<HTMLElement, DetailsProps>(
  ({ className, ...props }, ref) => (
    <dd
      ref={ref}
      className={cx('tale-key-value-pairs__details', className)}
      {...props}
    />
  ),
);
Details.displayName = 'KeyValuePairs.Details';

/* ─── Info ────────────────────────────────────────────────────────────────── */

export interface InfoProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className'> {
  className?: string | undefined;
}

/** Optional inline help, link, or tooltip trigger next to a term. */
export const Info = React.forwardRef<HTMLSpanElement, InfoProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cx('tale-key-value-pairs__info', className)}
      {...props}
    />
  ),
);
Info.displayName = 'KeyValuePairs.Info';

/* ─── Group ───────────────────────────────────────────────────────────────── */

export interface GroupProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  className?: string | undefined;
}

/** A top-level grouped set of key-value pairs. */
export const Group = React.forwardRef<HTMLDivElement, GroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cx('tale-key-value-pairs__group', className)}
      {...props}
    />
  ),
);
Group.displayName = 'KeyValuePairs.Group';

/* ─── Group Title ─────────────────────────────────────────────────────────── */

export interface GroupTitleProps extends Omit<React.ComponentPropsWithoutRef<'dt'>, 'className'> {
  className?: string | undefined;
}

/** The term/title for a grouped set of key-value pairs. */
export const GroupTitle = React.forwardRef<HTMLElement, GroupTitleProps>(
  ({ className, ...props }, ref) => (
    <dt
      ref={ref}
      className={cx('tale-key-value-pairs__group-title', className)}
      {...props}
    />
  ),
);
GroupTitle.displayName = 'KeyValuePairs.GroupTitle';

/* ─── Group List ──────────────────────────────────────────────────────────── */

export interface GroupListProps extends Omit<React.ComponentPropsWithoutRef<'dd'>, 'className'> {
  className?: string | undefined;
}

/** The details area for a grouped set. Renders a `<dd>` containing a nested `<dl>`. */
export const GroupList = React.forwardRef<HTMLElement, GroupListProps>(
  ({ className, children, ...props }, ref) => (
    <dd
      ref={ref}
      className={cx('tale-key-value-pairs__group-details', className)}
      {...props}
    >
      <dl className="tale-key-value-pairs__group-list">
        {children}
      </dl>
    </dd>
  ),
);
GroupList.displayName = 'KeyValuePairs.GroupList';
