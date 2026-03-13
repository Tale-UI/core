import * as React from 'react';
import { Button as H } from './Button';
import type { ButtonProps as HProps } from './Button';
import { cx } from '../_cx';

type Variant = 'primary' | 'neutral' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends HProps {
  variant?: Variant | undefined;
  size?: Size | undefined;
}

export const Button = React.forwardRef<React.ComponentRef<typeof H>, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => (
    <H
      className={cx(`tale-button tale-button--${variant} tale-button--${size}`, className)}
      ref={ref}
      {...props}
    />
  ),
);
Button.displayName = 'Button';
