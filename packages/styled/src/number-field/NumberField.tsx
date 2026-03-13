import * as React from 'react';
import { NumberField as H } from '@tale-ui/react/number-field';
import { cx } from '../_cx';

export const Root = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-number-field', className)} ref={ref} {...props} />
));
Root.displayName = 'NumberField.Root';

export const Group = React.forwardRef<
  React.ComponentRef<typeof H.Group>,
  React.ComponentPropsWithoutRef<typeof H.Group>
>(({ className, ...props }, ref) => (
  <H.Group className={cx('tale-number-field__group', className)} ref={ref} {...props} />
));
Group.displayName = 'NumberField.Group';

export const Decrement = React.forwardRef<
  React.ComponentRef<typeof H.Decrement>,
  React.ComponentPropsWithoutRef<typeof H.Decrement>
>(({ className, children = '−', ...props }, ref) => (
  <H.Decrement className={cx('tale-number-field__decrement', className)} ref={ref} {...props}>
    {children}
  </H.Decrement>
));
Decrement.displayName = 'NumberField.Decrement';

export const Input = React.forwardRef<
  React.ComponentRef<typeof H.Input>,
  React.ComponentPropsWithoutRef<typeof H.Input>
>(({ className, ...props }, ref) => (
  <H.Input className={cx('tale-number-field__input', className)} ref={ref} {...props} />
));
Input.displayName = 'NumberField.Input';

export const Increment = React.forwardRef<
  React.ComponentRef<typeof H.Increment>,
  React.ComponentPropsWithoutRef<typeof H.Increment>
>(({ className, children = '+', ...props }, ref) => (
  <H.Increment className={cx('tale-number-field__increment', className)} ref={ref} {...props}>
    {children}
  </H.Increment>
));
Increment.displayName = 'NumberField.Increment';
