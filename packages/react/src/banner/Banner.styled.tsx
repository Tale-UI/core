import * as React from 'react';
import { X } from 'lucide-react';
import { Icon } from '../icon';
import { cx } from '../_cx';

type Variant = 'info' | 'success' | 'warning' | 'error';
type Size = 'sm' | 'md';

/* ─── Root ────────────────────────────────────────────────────────────────── */

export interface RootProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  /** Semantic variant controlling the colour scheme. */
  variant?: Variant | undefined;
  /** Size variant affecting spacing and typography. */
  size?: Size | undefined;
  className?: string | undefined;
}

/**
 * An inline notification banner with semantic variants.
 *
 * @example
 * ```tsx
 * import { Banner } from '@tale-ui/react/banner';
 * import { Icon } from '@tale-ui/react/icon';
 * import { InfoIcon } from 'lucide-react';
 *
 * <Banner.Root variant="info">
 *   <Banner.Icon><Icon icon={InfoIcon} size="sm" /></Banner.Icon>
 *   <Banner.Title>Heads up</Banner.Title>
 *   <Banner.Description>Your trial expires in 3 days.</Banner.Description>
 * </Banner.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ variant = 'info', size = 'md', className, ...props }, ref) => {
    const classes = ['tale-banner'];
    if (variant === 'info') {classes.push('tale-banner--info');}
    else {classes.push(`color-${variant}`);}
    if (size !== 'md') {classes.push(`tale-banner--${size}`);}

    return (
      <div
        ref={ref}
        role="status"
        className={cx(classes.join(' '), className)}
        {...props}
      />
    );
  },
);
Root.displayName = 'Banner.Root';

/* ─── Icon ────────────────────────────────────────────────────────────────── */

export interface IconProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  className?: string | undefined;
}

/**
 * Container for the banner icon.
 *
 * @example
 * ```tsx
 * <Banner.Icon><Icon icon={InfoIcon} size="sm" /></Banner.Icon>
 * ```
 */
export const BannerIcon = React.forwardRef<HTMLDivElement, IconProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cx('tale-banner__icon', className)}
      {...props}
    />
  ),
);
BannerIcon.displayName = 'Banner.Icon';

export { BannerIcon as Icon };

/* ─── Title ───────────────────────────────────────────────────────────────── */

export interface TitleProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  className?: string | undefined;
}

/**
 * The main heading for the banner.
 *
 * @example
 * ```tsx
 * <Banner.Title>Update available</Banner.Title>
 * ```
 */
export const Title = React.forwardRef<HTMLDivElement, TitleProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cx('tale-banner__title', className)}
      {...props}
    />
  ),
);
Title.displayName = 'Banner.Title';

/* ─── Description ─────────────────────────────────────────────────────────── */

export interface DescriptionProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  className?: string | undefined;
}

/**
 * Supporting text for the banner.
 *
 * @example
 * ```tsx
 * <Banner.Description>Please update to the latest version.</Banner.Description>
 * ```
 */
export const Description = React.forwardRef<HTMLDivElement, DescriptionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cx('tale-banner__description', className)}
      {...props}
    />
  ),
);
Description.displayName = 'Banner.Description';

/* ─── Actions ─────────────────────────────────────────────────────────────── */

export interface ActionsProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  className?: string | undefined;
}

/**
 * Container for action buttons.
 *
 * @example
 * ```tsx
 * <Banner.Actions>
 *   <Button variant="ghost" size="sm">Dismiss</Button>
 * </Banner.Actions>
 * ```
 */
export const Actions = React.forwardRef<HTMLDivElement, ActionsProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cx('tale-banner__actions', className)}
      {...props}
    />
  ),
);
Actions.displayName = 'Banner.Actions';

/* ─── Close ───────────────────────────────────────────────────────────────── */

export interface CloseProps extends Omit<React.ComponentPropsWithoutRef<'button'>, 'className'> {
  className?: string | undefined;
}

/**
 * Dismiss button. Renders a default X icon; pass children to override.
 *
 * @example
 * ```tsx
 * <Banner.Close onClick={() => setVisible(false)} />
 * ```
 */
export const Close = React.forwardRef<HTMLButtonElement, CloseProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label="Dismiss"
      className={cx('tale-icon-button tale-icon-button--sm tale-button tale-button--ghost tale-banner__close', className)}
      {...props}
    >
      {children ?? <Icon icon={X} size="sm" />}
    </button>
  ),
);
Close.displayName = 'Banner.Close';
