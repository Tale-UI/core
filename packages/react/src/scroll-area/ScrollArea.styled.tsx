import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';

const StyledRoot = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-scroll-area', className)} ref={ref} {...props} />
));
StyledRoot.displayName = 'ScrollArea.Root';
export const Root = StyledRoot as typeof H.Root;

const StyledViewport = React.forwardRef<
  React.ComponentRef<typeof H.Viewport>,
  React.ComponentPropsWithoutRef<typeof H.Viewport>
>(({ className, ...props }, ref) => (
  <H.Viewport className={cx('tale-scroll-area__viewport', className)} ref={ref} {...props} />
));
StyledViewport.displayName = 'ScrollArea.Viewport';
export const Viewport = StyledViewport as typeof H.Viewport;

const StyledScrollbar = React.forwardRef<
  React.ComponentRef<typeof H.Scrollbar>,
  React.ComponentPropsWithoutRef<typeof H.Scrollbar>
>(({ className, ...props }, ref) => (
  <H.Scrollbar className={cx('tale-scroll-area__scrollbar', className)} ref={ref} {...props} />
));
StyledScrollbar.displayName = 'ScrollArea.Scrollbar';
export const Scrollbar = StyledScrollbar as typeof H.Scrollbar;

const StyledThumb = React.forwardRef<
  React.ComponentRef<typeof H.Thumb>,
  React.ComponentPropsWithoutRef<typeof H.Thumb>
>(({ className, ...props }, ref) => (
  <H.Thumb className={cx('tale-scroll-area__thumb', className)} ref={ref} {...props} />
));
StyledThumb.displayName = 'ScrollArea.Thumb';
export const Thumb = StyledThumb as typeof H.Thumb;

const StyledCorner = React.forwardRef<
  React.ComponentRef<typeof H.Corner>,
  React.ComponentPropsWithoutRef<typeof H.Corner>
>(({ className, ...props }, ref) => (
  <H.Corner className={cx('tale-scroll-area__corner', className)} ref={ref} {...props} />
));
StyledCorner.displayName = 'ScrollArea.Corner';
export const Corner = StyledCorner as typeof H.Corner;

export { Content } from './index.parts';
