import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';

export const Root = H.Root;
export const Portal = H.Portal;
export const Positioner = H.Positioner;
export const List = H.List;

const StyledInput = React.forwardRef<
  React.ComponentRef<typeof H.Input>,
  React.ComponentPropsWithoutRef<typeof H.Input>
>(({ className, ...props }, ref) => (
  <H.Input className={cx('tale-autocomplete__input', className)} ref={ref} {...props} />
));
StyledInput.displayName = 'Autocomplete.Input';
export const Input = StyledInput as typeof H.Input;

const StyledPopup = React.forwardRef<
  React.ComponentRef<typeof H.Popup>,
  React.ComponentPropsWithoutRef<typeof H.Popup>
>(({ className, ...props }, ref) => (
  <H.Popup className={cx('tale-autocomplete__popup', className)} ref={ref} {...props} />
));
StyledPopup.displayName = 'Autocomplete.Popup';
export const Popup = StyledPopup as typeof H.Popup;

const StyledEmpty = React.forwardRef<
  React.ComponentRef<typeof H.Empty>,
  React.ComponentPropsWithoutRef<typeof H.Empty>
>(({ className, ...props }, ref) => (
  <H.Empty className={cx('tale-autocomplete__empty', className)} ref={ref} {...props} />
));
StyledEmpty.displayName = 'Autocomplete.Empty';
export const Empty = StyledEmpty as typeof H.Empty;

const StyledItem = React.forwardRef<
  React.ComponentRef<typeof H.Item>,
  React.ComponentPropsWithoutRef<typeof H.Item>
>(({ className, ...props }, ref) => (
  <H.Item className={cx('tale-autocomplete__item', className)} ref={ref} {...props} />
));
StyledItem.displayName = 'Autocomplete.Item';
export const Item = StyledItem as typeof H.Item;

export { Value, Trigger, Icon, Clear, Backdrop, Arrow, Group, GroupLabel, Row, Collection, Separator, useFilter, useFilteredItems } from './index.parts';
