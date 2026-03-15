import * as React from 'react';
import { Checkbox as AriaCheckbox } from 'react-aria-components';
import type { CheckboxProps as AriaCheckboxProps } from 'react-aria-components';
import { cx } from '../_cx';

export interface CheckboxRootProps extends Omit<AriaCheckboxProps, 'className'> {
  className?: string | undefined;
}

export const Root = React.forwardRef<HTMLLabelElement, CheckboxRootProps>(
  ({ className, ...props }, ref) => (
    <AriaCheckbox ref={ref} className={cx('tale-checkbox', className)} {...props} />
  ),
);
Root.displayName = 'Checkbox.Root';

export interface CheckboxIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string | undefined;
}

export const Indicator = React.forwardRef<HTMLSpanElement, CheckboxIndicatorProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-checkbox__indicator', className)} {...props} />
  ),
);
Indicator.displayName = 'Checkbox.Indicator';
