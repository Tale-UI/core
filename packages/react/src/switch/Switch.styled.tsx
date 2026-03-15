import * as React from 'react';
import { Switch as AriaSwitch } from 'react-aria-components';
import type { SwitchProps as AriaSwitchProps } from 'react-aria-components';
import { cx } from '../_cx';

export interface SwitchRootProps extends Omit<AriaSwitchProps, 'className'> {
  className?: string | undefined;
}

export const Root = React.forwardRef<HTMLLabelElement, SwitchRootProps>(
  ({ className, ...props }, ref) => (
    <AriaSwitch ref={ref} className={cx('tale-switch', className)} {...props} />
  ),
);
Root.displayName = 'Switch.Root';

export interface SwitchThumbProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string | undefined;
}

export const Thumb = React.forwardRef<HTMLSpanElement, SwitchThumbProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-switch__thumb', className)} {...props} />
  ),
);
Thumb.displayName = 'Switch.Thumb';
