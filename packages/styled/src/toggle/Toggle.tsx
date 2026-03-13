import * as React from 'react';
import { Toggle as H } from '@tale-ui/react/toggle';
import { ToggleGroup as HGroup } from '@tale-ui/react/toggle-group';
import { cx } from '../_cx';

type Size = 'sm' | 'md' | 'lg';

export interface ToggleProps extends React.ComponentPropsWithoutRef<typeof H> {
  size?: Size;
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
