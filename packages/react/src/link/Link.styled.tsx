import * as React from 'react';
import { Link as AriaLink } from 'react-aria-components';
import type { LinkProps as AriaLinkProps } from 'react-aria-components';
import { cx } from '../_cx';

export interface LinkProps extends Omit<AriaLinkProps, 'className'> {
  className?: string | undefined;
}

/**
 * A styled anchor link.
 *
 * @example
 * ```tsx
 * import { Link } from '@tale-ui/react/link';
 *
 * <Link href="/about">About us</Link>
 * ```
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, ...props }, ref) => (
    <AriaLink
      ref={ref}
      className={cx('tale-link', className)}
      {...props}
    />
  ),
);
Link.displayName = 'Link';
