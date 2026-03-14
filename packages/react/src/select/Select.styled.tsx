import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';
import type {
  SelectRootProps,
  SelectRootState,
  SelectRootActions,
  SelectRootChangeEventReason,
  SelectRootChangeEventDetails,
} from './root/SelectRoot';
import type {
  SelectTriggerState,
  SelectTriggerProps,
} from './trigger/SelectTrigger';

function ChevronIcon() {
  return (
    <svg
      className="tale-select__icon"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="4,6 8,10 12,6" />
    </svg>
  );
}

export const Root = H.Root;

export namespace Root {
  export type State = SelectRootState;
    export type Props<Value = any, Multiple extends boolean | undefined = false> = SelectRootProps<Value, Multiple>;
  export type Actions = SelectRootActions;
  export type ChangeEventReason = SelectRootChangeEventReason;
  export type ChangeEventDetails = SelectRootChangeEventDetails;
}

export const Portal = H.Portal;
export const Backdrop = H.Backdrop;
export const Positioner = H.Positioner;
export const Arrow = H.Arrow;
export const ScrollDownArrow = H.ScrollDownArrow;
export const ScrollUpArrow = H.ScrollUpArrow;
export const Group = H.Group;
export const ItemText = H.ItemText;

const StyledTrigger = React.forwardRef<
  React.ComponentRef<typeof H.Trigger>,
  React.ComponentPropsWithoutRef<typeof H.Trigger>
>(({ className, children, ...props }, ref) => (
  <H.Trigger className={cx('tale-select__trigger', className)} ref={ref} {...props}>
    {children ?? (
      <React.Fragment>
        <H.Value className="tale-select__value" />
        <ChevronIcon />
      </React.Fragment>
    )}
  </H.Trigger>
));
StyledTrigger.displayName = 'Select.Trigger';
export const Trigger = StyledTrigger as typeof H.Trigger;

export namespace Trigger {
  export type State = SelectTriggerState;
  export type Props = SelectTriggerProps;
}

const StyledValue = React.forwardRef<
  React.ComponentRef<typeof H.Value>,
  React.ComponentPropsWithoutRef<typeof H.Value>
>(({ className, ...props }, ref) => (
  <H.Value className={cx('tale-select__value', className)} ref={ref} {...props} />
));
StyledValue.displayName = 'Select.Value';
export const Value = StyledValue as typeof H.Value;

const StyledIcon = React.forwardRef<
  React.ComponentRef<typeof H.Icon>,
  React.ComponentPropsWithoutRef<typeof H.Icon>
>(({ className, children = <ChevronIcon />, ...props }, ref) => (
  <H.Icon className={cx('tale-select__icon', className)} ref={ref} {...props}>
    {children}
  </H.Icon>
));
StyledIcon.displayName = 'Select.Icon';
export const Icon = StyledIcon as typeof H.Icon;

const StyledPopup = React.forwardRef<
  React.ComponentRef<typeof H.Popup>,
  React.ComponentPropsWithoutRef<typeof H.Popup>
>(({ className, ...props }, ref) => (
  <H.Popup className={cx('tale-select__popup', className)} ref={ref} {...props} />
));
StyledPopup.displayName = 'Select.Popup';
export const Popup = StyledPopup as typeof H.Popup;

const StyledList = React.forwardRef<
  React.ComponentRef<typeof H.List>,
  React.ComponentPropsWithoutRef<typeof H.List>
>(({ className, ...props }, ref) => (
  <H.List className={cx('tale-select__list', className)} ref={ref} {...props} />
));
StyledList.displayName = 'Select.List';
export const List = StyledList as typeof H.List;

const StyledItem = React.forwardRef<
  React.ComponentRef<typeof H.Item>,
  React.ComponentPropsWithoutRef<typeof H.Item>
>(({ className, ...props }, ref) => (
  <H.Item className={cx('tale-select__item', className)} ref={ref} {...props} />
));
StyledItem.displayName = 'Select.Item';
export const Item = StyledItem as typeof H.Item;

const StyledItemIndicator = React.forwardRef<
  React.ComponentRef<typeof H.ItemIndicator>,
  React.ComponentPropsWithoutRef<typeof H.ItemIndicator>
>(({ className, ...props }, ref) => (
  <H.ItemIndicator className={cx('tale-select__item-indicator', className)} ref={ref} {...props} />
));
StyledItemIndicator.displayName = 'Select.ItemIndicator';
export const ItemIndicator = StyledItemIndicator as typeof H.ItemIndicator;

const StyledGroupLabel = React.forwardRef<
  React.ComponentRef<typeof H.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof H.GroupLabel>
>(({ className, ...props }, ref) => (
  <H.GroupLabel className={cx('tale-select__group-label', className)} ref={ref} {...props} />
));
StyledGroupLabel.displayName = 'Select.GroupLabel';
export const GroupLabel = StyledGroupLabel as typeof H.GroupLabel;

export const Separator = H.Separator;

const StyledLabel = React.forwardRef<
  React.ComponentRef<typeof H.Label>,
  React.ComponentPropsWithoutRef<typeof H.Label>
>(({ className, ...props }, ref) => (
  <H.Label className={cx('tale-select__label', className)} ref={ref} {...props} />
));
StyledLabel.displayName = 'Select.Label';
export const Label = StyledLabel as typeof H.Label;
