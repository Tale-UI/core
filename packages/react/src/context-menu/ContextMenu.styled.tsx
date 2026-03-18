import * as React from 'react';
import {
  Menu,
  MenuItem,
  MenuSection,
  Popover,
  Separator,
} from 'react-aria-components';
import type {
  MenuProps,
  MenuItemProps,
  MenuSectionProps,
  PopoverProps,
  SeparatorProps,
} from 'react-aria-components';
import { cx } from '../_cx';

/* ─── Root (right-click context menu controller) ─────────────────────────── */

export interface RootProps {
  children: React.ReactNode;
}

interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
}

/**
 * A menu that appears on right-click (context menu event).
 *
 * @example
 * ```tsx
 * import { ContextMenu } from '@tale-ui/react/context-menu';
 *
 * <ContextMenu.Root>
 *   <ContextMenu.Trigger>Right-click here</ContextMenu.Trigger>
 *   <ContextMenu.Popup>
 *     <ContextMenu.MenuList>
 *       <ContextMenu.Item id="cut">Cut</ContextMenu.Item>
 *       <ContextMenu.Item id="copy">Copy</ContextMenu.Item>
 *       <ContextMenu.Separator />
 *       <ContextMenu.Item id="paste">Paste</ContextMenu.Item>
 *     </ContextMenu.MenuList>
 *   </ContextMenu.Popup>
 * </ContextMenu.Root>
 * ```
 */
export function Root({ children }: RootProps) {
  const [state, setState] = React.useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
  });

  const open = React.useCallback((x: number, y: number) => {
    setState({ isOpen: true, x, y });
  }, []);

  const close = React.useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <ContextMenuContext.Provider value={{ ...state, open, close }}>
      {children}
    </ContextMenuContext.Provider>
  );
}

interface ContextMenuContextValue extends ContextMenuState {
  open: (x: number, y: number) => void;
  close: () => void;
}

const ContextMenuContext = React.createContext<ContextMenuContextValue>({
  isOpen: false,
  x: 0,
  y: 0,
  open: () => {},
  close: () => {},
});

/* ─── Trigger (right-click area) ─────────────────────────────────────────── */

export type TriggerProps = React.HTMLAttributes<HTMLDivElement> & { className?: string };

export const Trigger = React.forwardRef<HTMLDivElement, TriggerProps>(
  ({ className, onContextMenu, ...props }, ref) => {
    const { open } = React.useContext(ContextMenuContext);

    const handleContextMenu = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        open(e.clientX, e.clientY);
        onContextMenu?.(e);
      },
      [open, onContextMenu],
    );

    return (
      <div
        ref={ref}
        className={cx('tale-context-menu__trigger', className)}
        onContextMenu={handleContextMenu}
        {...props}
      />
    );
  },
);
Trigger.displayName = 'ContextMenu.Trigger';

/* ─── Popup (positioned at cursor) ───────────────────────────────────────── */

export type PopupProps = Omit<PopoverProps, 'className' | 'isOpen' | 'triggerRef' | 'style'> & {
  className?: string;
};

export const Popup = React.forwardRef<HTMLDivElement, PopupProps>(
  ({ className, children, ...props }, ref) => {
    const { isOpen, x, y, close } = React.useContext(ContextMenuContext);

    // Virtual trigger element positioned at cursor
    const triggerRef = React.useRef<HTMLSpanElement>(null);

    if (!isOpen) return null;

    return (
      <>
        <span
          ref={triggerRef}
          style={{
            position: 'fixed',
            left: x,
            top: y,
            width: 0,
            height: 0,
            pointerEvents: 'none',
          }}
        />
        <Popover
          ref={ref}
          triggerRef={triggerRef}
          isOpen={isOpen}
          onOpenChange={(open) => { if (!open) close(); }}
          placement="bottom start"
          className={cx('tale-context-menu', className)}
          {...props}
        >
          {children}
        </Popover>
      </>
    );
  },
);
Popup.displayName = 'ContextMenu.Popup';

/* ─── MenuList ───────────────────────────────────────────────────────────── */

export function MenuList<T extends object>(
  props: Omit<MenuProps<T>, 'className'> & { className?: string },
) {
  const { className, ...rest } = props;
  const { close } = React.useContext(ContextMenuContext);
  return (
    <Menu
      className={cx('tale-context-menu__list', className)}
      onAction={() => close()}
      {...rest}
    />
  );
}
MenuList.displayName = 'ContextMenu.MenuList';

/* ─── Item ───────────────────────────────────────────────────────────────── */

export const Item = React.forwardRef<
  HTMLDivElement,
  Omit<MenuItemProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <MenuItem ref={ref} className={cx('tale-context-menu__item', className)} {...props} />
));
Item.displayName = 'ContextMenu.Item';

/* ─── Group ──────────────────────────────────────────────────────────────── */

export function Group<T extends object>(
  props: Omit<MenuSectionProps<T>, 'className'> & { className?: string },
) {
  const { className, ...rest } = props;
  return <MenuSection className={cx('tale-context-menu__group', className)} {...rest} />;
}
Group.displayName = 'ContextMenu.Group';

/* ─── Separator ──────────────────────────────────────────────────────────── */

export const ContextMenuSeparator = React.forwardRef<
  HTMLElement,
  Omit<SeparatorProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <Separator ref={ref} className={cx('tale-context-menu__separator', className)} {...props} />
));
ContextMenuSeparator.displayName = 'ContextMenu.Separator';
export { ContextMenuSeparator as Separator };
