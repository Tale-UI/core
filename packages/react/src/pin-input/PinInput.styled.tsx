import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { cx } from '../_cx';

/* ─── Root ─────────────────────────────────────────────────────────────────── */

export interface RootProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'onChange'> {
  /** Total number of input slots. */
  maxLength: number;
  /** Controlled value. */
  value?: string;
  /** Called when the value changes. */
  onChange?: (value: string) => void;
  /** Whether the input is disabled. */
  disabled?: boolean;
  /** Additional CSS class name. */
  className?: string;
}

/**
 * OTP / verification code input with individual digit slots.
 *
 * @example
 * ```tsx
 * import { PinInput } from '@tale-ui/react/pin-input';
 *
 * <PinInput.Root maxLength={6}>
 *   <PinInput.Group>
 *     <PinInput.Slot index={0} />
 *     <PinInput.Slot index={1} />
 *     <PinInput.Slot index={2} />
 *   </PinInput.Group>
 *   <PinInput.Separator />
 *   <PinInput.Group>
 *     <PinInput.Slot index={3} />
 *     <PinInput.Slot index={4} />
 *     <PinInput.Slot index={5} />
 *   </PinInput.Group>
 * </PinInput.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLInputElement, RootProps>(
  ({ maxLength, value, onChange, disabled, className, children, ...props }, ref) => (
    <OTPInput
      ref={ref}
      maxLength={maxLength}
      value={value}
      onChange={onChange}
      disabled={disabled}
      containerClassName={cx('tale-pin-input', className)}
      {...props}
    >
      {children}
    </OTPInput>
  ),
);
Root.displayName = 'PinInput.Root';

/* ─── Group ────────────────────────────────────────────────────────────────── */

export interface GroupProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  /** Additional CSS class name. */
  className?: string;
}

/**
 * Groups related slots together visually.
 *
 * @example
 * ```tsx
 * <PinInput.Group>
 *   <PinInput.Slot index={0} />
 *   <PinInput.Slot index={1} />
 *   <PinInput.Slot index={2} />
 * </PinInput.Group>
 * ```
 */
export const Group = React.forwardRef<HTMLDivElement, GroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cx('tale-pin-input__group', className)}
      {...props}
    />
  ),
);
Group.displayName = 'PinInput.Group';

/* ─── Slot ─────────────────────────────────────────────────────────────────── */

export interface SlotProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'children'> {
  /** Zero-based index into the OTP slots array. */
  index: number;
  /** Additional CSS class name. */
  className?: string;
}

/**
 * Renders a single digit slot. Reads its state from OTPInputContext.
 *
 * @example
 * ```tsx
 * <PinInput.Slot index={0} />
 * ```
 */
export const Slot = React.forwardRef<HTMLDivElement, SlotProps>(
  ({ index, className, ...props }, ref) => {
    const { slots } = React.useContext(OTPInputContext);
    const slot = slots?.[index];

    return (
      <div
        ref={ref}
        className={cx('tale-pin-input__slot', className)}
        data-active={slot?.isActive || undefined}
        data-filled={slot?.char ? '' : undefined}
        {...props}
      >
        {slot?.char}
        {slot?.hasFakeCaret && <span className="tale-pin-input__caret" />}
      </div>
    );
  },
);
Slot.displayName = 'PinInput.Slot';

/* ─── Separator ────────────────────────────────────────────────────────────── */

export interface SeparatorProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className'> {
  /** Additional CSS class name. */
  className?: string;
}

/**
 * A decorative separator between slot groups.
 *
 * @example
 * ```tsx
 * <PinInput.Separator />
 * ```
 */
export const Separator = React.forwardRef<HTMLSpanElement, SeparatorProps>(
  ({ className, children = '–', ...props }, ref) => (
    <span
      ref={ref}
      role="presentation"
      aria-hidden="true"
      className={cx('tale-pin-input__separator', className)}
      {...props}
    >
      {children}
    </span>
  ),
);
Separator.displayName = 'PinInput.Separator';
