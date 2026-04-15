import * as React from 'react';
import { cx } from '../_cx';

// ── Root ────────────────────────────────────────────────────────────────────

export interface RootProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * A horizontal flex container that groups an input with leading and/or trailing
 * visual addons (text prefixes, currency symbols, action buttons, etc.).
 * Compose with `Input.Root` and `InputGroup.Addon`.
 *
 * @example
 * ```tsx
 * import { InputGroup } from '@tale-ui/react/input-group';
 * import { Input } from '@tale-ui/react/input';
 *
 * // Leading text addon
 * <InputGroup.Root>
 *   <InputGroup.Addon position="leading">https://</InputGroup.Addon>
 *   <Input.Root>
 *     <Input.Label>Website</Input.Label>
 *     <Input.Input placeholder="example.com" />
 *   </Input.Root>
 * </InputGroup.Root>
 *
 * // Trailing button addon
 * <InputGroup.Root>
 *   <Input.Root>
 *     <Input.Label>Referral code</Input.Label>
 *     <Input.Input placeholder="Enter code" />
 *   </Input.Root>
 *   <InputGroup.Addon position="trailing">
 *     Copy
 *   </InputGroup.Addon>
 * </InputGroup.Root>
 *
 * // Both leading and trailing
 * <InputGroup.Root>
 *   <InputGroup.Addon position="leading">$</InputGroup.Addon>
 *   <Input.Root>
 *     <Input.Input placeholder="0.00" />
 *   </Input.Root>
 *   <InputGroup.Addon position="trailing">.00</InputGroup.Addon>
 * </InputGroup.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cx('tale-input-group', className)}
      {...props}
    />
  ),
);
Root.displayName = 'InputGroup.Root';

// ── Addon ───────────────────────────────────────────────────────────────────

export interface AddonProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Which side of the input this addon attaches to.
   * Determines border-radius and border-removal direction.
   * @default 'leading'
   */
  position?: 'leading' | 'trailing';
}

/**
 * A styled addon slot that attaches flush to either side of an input field.
 * Commonly used for URL prefixes, currency symbols, units, or inline actions.
 *
 * @example
 * ```tsx
 * <InputGroup.Addon position="leading">$</InputGroup.Addon>
 * <InputGroup.Addon position="trailing">.com</InputGroup.Addon>
 * ```
 */
export const Addon = React.forwardRef<HTMLSpanElement, AddonProps>(
  ({ position = 'leading', className, ...props }, ref) => (
    <span
      ref={ref}
      className={cx(
        position === 'trailing'
          ? 'tale-input-group__addon tale-input-group__addon--trailing'
          : 'tale-input-group__addon tale-input-group__addon--leading',
        className,
      )}
      {...props}
    />
  ),
);
Addon.displayName = 'InputGroup.Addon';
