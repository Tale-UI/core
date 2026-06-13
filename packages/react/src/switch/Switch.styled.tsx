import * as React from 'react';
import { Switch as AriaSwitch } from 'react-aria-components';
import type { SwitchProps as AriaSwitchProps } from 'react-aria-components';
import { cx } from '../_cx';

export interface SwitchRootProps extends Omit<AriaSwitchProps, 'className'> {
  className?: string | undefined;
}

/**
 * A toggle switch with thumb and label.
 *
 * @status deprecated
 * @deprecated Use SwitchField from `@tale-ui/react/switch-field` instead — it adds built-in description, error message, and validation support. Switch remains functional but the underlying React Aria Switch is deprecated upstream.
 *
 * @example
 * ```tsx
 * import { Switch } from '@tale-ui/react/switch';
 *
 * <Switch.Root>
 *   <Switch.Thumb />
 *   Enable notifications
 * </Switch.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLLabelElement, SwitchRootProps>(
  ({ className, ...props }, ref) => (
    <AriaSwitch ref={ref} className={cx('tale-switch', className)} {...props} />
  ),
);
Root.displayName = 'Switch.Root';

export interface SwitchThumbProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string | undefined;
}

export const Thumb = React.forwardRef<HTMLSpanElement, SwitchThumbProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-switch__thumb', className)} {...props} />
  ),
);
Thumb.displayName = 'Switch.Thumb';

/* ─── Visual ──────────────────────────────────────────────────────────────── */

export interface SwitchVisualProps extends Omit<
  React.ComponentPropsWithoutRef<'span'>,
  'className'
> {
  /** Whether the switch visual appears on/checked. */
  checked?: boolean;
  /** Additional CSS class name. */
  className?: string;
}

/**
 * Render-only switch track + thumb **without** React Aria behaviour.
 * Use only when building new components where behaviour is provided externally.
 * Do NOT use in application UI — use Switch.Root instead.
 *
 * @example
 * ```tsx
 * <SettingsSummary>
 *   <Switch.Visual checked={isEnabled} />
 *   Feature enabled
 * </SettingsSummary>
 * ```
 */
export const Visual = React.forwardRef<HTMLSpanElement, SwitchVisualProps>(
  ({ checked, className, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden="true"
      data-selected={checked || undefined}
      className={cx('tale-switch', className)}
      {...props}
    >
      <span className="tale-switch__thumb" />
    </span>
  ),
);
Visual.displayName = 'Switch.Visual';
