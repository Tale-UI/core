import * as React from 'react';
import { Radio as H } from '@tale-ui/react/radio';
import { RadioGroup as HGroup } from '@tale-ui/react/radio-group';
import { cx } from '../_cx';

type Size = 'sm' | 'md' | 'lg';

export interface RootProps extends React.ComponentPropsWithoutRef<typeof H.Root> {
  size?: Size;
}

export const Root = React.forwardRef<React.ComponentRef<typeof H.Root>, RootProps>(
  ({ size = 'md', className, ...props }, ref) => (
    <H.Root
      className={cx(size !== 'md' ? `tale-radio tale-radio--${size}` : 'tale-radio', className)}
      ref={ref}
      {...props}
    />
  ),
);
Root.displayName = 'Radio.Root';

export const Indicator = React.forwardRef<
  React.ComponentRef<typeof H.Indicator>,
  React.ComponentPropsWithoutRef<typeof H.Indicator>
>(({ className, ...props }, ref) => (
  <H.Indicator className={cx('tale-radio__indicator', className)} ref={ref} {...props} />
));
Indicator.displayName = 'Radio.Indicator';

export const Group = HGroup;
