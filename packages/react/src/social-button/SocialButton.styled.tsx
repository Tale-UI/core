import * as React from 'react';
import { cx } from '../_cx';

type Provider = 'google' | 'github' | 'apple' | 'x' | 'facebook';
type Size = 'sm' | 'md' | 'lg';

export interface SocialButtonProps extends Omit<React.ComponentPropsWithoutRef<'button'>, 'className'> {
  /** Social provider whose icon to display. */
  provider: Provider;
  /** Button size. Defaults to 'md'. */
  size?: Size | undefined;
  className?: string | undefined;
}

/* ─── Provider SVG icons ─────────────────────────────────────────────────── */

const GoogleIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62Z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 0 0 9 18Z" />
    <path fill="#FBBC05" d="M3.96 10.71A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3-2.33Z" />
    <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58Z" />
  </svg>
);

const GitHubIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
    <path d="M9 0a9 9 0 0 0-2.84 17.54c.45.08.62-.2.62-.43v-1.52c-2.51.55-3.04-1.21-3.04-1.21-.41-1.04-1-1.32-1-1.32-.82-.56.06-.55.06-.55.9.07 1.38.93 1.38.93.8 1.37 2.1.97 2.61.74.08-.58.31-.97.57-1.2-2-.23-4.1-1-4.1-4.46 0-.98.35-1.79.93-2.42-.1-.23-.4-1.15.08-2.39 0 0 .76-.24 2.48.93a8.6 8.6 0 0 1 4.52 0c1.72-1.17 2.48-.93 2.48-.93.49 1.24.18 2.16.09 2.39.58.63.92 1.44.92 2.42 0 3.47-2.11 4.23-4.12 4.45.33.28.62.83.62 1.68v2.49c0 .24.16.52.63.43A9 9 0 0 0 9 0Z" />
  </svg>
);

const AppleIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
    <path d="M14.94 15.21c-.72.7-1.5.65-2.25.3-.8-.37-1.52-.38-2.36 0-1.06.48-1.61.34-2.24-.3C4.85 12.14 5.27 6.88 8.66 6.69c.96.05 1.62.55 2.19.58.7-.14 1.37-.67 2.13-.6.91.08 1.59.48 2.03 1.18-1.86 1.12-1.42 3.57.27 4.25-.35.91-.79 1.8-1.46 2.67l.12.44ZM11.13 6.65c-1.17.07-2.15-.82-2.24-1.97.12-1.27 1.15-2.21 2.24-2.12 1.25.13 2.17 1.24 2.03 2.23-.14 1.04-.99 1.78-2.03 1.86Z" />
  </svg>
);

const XIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
    <path d="M13.9 2h2.36L10.84 8.16 17.22 16h-5l-3.9-5.1L3.73 16H1.36l5.8-6.62L1.08 2h5.12l3.53 4.66L13.9 2Zm-.83 12.58h1.31L5.24 3.35H3.83l9.24 11.23Z" />
  </svg>
);

const FacebookIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="#1877F2" aria-hidden="true">
    <path d="M18 9a9 9 0 1 0-10.41 8.89v-6.29H5.31V9h2.28V7.02c0-2.25 1.34-3.5 3.39-3.5.98 0 2.01.18 2.01.18v2.21h-1.13c-1.12 0-1.47.69-1.47 1.4V9h2.49l-.4 2.6h-2.09v6.29A9 9 0 0 0 18 9Z" />
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
 * <SocialButton provider="github" size="lg">Continue with GitHub</SocialButton>
 * ```
 */
export const SocialButton = React.forwardRef<HTMLButtonElement, SocialButtonProps>(
  ({ provider, size = 'md', className, children, ...props }, ref) => {
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
