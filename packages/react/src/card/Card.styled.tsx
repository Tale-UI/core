import * as React from 'react';
import { cx } from '../_cx';

/* ─── Root ────────────────────────────────────────────────────────────────── */

type Variant = 'elevated' | 'outlined' | 'filled';
type Padding = 'sm' | 'md' | 'lg';

export interface RootProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  /** Visual style. @default 'outlined' */
  variant?: Variant | undefined;
  /** Inner padding. @default 'md' */
  padding?: Padding | undefined;
  className?: string | undefined;
}

/**
 * A surface container with header, body, and footer sections.
 *
 * @example
 * ```tsx
 * import { Card } from '@tale-ui/react/card';
 *
 * <Card.Root variant="elevated">
 *   <Card.Header>Title</Card.Header>
 *   <Card.Body>Content goes here.</Card.Body>
 *   <Card.Footer>Footer actions</Card.Footer>
 * </Card.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ variant = 'outlined', padding = 'md', className, ...props }, ref) => (
    <div
      ref={ref}
      className={cx(
        `tale-card tale-card--${variant} tale-card--${padding}`,
        className,
      )}
      {...props}
    />
  ),
);
Root.displayName = 'Card.Root';

/* ─── Header ──────────────────────────────────────────────────────────────── */

export interface HeaderProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  className?: string | undefined;
}

/**
 * Card header section, typically containing a title.
 *
 * @example
 * ```tsx
 * <Card.Header>Card Title</Card.Header>
 * ```
 */
export const Header = React.forwardRef<HTMLDivElement, HeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cx('tale-card__header', className)}
      {...props}
    />
  ),
);
Header.displayName = 'Card.Header';

/* ─── Body ────────────────────────────────────────────────────────────────── */

export interface BodyProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  className?: string | undefined;
}

/**
 * Card body section for main content.
 *
 * @example
 * ```tsx
 * <Card.Body>Main content goes here.</Card.Body>
 * ```
 */
export const Body = React.forwardRef<HTMLDivElement, BodyProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cx('tale-card__body', className)}
      {...props}
    />
  ),
);
Body.displayName = 'Card.Body';

/* ─── Footer ──────────────────────────────────────────────────────────────── */

export interface FooterProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  className?: string | undefined;
}

/**
 * Card footer section, typically containing actions.
 *
 * @example
 * ```tsx
 * <Card.Footer>
 *   <Button variant="primary">Save</Button>
 * </Card.Footer>
 * ```
 */
export const Footer = React.forwardRef<HTMLDivElement, FooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cx('tale-card__footer', className)}
      {...props}
    />
  ),
);
Footer.displayName = 'Card.Footer';
