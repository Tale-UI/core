import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';
import type {
  FieldRootState,
  FieldRootProps,
  FieldRootActions,
} from './root/FieldRoot';

const StyledRoot = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-field', className)} ref={ref} {...props} />
));
StyledRoot.displayName = 'Field.Root';
export const Root = StyledRoot as typeof H.Root;

export namespace Root {
  export type State = FieldRootState;
  export type Props = FieldRootProps;
  export type Actions = FieldRootActions;
}

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

export { Control, Validity, Item } from './index.parts';
export type { ValidityData } from './index.parts';
