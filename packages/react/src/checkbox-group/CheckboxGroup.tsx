'use client';
import * as React from 'react';
import { CheckboxGroup as AriaCheckboxGroup } from 'react-aria-components';
import type { CheckboxGroupProps as AriaCheckboxGroupProps } from 'react-aria-components';
import { cx } from '../_cx';
import { SizeContext } from '../_SizeContext';

export interface CheckboxGroupProps extends Omit<AriaCheckboxGroupProps, 'className'> {
  className?: string | undefined;
  /** An accessible label for the checkbox group. */
  label?: string;
  /** A description for the checkbox group. Displays below the group. */
  description?: string;
  /** Layout orientation. Sets `data-orientation` for CSS styling. */
  orientation?: 'horizontal' | 'vertical';
  /** Propagates size to all child CheckboxField.Root components. */
  size?: 'sm' | 'md';
}

/**
 * Groups a set of checkboxes with form validation and accessibility support.
 * Wraps React Aria's CheckboxGroup.
 *
 * @example
 * ```tsx
 * import { CheckboxGroup } from '@tale-ui/react/checkbox-group';
 * import { CheckboxField } from '@tale-ui/react/checkbox-field';
 * import { Icon } from '@tale-ui/react/icon';
 * import { Check } from 'lucide-react';
 *
 * <CheckboxGroup label="Favorite fruits">
 *   <CheckboxField.Root value="apple">
 *     <CheckboxField.Button>
 *       <CheckboxField.Indicator><Icon icon={Check} size="sm" /></CheckboxField.Indicator>
 *       Apple
 *     </CheckboxField.Button>
 *   </CheckboxField.Root>
 *   <CheckboxField.Root value="banana">
 *     <CheckboxField.Button>
 *       <CheckboxField.Indicator><Icon icon={Check} size="sm" /></CheckboxField.Indicator>
 *       Banana
 *     </CheckboxField.Button>
 *   </CheckboxField.Root>
 * </CheckboxGroup>
 * ```
 */
export const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  ({ className, orientation, size, ...props }, ref) => {
    const group = (
      <AriaCheckboxGroup
        ref={ref}
        className={cx('tale-checkbox-group', className)}
        data-orientation={orientation}
        {...props}
      />
    );
    return size ? <SizeContext.Provider value={size}>{group}</SizeContext.Provider> : group;
  },
);
CheckboxGroup.displayName = 'CheckboxGroup';

export namespace CheckboxGroup {
  export type Props = CheckboxGroupProps;
}
