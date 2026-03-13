import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';
import type {
  PreviewCardRootState,
  PreviewCardRootProps,
  PreviewCardRootActions,
  PreviewCardRootChangeEventReason,
  PreviewCardRootChangeEventDetails,
} from './root/PreviewCardRoot';
import type {
  PreviewCardTriggerState,
  PreviewCardTriggerProps,
} from './trigger/PreviewCardTrigger';
import type { PreviewCardPortalProps } from './portal/PreviewCardPortal';
import type {
  PreviewCardPositionerState,
  PreviewCardPositionerProps,
} from './positioner/PreviewCardPositioner';
import type {
  PreviewCardPopupState,
  PreviewCardPopupProps,
} from './popup/PreviewCardPopup';

export const Root = H.Root;

export namespace Root {
  export type State = PreviewCardRootState;
    export type Props<Payload = unknown> = PreviewCardRootProps<Payload>;
  export type Actions = PreviewCardRootActions;
  export type ChangeEventReason = PreviewCardRootChangeEventReason;
  export type ChangeEventDetails = PreviewCardRootChangeEventDetails;
}

export const Trigger = H.Trigger;

export namespace Trigger {
  export type State = PreviewCardTriggerState;
    export type Props<Payload = unknown> = PreviewCardTriggerProps<Payload>;
}

export const Portal = H.Portal;

export namespace Portal {
  export type Props = PreviewCardPortalProps;
}

export const Positioner = H.Positioner;

export namespace Positioner {
  export type State = PreviewCardPositionerState;
  export type Props = PreviewCardPositionerProps;
}

export const Backdrop = H.Backdrop;
export const Viewport = H.Viewport;
export const createHandle = H.createHandle;
export const Handle = H.Handle;

const StyledArrow = React.forwardRef<
  React.ComponentRef<typeof H.Arrow>,
  React.ComponentPropsWithoutRef<typeof H.Arrow>
>(({ className, ...props }, ref) => (
  <H.Arrow className={cx('tale-preview-card__arrow', className)} ref={ref} {...props} />
));
StyledArrow.displayName = 'PreviewCard.Arrow';
export const Arrow = StyledArrow as typeof H.Arrow;

const StyledPopup = React.forwardRef<
  React.ComponentRef<typeof H.Popup>,
  React.ComponentPropsWithoutRef<typeof H.Popup>
>(({ className, ...props }, ref) => (
  <H.Popup className={cx('tale-preview-card__popup', className)} ref={ref} {...props} />
));
StyledPopup.displayName = 'PreviewCard.Popup';
export const Popup = StyledPopup as typeof H.Popup;

export namespace Popup {
  export type State = PreviewCardPopupState;
  export type Props = PreviewCardPopupProps;
}
