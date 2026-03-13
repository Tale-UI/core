import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';
import type {
  DialogRootProps,
  DialogRootActions,
  DialogRootChangeEventReason,
  DialogRootChangeEventDetails,
} from './root/DialogRoot';
import type { DialogPopupProps, DialogPopupState } from './popup/DialogPopup';
import type { DialogPortalProps } from './portal/DialogPortal';
import type {
  DialogTriggerProps,
  DialogTriggerState,
} from './trigger/DialogTrigger';

export const Root = H.Root;

export namespace Root {
    export type Props<Payload = unknown> = DialogRootProps<Payload>;
  export type Actions = DialogRootActions;
  export type ChangeEventReason = DialogRootChangeEventReason;
  export type ChangeEventDetails = DialogRootChangeEventDetails;
}

export const Portal = H.Portal;

export namespace Portal {
  export type Props = DialogPortalProps;
}

export const Viewport = H.Viewport;
export const Trigger = H.Trigger;

export namespace Trigger {
    export type Props<Payload = unknown> = DialogTriggerProps<Payload>;
  export type State = DialogTriggerState;
}

export const createHandle = H.createHandle;
export const Handle = H.Handle;

const StyledBackdrop = React.forwardRef<
  React.ComponentRef<typeof H.Backdrop>,
  React.ComponentPropsWithoutRef<typeof H.Backdrop>
>(({ className, ...props }, ref) => (
  <H.Backdrop className={cx('tale-dialog__backdrop', className)} ref={ref} {...props} />
));
StyledBackdrop.displayName = 'Dialog.Backdrop';
export const Backdrop = StyledBackdrop as typeof H.Backdrop;

const StyledPopup = React.forwardRef<
  React.ComponentRef<typeof H.Popup>,
  React.ComponentPropsWithoutRef<typeof H.Popup>
>(({ className, ...props }, ref) => (
  <H.Popup className={cx('tale-dialog__popup', className)} ref={ref} {...props} />
));
StyledPopup.displayName = 'Dialog.Popup';
export const Popup = StyledPopup as typeof H.Popup;

export namespace Popup {
  export type Props = DialogPopupProps;
  export type State = DialogPopupState;
}

const StyledTitle = React.forwardRef<
  React.ComponentRef<typeof H.Title>,
  React.ComponentPropsWithoutRef<typeof H.Title>
>(({ className, ...props }, ref) => (
  <H.Title className={cx('tale-dialog__title', className)} ref={ref} {...props} />
));
StyledTitle.displayName = 'Dialog.Title';
export const Title = StyledTitle as typeof H.Title;

const StyledDescription = React.forwardRef<
  React.ComponentRef<typeof H.Description>,
  React.ComponentPropsWithoutRef<typeof H.Description>
>(({ className, ...props }, ref) => (
  <H.Description className={cx('tale-dialog__description', className)} ref={ref} {...props} />
));
StyledDescription.displayName = 'Dialog.Description';
export const Description = StyledDescription as typeof H.Description;

export const Close = H.Close;
