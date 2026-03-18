import * as React from 'react';
import { useMergedRefs } from '@tale-ui/utils/useMergedRefs';
import { cx } from '../_cx';
import { getStateAttributesProps } from '../utils/getStateAttributesProps';
import { transitionStatusMapping } from '../utils/stateAttributesMapping';
import { useOpenChangeComplete } from '../utils/useOpenChangeComplete';
import { useTransitionStatus, type TransitionStatus } from '../utils/useTransitionStatus';

interface DrawerContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  mounted: boolean;
  setMounted: React.Dispatch<React.SetStateAction<boolean>>;
  transitionStatus: TransitionStatus;
}

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

export interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
}

export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ className, open: openProp, defaultOpen = false, onOpenChange, ...props }, ref) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const open = openProp ?? uncontrolledOpen;
    const { mounted, setMounted, transitionStatus } = useTransitionStatus(open);

    const setOpen = React.useCallback(
      (nextOpen: boolean) => {
        if (openProp === undefined) {
          setUncontrolledOpen(nextOpen);
        }

        onOpenChange?.(nextOpen);
      },
      [onOpenChange, openProp],
    );

    const contextValue = React.useMemo(
      () => ({
        open,
        setOpen,
        mounted,
        setMounted,
        transitionStatus,
      }),
      [mounted, open, setMounted, setOpen, transitionStatus],
    );

    return (
      <DrawerContext.Provider value={contextValue}>
        <div ref={ref} className={cx('tale-drawer', className)} {...props} />
      </DrawerContext.Provider>
    );
  },
);
Root.displayName = 'Drawer.Root';

export const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
  const context = React.useContext(DrawerContext);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);

      if (!event.defaultPrevented) {
        context?.setOpen(true);
      }
    },
    [context, onClick],
  );

  return <button ref={ref} className={cx('tale-drawer__trigger', className)} onClick={handleClick} {...props} />;
});
Trigger.displayName = 'Drawer.Trigger';

export const Popup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(DrawerContext);
    const popupRef = React.useRef<HTMLDivElement | null>(null);
    const mergedRef = useMergedRefs(popupRef, ref);

    useOpenChangeComplete({
      enabled: context?.transitionStatus === 'ending',
      open: context?.open,
      ref: popupRef,
      onComplete: () => context?.setMounted(false),
    });

    if (context && !context.mounted) {
      return null;
    }

    const stateProps = context
      ? getStateAttributesProps({ transitionStatus: context.transitionStatus }, transitionStatusMapping)
      : undefined;

    return (
      <div
        ref={mergedRef}
        role="dialog"
        className={cx('tale-drawer__popup', className)}
        {...stateProps}
        {...props}
      />
    );
  },
);
Popup.displayName = 'Drawer.Popup';

export const Close = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
  const context = React.useContext(DrawerContext);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);

      if (!event.defaultPrevented) {
        context?.setOpen(false);
      }
    },
    [context, onClick],
  );

  return <button ref={ref} className={cx('tale-drawer__close', className)} onClick={handleClick} {...props} />;
});
Close.displayName = 'Drawer.Close';

export const Title = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-drawer__title', className)} {...props} />
  ),
);
Title.displayName = 'Drawer.Title';

export const Description = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-drawer__description', className)} {...props} />
  ),
);
Description.displayName = 'Drawer.Description';

export interface BackdropProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  className?: string | undefined;
}

export const Backdrop = React.forwardRef<HTMLDivElement, BackdropProps>(
  ({ className, onClick, ...props }, ref) => {
    if (process.env.NODE_ENV !== 'production' && 'children' in props) {
      console.warn(
        'Drawer.Backdrop does not accept children. Use it as a self-closing sibling of Drawer.Popup: ' +
          '<Drawer.Backdrop /> <Drawer.Popup>…</Drawer.Popup>. ' +
          'Wrapping Popup inside Backdrop causes a hooks-order crash.',
      );
    }

    const context = React.useContext(DrawerContext);

    if (context && !context.mounted) {
      return null;
    }

    const stateProps = context
      ? getStateAttributesProps({ transitionStatus: context.transitionStatus }, transitionStatusMapping)
      : undefined;

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          context?.setOpen(false);
        }
      },
      [context, onClick],
    );

    return (
      <div
        ref={ref}
        className={cx('tale-drawer__backdrop', className)}
        onClick={handleClick}
        {...stateProps}
        {...props}
      />
    );
  },
);
Backdrop.displayName = 'Drawer.Backdrop';
