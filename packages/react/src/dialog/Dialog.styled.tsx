import * as React from 'react';
import {
  DialogTrigger,
  Modal,
  ModalOverlay,
  Dialog,
  Heading,
  Button,
  type DialogTriggerProps,
  type ModalOverlayProps,
  type DialogProps,
  type HeadingProps,
  type ButtonProps,
} from 'react-aria-components';
import { cx } from '../_cx';

/* ─── Root ─────────────────────────────────────────────────────────────────── */

/**
 * A modal dialog overlay with backdrop, title, description, and close button.
 *
 * @example
 * ```tsx
 * import { Dialog } from '@tale-ui/react/dialog';
 * import { Button } from '@tale-ui/react/button';
 *
 * <Dialog.Root>
 *   <Dialog.Trigger>Open Dialog</Dialog.Trigger>
 *   <Dialog.Backdrop>
 *     <Dialog.Popup>
 *       <Dialog.Title>Confirm action</Dialog.Title>
 *       <Dialog.Description>Are you sure?</Dialog.Description>
 *       <Dialog.Close>Close</Dialog.Close>
 *     </Dialog.Popup>
 *   </Dialog.Backdrop>
 * </Dialog.Root>
 * ```
 */
export const Root = DialogTrigger;

/* ─── Trigger ───────────────────────────────────────────────────────────────── */

export type TriggerProps = Omit<ButtonProps, 'className'> & { className?: string };

const StyledTrigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  ({ className, ...props }, ref) => (
    <Button ref={ref} className={cx('tale-button', className as string | undefined)} {...props} />
  ),
);
StyledTrigger.displayName = 'Dialog.Trigger';
export const Trigger = StyledTrigger;

/* ─── Backdrop ───────────────────────────────────────────────────────────────── */

export type BackdropProps = Omit<ModalOverlayProps, 'className'> & { className?: string };

const StyledBackdrop = React.forwardRef<HTMLDivElement, BackdropProps>(
  ({ className, ...props }, ref) => (
    <ModalOverlay ref={ref} className={cx('tale-dialog__backdrop', className as string | undefined)} {...props} />
  ),
);
StyledBackdrop.displayName = 'Dialog.Backdrop';
export const Backdrop = StyledBackdrop;

/* ─── Popup ──────────────────────────────────────────────────────────────────── */

/** Renders a Modal containing a RA Dialog element. Wrap Title, Description, Close, etc. inside. */
export type PopupProps = Omit<DialogProps, 'className'> & {
  className?: string;
  /**
   * Additional props forwarded to the wrapping Modal element.
   * Note: the modal itself is unstyled – style the dialog content via className.
   */
  modalProps?: Omit<ModalOverlayProps, 'children'>;
};

const StyledPopup = React.forwardRef<HTMLElement, PopupProps>(
  ({ className, modalProps, children, ...props }, ref) => (
    <Modal {...modalProps}>
      <Dialog
        ref={ref}
        className={cx('tale-dialog__popup', className as string | undefined)}
        {...props}
      >
        {children}
      </Dialog>
    </Modal>
  ),
);
StyledPopup.displayName = 'Dialog.Popup';
export const Popup = StyledPopup;

/* ─── Title ──────────────────────────────────────────────────────────────────── */

export type TitleProps = Omit<HeadingProps, 'className'> & { className?: string };

const StyledTitle = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className, slot = 'title', ...props }, ref) => (
    <Heading
      ref={ref}
      slot={slot}
      className={cx('tale-dialog__title', className as string | undefined)}
      {...props}
    />
  ),
);
StyledTitle.displayName = 'Dialog.Title';
export const Title = StyledTitle;

/* ─── Description ────────────────────────────────────────────────────────────── */

export type DescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & { className?: string };

const StyledDescription = React.forwardRef<HTMLParagraphElement, DescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cx('tale-dialog__description', className as string | undefined)}
      {...props}
    />
  ),
);
StyledDescription.displayName = 'Dialog.Description';
export const Description = StyledDescription;

/* ─── Close ──────────────────────────────────────────────────────────────────── */

/**
 * A button that closes the dialog. Must be rendered inside a `Dialog` (or `Popup`).
 * RA's `<Button slot="close">` automatically closes the enclosing dialog.
 */
export type CloseProps = Omit<ButtonProps, 'className'> & { className?: string };

const StyledClose = React.forwardRef<HTMLButtonElement, CloseProps>(
  ({ className, slot = 'close', ...props }, ref) => (
    <Button
      ref={ref}
      slot={slot}
      className={cx('tale-dialog__close', className as string | undefined)}
      {...props}
    />
  ),
);
StyledClose.displayName = 'Dialog.Close';
export const Close = StyledClose;

/* ─── Re-export prop types ───────────────────────────────────────────────────── */
export type { DialogTriggerProps as RootProps };
