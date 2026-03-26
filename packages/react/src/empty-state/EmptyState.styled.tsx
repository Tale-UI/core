import * as React from 'react';
import { cx } from '../_cx';

/* ─── Root ────────────────────────────────────────────────────────────────── */

export interface RootProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  className?: string | undefined;
  /** Size variant affecting spacing and typography. */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * A placeholder for empty content areas (empty tables, search results, lists).
 *
 * @example
 * ```tsx
 * import { EmptyState } from '@tale-ui/react/empty-state';
 * import { Icon } from '@tale-ui/react/icon';
 * import { Button } from '@tale-ui/react/button';
 * import { InboxIcon } from 'lucide-react';
 *
 * <EmptyState.Root>
 *   <EmptyState.Icon><Icon icon={InboxIcon} size="lg" /></EmptyState.Icon>
 *   <EmptyState.Title>No messages</EmptyState.Title>
 *   <EmptyState.Description>Your inbox is empty.</EmptyState.Description>
 *   <EmptyState.Actions><Button variant="primary">Compose</Button></EmptyState.Actions>
 * </EmptyState.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ size = 'md', className, ...props }, ref) => (
    <div
      ref={ref}
      className={cx(
        size === 'md' ? 'tale-empty-state' : `tale-empty-state tale-empty-state--${size}`,
        className,
      )}
      {...props}
    />
  ),
);
Root.displayName = 'EmptyState.Root';

/* ─── Icon ────────────────────────────────────────────────────────────────── */

export interface IconProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  className?: string | undefined;
}

/**
 * Container for the empty state icon.
 *
 * @example
 * ```tsx
 * <EmptyState.Icon><Icon icon={InboxIcon} size="lg" /></EmptyState.Icon>
 * ```
 */
export const EmptyStateIcon = React.forwardRef<HTMLDivElement, IconProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cx('tale-empty-state__icon', className)}
      {...props}
    />
  ),
);
EmptyStateIcon.displayName = 'EmptyState.Icon';

// Re-export with the name consumers see in the namespace
export { EmptyStateIcon as Icon };

/* ─── Title ───────────────────────────────────────────────────────────────── */

export interface TitleProps extends Omit<React.ComponentPropsWithoutRef<'h3'>, 'className'> {
  className?: string | undefined;
}

/**
 * The main heading for the empty state.
 *
 * @example
 * ```tsx
 * <EmptyState.Title>No results found</EmptyState.Title>
 * ```
 */
export const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cx('tale-empty-state__title', className)}
      {...props}
    />
  ),
);
Title.displayName = 'EmptyState.Title';

/* ─── Description ─────────────────────────────────────────────────────────── */

export interface DescriptionProps extends Omit<React.ComponentPropsWithoutRef<'p'>, 'className'> {
  className?: string | undefined;
}

/**
 * Supporting text explaining the empty state.
 *
 * @example
 * ```tsx
 * <EmptyState.Description>Try adjusting your search terms.</EmptyState.Description>
 * ```
 */
export const Description = React.forwardRef<HTMLParagraphElement, DescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cx('tale-empty-state__description', className)}
      {...props}
    />
  ),
);
Description.displayName = 'EmptyState.Description';

/* ─── Actions ─────────────────────────────────────────────────────────────── */

export interface ActionsProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  className?: string | undefined;
}

/**
 * Container for action buttons.
 *
 * @example
 * ```tsx
 * <EmptyState.Actions>
 *   <Button variant="primary">Create new</Button>
 * </EmptyState.Actions>
 * ```
 */
export const Actions = React.forwardRef<HTMLDivElement, ActionsProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cx('tale-empty-state__actions', className)}
      {...props}
    />
  ),
);
Actions.displayName = 'EmptyState.Actions';
