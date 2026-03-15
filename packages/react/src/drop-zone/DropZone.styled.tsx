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

export const DropZone = React.forwardRef<HTMLDivElement, DropZoneProps>(
  ({ className, ...props }, ref) => (
    <AriaDropZone ref={ref} className={cx('tale-drop-zone', className)} {...props} />
  ),
);
DropZone.displayName = 'DropZone';
