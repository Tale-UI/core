import * as React from 'react';
import { cx } from '../_cx';

type Variant = 'display' | 'heading' | 'title' | 'label' | 'text' | 'mono';
type Size = 'xs' | 's' | 'm' | 'l';
type Color = 'default' | 'muted' | 'accent';
type TextElement = 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'label';

/** Maps component variant names to the CSS utility class prefix in `_typography.css`. */
const VARIANT_CLASS: Record<Variant, string> = {
  display: 'display',
  heading: 'heading',
  title: 'title',
  label: 'label',
  text: 'body',
  mono: 'mono',
};

export interface TextProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className' | 'color'> {
  /** Typography variant. @default 'text' */
  variant?: Variant | undefined;
  /** Typography size. @default 'm' */
  size?: Size | undefined;
  /** HTML element to render. @default 'span' */
  as?: TextElement | undefined;
  /** Text colour. `'muted'` uses `--neutral-60`, `'accent'` uses `--color-60`. @default 'default' */
  color?: Color | undefined;
  className?: string | undefined;
}

/**
 * Polymorphic typography wrapper that maps to the design system's typography tokens.
 *
 * @example
 * ```tsx
 * import { Text } from '@tale-ui/react/text';
 *
 * <Text variant="heading" size="l" as="h1">Page title</Text>
 * <Text variant="text" color="muted">Secondary info</Text>
 * <Text variant="mono" size="s" as="code">const x = 1;</Text>
 * ```
 */
export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ variant = 'text', size = 'm', as: Tag = 'span', color = 'default', className, ...props }, ref) => {
    const typographyClass = `text--${VARIANT_CLASS[variant]}-${size}`;
    const colorClass = color !== 'default' ? `tale-text--${color}` : '';
    return (
      <Tag
        ref={ref as React.Ref<any>}
        className={cx(
          `tale-text ${typographyClass}${colorClass ? ` ${colorClass}` : ''}`,
          className,
        )}
        {...props}
      />
    );
  },
);
Text.displayName = 'Text';
