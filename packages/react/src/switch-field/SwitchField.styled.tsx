import * as React from 'react';
import {
  SwitchField as AriaSwitchField,
  SwitchButton as AriaSwitchButton,
  Text as AriaText,
  FieldError as AriaFieldError,
} from 'react-aria-components';
import type {
  SwitchFieldProps as AriaSwitchFieldProps,
  SwitchButtonProps as AriaSwitchButtonProps,
} from 'react-aria-components';
import { cx } from '../_cx';

export interface SwitchFieldRootProps extends Omit<AriaSwitchFieldProps, 'className'> {
  className?: string | undefined;
}

/**
 * A toggle switch with built-in support for a description and validation error message.
 * Replaces `Switch` (deprecated upstream in React Aria Components 1.18).
 *
 * @status stable
 *
 * @example
 * ```tsx
 * import { SwitchField } from '@tale-ui/react/switch-field';
 *
 * <SwitchField.Root>
 *   <SwitchField.Button>
 *     <SwitchField.Thumb />
 *     Enable notifications
 *   </SwitchField.Button>
 *   <SwitchField.Description>
 *     We'll send you updates about your account.
 *   </SwitchField.Description>
 *   <SwitchField.Error>Notifications must be enabled to continue.</SwitchField.Error>
 * </SwitchField.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, SwitchFieldRootProps>(
  ({ className, ...props }, ref) => (
    <AriaSwitchField ref={ref} className={cx('tale-switch-field', className)} {...props} />
  ),
);
Root.displayName = 'SwitchField.Root';

export interface SwitchFieldButtonProps extends Omit<AriaSwitchButtonProps, 'className'> {
  className?: string | undefined;
}

export const Button = React.forwardRef<HTMLLabelElement, SwitchFieldButtonProps>(
  ({ className, ...props }, ref) => (
    <AriaSwitchButton ref={ref} className={cx('tale-switch-field__button', className)} {...props} />
  ),
);
Button.displayName = 'SwitchField.Button';

export interface SwitchFieldThumbProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string | undefined;
}

export const Thumb = React.forwardRef<HTMLSpanElement, SwitchFieldThumbProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-switch-field__thumb', className)} {...props} />
  ),
);
Thumb.displayName = 'SwitchField.Thumb';

export interface SwitchFieldDescriptionProps extends Omit<
  React.ComponentPropsWithoutRef<typeof AriaText>,
  'className'
> {
  className?: string | undefined;
}

export const Description = React.forwardRef<HTMLElement, SwitchFieldDescriptionProps>(
  ({ className, ...props }, ref) => (
    <AriaText
      ref={ref}
      slot="description"
      className={cx('tale-switch-field__description', className)}
      {...props}
    />
  ),
);
Description.displayName = 'SwitchField.Description';

export interface SwitchFieldErrorProps extends Omit<
  React.ComponentPropsWithoutRef<typeof AriaFieldError>,
  'className'
> {
  className?: string | undefined;
}

export const Error = React.forwardRef<HTMLElement, SwitchFieldErrorProps>(
  ({ className, ...props }, ref) => (
    <AriaFieldError ref={ref} className={cx('tale-switch-field__error', className)} {...props} />
  ),
);
Error.displayName = 'SwitchField.Error';
