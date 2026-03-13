import * as React from 'react';
import { Select as H } from '@tale-ui/react/select';
import { cx } from '../_cx';

const ChevronIcon = () => (
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

export const Root = H.Root;
export const Portal = H.Portal;
export const Backdrop = H.Backdrop;
export const Positioner = H.Positioner;
export const Arrow = H.Arrow;
export const ScrollDownArrow = H.ScrollDownArrow;
export const ScrollUpArrow = H.ScrollUpArrow;
export const Group = H.Group;
export const ItemText = H.ItemText;

export const Trigger = React.forwardRef<
  React.ComponentRef<typeof H.Trigger>,
  React.ComponentPropsWithoutRef<typeof H.Trigger>
>(({ className, children, ...props }, ref) => (
  <H.Trigger className={cx('tale-select__trigger', className)} ref={ref} {...props}>
    {children ?? (
      <>
        <H.Value className="tale-select__value" />
        <ChevronIcon />
      </>
    )}
  </H.Trigger>
));
Trigger.displayName = 'Select.Trigger';

export const Value = React.forwardRef<
  React.ComponentRef<typeof H.Value>,
  React.ComponentPropsWithoutRef<typeof H.Value>
>(({ className, ...props }, ref) => (
  <H.Value className={cx('tale-select__value', className)} ref={ref} {...props} />
));
Value.displayName = 'Select.Value';

export const Icon = React.forwardRef<
  React.ComponentRef<typeof H.Icon>,
  React.ComponentPropsWithoutRef<typeof H.Icon>
>(({ className, children = <ChevronIcon />, ...props }, ref) => (
  <H.Icon className={cx('tale-select__icon', className)} ref={ref} {...props}>
    {children}
  </H.Icon>
));
Icon.displayName = 'Select.Icon';

export const Popup = React.forwardRef<
  React.ComponentRef<typeof H.Popup>,
  React.ComponentPropsWithoutRef<typeof H.Popup>
>(({ className, ...props }, ref) => (
  <H.Popup className={cx('tale-select__popup', className)} ref={ref} {...props} />
));
Popup.displayName = 'Select.Popup';

export const List = React.forwardRef<
  React.ComponentRef<typeof H.List>,
  React.ComponentPropsWithoutRef<typeof H.List>
>(({ className, ...props }, ref) => (
  <H.List className={cx('tale-select__list', className)} ref={ref} {...props} />
));
List.displayName = 'Select.List';

export const Item = React.forwardRef<
  React.ComponentRef<typeof H.Item>,
  React.ComponentPropsWithoutRef<typeof H.Item>
>(({ className, ...props }, ref) => (
  <H.Item className={cx('tale-select__item', className)} ref={ref} {...props} />
));
Item.displayName = 'Select.Item';

export const ItemIndicator = React.forwardRef<
  React.ComponentRef<typeof H.ItemIndicator>,
  React.ComponentPropsWithoutRef<typeof H.ItemIndicator>
>(({ className, ...props }, ref) => (
  <H.ItemIndicator className={cx('tale-select__item-indicator', className)} ref={ref} {...props} />
));
ItemIndicator.displayName = 'Select.ItemIndicator';

export const GroupLabel = React.forwardRef<
  React.ComponentRef<typeof H.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof H.GroupLabel>
>(({ className, ...props }, ref) => (
  <H.GroupLabel className={cx('tale-select__group-label', className)} ref={ref} {...props} />
));
GroupLabel.displayName = 'Select.GroupLabel';

export const Separator = H.Separator;
