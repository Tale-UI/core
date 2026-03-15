import * as React from 'react';
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
} from 'react-aria-components';
import type {
  RadioProps as AriaRadioProps,
  RadioGroupProps as AriaRadioGroupProps,
} from 'react-aria-components';
import { cx } from '../_cx';

type Size = 'sm' | 'md' | 'lg';

export interface RadioRootProps extends Omit<AriaRadioProps, 'className'> {
  size?: Size | undefined;
  className?: string | undefined;
}

export const Root = React.forwardRef<HTMLLabelElement, RadioRootProps>(
  ({ size, className, ...props }, ref) => (
    <AriaRadio
      ref={ref}
      className={cx(size && size !== 'md' ? `tale-radio tale-radio--${size}` : 'tale-radio', className)}
      {...props}
    />
  ),
);
Root.displayName = 'Radio.Root';

export interface RadioIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string | undefined;
}

export const Indicator = React.forwardRef<HTMLSpanElement, RadioIndicatorProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-radio__indicator', className)} {...props} />
  ),
);
Indicator.displayName = 'Radio.Indicator';

export interface RadioGroupProps extends Omit<AriaRadioGroupProps, 'className'> {
  className?: string | undefined;
}

export const Group = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, ...props }, ref) => (
    <AriaRadioGroup ref={ref} className={cx('tale-radio-group', className)} {...props} />
  ),
);
Group.displayName = 'Radio.Group';
