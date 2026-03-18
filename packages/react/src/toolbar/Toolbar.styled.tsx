import * as React from 'react';
import { Toolbar } from 'react-aria-components';
import type { ToolbarProps } from 'react-aria-components';
import { cx } from '../_cx';

/**
 * A horizontal bar of grouped actions (buttons, toggles, links).
 *
 * @example
 * ```tsx
 * import { Toolbar } from '@tale-ui/react/toolbar';
 *
 * <Toolbar.Root aria-label="Formatting">
 *   <Toolbar.Group>
 *     <Toolbar.Button>Bold</Toolbar.Button>
 *     <Toolbar.Button>Italic</Toolbar.Button>
 *   </Toolbar.Group>
 *   <Toolbar.Separator />
 *   <Toolbar.Group>
 *     <Toolbar.Button>Left</Toolbar.Button>
 *     <Toolbar.Button>Center</Toolbar.Button>
 *   </Toolbar.Group>
 * </Toolbar.Root>
 * ```
 */
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
