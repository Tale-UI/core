import * as React from 'react';
import { ScrollArea as H } from '@tale-ui/react/scroll-area';
import { cx } from '../_cx';

export const Root = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-scroll-area', className)} ref={ref} {...props} />
));
Root.displayName = 'ScrollArea.Root';

export const Viewport = React.forwardRef<
  React.ComponentRef<typeof H.Viewport>,
  React.ComponentPropsWithoutRef<typeof H.Viewport>
>(({ className, ...props }, ref) => (
  <H.Viewport className={cx('tale-scroll-area__viewport', className)} ref={ref} {...props} />
));
Viewport.displayName = 'ScrollArea.Viewport';

export const Scrollbar = React.forwardRef<
  React.ComponentRef<typeof H.Scrollbar>,
  React.ComponentPropsWithoutRef<typeof H.Scrollbar>
>(({ className, ...props }, ref) => (
  <H.Scrollbar className={cx('tale-scroll-area__scrollbar', className)} ref={ref} {...props} />
));
Scrollbar.displayName = 'ScrollArea.Scrollbar';

export const Thumb = React.forwardRef<
  React.ComponentRef<typeof H.Thumb>,
  React.ComponentPropsWithoutRef<typeof H.Thumb>
>(({ className, ...props }, ref) => (
  <H.Thumb className={cx('tale-scroll-area__thumb', className)} ref={ref} {...props} />
));
Thumb.displayName = 'ScrollArea.Thumb';

export const Corner = React.forwardRef<
  React.ComponentRef<typeof H.Corner>,
  React.ComponentPropsWithoutRef<typeof H.Corner>
>(({ className, ...props }, ref) => (
  <H.Corner className={cx('tale-scroll-area__corner', className)} ref={ref} {...props} />
));
Corner.displayName = 'ScrollArea.Corner';
