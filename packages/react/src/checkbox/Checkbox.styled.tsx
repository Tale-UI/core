import * as React from 'react';
import { Checkbox as AriaCheckbox } from 'react-aria-components';
import type { CheckboxProps as AriaCheckboxProps } from 'react-aria-components';
import { cx } from '../_cx';
import { useSize } from '../_SizeContext';

type Size = 'sm' | 'md';

export interface CheckboxRootProps extends Omit<AriaCheckboxProps, 'className'> {
  /** Size of the checkbox indicator. Defaults to `'md'`. Inherits from CheckboxGroup `size` when omitted.
   * The `'sm'` variant is for edge-cases only (dense tables, compact toolbars) — prefer `'md'` in most contexts. */
  size?: Size | undefined;
  className?: string | undefined;
}

/**
 * A checkbox input with indicator and label.
 *
 * @example
 * ```tsx
 * import { Checkbox } from '@tale-ui/react/checkbox';
 * import { Icon } from '@tale-ui/react/icon';
 * import { Check } from 'lucide-react';
 *
 * <Checkbox.Root>
 *   <Checkbox.Indicator>
 *     <Icon icon={Check} size="sm" />
 *   </Checkbox.Indicator>
 *   Accept terms and conditions
 * </Checkbox.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLLabelElement, CheckboxRootProps>(
  ({ size: sizeProp, className, ...props }, ref) => {
    const size = useSize(sizeProp, 'md');
    return (
      <AriaCheckbox
        ref={ref}
        className={cx(size !== 'md' ? `tale-checkbox tale-checkbox--${size}` : 'tale-checkbox', className)}
        {...props}
      />
    );
  },
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

/* ─── Visual ──────────────────────────────────────────────────────────────── */

export interface CheckboxVisualProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className'> {
  /** Whether the checkbox visual appears checked. */
  checked?: boolean;
  /** Size of the checkbox visual. Defaults to `'md'`. */
  size?: Size | undefined;
  /** Additional CSS class name. */
  className?: string;
}

/**
 * Render-only checkbox indicator **without** React Aria behaviour.
 * Use only when building new components where behaviour is provided externally.
 * Do NOT use in application UI — use Checkbox.Root instead.
 *
 * @example
 * ```tsx
 * <Menu.Item>
 *   <Checkbox.Visual checked={isSelected}>
 *     <Icon icon={Check} size="sm" />
 *   </Checkbox.Visual>
 *   Enable notifications
 * </Menu.Item>
 * ```
 */
export const Visual = React.forwardRef<HTMLSpanElement, CheckboxVisualProps>(
  ({ checked, size = 'md', className, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden="true"
      data-selected={checked || undefined}
      className={cx(size !== 'md' ? `tale-checkbox__indicator tale-checkbox__indicator--${size}` : 'tale-checkbox__indicator', className)}
      {...props}
    />
  ),
);
Visual.displayName = 'Checkbox.Visual';
