import * as React from 'react';
import {
  DialogTrigger,
  Popover,
  Dialog,
  Button,
} from 'react-aria-components';
import type {
  DialogTriggerProps,
  PopoverProps,
  DialogProps,
  ButtonProps,
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
 *     <PreviewCard.Content>
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

// Popup (Popover)
export const Popup = React.forwardRef<
  HTMLDivElement,
  Omit<PopoverProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <Popover ref={ref} className={cx('tale-preview-card__popup', className)} {...props} />
));
Popup.displayName = 'PreviewCard.Popup';

// Content (Dialog inside Popover)
export const Content = React.forwardRef<
  HTMLElement,
  Omit<DialogProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <Dialog ref={ref} className={cx('tale-preview-card', className)} {...props} />
));
Content.displayName = 'PreviewCard.Content';
