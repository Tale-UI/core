import * as React from 'react';
import {
  TextField as AriaTextField,
  Group as AriaGroup,
  Input as AriaInput,
  Label as AriaLabel,
  Text as AriaText,
  FieldError as AriaFieldError,
  type TextFieldProps as AriaTextFieldProps,
  type GroupProps as AriaGroupProps,
  type InputProps as AriaInputProps,
  type LabelProps as AriaLabelProps,
  type TextProps as AriaTextProps,
} from 'react-aria-components';
import { CreditCard } from 'lucide-react';
import { Icon } from '../icon';
import { cx } from '../_cx';

/* ─── Internal utilities ──────────────────────────────────────────────────── */

type CardType = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

function detectCardType(digits: string): CardType {
  if (!digits) return 'unknown';

  if (digits[0] === '4') return 'visa';

  const two = parseInt(digits.slice(0, 2), 10);
  if (two >= 51 && two <= 55) return 'mastercard';
  const four = parseInt(digits.slice(0, 4), 10);
  if (four >= 2221 && four <= 2720) return 'mastercard';

  if (two === 34 || two === 37) return 'amex';

  if (digits.startsWith('6011') || digits.startsWith('65')) return 'discover';
  const three = parseInt(digits.slice(0, 3), 10);
  if (three >= 644 && three <= 649) return 'discover';

  return 'unknown';
}

function formatCardNumber(digits: string, cardType: CardType): string {
  if (cardType === 'amex') {
    const max = digits.slice(0, 15);
    const parts: string[] = [];
    if (max.length > 0) parts.push(max.slice(0, 4));
    if (max.length > 4) parts.push(max.slice(4, 10));
    if (max.length > 10) parts.push(max.slice(10, 15));
    return parts.join(' ');
  }

  const max = digits.slice(0, 16);
  const parts: string[] = [];
  for (let i = 0; i < max.length; i += 4) {
    parts.push(max.slice(i, i + 4));
  }
  return parts.join(' ');
}

/* ─── Context ─────────────────────────────────────────────────────────────── */

interface PaymentInputContextValue {
  digits: string;
  setDigits: (digits: string) => void;
}

const PaymentInputContext = React.createContext<PaymentInputContextValue>({
  digits: '',
  setDigits: () => {},
});

/* ─── Root (TextField) ────────────────────────────────────────────────────── */

export interface RootProps extends Omit<AriaTextFieldProps, 'className'> {
  className?: string | undefined;
}

/**
 * A credit card number input with auto-formatting and card type detection.
 *
 * @example
 * ```tsx
 * import { PaymentInput } from '@tale-ui/react/payment-input';
 *
 * <PaymentInput.Root>
 *   <PaymentInput.Label>Card number</PaymentInput.Label>
 *   <PaymentInput.Group>
 *     <PaymentInput.Input placeholder="1234 5678 9012 3456" />
 *     <PaymentInput.CardIcon />
 *   </PaymentInput.Group>
 * </PaymentInput.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const [digits, setDigitsState] = React.useState('');

    const cardType = detectCardType(digits);
    const formatted = digits ? formatCardNumber(digits, cardType) : (value ?? '');

    const setDigits = React.useCallback(
      (newDigits: string) => {
        setDigitsState(newDigits);
        const ct = detectCardType(newDigits);
        const fmt = formatCardNumber(newDigits, ct);
        onChange?.(fmt);
      },
      [onChange],
    );

    const ctx = React.useMemo(
      () => ({ digits, setDigits }),
      [digits, setDigits],
    );

    return (
      <PaymentInputContext.Provider value={ctx}>
        <AriaTextField
          ref={ref}
          className={cx('tale-payment-input', className)}
          value={String(formatted)}
          onChange={(v) => {
            const raw = v.replace(/\D/g, '');
            setDigits(raw);
          }}
          {...props}
        />
      </PaymentInputContext.Provider>
    );
  },
);
Root.displayName = 'PaymentInput.Root';

/* ─── Group ───────────────────────────────────────────────────────────────── */

export interface GroupProps extends Omit<AriaGroupProps, 'className'> {
  className?: string | undefined;
}

export const Group = React.forwardRef<HTMLDivElement, GroupProps>(
  ({ className, ...props }, ref) => (
    <AriaGroup
      ref={ref}
      className={cx('tale-payment-input__group', className)}
      {...props}
    />
  ),
);
Group.displayName = 'PaymentInput.Group';

/* ─── Input ───────────────────────────────────────────────────────────────── */

export interface InputProps extends Omit<AriaInputProps, 'className'> {
  className?: string | undefined;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <AriaInput
      ref={ref}
      inputMode="numeric"
      className={cx('tale-payment-input__input', className)}
      {...props}
    />
  ),
);
Input.displayName = 'PaymentInput.Input';

/* ─── Label ───────────────────────────────────────────────────────────────── */

export interface LabelProps extends Omit<AriaLabelProps, 'className'> {
  className?: string | undefined;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <AriaLabel
      ref={ref}
      className={cx('tale-payment-input__label', className)}
      {...props}
    />
  ),
);
Label.displayName = 'PaymentInput.Label';

/* ─── Description ─────────────────────────────────────────────────────────── */

export interface DescriptionProps extends Omit<AriaTextProps, 'className' | 'slot'> {
  className?: string | undefined;
}

export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  ({ className, ...props }, ref) => (
    <AriaText
      ref={ref}
      slot="description"
      className={cx('tale-payment-input__description', className)}
      {...props}
    />
  ),
);
Description.displayName = 'PaymentInput.Description';

/* ─── ErrorMessage ────────────────────────────────────────────────────────── */

export interface ErrorMessageProps extends Omit<AriaTextProps, 'className' | 'slot'> {
  className?: string | undefined;
}

export const ErrorMessage = React.forwardRef<HTMLElement, ErrorMessageProps>(
  ({ className, ...props }, ref) => (
    <AriaFieldError
      ref={ref}
      className={cx('tale-payment-input__error', className)}
      {...props}
    />
  ),
);
ErrorMessage.displayName = 'PaymentInput.ErrorMessage';

/* ─── CardIcon ────────────────────────────────────────────────────────────── */

export interface CardIconProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className' | 'children'> {
  className?: string | undefined;
}

export const CardIcon = React.forwardRef<HTMLSpanElement, CardIconProps>(
  ({ className, ...props }, ref) => {
    const { digits } = React.useContext(PaymentInputContext);
    const cardType = detectCardType(digits);

    return (
      <span
        ref={ref}
        className={cx('tale-payment-input__card-icon', className)}
        data-card-type={cardType}
        {...props}
      >
        <Icon icon={CreditCard} size="sm" />
      </span>
    );
  },
);
CardIcon.displayName = 'PaymentInput.CardIcon';
