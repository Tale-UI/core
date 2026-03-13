import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';
import type {
  ComboboxRootState,
  ComboboxRootProps,
  ComboboxRootActions,
  ComboboxRootChangeEventReason,
  ComboboxRootChangeEventDetails,
  ComboboxRootHighlightEventReason,
  ComboboxRootHighlightEventDetails,
} from './root/ComboboxRoot';

export const Root = H.Root;

export namespace Root {
    export type Props<Value = any, Multiple extends boolean | undefined = false> = ComboboxRootProps<Value, Multiple>;
  export type State = ComboboxRootState;
  export type Actions = ComboboxRootActions;
  export type ChangeEventReason = ComboboxRootChangeEventReason;
  export type ChangeEventDetails = ComboboxRootChangeEventDetails;
  export type HighlightEventReason = ComboboxRootHighlightEventReason;
  export type HighlightEventDetails = ComboboxRootHighlightEventDetails;
}
export const Portal = H.Portal;
export const Backdrop = H.Backdrop;
export const Positioner = H.Positioner;
export const Arrow = H.Arrow;
export const Icon = H.Icon;
export const Value = H.Value;
export const Status = H.Status;
export const Trigger = H.Trigger;
export const List = H.List;
export const Row = H.Row;
export const Collection = H.Collection;
export const Clear = H.Clear;
export const ItemIndicator = H.ItemIndicator;
export const Group = H.Group;
export const useFilter = H.useFilter;
export const useFilteredItems = H.useFilteredItems;

const StyledInput = React.forwardRef<
  React.ComponentRef<typeof H.Input>,
  React.ComponentPropsWithoutRef<typeof H.Input>
>(({ className, ...props }, ref) => (
  <H.Input className={cx('tale-combobox__input', className)} ref={ref} {...props} />
));
StyledInput.displayName = 'Combobox.Input';
export const Input = StyledInput as typeof H.Input;

const StyledPopup = React.forwardRef<
  React.ComponentRef<typeof H.Popup>,
  React.ComponentPropsWithoutRef<typeof H.Popup>
>(({ className, ...props }, ref) => (
  <H.Popup className={cx('tale-combobox__popup', className)} ref={ref} {...props} />
));
StyledPopup.displayName = 'Combobox.Popup';
export const Popup = StyledPopup as typeof H.Popup;

const StyledItem = React.forwardRef<
  React.ComponentRef<typeof H.Item>,
  React.ComponentPropsWithoutRef<typeof H.Item>
>(({ className, ...props }, ref) => (
  <H.Item className={cx('tale-combobox__item', className)} ref={ref} {...props} />
));
StyledItem.displayName = 'Combobox.Item';
export const Item = StyledItem as typeof H.Item;

const StyledGroupLabel = React.forwardRef<
  React.ComponentRef<typeof H.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof H.GroupLabel>
>(({ className, ...props }, ref) => (
  <H.GroupLabel className={cx('tale-combobox__group-label', className)} ref={ref} {...props} />
));
StyledGroupLabel.displayName = 'Combobox.GroupLabel';
export const GroupLabel = StyledGroupLabel as typeof H.GroupLabel;

const StyledEmpty = React.forwardRef<
  React.ComponentRef<typeof H.Empty>,
  React.ComponentPropsWithoutRef<typeof H.Empty>
>(({ className, ...props }, ref) => (
  <H.Empty className={cx('tale-combobox__empty', className)} ref={ref} {...props} />
));
StyledEmpty.displayName = 'Combobox.Empty';
export const Empty = StyledEmpty as typeof H.Empty;

const StyledChips = React.forwardRef<
  React.ComponentRef<typeof H.Chips>,
  React.ComponentPropsWithoutRef<typeof H.Chips>
>(({ className, ...props }, ref) => (
  <H.Chips className={cx('tale-combobox__chips', className)} ref={ref} {...props} />
));
StyledChips.displayName = 'Combobox.Chips';
export const Chips = StyledChips as typeof H.Chips;

const StyledChip = React.forwardRef<
  React.ComponentRef<typeof H.Chip>,
  React.ComponentPropsWithoutRef<typeof H.Chip>
>(({ className, ...props }, ref) => (
  <H.Chip className={cx('tale-combobox__chip', className)} ref={ref} {...props} />
));
StyledChip.displayName = 'Combobox.Chip';
export const Chip = StyledChip as typeof H.Chip;

const StyledChipRemove = React.forwardRef<
  React.ComponentRef<typeof H.ChipRemove>,
  React.ComponentPropsWithoutRef<typeof H.ChipRemove>
>(({ className, ...props }, ref) => (
  <H.ChipRemove className={cx('tale-combobox__chip-remove', className)} ref={ref} {...props} />
));
StyledChipRemove.displayName = 'Combobox.ChipRemove';
export const ChipRemove = StyledChipRemove as typeof H.ChipRemove;

export { Separator } from './index.parts';
