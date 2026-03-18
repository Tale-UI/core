import * as React from 'react';
import {
  DropZone as AriaDropZone,
  type DropZoneProps as AriaDropZoneProps,
} from 'react-aria-components';
import { cx } from '../_cx';

// ── DropZone ───────────────────────────────────────────────────────────────

export type DropZoneProps = Omit<AriaDropZoneProps, 'className'> & {
  className?: string;
};

/**
 * An area that accepts dragged files or data.
 *
 * @example
 * ```tsx
 * import { DropZone } from '@tale-ui/react/drop-zone';
 *
 * <DropZone onDrop={(e) => console.log('Dropped:', e.items)}>
 *   <p>Drag and drop files here</p>
 * </DropZone>
 * ```
 */
export const DropZone = React.forwardRef<HTMLDivElement, DropZoneProps>(
  ({ className, ...props }, ref) => (
    <AriaDropZone ref={ref} className={cx('tale-drop-zone', className)} {...props} />
  ),
);
DropZone.displayName = 'DropZone';
