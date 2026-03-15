import * as React from 'react';
import { Form as AriaForm } from 'react-aria-components';
import type { FormProps as AriaFormProps } from 'react-aria-components';
import { cx } from '../_cx';

export interface FormProps extends Omit<AriaFormProps, 'className'> {
  className?: string | undefined;
}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, ...props }, ref) => (
    <AriaForm ref={ref} className={cx('tale-form', className)} {...props} />
  ),
);
Form.displayName = 'Form';
