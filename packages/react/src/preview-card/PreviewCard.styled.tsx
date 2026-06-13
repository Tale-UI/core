import * as React from 'react';
import {
  Popover,
  Dialog,
  OverlayArrow,
} from 'react-aria-components';
import type {
  PopoverProps,
  DialogProps,
  OverlayArrowProps,
} from 'react-aria-components';
import { cx } from '../_cx';

// ── Context ──────────────────────────────────────────────────────────────────

interface PreviewCardContextValue {
  triggerRef: React.RefObject<HTMLSpanElement | null>;
  isOpen: boolean;
  onHoverOpen: () => void;
  onHoverClose: () => void;
  onHoverKeepOpen: () => void;
  close: () => void;
}

const PreviewCardContext = React.createContext<PreviewCardContextValue>({
  triggerRef: { current: null },
  isOpen: false,
  onHoverOpen: () => {},
  onHoverClose: () => {},
  onHoverKeepOpen: () => {},
  close: () => {},
});

// ── Root ─────────────────────────────────────────────────────────────────────

export interface RootProps {
  children: React.ReactNode;
  /** Delay in ms before opening on hover. @default 400 */
  delay?: number;
  /** Delay in ms before closing after hover ends. @default 300 */
  closeDelay?: number;
}

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
export const Root: React.FC<RootProps> = ({ children, delay = 400, closeDelay = 300 }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLSpanElement>(null);
  const openTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const onHoverOpen = React.useCallback(() => {
    clearTimeout(closeTimer.current);
    openTimer.current = setTimeout(() => setIsOpen(true), delay);
  }, [delay]);

  const onHoverClose = React.useCallback(() => {
    clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setIsOpen(false), closeDelay);
  }, [closeDelay]);

  const onHoverKeepOpen = React.useCallback(() => {
    clearTimeout(closeTimer.current);
    clearTimeout(openTimer.current);
  }, []);

  const close = React.useCallback(() => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
    setIsOpen(false);
  }, []);

  React.useEffect(() => () => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
  }, []);

  const ctx = React.useMemo(
    () => ({ triggerRef, isOpen, onHoverOpen, onHoverClose, onHoverKeepOpen, close }),
    [isOpen, onHoverOpen, onHoverClose, onHoverKeepOpen, close],
  );

  return (
    <PreviewCardContext.Provider value={ctx}>
      {children}
    </PreviewCardContext.Provider>
  );
};
Root.displayName = 'PreviewCard.Root';

// ── Trigger ──────────────────────────────────────────────────────────────────

export interface TriggerProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

export const Trigger = React.forwardRef<HTMLSpanElement, TriggerProps>(
  ({ className, ...props }, ref) => {
    const { triggerRef, onHoverOpen, onHoverClose } = React.useContext(PreviewCardContext);

    const mergedRef = React.useCallback(
      (node: HTMLSpanElement | null) => {
        (triggerRef as React.MutableRefObject<HTMLSpanElement | null>).current = node;
        if (typeof ref === 'function') {ref(node);}
        else if (ref) {(ref as React.MutableRefObject<HTMLSpanElement | null>).current = node;}
      },
      [ref, triggerRef],
    );

    return (
      <span
        ref={mergedRef}
        className={cx('tale-preview-card__trigger', className)}
        onPointerEnter={onHoverOpen}
        onPointerLeave={onHoverClose}
        {...props}
      />
    );
  },
);
Trigger.displayName = 'PreviewCard.Trigger';

// ── Arrow ────────────────────────────────────────────────────────────────────

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

// ── Popup ────────────────────────────────────────────────────────────────────

export const Popup = React.forwardRef<
  HTMLDivElement,
  Omit<PopoverProps, 'className' | 'isOpen' | 'triggerRef'> & { className?: string }
>(({ className, children, ...props }, ref) => {
  const { triggerRef, isOpen, onHoverClose, onHoverKeepOpen, close } = React.useContext(PreviewCardContext);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  const mergedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      (popoverRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof ref === 'function') {ref(node);}
      else if (ref) {(ref as React.MutableRefObject<HTMLDivElement | null>).current = node;}
    },
    [ref],
  );

  React.useEffect(() => {
    const el = popoverRef.current;
    if (!el) {return;}
    el.addEventListener('pointerenter', onHoverKeepOpen);
    el.addEventListener('pointerleave', onHoverClose);
    return () => {
      el.removeEventListener('pointerenter', onHoverKeepOpen);
      el.removeEventListener('pointerleave', onHoverClose);
    };
  }, [onHoverKeepOpen, onHoverClose]);

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
    <Popover
      ref={mergedRef}
      triggerRef={triggerRef}
      isOpen={isOpen}
      onOpenChange={(open) => { if (!open) {close();} }}
      isNonModal
      className={cx('tale-preview-card__popup', className)}
      {...props}
    >
      {arrowChildren}
      {otherChildren}
    </Popover>
  );
});
Popup.displayName = 'PreviewCard.Popup';

// ── Content ──────────────────────────────────────────────────────────────────

export const Content = React.forwardRef<
  HTMLElement,
  Omit<DialogProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <Dialog ref={ref} className={cx('tale-preview-card', className)} {...props} />
));
Content.displayName = 'PreviewCard.Content';
