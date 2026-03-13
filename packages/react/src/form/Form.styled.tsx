import * as React from 'react';
import { Form as H } from './Form';
import type {
  FormProps,
  FormState,
  FormActions,
  FormValidationMode,
  FormSubmitEventReason,
  FormSubmitEventDetails,
} from './Form';
import { cx } from '../_cx';

const StyledForm = React.forwardRef<
  React.ComponentRef<typeof H>,
  React.ComponentPropsWithoutRef<typeof H>
>(({ className, ...props }, ref) => (
  <H className={cx('tale-form', className)} ref={ref} {...props} />
));
StyledForm.displayName = 'Form';
export const Form = StyledForm as typeof H;

export namespace Form {
  export type Props<FormValues extends Record<string, any> = Record<string, any>> =
    FormProps<FormValues>;
  export type State = FormState;
  export type Actions = FormActions;
  export type ValidationMode = FormValidationMode;
  export type SubmitEventReason = FormSubmitEventReason;
  export type SubmitEventDetails = FormSubmitEventDetails;
    export type Values<FormValues extends Record<string, any> = Record<string, any>> = FormValues;
}
