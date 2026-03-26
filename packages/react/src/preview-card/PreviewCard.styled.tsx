import * as React from 'react';
import {
  DialogTrigger,
  Popover,
  Dialog,
  Button,
  OverlayArrow,
} from 'react-aria-components';
import type {
  DialogTriggerProps,
  PopoverProps,
  DialogProps,
  ButtonProps,
  OverlayArrowProps,
} from 'react-aria-components';
import { cx } from '../_cx';

/**
 * A hover-triggered card that shows a preview of linked content.
 *
 * @example
 * ```tsx
 * import { PreviewCard } from '@tale-ui/react/preview-card';
 *
 * <PreviewCard.Root>
 *   <PreviewCard.Trigger>Hover to preview</PreviewCard.Trigger>
 *   <PreviewCard.Popup placement="bottom" offset={8}>
 *     <PreviewCard.Content aria-label="Preview">
 *       <p>Preview content here</p>
 *     </PreviewCard.Content>
 *   </PreviewCard.Popup>
 * </PreviewCard.Root>
 * ```
 */
export const Root = DialogTrigger;
export type RootProps = DialogTriggerProps;

// Trigger
export const Trigger = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <Button ref={ref} className={cx('tale-preview-card__trigger', className)} {...props} />
));
Trigger.displayName = 'PreviewCard.Trigger';

// Arrow (defined before Popup so Popup can reference StyledArrow for hoisting)
export type ArrowProps = Omit<OverlayArrowProps, 'className'> & { className?: string };

const StyledArrow = React.forwardRef<HTMLDivElement, ArrowProps>(
  ({ className, children, ...props }, ref) => (
    <OverlayArrow
      ref={ref}
      className={cx('tale-preview-card__arrow', className as string | undefined)}
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
StyledArrow.displayName = 'PreviewCard.Arrow';
export const Arrow = StyledArrow;

// Popup (Popover)
//
// Any `PreviewCard.Arrow` children are automatically hoisted out of the Popover's
// child list so they render as direct children of the RA Popover (required by React Aria
// for OverlayArrow positioning).
export const Popup = React.forwardRef<
  HTMLDivElement,
  Omit<PopoverProps, 'className'> & { className?: string }
>(({ className, children, ...props }, ref) => {
  const arrowChildren: React.ReactNode[] = [];
  const otherChildren: React.ReactNode[] = [];

  React.Children.forEach(children as React.ReactNode, (child) => {
    if (React.isValidElement(child) && child.type === StyledArrow) {
      arrowChildren.push(child);
    } else {
      otherChildren.push(child);
    }
  });

  return (
    <Popover ref={ref} className={cx('tale-preview-card__popup', className)} {...props}>
      {arrowChildren}
      {otherChildren}
    </Popover>
  );
});
Popup.displayName = 'PreviewCard.Popup';

// Content (Dialog inside Popover)
export const Content = React.forwardRef<
  HTMLElement,
  Omit<DialogProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <Dialog ref={ref} className={cx('tale-preview-card', className)} {...props} />
));
Content.displayName = 'PreviewCard.Content';
