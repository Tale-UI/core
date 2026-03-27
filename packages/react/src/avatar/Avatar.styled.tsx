import * as React from 'react';
import { cx } from '../_cx';

type Size = 'sm' | 'md' | 'lg' | 'xl';

// ── Size context (Avatar has 4 sizes, shared _SizeContext only types 3) ─────

const AvatarSizeContext = React.createContext<Size | undefined>(undefined);

function useAvatarSize(explicit: Size | undefined, fallback: Size): Size {
  const fromContext = React.useContext(AvatarSizeContext);
  return explicit ?? fromContext ?? fallback;
}

// ── Group ───────────────────────────────────────────────────────────────────

export interface GroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Propagates size to all child Avatar.Root and Avatar.Count components. */
  size?: Size | undefined;
}

/**
 * Stacks avatars horizontally with overlapping edges.
 *
 * @example
 * ```tsx
 * import { Avatar } from '@tale-ui/react/avatar';
 *
 * <Avatar.Group size="md">
 *   <Avatar.Root><Avatar.Fallback>AB</Avatar.Fallback></Avatar.Root>
 *   <Avatar.Root><Avatar.Fallback>CD</Avatar.Fallback></Avatar.Root>
 *   <Avatar.Count>+3</Avatar.Count>
 * </Avatar.Group>
 * ```
 */
export const Group = React.forwardRef<HTMLDivElement, GroupProps>(
  ({ size, className, children, ...props }, ref) => {
    const content = (
      <div ref={ref} className={cx('tale-avatar-group', className)} {...props}>
        {children}
      </div>
    );

    return size != null ? (
      <AvatarSizeContext.Provider value={size}>{content}</AvatarSizeContext.Provider>
    ) : (
      content
    );
  },
);
Group.displayName = 'Avatar.Group';

// ── Count ───────────────────────────────────────────────────────────────────

export interface CountProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Override group size for this count indicator. */
  size?: Size | undefined;
}

/**
 * Overflow indicator showing how many additional avatars are hidden.
 *
 * @example
 * ```tsx
 * <Avatar.Count>+5</Avatar.Count>
 * ```
 */
export const Count = React.forwardRef<HTMLSpanElement, CountProps>(
  ({ size: sizeProp, className, ...props }, ref) => {
    const size = useAvatarSize(sizeProp, 'md');
    return (
      <span
        ref={ref}
        className={cx(`tale-avatar-count tale-avatar-count--${size}`, className)}
        {...props}
      />
    );
  },
);
Count.displayName = 'Avatar.Count';

// ── Root ────────────────────────────────────────────────────────────────────

export interface RootProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: Size | undefined;
}

/**
 * A user avatar with image and fallback.
 *
 * @example
 * ```tsx
 * import { Avatar } from '@tale-ui/react/avatar';
 *
 * <Avatar.Root size="md">
 *   <Avatar.Image src="/photo.jpg" alt="User" />
 *   <Avatar.Fallback>JD</Avatar.Fallback>
 * </Avatar.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLSpanElement, RootProps>(
  ({ size: sizeProp, className, ...props }, ref) => {
    const size = useAvatarSize(sizeProp, 'md');
    return (
      <span ref={ref} className={cx(`tale-avatar tale-avatar--${size}`, className)} {...props} />
    );
  },
);
Root.displayName = 'Avatar.Root';

export const Image = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, ...props }, ref) => (
    <img ref={ref} className={cx('tale-avatar__image', className)} {...props} />
  ),
);
Image.displayName = 'Avatar.Image';

export const Fallback = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-avatar__fallback', className)} {...props} />
  ),
);
Fallback.displayName = 'Avatar.Fallback';
