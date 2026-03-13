import * as React from 'react';
import { PreviewCard as H } from '@tale-ui/react/preview-card';
import { cx } from '../_cx';

export const Root = H.Root;
export const Trigger = H.Trigger;
export const Portal = H.Portal;
export const Positioner = H.Positioner;
export const Backdrop = H.Backdrop;
export const Viewport = H.Viewport;
export const createHandle = H.createHandle;
export const Handle = H.Handle;

export const Arrow = React.forwardRef<
  React.ComponentRef<typeof H.Arrow>,
  React.ComponentPropsWithoutRef<typeof H.Arrow>
>(({ className, ...props }, ref) => (
  <H.Arrow className={cx('tale-preview-card__arrow', className)} ref={ref} {...props} />
));
Arrow.displayName = 'PreviewCard.Arrow';

export const Popup = React.forwardRef<
  React.ComponentRef<typeof H.Popup>,
  React.ComponentPropsWithoutRef<typeof H.Popup>
>(({ className, ...props }, ref) => (
  <H.Popup className={cx('tale-preview-card__popup', className)} ref={ref} {...props} />
));
Popup.displayName = 'PreviewCard.Popup';
