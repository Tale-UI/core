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
 * Nest a `FileTrigger` inside to also allow clicking anywhere on the zone to
 * open the native file picker — React Aria forwards zone clicks to the
 * FileTrigger automatically.
 *
 * @example
 * ```tsx
 * import { DropZone } from '@tale-ui/react/drop-zone';
 * import { FileTrigger } from '@tale-ui/react/file-trigger';
 * import { Button } from '@tale-ui/react/button';
 *
 * <DropZone onDrop={(e) => console.log('Dropped:', e.items)}>
 *   <FileTrigger onSelect={(files) => console.log(files)}>
 *     <Button>Drop files here or click to browse</Button>
 *   </FileTrigger>
 * </DropZone>
 * ```
 */
export const DropZone = React.forwardRef<HTMLDivElement, DropZoneProps>(
  ({ className, ...props }, ref) => (
    <AriaDropZone ref={ref} className={cx('tale-drop-zone', className)} {...props} />
  ),
);
DropZone.displayName = 'DropZone';
