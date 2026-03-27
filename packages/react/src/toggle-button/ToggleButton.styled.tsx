import * as React from 'react';
import {
  ToggleButton as AriaToggleButton,
  ToggleButtonGroup as AriaToggleButtonGroup,
} from 'react-aria-components';
import type {
  ToggleButtonProps as AriaToggleButtonProps,
  ToggleButtonGroupProps as AriaToggleButtonGroupProps,
} from 'react-aria-components';
import { cx } from '../_cx';
import { SizeContext, useSize } from '../_SizeContext';

type Size = 'sm' | 'md' | 'lg';

export interface ToggleButtonProps extends Omit<AriaToggleButtonProps, 'className'> {
  size?: Size | undefined;
  className?: string | undefined;
}

/**
 * A button that can be toggled on and off.
 *
 * @example
 * ```tsx
 * import { ToggleButton } from '@tale-ui/react/toggle-button';
 *
 * <ToggleButton size="md">Toggle me</ToggleButton>
 * ```
 */
export const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({ size: sizeProp, className, ...props }, ref) => {
    const size = useSize(sizeProp, 'md');
    return (
      <AriaToggleButton
        ref={ref}
        className={cx(`tale-toggle-button tale-toggle-button--${size}`, className)}
        {...props}
      />
    );
  },
);
ToggleButton.displayName = 'ToggleButton';

export interface ToggleButtonGroupProps extends Omit<AriaToggleButtonGroupProps, 'className'> {
  /** Size propagated to child ToggleButton components. */
  size?: Size | undefined;
  className?: string | undefined;
}

/**
 * A group of toggle buttons with single or multiple selection.
 *
 * @example
 * ```tsx
 * import { ToggleButton, ToggleButtonGroup } from '@tale-ui/react/toggle-button';
 *
 * <ToggleButtonGroup aria-label="Text alignment" size="sm">
 *   <ToggleButton id="left">Left</ToggleButton>
 *   <ToggleButton id="center">Center</ToggleButton>
 *   <ToggleButton id="right">Right</ToggleButton>
 * </ToggleButtonGroup>
 * ```
 */
export const ToggleButtonGroup = React.forwardRef<HTMLDivElement, ToggleButtonGroupProps>(
  ({ size, className, ...props }, ref) => {
    const group = (
      <AriaToggleButtonGroup
        ref={ref}
        className={cx('tale-toggle-button-group', className)}
        {...props}
      />
    );
    return size ? <SizeContext.Provider value={size}>{group}</SizeContext.Provider> : group;
  },
);
ToggleButtonGroup.displayName = 'ToggleButtonGroup';

/* ─── Visual ──────────────────────────────────────────────────────────────── */

export interface ToggleButtonVisualProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className'> {
  /** Whether the toggle visual appears pressed/selected. */
  checked?: boolean;
  /** Size variant. */
  size?: Size | undefined;
  /** Additional CSS class name. */
  className?: string;
}

/**
 * Render-only toggle button **without** React Aria behaviour.
 * Use only when building new components where behaviour is provided externally.
 * Do NOT use in application UI — use ToggleButton instead.
 *
 * @example
 * ```tsx
 * <DragItem>
 *   <ToggleButtonVisual checked={isActive} size="sm">Bold</ToggleButtonVisual>
 * </DragItem>
 * ```
 */
export const ToggleButtonVisual = React.forwardRef<HTMLSpanElement, ToggleButtonVisualProps>(
  ({ checked, size = 'md', className, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden="true"
      data-selected={checked || undefined}
      className={cx(`tale-toggle-button tale-toggle-button--${size}`, className)}
      {...props}
    />
  ),
);
ToggleButtonVisual.displayName = 'ToggleButton.Visual';
