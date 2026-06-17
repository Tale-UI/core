import * as React from 'react';
import { Link as AriaLink } from 'react-aria-components';
import type {
  LinkProps as AriaLinkProps,
  LinkRenderProps as AriaLinkRenderProps,
} from 'react-aria-components';
import { cx } from '../_cx';

type AriaLinkChildrenRenderProps = AriaLinkRenderProps & {
  defaultChildren: React.ReactNode | undefined;
};

export interface LinkProps extends Omit<AriaLinkProps, 'className'> {
  /** Optional leading icon. Prefer `<Icon icon={LucideIcon} size="sm" />` from `@tale-ui/react/icon`. */
  iconLeading?: React.ReactNode | undefined;
  /** Optional trailing icon. External links and links with `target="_blank"` should use lucide `ExternalLink`. */
  iconTrailing?: React.ReactNode | undefined;
  className?: string | undefined;
}

/**
 * A styled anchor link.
 *
 * @example
 * ```tsx
 * import { Link } from '@tale-ui/react/link';
 * import { Icon } from '@tale-ui/react/icon';
 * import { ExternalLink } from 'lucide-react';
 *
 * <Link href="/about">About us</Link>
 * <Link
 *   href="https://example.com"
 *   target="_blank"
 *   rel="noopener noreferrer"
 *   iconTrailing={<Icon icon={ExternalLink} size="sm" />}
 * >
 *   Visit Example
 * </Link>
 * ```
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, iconLeading, iconTrailing, children, ...props }, ref) => {
    const hasLeadingIcon = iconLeading != null && typeof iconLeading !== 'boolean';
    const hasTrailingIcon = iconTrailing != null && typeof iconTrailing !== 'boolean';
    const hasIcon = hasLeadingIcon || hasTrailingIcon;
    const baseClassName = hasIcon ? 'tale-link tale-link--has-icon' : 'tale-link';

    const renderContent = (renderedChildren: React.ReactNode) => (
      <React.Fragment>
        {hasLeadingIcon && (
          <span className="tale-link__icon" aria-hidden="true">
            {iconLeading}
          </span>
        )}
        {renderedChildren}
        {hasTrailingIcon && (
          <span className="tale-link__icon" aria-hidden="true">
            {iconTrailing}
          </span>
        )}
      </React.Fragment>
    );
    const linkChildren =
      typeof children === 'function'
        ? (values: AriaLinkChildrenRenderProps) => renderContent(children(values))
        : renderContent(children);

    return (
      <AriaLink
        ref={ref}
        className={cx(baseClassName, className)}
        {...props}
      >
        {linkChildren}
      </AriaLink>
    );
  },
);
Link.displayName = 'Link';
