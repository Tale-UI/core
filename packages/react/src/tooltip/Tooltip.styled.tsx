import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';
import type {
  TooltipRootState,
  TooltipRootProps,
  TooltipRootActions,
  TooltipRootChangeEventReason,
  TooltipRootChangeEventDetails,
} from './root/TooltipRoot';
import type {
  TooltipTriggerState,
  TooltipTriggerProps,
} from './trigger/TooltipTrigger';
import type { TooltipPortalProps } from './portal/TooltipPortal';
import type {
  TooltipPositionerState,
  TooltipPositionerProps,
} from './positioner/TooltipPositioner';
import type {
  TooltipPopupState,
  TooltipPopupProps,
} from './popup/TooltipPopup';

export const Root = H.Root;

export namespace Root {
  export type State = TooltipRootState;
    export type Props<Payload = unknown> = TooltipRootProps<Payload>;
  export type Actions = TooltipRootActions;
  export type ChangeEventReason = TooltipRootChangeEventReason;
  export type ChangeEventDetails = TooltipRootChangeEventDetails;
}

export const Trigger = H.Trigger;

export namespace Trigger {
  export type State = TooltipTriggerState;
    export type Props<Payload = unknown> = TooltipTriggerProps<Payload>;
}

export const Portal = H.Portal;

export namespace Portal {
  export type Props = TooltipPortalProps;
}

export const Positioner = H.Positioner;

export namespace Positioner {
  export type State = TooltipPositionerState;
  export type Props = TooltipPositionerProps;
}

export const Provider = H.Provider;
export const Viewport = H.Viewport;
export const createHandle = H.createHandle;
export const Handle = H.Handle;

const StyledPopup = React.forwardRef<
  React.ComponentRef<typeof H.Popup>,
  React.ComponentPropsWithoutRef<typeof H.Popup>
>(({ className, ...props }, ref) => (
  <H.Popup className={cx('tale-tooltip__popup', className)} ref={ref} {...props} />
));
StyledPopup.displayName = 'Tooltip.Popup';
export const Popup = StyledPopup as typeof H.Popup;

export namespace Popup {
  export type State = TooltipPopupState;
  export type Props = TooltipPopupProps;
}

const StyledArrow = React.forwardRef<
  React.ComponentRef<typeof H.Arrow>,
  React.ComponentPropsWithoutRef<typeof H.Arrow>
>(({ className, ...props }, ref) => (
  <H.Arrow className={cx('tale-tooltip__arrow', className)} ref={ref} {...props} />
));
StyledArrow.displayName = 'Tooltip.Arrow';
export const Arrow = StyledArrow as typeof H.Arrow;
