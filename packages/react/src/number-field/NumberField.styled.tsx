import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';
import type {
  NumberFieldRootState,
  NumberFieldRootProps,
  NumberFieldRootChangeEventReason,
  NumberFieldRootChangeEventDetails,
  NumberFieldRootCommitEventReason,
  NumberFieldRootCommitEventDetails,
} from './root/NumberFieldRoot';

const StyledRoot = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-number-field', className)} ref={ref} {...props} />
));
StyledRoot.displayName = 'NumberField.Root';
export const Root = StyledRoot as typeof H.Root;

export namespace Root {
  export type State = NumberFieldRootState;
  export type Props = NumberFieldRootProps;
  export type ChangeEventReason = NumberFieldRootChangeEventReason;
  export type ChangeEventDetails = NumberFieldRootChangeEventDetails;
  export type CommitEventReason = NumberFieldRootCommitEventReason;
  export type CommitEventDetails = NumberFieldRootCommitEventDetails;
}

const StyledGroup = React.forwardRef<
  React.ComponentRef<typeof H.Group>,
  React.ComponentPropsWithoutRef<typeof H.Group>
>(({ className, ...props }, ref) => (
  <H.Group className={cx('tale-number-field__group', className)} ref={ref} {...props} />
));
StyledGroup.displayName = 'NumberField.Group';
export const Group = StyledGroup as typeof H.Group;

const StyledDecrement = React.forwardRef<
  React.ComponentRef<typeof H.Decrement>,
  React.ComponentPropsWithoutRef<typeof H.Decrement>
>(({ className, children = '−', ...props }, ref) => (
  <H.Decrement className={cx('tale-number-field__decrement', className)} ref={ref} {...props}>
    {children}
  </H.Decrement>
));
StyledDecrement.displayName = 'NumberField.Decrement';
export const Decrement = StyledDecrement as typeof H.Decrement;

const StyledInput = React.forwardRef<
  React.ComponentRef<typeof H.Input>,
  React.ComponentPropsWithoutRef<typeof H.Input>
>(({ className, ...props }, ref) => (
  <H.Input className={cx('tale-number-field__input', className)} ref={ref} {...props} />
));
StyledInput.displayName = 'NumberField.Input';
export const Input = StyledInput as typeof H.Input;

const StyledIncrement = React.forwardRef<
  React.ComponentRef<typeof H.Increment>,
  React.ComponentPropsWithoutRef<typeof H.Increment>
>(({ className, children = '+', ...props }, ref) => (
  <H.Increment className={cx('tale-number-field__increment', className)} ref={ref} {...props}>
    {children}
  </H.Increment>
));
StyledIncrement.displayName = 'NumberField.Increment';
export const Increment = StyledIncrement as typeof H.Increment;

export { ScrubArea, ScrubAreaCursor } from './index.parts';
