import * as React from 'react';
import { Input as H } from '@tale-ui/react/input';
import { cx } from '../_cx';

type Size = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.ComponentPropsWithoutRef<typeof H>, 'size'> {
  size?: Size;
}

export const Input = React.forwardRef<React.ComponentRef<typeof H>, InputProps>(
  ({ size = 'md', className, ...props }, ref) => (
    <H
      className={cx(size !== 'md' ? `tale-input tale-input--${size}` : 'tale-input', className)}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
