import * as React from 'react';
import { Field as H } from '@tale-ui/react/field';
import { cx } from '../_cx';

export const Root = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-field', className)} ref={ref} {...props} />
));
Root.displayName = 'Field.Root';

export const Label = React.forwardRef<
  React.ComponentRef<typeof H.Label>,
  React.ComponentPropsWithoutRef<typeof H.Label>
>(({ className, ...props }, ref) => (
  <H.Label className={cx('tale-field__label', className)} ref={ref} {...props} />
));
Label.displayName = 'Field.Label';

export const Description = React.forwardRef<
  React.ComponentRef<typeof H.Description>,
  React.ComponentPropsWithoutRef<typeof H.Description>
>(({ className, ...props }, ref) => (
  <H.Description className={cx('tale-field__description', className)} ref={ref} {...props} />
));
Description.displayName = 'Field.Description';

export const Error = React.forwardRef<
  React.ComponentRef<typeof H.Error>,
  React.ComponentPropsWithoutRef<typeof H.Error>
>(({ className, ...props }, ref) => (
  <H.Error className={cx('tale-field__error', className)} ref={ref} {...props} />
));
Error.displayName = 'Field.Error';
