import * as React from 'react';
import {
  TooltipTrigger,
  Tooltip,
  OverlayArrow,
  Button,
  type TooltipTriggerComponentProps,
  type TooltipProps as AriaTooltipProps,
} from 'react-aria-components';
import { cx } from '../_cx';

/**
 * A small popup label that appears on hover or focus.
 *
 * @example
 * ```tsx
 * import { Tooltip } from '@tale-ui/react/tooltip';
 *
 * <Tooltip.Root>
 *   <Tooltip.Trigger className="tale-button tale-button--neutral tale-button--md">Hover me</Tooltip.Trigger>
 *   <Tooltip.Popup placement="top" offset={8}>
 *     <Tooltip.Arrow />
 *     Tooltip text
 *   </Tooltip.Popup>
 * </Tooltip.Root>
 * ```
 */
export const Root = TooltipTrigger;
export type RootProps = TooltipTriggerComponentProps;

// Trigger — RA Button with tooltip trigger slot
export const Trigger = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ComponentPropsWithoutRef<typeof Button>, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <Button ref={ref} className={cx('tale-tooltip__trigger', className)} {...props} />
));
Trigger.displayName = 'Tooltip.Trigger';

// Popup — the actual tooltip
export const Popup = React.forwardRef<
  HTMLDivElement,
  Omit<AriaTooltipProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <Tooltip ref={ref} className={cx('tale-tooltip__popup', className)} {...props} />
));
Popup.displayName = 'Tooltip.Popup';

// Arrow
export const Arrow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { className?: string }
>(({ className, ...props }, ref) => (
  <OverlayArrow>
    <div ref={ref} className={cx('tale-tooltip__arrow', className)} {...props}>
      <svg viewBox="0 0 8 8" aria-hidden="true">
        <path d="M0 0 L4 4 L8 0 Z" />
      </svg>
    </div>
  </OverlayArrow>
));
Arrow.displayName = 'Tooltip.Arrow';
