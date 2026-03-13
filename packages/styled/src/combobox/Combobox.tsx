import * as React from 'react';
import { Combobox as H } from '@tale-ui/react/combobox';
import { cx } from '../_cx';

export const Root = H.Root;
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

export const Input = React.forwardRef<
  React.ComponentRef<typeof H.Input>,
  React.ComponentPropsWithoutRef<typeof H.Input>
>(({ className, ...props }, ref) => (
  <H.Input className={cx('tale-combobox__input', className)} ref={ref} {...props} />
));
Input.displayName = 'Combobox.Input';

export const Popup = React.forwardRef<
  React.ComponentRef<typeof H.Popup>,
  React.ComponentPropsWithoutRef<typeof H.Popup>
>(({ className, ...props }, ref) => (
  <H.Popup className={cx('tale-combobox__popup', className)} ref={ref} {...props} />
));
Popup.displayName = 'Combobox.Popup';

export const Item = React.forwardRef<
  React.ComponentRef<typeof H.Item>,
  React.ComponentPropsWithoutRef<typeof H.Item>
>(({ className, ...props }, ref) => (
  <H.Item className={cx('tale-combobox__item', className)} ref={ref} {...props} />
));
Item.displayName = 'Combobox.Item';

export const GroupLabel = React.forwardRef<
  React.ComponentRef<typeof H.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof H.GroupLabel>
>(({ className, ...props }, ref) => (
  <H.GroupLabel className={cx('tale-combobox__group-label', className)} ref={ref} {...props} />
));
GroupLabel.displayName = 'Combobox.GroupLabel';

export const Empty = React.forwardRef<
  React.ComponentRef<typeof H.Empty>,
  React.ComponentPropsWithoutRef<typeof H.Empty>
>(({ className, ...props }, ref) => (
  <H.Empty className={cx('tale-combobox__empty', className)} ref={ref} {...props} />
));
Empty.displayName = 'Combobox.Empty';

export const Chips = React.forwardRef<
  React.ComponentRef<typeof H.Chips>,
  React.ComponentPropsWithoutRef<typeof H.Chips>
>(({ className, ...props }, ref) => (
  <H.Chips className={cx('tale-combobox__chips', className)} ref={ref} {...props} />
));
Chips.displayName = 'Combobox.Chips';

export const Chip = React.forwardRef<
  React.ComponentRef<typeof H.Chip>,
  React.ComponentPropsWithoutRef<typeof H.Chip>
>(({ className, ...props }, ref) => (
  <H.Chip className={cx('tale-combobox__chip', className)} ref={ref} {...props} />
));
Chip.displayName = 'Combobox.Chip';

export const ChipRemove = React.forwardRef<
  React.ComponentRef<typeof H.ChipRemove>,
  React.ComponentPropsWithoutRef<typeof H.ChipRemove>
>(({ className, ...props }, ref) => (
  <H.ChipRemove className={cx('tale-combobox__chip-remove', className)} ref={ref} {...props} />
));
ChipRemove.displayName = 'Combobox.ChipRemove';
