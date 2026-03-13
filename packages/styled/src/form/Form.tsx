import * as React from 'react';
import { Form as H } from '@tale-ui/react/form';
import { cx } from '../_cx';

export const Form = React.forwardRef<
  React.ComponentRef<typeof H>,
  React.ComponentPropsWithoutRef<typeof H>
>(({ className, ...props }, ref) => (
  <H className={cx('tale-form', className)} ref={ref} {...props} />
));
Form.displayName = 'Form';
