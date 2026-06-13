import * as React from 'react';
import { X } from 'lucide-react';
import {
  DialogTrigger,
  Popover,
  Dialog,
  Heading,
  Button,
  OverlayArrow,
  type DialogTriggerProps,
  type PopoverProps,
  type DialogProps,
  type HeadingProps,
  type ButtonProps,
  type OverlayArrowProps,
} from 'react-aria-components';
import { Icon } from '../icon';
import { cx } from '../_cx';

/* ─── Root ─────────────────────────────────────────────────────────────────── */

/**
 * A floating panel anchored to a trigger element.
 *
 * @example
 * ```tsx
 * import { Popover } from '@tale-ui/react/popover';
 *
 * <Popover.Root>
 *   <Popover.Trigger className="tale-button tale-button--neutral tale-button--md">Open Popover</Popover.Trigger>
 *   <Popover.Popup placement="bottom" offset={8}>
 *     <Popover.Arrow />
 *     <Popover.Title>Popover Title</Popover.Title>
 *     <Popover.Description>Some helpful info.</Popover.Description>
 *   </Popover.Popup>
 * </Popover.Root>
 * ```
 */
export const Root = DialogTrigger;

/* ─── Trigger ───────────────────────────────────────────────────────────────── */

export type TriggerProps = Omit<ButtonProps, 'className'> & { className?: string };

const StyledTrigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  ({ className, ...props }, ref) => (
    <Button ref={ref} className={className as string | undefined} {...props} />
  ),
);
StyledTrigger.displayName = 'Popover.Trigger';
export const Trigger = StyledTrigger;

/* ─── Arrow ──────────────────────────────────────────────────────────────────── */

export type ArrowProps = Omit<OverlayArrowProps, 'className'> & { className?: string };

const StyledArrow = React.forwardRef<HTMLDivElement, ArrowProps>(
  ({ className, children, ...props }, ref) => (
    <OverlayArrow
      ref={ref}
      className={cx('tale-popover__arrow', className as string | undefined)}
      {...props}
    >
      {children ?? (
        <svg viewBox="0 0 8 8" aria-hidden="true">
          <path d="M0 0 L4 4 L8 0 Z" />
        </svg>
      )}
    </OverlayArrow>
  ),
);
StyledArrow.displayName = 'Popover.Arrow';
export const Arrow = StyledArrow;

/* ─── Popup ──────────────────────────────────────────────────────────────────── */

/**
 * Renders a RA Popover (positioned overlay) containing a RA Dialog.
 * Supports all RA Popover placement props (placement, offset, crossOffset, etc.).
 *
 * Any `Popover.Arrow` children are automatically hoisted out of the Dialog
 * so they render as direct children of the RA Popover (required by React Aria).
 */
export type PopupProps = Omit<PopoverProps, 'className'> &
  Pick<DialogProps, 'aria-label' | 'aria-labelledby' | 'aria-describedby'> & {
    className?: string;
  };

const StyledPopup = React.forwardRef<HTMLElement, PopupProps>(
  (
    {
      className,
      children,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      ...popoverProps
    },
    ref,
  ) => {
    // Hoist OverlayArrow out of Dialog — it must be a direct child of Popover.
    const arrowChildren: React.ReactNode[] = [];
    const dialogChildren: React.ReactNode[] = [];

    React.Children.forEach(children as React.ReactNode, (child) => {
      if (React.isValidElement(child) && child.type === StyledArrow) {
        arrowChildren.push(child);
      } else {
        dialogChildren.push(child);
      }
    });

    return (
      <Popover ref={ref} {...popoverProps}>
        {arrowChildren}
        <Dialog
          className={cx('tale-popover__popup', className as string | undefined)}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaDescribedby}
        >
          {dialogChildren}
        </Dialog>
      </Popover>
    );
  },
);
StyledPopup.displayName = 'Popover.Popup';
export const Popup = StyledPopup;

/* ─── Title ──────────────────────────────────────────────────────────────────── */

export type TitleProps = Omit<HeadingProps, 'className'> & { className?: string };

const StyledTitle = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className, slot = 'title', ...props }, ref) => (
    <Heading
      ref={ref}
      slot={slot}
      className={cx('tale-popover__title', className as string | undefined)}
      {...props}
    />
  ),
);
StyledTitle.displayName = 'Popover.Title';
export const Title = StyledTitle;

/* ─── Description ────────────────────────────────────────────────────────────── */

export type DescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & { className?: string };

const StyledDescription = React.forwardRef<HTMLParagraphElement, DescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cx('tale-popover__description', className as string | undefined)}
      {...props}
    />
  ),
);
StyledDescription.displayName = 'Popover.Description';
export const Description = StyledDescription;

/* ─── Close ──────────────────────────────────────────────────────────────────── */

/** A button that closes the popover. Must be rendered inside a Popup (Dialog). */
export type CloseProps = Omit<ButtonProps, 'className'> & { className?: string };

const StyledClose = React.forwardRef<HTMLButtonElement, CloseProps>(
  ({ className, slot = 'close', children, ...props }, ref) => (
    <Button
      ref={ref}
      slot={slot}
      className={cx('tale-icon-button tale-icon-button--sm tale-button tale-button--ghost tale-popover__close', className as string | undefined)}
      {...props}
    >
      {children ?? <Icon icon={X} size="sm" />}
    </Button>
  ),
);
StyledClose.displayName = 'Popover.Close';
export const Close = StyledClose;

/* ─── Re-export prop types ───────────────────────────────────────────────────── */
export type { DialogTriggerProps as RootProps };
