import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';
import type {
  PopoverRootState,
  PopoverRootProps,
  PopoverRootActions,
  PopoverRootChangeEventReason,
  PopoverRootChangeEventDetails,
} from './root/PopoverRoot';
import type {
  PopoverTriggerState,
  PopoverTriggerProps,
} from './trigger/PopoverTrigger';
import type { PopoverPortalProps } from './portal/PopoverPortal';
import type {
  PopoverPositionerState,
  PopoverPositionerProps,
} from './positioner/PopoverPositioner';
import type {
  PopoverPopupState,
  PopoverPopupProps,
} from './popup/PopoverPopup';

export const Root = H.Root;

export namespace Root {
  export type State = PopoverRootState;
    export type Props<Payload = unknown> = PopoverRootProps<Payload>;
  export type Actions = PopoverRootActions;
  export type ChangeEventReason = PopoverRootChangeEventReason;
  export type ChangeEventDetails = PopoverRootChangeEventDetails;
}

export const Trigger = H.Trigger;

export namespace Trigger {
  export type State = PopoverTriggerState;
    export type Props<Payload = unknown> = PopoverTriggerProps<Payload>;
}

export const Portal = H.Portal;

export namespace Portal {
  export type Props = PopoverPortalProps;
}

export const Positioner = H.Positioner;

export namespace Positioner {
  export type State = PopoverPositionerState;
  export type Props = PopoverPositionerProps;
}

export const Backdrop = H.Backdrop;
export const Viewport = H.Viewport;
export const createHandle = H.createHandle;
export const Handle = H.Handle;

const StyledArrow = React.forwardRef<
  React.ComponentRef<typeof H.Arrow>,
  React.ComponentPropsWithoutRef<typeof H.Arrow>
>(({ className, ...props }, ref) => (
  <H.Arrow className={cx('tale-popover__arrow', className)} ref={ref} {...props} />
));
StyledArrow.displayName = 'Popover.Arrow';
export const Arrow = StyledArrow as typeof H.Arrow;

const StyledPopup = React.forwardRef<
  React.ComponentRef<typeof H.Popup>,
  React.ComponentPropsWithoutRef<typeof H.Popup>
>(({ className, ...props }, ref) => (
  <H.Popup className={cx('tale-popover__popup', className)} ref={ref} {...props} />
));
StyledPopup.displayName = 'Popover.Popup';
export const Popup = StyledPopup as typeof H.Popup;

export namespace Popup {
  export type State = PopoverPopupState;
  export type Props = PopoverPopupProps;
}

const StyledTitle = React.forwardRef<
  React.ComponentRef<typeof H.Title>,
  React.ComponentPropsWithoutRef<typeof H.Title>
>(({ className, ...props }, ref) => (
  <H.Title className={cx('tale-popover__title', className)} ref={ref} {...props} />
));
StyledTitle.displayName = 'Popover.Title';
export const Title = StyledTitle as typeof H.Title;

const StyledDescription = React.forwardRef<
  React.ComponentRef<typeof H.Description>,
  React.ComponentPropsWithoutRef<typeof H.Description>
>(({ className, ...props }, ref) => (
  <H.Description className={cx('tale-popover__description', className)} ref={ref} {...props} />
));
StyledDescription.displayName = 'Popover.Description';
export const Description = StyledDescription as typeof H.Description;

const StyledClose = React.forwardRef<
  React.ComponentRef<typeof H.Close>,
  React.ComponentPropsWithoutRef<typeof H.Close>
>(({ className, ...props }, ref) => (
  <H.Close className={cx('tale-popover__close', className)} ref={ref} {...props} />
));
StyledClose.displayName = 'Popover.Close';
export const Close = StyledClose as typeof H.Close;
