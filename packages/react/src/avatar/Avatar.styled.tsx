import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';

type Size = 'sm' | 'md' | 'lg' | 'xl';

export interface RootProps extends React.ComponentPropsWithoutRef<typeof H.Root> {
  size?: Size | undefined;
}

export const Root = React.forwardRef<React.ComponentRef<typeof H.Root>, RootProps>(
  ({ size = 'md', className, ...props }, ref) => (
    <H.Root className={cx(`tale-avatar tale-avatar--${size}`, className)} ref={ref} {...props} />
  ),
);
Root.displayName = 'Avatar.Root';

export const Image = React.forwardRef<
  React.ComponentRef<typeof H.Image>,
  React.ComponentPropsWithoutRef<typeof H.Image>
>(({ className, ...props }, ref) => (
  <H.Image className={cx('tale-avatar__image', className)} ref={ref} {...props} />
));
Image.displayName = 'Avatar.Image';

export const Fallback = React.forwardRef<
  React.ComponentRef<typeof H.Fallback>,
  React.ComponentPropsWithoutRef<typeof H.Fallback>
>(({ className, ...props }, ref) => (
  <H.Fallback className={cx('tale-avatar__fallback', className)} ref={ref} {...props} />
));
Fallback.displayName = 'Avatar.Fallback';
