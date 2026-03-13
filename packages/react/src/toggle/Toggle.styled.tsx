import * as React from 'react';
import { Toggle as H } from './Toggle';
import { ToggleGroup as HGroup } from '../toggle-group/ToggleGroup';
import { cx } from '../_cx';

type Size = 'sm' | 'md' | 'lg';

export interface ToggleProps extends React.ComponentPropsWithoutRef<typeof H> {
  size?: Size | undefined;
}

export const Toggle = React.forwardRef<React.ComponentRef<typeof H>, ToggleProps>(
  ({ size = 'md', className, ...props }, ref) => (
    <H
      className={cx(`tale-toggle tale-toggle--${size}`, className)}
      ref={ref}
      {...props}
    />
  ),
);
Toggle.displayName = 'Toggle';

export const ToggleGroup = React.forwardRef<
  React.ComponentRef<typeof HGroup>,
  React.ComponentPropsWithoutRef<typeof HGroup>
>(({ className, ...props }, ref) => (
  <HGroup className={cx('tale-toggle-group', className)} ref={ref} {...props} />
));
ToggleGroup.displayName = 'ToggleGroup';
