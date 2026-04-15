import * as React from 'react';
import { cx } from '../_cx';

type Size = 'md' | 'lg';
type Color = 'brand' | 'warning' | 'error' | 'gray' | 'success';
type Theme = 'light' | 'modern';
type Align = 'leading' | 'trailing';

/* ─── Root ────────────────────────────────────────────────────────────────── */

export interface RootProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  /**
   * Text displayed inside the pinned addon slot.
   */
  addonText: string;
  /** Size of the badge group. @default 'md' */
  size?: Size | undefined;
  /** Color variant. @default 'brand' */
  color?: Color | undefined;
  /**
   * Visual theme.
   * - `'light'` — coloured ring-inset variant (default)
   * - `'modern'` — neutral card style with a coloured dot
   * @default 'light'
   */
  theme?: Theme | undefined;
  /**
   * Which side the addon slot is pinned to.
   * @default 'leading'
   */
  align?: Align | undefined;
  /** Icon or component rendered at the trailing edge of the addon. Defaults to a right-arrow chevron. */
  iconTrailing?: React.ReactNode | undefined;
  className?: string | undefined;
}

/**
 * A badge with a pinned addon text slot and an optional trailing icon — useful for
 * announcement banners, feature callouts, and "what's new" links.
 *
 * @example
 * ```tsx
 * import { BadgeGroup } from '@tale-ui/react/badge-group';
 *
 * <BadgeGroup.Root addonText="New" color="brand">
 *   We just launched dark mode
 * </BadgeGroup.Root>
 *
 * <BadgeGroup.Root addonText="v2.0" color="success" theme="modern" align="trailing">
 *   Read the release notes
 * </BadgeGroup.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  (
    {
      addonText,
      size = 'md',
      color = 'brand',
      theme = 'light',
      align = 'leading',
      iconTrailing,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const rootClasses = [
      'tale-badge-group',
      `tale-badge-group--${size}`,
      `tale-badge-group--${theme}`,
      `tale-badge-group--${color}`,
      `tale-badge-group--${align}`,
    ];

    const addonEl = (
      <span className={cx('tale-badge-group__addon', `tale-badge-group__addon--${align}`)}>
        {theme === 'modern' && align === 'leading' && (
          <span className="tale-badge-group__dot" aria-hidden />
        )}
        {addonText}
        {theme === 'modern' && align === 'trailing' && (
          <span className="tale-badge-group__dot" aria-hidden />
        )}
      </span>
    );

    const trailingIcon = iconTrailing != null ? (
      <span className="tale-badge-group__icon" aria-hidden>
        {iconTrailing}
      </span>
    ) : null;

    return (
      <div ref={ref} className={cx(rootClasses.join(' '), className)} {...props}>
        {align === 'leading' ? (
          <React.Fragment>
            {addonEl}
            {children}
            {trailingIcon}
          </React.Fragment>
        ) : (
          <React.Fragment>
            {theme === 'modern' && <span className="tale-badge-group__dot" aria-hidden />}
            {children}
            {addonEl}
          </React.Fragment>
        )}
      </div>
    );
  },
);
Root.displayName = 'BadgeGroup.Root';
