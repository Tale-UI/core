import * as React from 'react';
import { cx } from '../_cx';

type Size = 'sm' | 'md';

export interface SelectNativeProps extends Omit<React.ComponentPropsWithoutRef<'select'>, 'className' | 'size'> {
  /** Field size. Defaults to 'md'. */
  size?: Size | undefined;
  className?: string | undefined;
}

/**
 * A styled native `<select>` element matching the Input field appearance.
 *
 * @example
 * ```tsx
 * import { SelectNative } from '@tale-ui/react/select-native';
 *
 * <SelectNative>
 *   <option value="a">Option A</option>
 *   <option value="b">Option B</option>
 * </SelectNative>
 *
 * <SelectNative disabled>
 *   <option>Disabled</option>
 * </SelectNative>
 * ```
 */
export const SelectNative = React.forwardRef<HTMLSelectElement, SelectNativeProps>(
  ({ size = 'md', className, ...props }, ref) => (
    <select
      ref={ref}
      className={cx(`tale-select-native tale-select-native--${size}`, className)}
      {...props}
    />
  ),
);
SelectNative.displayName = 'SelectNative';
