import * as React from 'react';
import { cx } from '../_cx';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// ── Size context (Avatar has 6 sizes, shared _SizeContext only types 3) ─────

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

// ── AddButton ────────────────────────────────────────────────────────────────

type AddButtonSize = 'xs' | 'sm' | 'md';

export interface AddButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Size of the add button. Matches avatar xs–md sizes.
   * @default 'md'
   */
  size?: AddButtonSize | undefined;
}

/**
 * A dashed-border circular button for adding a new avatar (e.g. invite a team member).
 * Sizes match the xs–md avatar sizes.
 *
 * @example
 * ```tsx
 * import { Avatar } from '@tale-ui/react/avatar';
 *
 * <Avatar.Group size="md">
 *   <Avatar.Root><Avatar.Fallback>AB</Avatar.Fallback></Avatar.Root>
 *   <Avatar.AddButton size="md" aria-label="Add team member" onClick={openModal} />
 * </Avatar.Group>
 * ```
 */
export const AddButton = React.forwardRef<HTMLButtonElement, AddButtonProps>(
  ({ size = 'md', className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cx(`tale-avatar-add-button tale-avatar-add-button--${size}`, className)}
      {...props}
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        className="tale-avatar-add-button__icon"
      >
        <path
          d="M8 3v10M3 8h10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  ),
);
AddButton.displayName = 'Avatar.AddButton';

// ── CompanyIcon ───────────────────────────────────────────────────────────────

export interface CompanyIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Size of the enclosing avatar (controls the badge image size proportionally).
   * @default 'md'
   */
  size?: Size | undefined;
  /** URL of the company logo to display in the badge. */
  src: string;
  /** Accessible alt text for the company logo. Defaults to empty string. */
  alt?: string | undefined;
}

/**
 * Overlays a small circular company logo badge at the bottom-right of an avatar.
 * Wraps Avatar.Root from the outside (Avatar.Root has overflow:hidden).
 *
 * @example
 * ```tsx
 * import { Avatar } from '@tale-ui/react/avatar';
 *
 * <Avatar.CompanyIcon src="/logos/acme.png" alt="Acme Corp" size="md">
 *   <Avatar.Root>
 *     <Avatar.Image src="/photo.jpg" alt="Jane Doe" />
 *     <Avatar.Fallback>JD</Avatar.Fallback>
 *   </Avatar.Root>
 * </Avatar.CompanyIcon>
 * ```
 */
export const CompanyIcon = React.forwardRef<HTMLSpanElement, CompanyIconProps>(
  ({ size = 'md', src, alt = '', className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cx(`tale-avatar-company-icon tale-avatar-company-icon--${size}`, className)}
      {...props}
    >
      {children}
      <img src={src} alt={alt} className="tale-avatar-company-icon__badge" />
    </span>
  ),
);
CompanyIcon.displayName = 'Avatar.CompanyIcon';

// ── VerifiedTick ──────────────────────────────────────────────────────────────

type VerifiedTickSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

export interface VerifiedTickProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the verified badge SVG.
   * @default 'md'
   */
  size?: VerifiedTickSize | undefined;
}

/**
 * Decorative SVG verified badge (seal with checkmark). Use as the `badge` prop on
 * Avatar.Indicator or Avatar.ProfilePhoto.
 *
 * @example
 * ```tsx
 * import { Avatar } from '@tale-ui/react/avatar';
 *
 * // With Indicator
 * <Avatar.Indicator badge={<Avatar.VerifiedTick size="sm" />}>
 *   <Avatar.Root size="md">
 *     <Avatar.Image src="/photo.jpg" alt="User" />
 *   </Avatar.Root>
 * </Avatar.Indicator>
 *
 * // With ProfilePhoto
 * <Avatar.ProfilePhoto size="lg" badge={<Avatar.VerifiedTick size="md" />}>
 *   <Avatar.Image src="/photo.jpg" alt="Jane Doe" />
 *   <Avatar.Fallback>JD</Avatar.Fallback>
 * </Avatar.ProfilePhoto>
 * ```
 */
export const VerifiedTick = React.forwardRef<SVGSVGElement, VerifiedTickProps>(
  ({ size = 'md', className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cx(`tale-avatar-verified-tick tale-avatar-verified-tick--${size}`, className)}
      {...props}
    >
      {/* Seal / badge shape */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 1.5L12.39 3.21L15.32 3.01L16.22 5.78L18.66 7.08L18 10L18.66 12.92L16.22 14.22L15.32 16.99L12.39 16.79L10 18.5L7.61 16.79L4.68 16.99L3.78 14.22L1.34 12.92L2 10L1.34 7.08L3.78 5.78L4.68 3.01L7.61 3.21L10 1.5Z"
        fill="var(--color-60)"
      />
      {/* Checkmark */}
      <path
        d="M7 10.5L9 12.5L13 8"
        stroke="var(--color-60-fg)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
);
VerifiedTick.displayName = 'Avatar.VerifiedTick';

// ── ProfilePhoto ──────────────────────────────────────────────────────────────

type ProfilePhotoSize = 'sm' | 'md' | 'lg';

/** Maps ProfilePhoto size to the inner Avatar.Root size class. */
const profilePhotoAvatarSize: Record<ProfilePhotoSize, Size> = {
  sm: 'md',
  md: 'lg',
  lg: 'xl',
};

export interface ProfilePhotoProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Display size. Maps to md / lg / xl avatar dimensions respectively.
   * @default 'md'
   */
  size?: ProfilePhotoSize | undefined;
  /** Optional badge element positioned at the bottom-right corner (e.g. Avatar.VerifiedTick). */
  badge?: React.ReactNode | undefined;
}

/**
 * Enhanced avatar for profile displays — adds a contrast ring and optional badge slot.
 * Place Avatar.Image and Avatar.Fallback as direct children.
 *
 * @example
 * ```tsx
 * import { Avatar } from '@tale-ui/react/avatar';
 *
 * <Avatar.ProfilePhoto size="lg" badge={<Avatar.VerifiedTick size="md" />}>
 *   <Avatar.Image src="/photo.jpg" alt="Jane Doe" />
 *   <Avatar.Fallback>JD</Avatar.Fallback>
 * </Avatar.ProfilePhoto>
 * ```
 */
export const ProfilePhoto = React.forwardRef<HTMLSpanElement, ProfilePhotoProps>(
  ({ size = 'md', badge, className, children, ...props }, ref) => {
    const avatarSize = profilePhotoAvatarSize[size];
    return (
      <span
        ref={ref}
        className={cx(`tale-avatar-profile-photo tale-avatar-profile-photo--${size}`, className)}
        {...props}
      >
        <span className={`tale-avatar tale-avatar--${avatarSize} tale-avatar-profile-photo__inner`}>
          {children}
        </span>
        {badge != null && <span className="tale-avatar-profile-photo__badge">{badge}</span>}
      </span>
    );
  },
);
ProfilePhoto.displayName = 'Avatar.ProfilePhoto';
