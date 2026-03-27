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

// ── Indicator ────────────────────────────────────────────────────────────────

export interface IndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Position of the badge relative to the avatar.
   * @default 'bottom-right'
   */
  position?: 'bottom-right' | 'top-right' | undefined;
  /** Element to position at the avatar corner (typically a DotIcon). */
  badge?: React.ReactNode | undefined;
}

/**
 * Positions a badge (e.g. DotIcon) at the corner of an avatar.
 * Wraps Avatar.Root from outside because `.tale-avatar` has `overflow: hidden`.
 *
 * @example
 * ```tsx
 * import { Avatar } from '@tale-ui/react/avatar';
 * import { DotIcon } from '@tale-ui/react/dot-icon';
 *
 * <Avatar.Indicator badge={<DotIcon color="success" />}>
 *   <Avatar.Root>
 *     <Avatar.Image src="/photo.jpg" alt="User" />
 *     <Avatar.Fallback>JD</Avatar.Fallback>
 *   </Avatar.Root>
 * </Avatar.Indicator>
 * ```
 */
export const Indicator = React.forwardRef<HTMLSpanElement, IndicatorProps>(
  ({ position = 'bottom-right', badge, className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cx(`tale-avatar-indicator tale-avatar-indicator--${position}`, className)}
      {...props}
    >
      {children}
      {badge != null && <span className="tale-avatar-indicator__badge">{badge}</span>}
    </span>
  ),
);
Indicator.displayName = 'Avatar.Indicator';

// ── LabelGroup ───────────────────────────────────────────────────────────────

type LabelGroupSize = 'sm' | 'md' | 'lg';

export interface LabelGroupProps extends React.HTMLAttributes<HTMLElement> {
  /** Controls avatar size (via context) and text sizing. Defaults to 'md'. */
  size?: LabelGroupSize | undefined;
}

/**
 * Combines an avatar with a title and subtitle for user profile displays.
 *
 * @example
 * ```tsx
 * import { Avatar } from '@tale-ui/react/avatar';
 *
 * <Avatar.LabelGroup size="md">
 *   <Avatar.Root>
 *     <Avatar.Image src="/photo.jpg" alt="User" />
 *     <Avatar.Fallback>JD</Avatar.Fallback>
 *   </Avatar.Root>
 *   <Avatar.LabelGroupTitle>Jane Doe</Avatar.LabelGroupTitle>
 *   <Avatar.LabelGroupSubtitle>Product Designer</Avatar.LabelGroupSubtitle>
 * </Avatar.LabelGroup>
 * ```
 */
export const LabelGroup = React.forwardRef<HTMLElement, LabelGroupProps>(
  ({ size = 'md', className, children, ...props }, ref) => {
    const content = (
      <figure
        ref={ref}
        className={cx(`tale-avatar-label-group tale-avatar-label-group--${size}`, className)}
        {...props}
      >
        {children}
      </figure>
    );

    return (
      <AvatarSizeContext.Provider value={size}>{content}</AvatarSizeContext.Provider>
    );
  },
);
LabelGroup.displayName = 'Avatar.LabelGroup';

export const LabelGroupTitle = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-avatar-label-group__title', className)} {...props} />
  ),
);
LabelGroupTitle.displayName = 'Avatar.LabelGroupTitle';

export const LabelGroupSubtitle = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-avatar-label-group__subtitle', className)} {...props} />
  ),
);
LabelGroupSubtitle.displayName = 'Avatar.LabelGroupSubtitle';
