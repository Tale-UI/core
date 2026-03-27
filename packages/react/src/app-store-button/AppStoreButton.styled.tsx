import * as React from 'react';
import { cx } from '../_cx';
import { AppleBadge, GooglePlayBadge } from './_badges';

type Store = 'apple' | 'google';
type Size = 'sm' | 'md' | 'lg';

const SIZES: Record<Size, { apple: [number, number]; google: [number, number] }> = {
  sm: { apple: [96, 32], google: [108, 32] },
  md: { apple: [120, 40], google: [135, 40] },
  lg: { apple: [150, 50], google: [169, 50] },
};

const BADGE_ALT: Record<Store, string> = {
  apple: 'Download on the App Store',
  google: 'Get it on Google Play',
};

export interface AppStoreButtonProps extends Omit<React.ComponentPropsWithoutRef<'a'>, 'className' | 'children'> {
  /** Target app store. */
  store: Store;
  /** Badge size. Defaults to 'md'. */
  size?: Size | undefined;
  className?: string | undefined;
}

/**
 * An app store download badge with inline SVG.
 *
 * @example
 * ```tsx
 * import { AppStoreButton } from '@tale-ui/react/app-store-button';
 *
 * <AppStoreButton store="apple" href="https://apps.apple.com/..." />
 * <AppStoreButton store="google" href="https://play.google.com/..." />
 * ```
 */
export const AppStoreButton = React.forwardRef<HTMLAnchorElement, AppStoreButtonProps>(
  ({ store, size = 'md', className, ...props }, ref) => {
    const [w, h] = SIZES[size][store];

    return (
      <a
        ref={ref}
        aria-label={BADGE_ALT[store]}
        className={cx(
          `tale-app-store-button tale-app-store-button--${store} tale-app-store-button--${size}`,
          className,
        )}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {store === 'apple' ? <AppleBadge width={w} height={h} /> : <GooglePlayBadge width={w} height={h} />}
      </a>
    );
  },
);
AppStoreButton.displayName = 'AppStoreButton';
