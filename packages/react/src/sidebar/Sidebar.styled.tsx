import * as React from 'react';
import {
  ChevronDown,
  ChevronsUpDown,
  ExternalLink,
  Menu,
  Search as SearchIcon,
  X,
} from 'lucide-react';
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Link as AriaLink,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
} from 'react-aria-components';
import { cx } from '../_cx';

/* ─── Root ──────────────────────────────────────────────────────────────────── */

export interface SidebarRootProps extends React.HTMLAttributes<HTMLElement> {
  /** Remove the right border. Useful when the sidebar is borderless or uses a shadow layout. */
  hideBorder?: boolean | undefined;
  className?: string | undefined;
}

/**
 * Sidebar navigation primitives. Compose them to build simple, dual-tier, slim, or section-divided sidebars.
 *
 * @example
 * ```tsx
 * import { Sidebar } from '@tale-ui/react/sidebar';
 *
 * <Sidebar.Root>
 *   <Sidebar.Header>
 *     <img src="/logo.svg" alt="Logo" />
 *   </Sidebar.Header>
 *   <Sidebar.NavList>
 *     <Sidebar.NavItem href="/dashboard" current>Dashboard</Sidebar.NavItem>
 *     <Sidebar.NavItem href="/settings">Settings</Sidebar.NavItem>
 *   </Sidebar.NavList>
 *   <Sidebar.AccountCard name="Alex" email="alex@example.com" />
 * </Sidebar.Root>
 * ```
 *
 * @status stable
 */
export const Root = React.forwardRef<HTMLElement, SidebarRootProps>(
  ({ className, hideBorder, children, ...props }, ref) => {
    const classes = ['tale-sidebar', hideBorder ? 'tale-sidebar--no-border' : '', className ?? '']
      .filter(Boolean)
      .join(' ');
    return (
      <aside ref={ref} className={classes} {...props}>
        {children}
      </aside>
    );
  },
);
Root.displayName = 'Sidebar.Root';

/* ─── Header ────────────────────────────────────────────────────────────────── */

export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string | undefined;
}

export const Header = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cx('tale-sidebar__header', className)} {...props}>
      {children}
    </div>
  ),
);
Header.displayName = 'Sidebar.Header';

/* ─── Search ────────────────────────────────────────────────────────────────── */

export interface SidebarSearchProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string | undefined;
  className?: string | undefined;
  value?: string | undefined;
  onChange?: ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined;
}

export const Search = React.forwardRef<HTMLDivElement, SidebarSearchProps>(
  ({ placeholder = 'Search', className, value, onChange, ...props }, ref) => (
    <div ref={ref} className={cx('tale-sidebar__search', className)} {...props}>
      <SearchIcon className="tale-sidebar__search-icon" aria-hidden="true" />
      <input
        type="text"
        className="tale-sidebar__search-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-label={placeholder}
      />
    </div>
  ),
);
Search.displayName = 'Sidebar.Search';

/* ─── Divider ───────────────────────────────────────────────────────────────── */

export interface SidebarDividerProps extends React.HTMLAttributes<HTMLHRElement> {
  className?: string | undefined;
}

export const Divider = React.forwardRef<HTMLHRElement, SidebarDividerProps>(
  ({ className, ...props }, ref) => (
    <hr ref={ref} className={cx('tale-sidebar__divider', className)} {...props} />
  ),
);
Divider.displayName = 'Sidebar.Divider';

/* ─── NavList ───────────────────────────────────────────────────────────────── */

export interface SidebarNavListProps extends React.HTMLAttributes<HTMLUListElement> {
  className?: string | undefined;
}

export const NavList = React.forwardRef<HTMLUListElement, SidebarNavListProps>(
  ({ className, children, ...props }, ref) => (
    <ul ref={ref} className={cx('tale-sidebar__nav-list', className)} {...props}>
      {children}
    </ul>
  ),
);
NavList.displayName = 'Sidebar.NavList';

/* ─── NavItem ───────────────────────────────────────────────────────────────── */

export interface SidebarNavItemSubItem {
  href: string;
  label: string;
  current?: boolean | undefined;
}

export interface SidebarNavItemProps {
  href?: string | undefined;
  icon?: React.FC<{ className?: string }> | undefined;
  badge?: React.ReactNode;
  current?: boolean | undefined;
  children?: React.ReactNode;
  items?: SidebarNavItemSubItem[] | undefined;
  external?: boolean | undefined;
}

export function NavItem({
  href,
  icon: IconComponent,
  badge,
  current,
  children,
  items,
  external,
}: SidebarNavItemProps): React.ReactElement {
  const linkClass = ['tale-sidebar__nav-link', current ? 'tale-sidebar__nav-link--current' : '']
    .filter(Boolean)
    .join(' ');

  if (items && items.length > 0) {
    return (
      <li className="tale-sidebar__nav-item">
        <details>
          <summary className={linkClass}>
            {IconComponent && <IconComponent className="tale-sidebar__nav-icon" aria-hidden="true" />}
            <span className="tale-sidebar__nav-label">{children}</span>
            {badge && <span className="tale-sidebar__nav-badge">{badge}</span>}
            <ChevronDown className="tale-sidebar__nav-chevron" aria-hidden="true" />
          </summary>
          <ul className="tale-sidebar__nav-children">
            {items.map((item) => {
              const childClass = [
                'tale-sidebar__nav-link tale-sidebar__nav-child-link',
                item.current ? 'tale-sidebar__nav-link--current' : '',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <li key={item.href} className="tale-sidebar__nav-item">
                  <AriaLink href={item.href} className={childClass}>
                    {item.label}
                  </AriaLink>
                </li>
              );
            })}
          </ul>
        </details>
      </li>
    );
  }

  return (
    <li className="tale-sidebar__nav-item">
      <AriaLink href={href} className={linkClass}>
        {IconComponent && <IconComponent className="tale-sidebar__nav-icon" aria-hidden="true" />}
        <span className="tale-sidebar__nav-label">{children}</span>
        {badge && <span className="tale-sidebar__nav-badge">{badge}</span>}
        {external && <ExternalLink className="tale-sidebar__nav-external" aria-hidden="true" />}
      </AriaLink>
    </li>
  );
}
NavItem.displayName = 'Sidebar.NavItem';

/* ─── NavButton ─────────────────────────────────────────────────────────────── */

export interface SidebarNavButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string | undefined;
  icon?: React.FC<{ className?: string }> | undefined;
  label?: string | undefined;
  current?: boolean | undefined;
  className?: string | undefined;
}

export const NavButton = React.forwardRef<HTMLAnchorElement, SidebarNavButtonProps>(
  ({ href, icon: IconComponent, label, current, className, children, ...props }, ref) => {
    const classes = [
      'tale-sidebar__nav-btn',
      current ? 'tale-sidebar__nav-btn--current' : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');
    return (
      <a ref={ref} href={href} aria-label={label} className={classes} {...props}>
        {IconComponent && <IconComponent className="tale-sidebar__nav-btn-icon" aria-hidden="true" />}
        {children}
      </a>
    );
  },
);
NavButton.displayName = 'Sidebar.NavButton';

/* ─── AccountCard ───────────────────────────────────────────────────────────── */

export interface SidebarAccountCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  email: string;
  avatarSrc?: string | undefined;
  avatarAlt?: string | undefined;
  status?: 'online' | 'offline' | undefined;
  className?: string | undefined;
}

export const AccountCard = React.forwardRef<HTMLDivElement, SidebarAccountCardProps>(
  ({ name, email, avatarSrc, avatarAlt, status, className, children, ...props }, ref) => (
    <div ref={ref} className={cx('tale-sidebar__account-card', className)} {...props}>
      <div className="tale-sidebar__account-avatar-wrap">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={avatarAlt ?? name}
            className="tale-sidebar__account-avatar"
          />
        ) : (
          <div
            className="tale-sidebar__account-avatar tale-sidebar__account-avatar--placeholder"
            aria-hidden="true"
          >
            {name.charAt(0)}
          </div>
        )}
        {status && (
          <span
            className={`tale-sidebar__account-status tale-sidebar__account-status--${status}`}
            aria-label={status}
          />
        )}
      </div>
      <div className="tale-sidebar__account-info">
        <div className="tale-sidebar__account-name">{name}</div>
        <div className="tale-sidebar__account-email">{email}</div>
      </div>
      <AriaButton className="tale-sidebar__account-trigger" aria-label="Account options">
        <ChevronsUpDown aria-hidden="true" className="tale-sidebar__account-trigger-icon" />
      </AriaButton>
      {children}
    </div>
  ),
);
AccountCard.displayName = 'Sidebar.AccountCard';

/* ─── AccountMenu ───────────────────────────────────────────────────────────── */

export interface SidebarAccountMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string | undefined;
}

export const AccountMenu = React.forwardRef<HTMLDivElement, SidebarAccountMenuProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cx('tale-sidebar__account-menu', className)} {...props}>
      {children}
    </div>
  ),
);
AccountMenu.displayName = 'Sidebar.AccountMenu';

/* ─── MobileTrigger ─────────────────────────────────────────────────────────── */

export interface SidebarMobileTriggerProps {
  children: React.ReactNode;
  logo?: React.ReactNode;
}

export function MobileTrigger({ children, logo }: SidebarMobileTriggerProps): React.ReactElement {
  return (
    <AriaDialogTrigger>
      <header className="tale-sidebar__mobile-header">
        {logo && <div className="tale-sidebar__mobile-logo">{logo}</div>}
        <AriaButton className="tale-sidebar__mobile-menu-btn" aria-label="Open navigation">
          <Menu aria-hidden="true" />
        </AriaButton>
      </header>
      <AriaModalOverlay className="tale-sidebar__mobile-overlay">
        <AriaModal className="tale-sidebar__mobile-drawer">
          <AriaDialog aria-label="Navigation" className="tale-sidebar__mobile-dialog">
            {({ close }) => (
              <React.Fragment>
                <div className="tale-sidebar__mobile-close-row">
                  <AriaButton
                    className="tale-sidebar__mobile-close-btn"
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
MobileTrigger.displayName = 'Sidebar.MobileTrigger';

/* ─── FeatureCard ───────────────────────────────────────────────────────────── */

export interface SidebarFeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string | undefined;
  description?: string | undefined;
  dismissLabel?: string | undefined;
  onDismiss?: (() => void) | undefined;
  className?: string | undefined;
}

export const FeatureCard = React.forwardRef<HTMLDivElement, SidebarFeatureCardProps>(
  ({ title, description, dismissLabel, onDismiss, className, children, ...props }, ref) => (
    <div ref={ref} className={cx('tale-sidebar__feature-card', className)} {...props}>
      {title && <div className="tale-sidebar__feature-card-title">{title}</div>}
      {description && <div className="tale-sidebar__feature-card-description">{description}</div>}
      {children}
      {onDismiss && (
        <button
          type="button"
          className="tale-sidebar__feature-card-dismiss"
          onClick={onDismiss}
        >
          {dismissLabel ?? 'Dismiss'}
        </button>
      )}
    </div>
  ),
);
FeatureCard.displayName = 'Sidebar.FeatureCard';
