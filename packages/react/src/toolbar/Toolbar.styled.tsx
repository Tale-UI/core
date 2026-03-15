import * as React from 'react';
import { Toolbar } from 'react-aria-components';
import type { ToolbarProps } from 'react-aria-components';
import { cx } from '../_cx';

// Root — wraps RA Toolbar
export const Root = React.forwardRef<
  HTMLDivElement,
  Omit<ToolbarProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <Toolbar ref={ref} className={cx('tale-toolbar', className)} {...props} />
));
Root.displayName = 'Toolbar.Root';

// Group — generic grouping div inside toolbar
export const Group = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-toolbar__group', className)} {...props} />
  ),
);
Group.displayName = 'Toolbar.Group';

// Button
export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button ref={ref} className={cx('tale-toolbar__button', className)} {...props} />
));
Button.displayName = 'Toolbar.Button';

// Link
export const Link = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <a ref={ref} className={cx('tale-toolbar__link', className)} {...props} />
));
Link.displayName = 'Toolbar.Link';

// Input
export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cx('tale-toolbar__input tale-input', className)} {...props} />
));
Input.displayName = 'Toolbar.Input';

// Separator
export const Separator = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => (
    <hr ref={ref} className={cx('tale-toolbar__separator', className)} {...props} />
  ),
);
Separator.displayName = 'Toolbar.Separator';
