import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';
import type {
  MenuRootProps,
  MenuRootActions,
  MenuRootChangeEventReason,
  MenuRootChangeEventDetails,
  MenuRootOrientation,
} from './root/MenuRoot';
import type {
  MenuTriggerProps,
  MenuTriggerState,
} from './trigger/MenuTrigger';
import type { MenuPortalProps } from './portal/MenuPortal';
import type {
  MenuPopupProps,
  MenuPopupState,
} from './popup/MenuPopup';
import type {
  MenuSubmenuRootProps,
  MenuSubmenuRootState,
  MenuSubmenuRootChangeEventReason,
  MenuSubmenuRootChangeEventDetails,
} from './submenu-root/MenuSubmenuRoot';
import type {
  MenuSubmenuTriggerProps,
  MenuSubmenuTriggerState,
} from './submenu-trigger/MenuSubmenuTrigger';

export const Root = H.Root;

export namespace Root {
    export type Props<Payload = unknown> = MenuRootProps<Payload>;
  export type Actions = MenuRootActions;
  export type ChangeEventReason = MenuRootChangeEventReason;
  export type ChangeEventDetails = MenuRootChangeEventDetails;
  export type Orientation = MenuRootOrientation;
}

export const Trigger = H.Trigger;

export namespace Trigger {
    export type Props<Payload = unknown> = MenuTriggerProps<Payload>;
  export type State = MenuTriggerState;
}

export const Portal = H.Portal;

export namespace Portal {
  export type Props = MenuPortalProps;
}

export const Backdrop = H.Backdrop;
export const Positioner = H.Positioner;
export const Arrow = H.Arrow;
export const Group = H.Group;
export const RadioGroup = H.RadioGroup;
export const SubmenuRoot = H.SubmenuRoot;

export namespace SubmenuRoot {
  export type Props = MenuSubmenuRootProps;
  export type State = MenuSubmenuRootState;
  export type ChangeEventReason = MenuSubmenuRootChangeEventReason;
  export type ChangeEventDetails = MenuSubmenuRootChangeEventDetails;
}

export const Separator = H.Separator;
export { MenuHandle as Handle } from './store/MenuHandle';
export const createHandle = H.createHandle;

const StyledPopup = React.forwardRef<
  React.ComponentRef<typeof H.Popup>,
  React.ComponentPropsWithoutRef<typeof H.Popup>
>(({ className, ...props }, ref) => (
  <H.Popup className={cx('tale-menu__popup', className)} ref={ref} {...props} />
));
StyledPopup.displayName = 'Menu.Popup';
export const Popup = StyledPopup as typeof H.Popup;

export namespace Popup {
  export type Props = MenuPopupProps;
  export type State = MenuPopupState;
}

const StyledItem = React.forwardRef<
  React.ComponentRef<typeof H.Item>,
  React.ComponentPropsWithoutRef<typeof H.Item>
>(({ className, ...props }, ref) => (
  <H.Item className={cx('tale-menu__item', className)} ref={ref} {...props} />
));
StyledItem.displayName = 'Menu.Item';
export const Item = StyledItem as typeof H.Item;

const StyledCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof H.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof H.CheckboxItem>
>(({ className, ...props }, ref) => (
  <H.CheckboxItem className={cx('tale-menu__checkbox-item', className)} ref={ref} {...props} />
));
StyledCheckboxItem.displayName = 'Menu.CheckboxItem';
export const CheckboxItem = StyledCheckboxItem as typeof H.CheckboxItem;

const StyledCheckboxItemIndicator = React.forwardRef<
  React.ComponentRef<typeof H.CheckboxItemIndicator>,
  React.ComponentPropsWithoutRef<typeof H.CheckboxItemIndicator>
>(({ className, ...props }, ref) => (
  <H.CheckboxItemIndicator className={cx('tale-menu__item-indicator', className)} ref={ref} {...props} />
));
StyledCheckboxItemIndicator.displayName = 'Menu.CheckboxItemIndicator';
export const CheckboxItemIndicator = StyledCheckboxItemIndicator as typeof H.CheckboxItemIndicator;

const StyledRadioItem = React.forwardRef<
  React.ComponentRef<typeof H.RadioItem>,
  React.ComponentPropsWithoutRef<typeof H.RadioItem>
>(({ className, ...props }, ref) => (
  <H.RadioItem className={cx('tale-menu__radio-item', className)} ref={ref} {...props} />
));
StyledRadioItem.displayName = 'Menu.RadioItem';
export const RadioItem = StyledRadioItem as typeof H.RadioItem;

const StyledRadioItemIndicator = React.forwardRef<
  React.ComponentRef<typeof H.RadioItemIndicator>,
  React.ComponentPropsWithoutRef<typeof H.RadioItemIndicator>
>(({ className, ...props }, ref) => (
  <H.RadioItemIndicator className={cx('tale-menu__item-indicator', className)} ref={ref} {...props} />
));
StyledRadioItemIndicator.displayName = 'Menu.RadioItemIndicator';
export const RadioItemIndicator = StyledRadioItemIndicator as typeof H.RadioItemIndicator;

const StyledLinkItem = React.forwardRef<
  React.ComponentRef<typeof H.LinkItem>,
  React.ComponentPropsWithoutRef<typeof H.LinkItem>
>(({ className, ...props }, ref) => (
  <H.LinkItem className={cx('tale-menu__link-item', className)} ref={ref} {...props} />
));
StyledLinkItem.displayName = 'Menu.LinkItem';
export const LinkItem = StyledLinkItem as typeof H.LinkItem;

const StyledSubmenuTrigger = React.forwardRef<
  React.ComponentRef<typeof H.SubmenuTrigger>,
  React.ComponentPropsWithoutRef<typeof H.SubmenuTrigger>
>(({ className, ...props }, ref) => (
  <H.SubmenuTrigger className={cx('tale-menu__submenu-trigger', className)} ref={ref} {...props} />
));
StyledSubmenuTrigger.displayName = 'Menu.SubmenuTrigger';
export const SubmenuTrigger = StyledSubmenuTrigger as typeof H.SubmenuTrigger;

export namespace SubmenuTrigger {
  export type Props = MenuSubmenuTriggerProps;
  export type State = MenuSubmenuTriggerState;
}

const StyledGroupLabel = React.forwardRef<
  React.ComponentRef<typeof H.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof H.GroupLabel>
>(({ className, ...props }, ref) => (
  <H.GroupLabel className={cx('tale-menu__group-label', className)} ref={ref} {...props} />
));
StyledGroupLabel.displayName = 'Menu.GroupLabel';
export const GroupLabel = StyledGroupLabel as typeof H.GroupLabel;
