import * as React from 'react';
import { X } from 'lucide-react';
import {
  DialogTrigger,
  Modal,
  ModalOverlay,
  Dialog,
  Heading,
  Button,
} from 'react-aria-components';
import type {
  DialogTriggerProps,
  ModalOverlayProps,
  DialogProps,
  HeadingProps,
  ButtonProps,
} from 'react-aria-components';
import { Icon } from '../icon';
import { cx } from '../_cx';

/**
 * A confirmation dialog for destructive or important actions.
 *
 * Note: `AlertDialog.Trigger` does NOT auto-apply `tale-button` — add both base and variant classes.
 * For action buttons, use standalone `Button` components.
 *
 * @example
 * ```tsx
 * import { useState } from 'react';
 * import { AlertDialog } from '@tale-ui/react/alert-dialog';
 * import { Button } from '@tale-ui/react/button';
 *
 * const [open, setOpen] = useState(false);
 *
 * <AlertDialog.Root isOpen={open} onOpenChange={setOpen}>
 *   <AlertDialog.Trigger className="tale-button tale-button--danger">
 *     Delete Item
 *   </AlertDialog.Trigger>
 *   <AlertDialog.Backdrop>
 *     <AlertDialog.Popup>
 *       <AlertDialog.Content>
 *         <AlertDialog.Title>Are you sure?</AlertDialog.Title>
 *         <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
 *         <AlertDialog.Actions>
 *           <Button variant="neutral" onPress={() => setOpen(false)}>Cancel</Button>
 *           <Button variant="danger" onPress={() => setOpen(false)}>Delete</Button>
 *         </AlertDialog.Actions>
 *       </AlertDialog.Content>
 *     </AlertDialog.Popup>
 *   </AlertDialog.Backdrop>
 * </AlertDialog.Root>
 * ```
 */
export const Root = DialogTrigger;
export type RootProps = DialogTriggerProps;

// Backdrop (ModalOverlay)
export const Backdrop = React.forwardRef<
  HTMLDivElement,
  Omit<ModalOverlayProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <ModalOverlay
    ref={ref}
    className={cx('tale-alert-dialog__backdrop', className)}
    {...props}
  />
));
Backdrop.displayName = 'AlertDialog.Backdrop';

// Popup (Modal)
export const Popup = React.forwardRef<
  HTMLDivElement,
  Omit<ModalOverlayProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <Modal
    ref={ref}
    className={cx('tale-alert-dialog__popup', className)}
    {...props}
  />
));
Popup.displayName = 'AlertDialog.Popup';

// Dialog content wrapper
export const Content = React.forwardRef<
  HTMLElement,
  Omit<DialogProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <Dialog
    ref={ref}
    role="alertdialog"
    className={cx('tale-alert-dialog__content', className)}
    {...props}
  />
));
Content.displayName = 'AlertDialog.Content';

// Title
export const Title = React.forwardRef<
  HTMLHeadingElement,
  Omit<HeadingProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <Heading
    ref={ref}
    slot="title"
    className={cx('tale-alert-dialog__title', className)}
    {...props}
  />
));
Title.displayName = 'AlertDialog.Title';

// Description
export const Description = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cx('tale-alert-dialog__description', className)}
    {...props}
  />
));
Description.displayName = 'AlertDialog.Description';

// Trigger button
export const Trigger = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <Button ref={ref} className={cx('tale-alert-dialog__trigger', className)} {...props} />
));
Trigger.displayName = 'AlertDialog.Trigger';

// Actions
export type ActionsProps = React.HTMLAttributes<HTMLDivElement> & { className?: string };

export const Actions = React.forwardRef<HTMLDivElement, ActionsProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-alert-dialog__actions', className)} {...props} />
  ),
);
Actions.displayName = 'AlertDialog.Actions';

// Close button
export const Close = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'className'> & { className?: string }
>(({ className, children, ...props }, ref) => (
  <Button ref={ref} slot="close" className={cx('tale-icon-button tale-icon-button--sm tale-button tale-button--ghost tale-alert-dialog__close', className)} {...props}>
    {children ?? <Icon icon={X} size="sm" />}
  </Button>
));
Close.displayName = 'AlertDialog.Close';
