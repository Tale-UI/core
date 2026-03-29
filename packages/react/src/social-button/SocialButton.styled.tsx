import * as React from 'react';
import { cx } from '../_cx';
import { SizeContext, useSize } from '../_SizeContext';

type Provider = 'google' | 'github' | 'apple' | 'x' | 'facebook';
type Size = 'sm' | 'md';

export interface SocialButtonProps extends Omit<React.ComponentPropsWithoutRef<'button'>, 'className'> {
  /** Social provider whose icon to display. */
  provider: Provider;
  /** Button size. Defaults to 'md'. */
  size?: Size | undefined;
  className?: string | undefined;
}

/* ─── Provider SVG icons ─────────────────────────────────────────────────── */

const GoogleIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4" />
    <path d="M12.24 24.0008C15.4764 24.0008 18.2058 22.9382 20.1944 21.1039L16.3274 18.1055C15.2516 18.8375 13.8626 19.252 12.2444 19.252C9.11376 19.252 6.45934 17.1399 5.50693 14.3003H1.51648V17.3912C3.55359 21.4434 7.70278 24.0008 12.24 24.0008Z" fill="#34A853" />
    <path d="M5.50253 14.3003C4.99987 12.8099 4.99987 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056-0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z" fill="#FBBC04" />
    <path d="M12.24 4.74966C13.9508 4.7232 15.6043 5.36697 16.8433 6.54867L20.2694 3.12262C18.1 1.0855 15.2207-0.034466 12.24 0.000808666C7.70277 0.000808666 3.55359 2.55822 1.51648 6.61481L5.50252 9.70575C6.45052 6.86173 9.10935 4.74966 12.24 4.74966Z" fill="#EA4335" />
  </svg>
);

const GitHubIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0a12 12 0 0 0-3.79 23.39c.6.1.83-.26.83-.57v-2.03c-3.34.73-4.05-1.61-4.05-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.31-.54-1.53.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.03 0c2.3-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.93.43.37.82 1.1.82 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 0Z" />
  </svg>
);

const AppleIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M20.8426 17.1449C20.5099 17.9135 20.1161 18.6211 19.6598 19.2715C19.0379 20.1583 18.5286 20.7721 18.1362 21.113C17.5278 21.6724 16.876 21.959 16.178 21.9753C15.6769 21.9753 15.0726 21.8327 14.3691 21.5434C13.6634 21.2555 13.0148 21.113 12.4218 21.113C11.7998 21.113 11.1328 21.2555 10.4193 21.5434C9.70475 21.8327 9.1291 21.9834 8.68898 21.9984C8.01963 22.0269 7.35246 21.7322 6.6865 21.113C6.26145 20.7422 5.7298 20.1067 5.09291 19.2063C4.40957 18.2449 3.84778 17.13 3.40766 15.8589C2.9363 14.486 2.70001 13.1565 2.70001 11.8694C2.70001 10.3951 3.01859 9.12345 3.65671 8.05784C4.15821 7.20191 4.82539 6.52672 5.66041 6.03105C6.49543 5.53539 7.39768 5.2828 8.36931 5.26664C8.90096 5.26664 9.59815 5.43109 10.4645 5.75429C11.3285 6.07858 11.8832 6.24303 12.1264 6.24303C12.3083 6.24303 12.9245 6.05074 13.9692 5.66738C14.9571 5.31186 15.7909 5.16466 16.474 5.22264C18.3249 5.37202 19.7155 6.10167 20.6403 7.41619C18.9849 8.4192 18.1661 9.82403 18.1824 11.6262C18.1973 13.03 18.7065 14.1981 19.7074 15.1256C20.1609 15.5561 20.6675 15.8888 21.231 16.1251C21.1088 16.4795 20.9798 16.819 20.8426 17.1449ZM16.5976 0.440369C16.5976 1.54062 16.1956 2.56792 15.3944 3.51878C14.4275 4.64917 13.258 5.30236 11.9898 5.19929C11.9737 5.06729 11.9643 4.92837 11.9643 4.78239C11.9643 3.72615 12.4241 2.59576 13.2407 1.67152C13.6483 1.20356 14.1668 0.814453 14.7955 0.504058C15.4229 0.198295 16.0164 0.0292007 16.5745 0.000244141C16.5908 0.147331 16.5976 0.294426 16.5976 0.440355V0.440369Z" fill="currentColor" />
  </svg>
);

const XIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M15.9455 23L10.396 15.0901L3.44886 23H0.509766L9.09209 13.2311L0.509766 1H8.05571L13.286 8.45502L19.8393 1H22.7784L14.5943 10.3165L23.4914 23H15.9455ZM19.2185 20.77H17.2398L4.71811 3.23H6.6971L11.7121 10.2532L12.5793 11.4719L19.2185 20.77Z" fill="currentColor" />
  </svg>
);

const FacebookIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z" fill="#1877F2" />
  </svg>
);

const providerIcons: Record<Provider, React.FC> = {
  google: GoogleIcon,
  github: GitHubIcon,
  apple: AppleIcon,
  x: XIcon,
  facebook: FacebookIcon,
};

/**
 * A social login button with a provider icon on the left.
 *
 * @example
 * ```tsx
 * import { SocialButton } from '@tale-ui/react/social-button';
 *
 * <SocialButton provider="google">Sign in with Google</SocialButton>
 * <SocialButton provider="github" size="sm">Continue with GitHub</SocialButton>
 * ```
 */
export const SocialButton = React.forwardRef<HTMLButtonElement, SocialButtonProps>(
  ({ provider, size: sizeProp, className, children, ...props }, ref) => {
    const size = useSize(sizeProp, 'md');
    const ProviderIcon = providerIcons[provider];

    return (
      <button
        ref={ref}
        type="button"
        className={cx(
          `tale-social-button tale-social-button--${size} tale-social-button--${provider}`,
          className,
        )}
        {...props}
      >
        <span className="tale-social-button__icon">
          <ProviderIcon />
        </span>
        {children}
      </button>
    );
  },
);
SocialButton.displayName = 'SocialButton';

/* ─── SocialButtonGroup ─────────────────────────────────────────────────── */

export interface SocialButtonGroupProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  /** Size propagated to all child SocialButton components. */
  size?: Size | undefined;
  className?: string | undefined;
}

/**
 * Groups SocialButton components with equal width and centered content.
 *
 * @example
 * ```tsx
 * import { SocialButton, SocialButtonGroup } from '@tale-ui/react/social-button';
 *
 * <SocialButtonGroup>
 *   <SocialButton provider="google">Sign in with Google</SocialButton>
 *   <SocialButton provider="github">Continue with GitHub</SocialButton>
 *   <SocialButton provider="apple">Sign in with Apple</SocialButton>
 * </SocialButtonGroup>
 * ```
 */
export const SocialButtonGroup = React.forwardRef<HTMLDivElement, SocialButtonGroupProps>(
  ({ size, className, children, ...props }, ref) => {
    const content = (
      <div
        ref={ref}
        role="group"
        className={cx('tale-social-button-group', className)}
        {...props}
      >
        {children}
      </div>
    );

    return size != null ? (
      <SizeContext.Provider value={size}>{content}</SizeContext.Provider>
    ) : (
      content
    );
  },
);
SocialButtonGroup.displayName = 'SocialButtonGroup';
