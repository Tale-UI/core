import * as React from 'react';
import { Switch as AriaSwitch } from 'react-aria-components';
import type { SwitchProps as AriaSwitchProps } from 'react-aria-components';
import { cx } from '../_cx';
import { useSize } from '../_SizeContext';

type Size = 'sm' | 'md';

export interface SwitchRootProps extends Omit<AriaSwitchProps, 'className'> {
  /** Size variant. */
  size?: Size | undefined;
  /** Slim track variant with reduced height. */
  slim?: boolean | undefined;
  className?: string | undefined;
}

/**
 * A toggle switch with thumb and label.
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
  ({ size: sizeProp, slim, className, ...props }, ref) => {
    const size = useSize(sizeProp, 'md') as Size;
    const classes = ['tale-switch'];
    if (size === 'sm') classes.push('tale-switch--sm');
    if (slim) classes.push('tale-switch--slim');
    return (
      <AriaSwitch ref={ref} className={cx(classes.join(' '), className)} {...props} />
    );
  },
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

export interface SwitchVisualProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className'> {
  /** Whether the switch visual appears on/checked. */
  checked?: boolean;
  /** Size variant. */
  size?: Size | undefined;
  /** Slim track variant with reduced height. */
  slim?: boolean | undefined;
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
  ({ checked, size: sizeProp, slim, className, ...props }, ref) => {
    const classes = ['tale-switch'];
    if (sizeProp === 'sm') classes.push('tale-switch--sm');
    if (slim) classes.push('tale-switch--slim');
    return (
      <span
        ref={ref}
        aria-hidden="true"
        data-selected={checked || undefined}
        className={cx(classes.join(' '), className)}
        {...props}
      >
        <span className="tale-switch__thumb" />
      </span>
    );
  },
);
Visual.displayName = 'Switch.Visual';
