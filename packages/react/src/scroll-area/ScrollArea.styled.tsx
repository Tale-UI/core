import * as React from 'react';
import { cx } from '../_cx';

/**
 * A scrollable container with custom scrollbars.
 *
 * @example
 * ```tsx
 * import { ScrollArea } from '@tale-ui/react/scroll-area';
 *
 * <ScrollArea.Root style={{ height: 200 }}>
 *   <ScrollArea.Viewport>
 *     <ScrollArea.Content>
 *       <p>Scrollable content here...</p>
 *     </ScrollArea.Content>
 *   </ScrollArea.Viewport>
 *   <ScrollArea.Scrollbar orientation="vertical">
 *     <ScrollArea.Thumb />
 *   </ScrollArea.Scrollbar>
 * </ScrollArea.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-scroll-area', className)} {...props} />
  ),
);
Root.displayName = 'ScrollArea.Root';

export const Viewport = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-scroll-area__viewport', className)} {...props} />
  ),
);
Viewport.displayName = 'ScrollArea.Viewport';

export const Scrollbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: 'horizontal' | 'vertical' }
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <div
    ref={ref}
    data-orientation={orientation}
    className={cx('tale-scroll-area__scrollbar', className)}
    {...props}
  />
));
Scrollbar.displayName = 'ScrollArea.Scrollbar';

export const Thumb = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-scroll-area__thumb', className)} {...props} />
  ),
);
Thumb.displayName = 'ScrollArea.Thumb';

export const Corner = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-scroll-area__corner', className)} {...props} />
  ),
);
Corner.displayName = 'ScrollArea.Corner';

export const Content = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-scroll-area__content', className)} {...props} />
  ),
);
Content.displayName = 'ScrollArea.Content';
