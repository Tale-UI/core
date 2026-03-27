import * as React from 'react';
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
} from 'react-aria-components';
import type {
  RadioProps as AriaRadioProps,
  RadioGroupProps as AriaRadioGroupProps,
} from 'react-aria-components';
import { cx } from '../_cx';
import { SizeContext, useSize } from '../_SizeContext';

type Size = 'sm' | 'md' | 'lg';

export interface RadioRootProps extends Omit<AriaRadioProps, 'className'> {
  size?: Size | undefined;
  className?: string | undefined;
}

/**
 * A radio button with indicator and label. Use inside Radio.Group.
 *
 * @example
 * ```tsx
 * import { Radio } from '@tale-ui/react/radio';
 *
 * <Radio.Group label="Favorite color">
 *   <Radio.Root value="red"><Radio.Indicator /> Red</Radio.Root>
 *   <Radio.Root value="green"><Radio.Indicator /> Green</Radio.Root>
 *   <Radio.Root value="blue"><Radio.Indicator /> Blue</Radio.Root>
 * </Radio.Group>
 * ```
 */
export const Root = React.forwardRef<HTMLLabelElement, RadioRootProps>(
  ({ size: sizeProp, className, ...props }, ref) => {
    const size = useSize(sizeProp, 'md');
    return (
      <AriaRadio
        ref={ref}
        className={cx(size !== 'md' ? `tale-radio tale-radio--${size}` : 'tale-radio', className)}
        {...props}
      />
    );
  },
);
Root.displayName = 'Radio.Root';

export interface RadioIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string | undefined;
}

export const Indicator = React.forwardRef<HTMLSpanElement, RadioIndicatorProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-radio__indicator', className)} {...props} />
  ),
);
Indicator.displayName = 'Radio.Indicator';

export interface RadioGroupProps extends Omit<AriaRadioGroupProps, 'className'> {
  className?: string | undefined;
  /** An accessible label for the radio group. */
  label?: string;
  /** A description for the radio group. Displays below the group. */
  description?: string;
  /** Size propagated to child Radio.Root components. */
  size?: Size | undefined;
}

/**
 * A group of radio buttons allowing single selection.
 *
 * @example
 * ```tsx
 * import { Radio } from '@tale-ui/react/radio';
 *
 * <Radio.Group label="Favorite color">
 *   <Radio.Root value="red"><Radio.Indicator /> Red</Radio.Root>
 *   <Radio.Root value="green"><Radio.Indicator /> Green</Radio.Root>
 *   <Radio.Root value="blue"><Radio.Indicator /> Blue</Radio.Root>
 * </Radio.Group>
 * ```
 */
export const Group = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ size, className, ...props }, ref) => {
    const group = <AriaRadioGroup ref={ref} className={cx('tale-radio-group', className)} {...props} />;
    return size ? <SizeContext.Provider value={size}>{group}</SizeContext.Provider> : group;
  },
);
Group.displayName = 'Radio.Group';

export const Dot = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-radio__dot', className)} {...props} />
  ),
);
Dot.displayName = 'Radio.Dot';

/* ─── Visual ────────────────��─────────────────────────────────────────────── */

export interface RadioVisualProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className'> {
  /** Whether the radio visual appears selected. */
  checked?: boolean;
  /** Additional CSS class name. */
  className?: string;
}

/**
 * Render-only radio indicator **without** React Aria behaviour.
 * Use only when building new components where behaviour is provided externally.
 * Do NOT use in application UI — use Radio.Root instead.
 *
 * @example
 * ```tsx
 * <CustomCard selected={isSelected}>
 *   <Radio.Visual checked={isSelected} />
 *   Option label
 * </CustomCard>
 * ```
 */
export const Visual = React.forwardRef<HTMLSpanElement, RadioVisualProps>(
  ({ checked, className, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden="true"
      data-selected={checked || undefined}
      className={cx('tale-radio__indicator', className)}
      {...props}
    />
  ),
);
Visual.displayName = 'Radio.Visual';
