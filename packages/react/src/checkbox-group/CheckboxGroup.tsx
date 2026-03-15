'use client';
import * as React from 'react';
import { CheckboxGroup as AriaCheckboxGroup } from 'react-aria-components';
import type { CheckboxGroupProps as AriaCheckboxGroupProps } from 'react-aria-components';
import { cx } from '../_cx';

export interface CheckboxGroupProps extends Omit<AriaCheckboxGroupProps, 'className'> {
  className?: string | undefined;
}

/**
 * Groups a set of checkboxes with form validation and accessibility support.
 * Wraps React Aria's CheckboxGroup.
 */
export const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  ({ className, ...props }, ref) => (
    <AriaCheckboxGroup
      ref={ref}
      className={cx('tale-checkbox-group', className)}
      {...props}
    />
  ),
);
CheckboxGroup.displayName = 'CheckboxGroup';

export namespace CheckboxGroup {
  export type Props = CheckboxGroupProps;
}
