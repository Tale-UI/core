import * as React from 'react';
import * as H from './index.parts';
import { RadioGroup as HGroup } from '../radio-group/RadioGroup';
import { cx } from '../_cx';

type Size = 'sm' | 'md' | 'lg';

export interface RootProps extends React.ComponentPropsWithoutRef<typeof H.Root> {
  size?: Size | undefined;
}

const StyledRoot = React.forwardRef<React.ComponentRef<typeof H.Root>, RootProps>(
  ({ size = 'md', className, ...props }, ref) => (
    <H.Root
      className={cx(size !== 'md' ? `tale-radio tale-radio--${size}` : 'tale-radio', className)}
      ref={ref}
      {...props}
    />
  ),
);
StyledRoot.displayName = 'Radio.Root';
export const Root = StyledRoot;

export const Indicator = React.forwardRef<
  React.ComponentRef<typeof H.Indicator>,
  React.ComponentPropsWithoutRef<typeof H.Indicator>
>(({ className, ...props }, ref) => (
  <H.Indicator className={cx('tale-radio__indicator', className)} ref={ref} {...props} />
));
Indicator.displayName = 'Radio.Indicator';

export const Group = HGroup;
