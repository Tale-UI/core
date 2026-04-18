import * as React from 'react';
import { cx } from '../_cx';

// ─── Inline icons ────────────────────────────────────────────────────────────

function PaypassIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="24" viewBox="0 0 20 24" fill="none" aria-hidden {...props}>
      <g clipPath="url(#cc-paypass-clip)">
        <path
          d="M15.1429 1.28571C17.0236 4.54326 18.0138 8.23849 18.0138 12C18.0138 15.7615 17.0236 19.4567 15.1429 22.7143M10.4286 3.64285C11.8956 6.18374 12.6679 9.06602 12.6679 12C12.6679 14.934 11.8956 17.8162 10.4286 20.3571M5.92859 5.80713C6.98933 7.66394 7.54777 9.77022 7.54777 11.9143C7.54777 14.0583 6.98933 16.1646 5.92859 18.0214M1.42859 8.14285C2.19306 9.29983 2.59834 10.6362 2.59834 12C2.59834 13.3638 2.19306 14.7002 1.42859 15.8571"
          stroke="currentColor"
          strokeWidth="2.57143"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="cc-paypass-clip">
          <rect width="20" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function MastercardIconWhite(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="30" height="19" viewBox="0 0 30 19" fill="none" aria-hidden {...props}>
      <path
        opacity="0.5"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.9053 16.4392C13.3266 17.7699 11.2787 18.5733 9.04092 18.5733C4.04776 18.5733 0 14.5737 0 9.63994C0 4.70619 4.04776 0.706604 9.04092 0.706604C11.2787 0.706604 13.3266 1.50993 14.9053 2.84066C16.484 1.50993 18.5319 0.706604 20.7697 0.706604C25.7629 0.706604 29.8106 4.70619 29.8106 9.63994C29.8106 14.5737 25.7629 18.5733 20.7697 18.5733C18.5319 18.5733 16.484 17.7699 14.9053 16.4392Z"
        fill="white"
      />
      <path
        opacity="0.5"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.9053 16.4392C16.8492 14.8007 18.0818 12.3625 18.0818 9.63994C18.0818 6.91733 16.8492 4.47919 14.9053 2.84066C16.484 1.50993 18.5319 0.706604 20.7697 0.706604C25.7628 0.706604 29.8106 4.70619 29.8106 9.63994C29.8106 14.5737 25.7628 18.5733 20.7697 18.5733C18.5319 18.5733 16.484 17.7699 14.9053 16.4392Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.9053 16.4392C16.8492 14.8007 18.0818 12.3625 18.0818 9.63995C18.0818 6.91736 16.8492 4.47924 14.9053 2.8407C12.9614 4.47924 11.7288 6.91736 11.7288 9.63995C11.7288 12.3625 12.9614 14.8007 14.9053 16.4392Z"
        fill="white"
      />
    </svg>
  );
}

function MastercardIconColor(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="30" height="19" viewBox="0 0 30 19" fill="none" aria-hidden {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.9053 16.4393C13.3266 17.77 11.2787 18.5733 9.04092 18.5733C4.04776 18.5733 0 14.5737 0 9.64C0 4.70625 4.04776 0.706665 9.04092 0.706665C11.2787 0.706665 13.3266 1.51 14.9053 2.84072C16.484 1.51 18.5319 0.706665 20.7697 0.706665C25.7629 0.706665 29.8106 4.70625 29.8106 9.64C29.8106 14.5737 25.7629 18.5733 20.7697 18.5733C18.5319 18.5733 16.484 17.77 14.9053 16.4393Z"
        fill="#ED0006"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.9053 16.4393C16.8492 14.8007 18.0818 12.3626 18.0818 9.64C18.0818 6.91739 16.8492 4.47925 14.9053 2.84072C16.484 1.50999 18.5319 0.706665 20.7697 0.706665C25.7628 0.706665 29.8106 4.70625 29.8106 9.64C29.8106 14.5737 25.7628 18.5733 20.7697 18.5733C18.5319 18.5733 16.484 17.77 14.9053 16.4393Z"
        fill="#F9A000"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.9053 16.4393C16.8492 14.8008 18.0818 12.3627 18.0818 9.64007C18.0818 6.91748 16.8492 4.47936 14.9053 2.84082C12.9614 4.47936 11.7288 6.91748 11.7288 9.64007C11.7288 12.3627 12.9614 14.8008 14.9053 16.4393Z"
        fill="#FF5E00"
      />
    </svg>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

type CreditCardType =
  | 'transparent'
  | 'transparent-gradient'
  | 'brand-dark'
  | 'brand-light'
  | 'gray-dark'
  | 'gray-light'
  | 'transparent-strip'
  | 'gray-strip'
  | 'gradient-strip'
  | 'salmon-strip'
  | 'gray-strip-vertical'
  | 'gradient-strip-vertical'
  | 'salmon-strip-vertical';

const STRIP_TYPES: CreditCardType[] = ['transparent-strip', 'gray-strip', 'gradient-strip', 'salmon-strip'];
const VERTICAL_STRIP_TYPES: CreditCardType[] = ['gray-strip-vertical', 'gradient-strip-vertical', 'salmon-strip-vertical'];
const COLOR_LOGO_TYPES: CreditCardType[] = ['brand-dark', 'brand-light', 'gray-dark', 'gray-light'];

// ─── Root ────────────────────────────────────────────────────────────────────

export interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The company name shown in the top-left corner. @default 'Company' */
  company?: string | undefined;
  /** The 16-digit card number. @default '1234 1234 1234 1234' */
  cardNumber?: string | undefined;
  /** The cardholder name. @default 'OLIVIA RHYE' */
  cardHolder?: string | undefined;
  /** Expiration date string. @default '06/28' */
  cardExpiration?: string | undefined;
  /**
   * Visual style of the card.
   * @default 'brand-dark'
   */
  type?: CreditCardType | undefined;
  /**
   * Desired rendered width in pixels. Height is automatically calculated to maintain
   * the 316 × 190 aspect ratio. Defaults to the native 316 px width.
   */
  width?: number | undefined;
}

/**
 * Visual credit-card display component. Supports 13 decorative style variants
 * with configurable card details.
 *
 * @example
 * ```tsx
 * import { CreditCard } from '@tale-ui/react/credit-card';
 *
 * // Default brand-dark card
 * <CreditCard.Root company="Acme Inc." cardNumber="4242 4242 4242 4242" />
 *
 * // Scaled to 240 px wide (height adjusts proportionally)
 * <CreditCard.Root type="gray-light" width={240} />
 *
 * // Gradient strip variant
 * <CreditCard.Root type="gradient-strip" cardHolder="JOHN DOE" cardExpiration="12/27" />
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  (
    {
      company = 'Company',
      cardNumber = '1234 1234 1234 1234',
      cardHolder = 'OLIVIA RHYE',
      cardExpiration = '06/28',
      type = 'brand-dark',
      width,
      className,
      ...rest
    },
    ref,
  ) => {
    const originalWidth = 316;
    const originalHeight = 190;

    const { scale, scaledWidth, scaledHeight } = React.useMemo(() => {
      if (!width) { return { scale: 1, scaledWidth: originalWidth, scaledHeight: originalHeight }; }
      const s = width / originalWidth;
      return {
        scale: s,
        // Round up so the wrapper always fully contains the scaled visual.
        scaledWidth: Math.ceil(width),
        scaledHeight: Math.ceil(originalHeight * s),
      };
    }, [width]);

    const isStrip = STRIP_TYPES.includes(type);
    const isVerticalStrip = VERTICAL_STRIP_TYPES.includes(type);
    const isColorLogo = COLOR_LOGO_TYPES.includes(type);

    return (
      <div
        ref={ref}
        style={{ width: `${scaledWidth}px`, height: `${scaledHeight}px` }}
        className={cx('tale-credit-card', className)}
        {...rest}
      >
        <div
          style={{
            transform: scale !== 1 ? `scale(${scale})` : undefined,
            width: `${originalWidth}px`,
            height: `${originalHeight}px`,
          }}
          className={`tale-credit-card__inner tale-credit-card__inner--${type}`}
        >
          {/* Horizontal strip overlay */}
          {isStrip && <div className="tale-credit-card__strip" />}
          {/* Vertical strip overlay */}
          {isVerticalStrip && <div className="tale-credit-card__strip-vertical" />}
          {/* Colour blobs for transparent-gradient */}
          {type === 'transparent-gradient' && (
            <div className="tale-credit-card__gradient-diffusor" aria-hidden>
              <div className="tale-credit-card__blob tale-credit-card__blob--pink" />
              <div className="tale-credit-card__blob tale-credit-card__blob--orange" />
              <div className="tale-credit-card__blob tale-credit-card__blob--blue" />
              <div className="tale-credit-card__blob tale-credit-card__blob--green" />
            </div>
          )}

          {/* Header row */}
          <div className="tale-credit-card__header">
            <span className="tale-credit-card__company">{company}</span>
            <PaypassIcon className="tale-credit-card__paypass" />
          </div>

          {/* Footer row */}
          <div className="tale-credit-card__footer">
            <div className="tale-credit-card__details">
              <div className="tale-credit-card__name-row">
                <p className="tale-credit-card__holder">{cardHolder}</p>
                <p className="tale-credit-card__expiration">{cardExpiration}</p>
              </div>
              <div className="tale-credit-card__number">
                {cardNumber}
                {/* Placeholder keeps layout stable when cardNumber is empty */}
                <span className="tale-credit-card__number-placeholder" aria-hidden>
                  1
                </span>
              </div>
            </div>

            <div className="tale-credit-card__logo-wrap">
              {isColorLogo ? <MastercardIconColor /> : <MastercardIconWhite />}
            </div>
          </div>
        </div>
      </div>
    );
  },
);
Root.displayName = 'CreditCard.Root';
