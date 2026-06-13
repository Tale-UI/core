import * as React from 'react';
import { cx } from '../_cx';

type Radius = 'none' | 'sm' | 'md' | 'lg' | 'full';
type Fit = 'cover' | 'contain' | 'fill' | 'none';

export interface ImageProps extends Omit<React.ComponentPropsWithoutRef<'img'>, 'className'> {
  /** Border radius. @default 'none' */
  radius?: Radius | undefined;
  /** Object-fit behaviour. @default 'cover' */
  fit?: Fit | undefined;
  /** Alt text (required for accessibility). */
  alt: string;
  className?: string | undefined;
}

/**
 * Styled image wrapper with radius and fit props.
 *
 * @example
 * ```tsx
 * import { Image } from '@tale-ui/react/image';
 *
 * <Image src="/photo.jpg" alt="A landscape" radius="md" fit="cover" />
 * ```
 */
export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ radius = 'none', fit = 'cover', className, ...props }, ref) => {
    const classes = ['tale-image'];
    if (radius !== 'none') {classes.push(`tale-image--${radius}`);}
    if (fit !== 'cover') {classes.push(`tale-image--${fit}`);}

    return (
      <img
        ref={ref}
        className={cx(classes.join(' '), className)}
        {...props}
      />
    );
  },
);
Image.displayName = 'Image';
