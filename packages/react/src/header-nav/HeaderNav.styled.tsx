import * as React from 'react';
import { Menu, X } from 'lucide-react';
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
} from 'react-aria-components';
import { cx } from '../_cx';

/* ─── Root ──────────────────────────────────────────────────────────────────── */

export interface HeaderNavRootProps extends React.HTMLAttributes<HTMLElement> {
  className?: string | undefined;
}

/**
 * Horizontal header navigation primitives.
 *
 * @example
 * ```tsx
 * import { HeaderNav } from '@tale-ui/react/header-nav';
 *
 * <HeaderNav.Root>
 *   <HeaderNav.Logo href="/">MyApp</HeaderNav.Logo>
 *   <HeaderNav.Secondary>
 *     <HeaderNav.NavButton href="/features" current>Features</HeaderNav.NavButton>
 *     <HeaderNav.NavButton href="/pricing">Pricing</HeaderNav.NavButton>
 *   </HeaderNav.Secondary>
 *   <HeaderNav.Actions>
 *     <a href="/login" className="tale-button tale-button--neutral tale-button--md">Log in</a>
 *   </HeaderNav.Actions>
 * </HeaderNav.Root>
 * ```
 *
 * @status stable
 */
export const Root = React.forwardRef<HTMLElement, HeaderNavRootProps>(
  ({ className, children, ...props }, ref) => (
    <header ref={ref} className={cx('tale-header-nav', className)} {...props}>
      {children}
    </header>
  ),
);
Root.displayName = 'HeaderNav.Root';

/* ─── Logo ──────────────────────────────────────────────────────────────────── */

export interface HeaderNavLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  href?: string | undefined;
  className?: string | undefined;
}

export const Logo = React.forwardRef<HTMLDivElement, HeaderNavLogoProps>(
  ({ href, className, children, ...props }, ref) => (
    <div ref={ref} className={cx('tale-header-nav__logo', className)} {...props}>
      {href ? (
        <a href={href} className="tale-header-nav__logo-link">
          {children}
        </a>
      ) : (
        children
      )}
    </div>
  ),
);
Logo.displayName = 'HeaderNav.Logo';

/* ─── NavButton ─────────────────────────────────────────────────────────────── */

export interface HeaderNavButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string | undefined;
  current?: boolean | undefined;
  className?: string | undefined;
}

export const NavButton = React.forwardRef<HTMLAnchorElement, HeaderNavButtonProps>(
  ({ href, current, className, children, ...props }, ref) => {
    const classes = [
      'tale-header-nav__nav-btn',
      current ? 'tale-header-nav__nav-btn--current' : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');
    return (
      <a ref={ref} href={href} className={classes} {...(current ? { 'aria-current': 'page' } : {})} {...props}>
        {children}
      </a>
    );
  },
);
NavButton.displayName = 'HeaderNav.NavButton';

/* ─── Actions ───────────────────────────────────────────────────────────────── */

export interface HeaderNavActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string | undefined;
}

export const Actions = React.forwardRef<HTMLDivElement, HeaderNavActionsProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cx('tale-header-nav__actions', className)} {...props}>
      {children}
    </div>
  ),
);
Actions.displayName = 'HeaderNav.Actions';

/* ─── Secondary ─────────────────────────────────────────────────────────────── */

export interface HeaderNavSecondaryProps extends React.HTMLAttributes<HTMLElement> {
  className?: string | undefined;
}

export const Secondary = React.forwardRef<HTMLElement, HeaderNavSecondaryProps>(
  ({ className, children, ...props }, ref) => (
    <nav ref={ref} className={cx('tale-header-nav__secondary', className)} {...props}>
      {children}
    </nav>
  ),
);
Secondary.displayName = 'HeaderNav.Secondary';

/* ─── MobileTrigger ─────────────────────────────────────────────────────────── */

export interface HeaderNavMobileTriggerProps {
  children: React.ReactNode;
}

export function MobileTrigger({ children }: HeaderNavMobileTriggerProps): React.ReactElement {
  return (
    <AriaDialogTrigger>
      <AriaButton className="tale-header-nav__mobile-trigger" aria-label="Open navigation">
        <Menu aria-hidden="true" />
      </AriaButton>
      <AriaModalOverlay className="tale-header-nav__mobile-overlay">
        <AriaModal className="tale-header-nav__mobile-drawer">
          <AriaDialog aria-label="Navigation" className="tale-header-nav__mobile-dialog">
            {({ close }) => (
              <React.Fragment>
                <div className="tale-header-nav__mobile-close-row">
                  <AriaButton
                    className="tale-header-nav__mobile-close-btn"
                    onPress={close}
                    aria-label="Close navigation"
                  >
                    <X aria-hidden="true" />
                  </AriaButton>
                </div>
                {children}
              </React.Fragment>
            )}
          </AriaDialog>
        </AriaModal>
      </AriaModalOverlay>
    </AriaDialogTrigger>
  );
}
MobileTrigger.displayName = 'HeaderNav.MobileTrigger';
