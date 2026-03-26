'use client';
import * as React from 'react';
import { CheckboxGroup as AriaCheckboxGroup } from 'react-aria-components';
import type { CheckboxGroupProps as AriaCheckboxGroupProps } from 'react-aria-components';
import { cx } from '../_cx';

export interface CheckboxGroupProps extends Omit<AriaCheckboxGroupProps, 'className'> {
  className?: string | undefined;
  /** An accessible label for the checkbox group. */
  label?: string;
  /** A description for the checkbox group. Displays below the group. */
  description?: string;
  /** Layout orientation. Sets `data-orientation` for CSS styling. */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Groups a set of checkboxes with form validation and accessibility support.
 * Wraps React Aria's CheckboxGroup.
 *
 * @example
 * ```tsx
 * import { CheckboxGroup } from '@tale-ui/react/checkbox-group';
 * import { Checkbox } from '@tale-ui/react/checkbox';
 * import { Icon } from '@tale-ui/react/icon';
 * import { Check } from 'lucide-react';
 *
 * <CheckboxGroup label="Favorite fruits">
 *   <Checkbox.Root value="apple">
 *     <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
 *     Apple
 *   </Checkbox.Root>
 *   <Checkbox.Root value="banana">
 *     <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
 *     Banana
 *   </Checkbox.Root>
 * </CheckboxGroup>
 * ```
 */
export const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  ({ className, orientation, ...props }, ref) => (
    <AriaCheckboxGroup
      ref={ref}
      className={cx('tale-checkbox-group', className)}
      data-orientation={orientation}
      {...props}
    />
  ),
);
CheckboxGroup.displayName = 'CheckboxGroup';

export namespace CheckboxGroup {
  export type Props = CheckboxGroupProps;
}
