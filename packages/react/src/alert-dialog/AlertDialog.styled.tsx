import * as React from 'react';
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
import { cx } from '../_cx';

// Root / Trigger controller
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

// Close button
export const Close = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <Button ref={ref} slot="close" className={cx('tale-alert-dialog__close', className)} {...props} />
));
Close.displayName = 'AlertDialog.Close';
