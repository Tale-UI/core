import * as React from 'react';
import { Form as AriaForm } from 'react-aria-components';
import type { FormProps as AriaFormProps } from 'react-aria-components';
import { cx } from '../_cx';

export interface FormProps extends Omit<AriaFormProps, 'className'> {
  className?: string | undefined;
}

/**
 * A form wrapper with built-in validation support.
 *
 * @example
 * ```tsx
 * import { Form } from '@tale-ui/react/form';
 * import { TextField } from '@tale-ui/react/text-field';
 * import { Button } from '@tale-ui/react/button';
 *
 * <Form onSubmit={(e) => { e.preventDefault(); }}>
 *   <TextField.Root isRequired>
 *     <TextField.Label>Username</TextField.Label>
 *     <TextField.Input />
 *   </TextField.Root>
 *   <Button type="submit" variant="primary">Submit</Button>
 * </Form>
 * ```
 */
export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, ...props }, ref) => (
    <AriaForm ref={ref} className={cx('tale-form', className)} {...props} />
  ),
);
Form.displayName = 'Form';
