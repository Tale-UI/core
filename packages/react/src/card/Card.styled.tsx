import * as React from 'react';
import { Button as AriaButton } from 'react-aria-components';
import type { ButtonProps as AriaButtonProps } from 'react-aria-components';
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
      className={cx(`tale-card tale-card--${variant} tale-card--${padding}`, className)}
      {...props}
    />
  ),
);
Root.displayName = 'Card.Root';

/* ─── Button ──────────────────────────────────────────────────────────────── */

export interface ButtonProps extends Omit<AriaButtonProps, 'aria-pressed' | 'className'> {
  /** Visual style. @default 'outlined' */
  variant?: Variant | undefined;
  /** Inner padding. @default 'md' */
  padding?: Padding | undefined;
  /**
   * Controlled selected state. When provided, Card.Button exposes
   * `aria-pressed` and `data-selected` for an accessible toggle-style action.
   */
  isSelected?: boolean | undefined;
  className?: string | undefined;
}

/**
 * An interactive card surface built on React Aria Button.
 *
 * Use this as an alternative outer container to `Card.Root`, not as its child.
 * It supports mouse, touch, keyboard, focus-visible, disabled, and pending
 * interaction states. Compose it with phrasing content such as `Text` rendered
 * as a span, `Badge`, or `Icon`. Do not use the div-based Card section parts or
 * place buttons, links, and other interactive controls inside it.
 *
 * @example
 * ```tsx
 * import { Card } from '@tale-ui/react/card';
 * import { Text } from '@tale-ui/react/text';
 *
 * <Card.Button onPress={() => selectTheme('harbour')}>
 *   <Text as="span" variant="label" size="m">Harbour</Text>
 *   <Text as="span" variant="text" size="s" color="muted">
 *     Deep teal with a warm stone neutral.
 *   </Text>
 * </Card.Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'outlined', padding = 'md', isSelected, className, ...props }, ref) => (
    <AriaButton
      {...props}
      ref={ref}
      aria-pressed={isSelected}
      data-selected={isSelected || undefined}
      className={cx(
        `tale-card tale-card--button tale-card--${variant} tale-card--${padding}`,
        className,
      )}
    />
  ),
);
Button.displayName = 'Card.Button';

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
    <div ref={ref} className={cx('tale-card__header', className)} {...props} />
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
export const Body = React.forwardRef<HTMLDivElement, BodyProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cx('tale-card__body', className)} {...props} />
));
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
    <div ref={ref} className={cx('tale-card__footer', className)} {...props} />
  ),
);
Footer.displayName = 'Card.Footer';
