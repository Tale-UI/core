import * as React from 'react';
import { cx } from '../_cx';

type Size = 'sm' | 'md' | 'lg' | 'xl';

export interface RootProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: Size | undefined;
}

export const Root = React.forwardRef<HTMLSpanElement, RootProps>(
  ({ size = 'md', className, ...props }, ref) => (
    <span ref={ref} className={cx(`tale-avatar tale-avatar--${size}`, className)} {...props} />
  ),
);
Root.displayName = 'Avatar.Root';

export const Image = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, ...props }, ref) => (
    <img ref={ref} className={cx('tale-avatar__image', className)} {...props} />
  ),
);
Image.displayName = 'Avatar.Image';

export const Fallback = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-avatar__fallback', className)} {...props} />
  ),
);
Fallback.displayName = 'Avatar.Fallback';
