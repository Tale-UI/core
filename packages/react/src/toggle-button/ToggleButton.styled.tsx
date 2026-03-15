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

type Size = 'sm' | 'md' | 'lg';

export interface ToggleButtonProps extends Omit<AriaToggleButtonProps, 'className'> {
  size?: Size | undefined;
  className?: string | undefined;
}

export const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({ size = 'md', className, ...props }, ref) => (
    <AriaToggleButton
      ref={ref}
      className={cx(`tale-toggle-button tale-toggle-button--${size}`, className)}
      {...props}
    />
  ),
);
ToggleButton.displayName = 'ToggleButton';

export interface ToggleButtonGroupProps extends Omit<AriaToggleButtonGroupProps, 'className'> {
  className?: string | undefined;
}

export const ToggleButtonGroup = React.forwardRef<HTMLDivElement, ToggleButtonGroupProps>(
  ({ className, ...props }, ref) => (
    <AriaToggleButtonGroup
      ref={ref}
      className={cx('tale-toggle-button-group', className)}
      {...props}
    />
  ),
);
ToggleButtonGroup.displayName = 'ToggleButtonGroup';
