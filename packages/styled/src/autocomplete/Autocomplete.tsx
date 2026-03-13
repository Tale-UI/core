import * as React from 'react';
import { Autocomplete as H } from '@tale-ui/react/autocomplete';
import { cx } from '../_cx';

export const Root = H.Root;
export const Portal = H.Portal;
export const Positioner = H.Positioner;
export const List = H.List;

export const Input = React.forwardRef<
  React.ComponentRef<typeof H.Input>,
  React.ComponentPropsWithoutRef<typeof H.Input>
>(({ className, ...props }, ref) => (
  <H.Input className={cx('tale-autocomplete__input', className)} ref={ref} {...props} />
));
Input.displayName = 'Autocomplete.Input';

export const Popup = React.forwardRef<
  React.ComponentRef<typeof H.Popup>,
  React.ComponentPropsWithoutRef<typeof H.Popup>
>(({ className, ...props }, ref) => (
  <H.Popup className={cx('tale-autocomplete__popup', className)} ref={ref} {...props} />
));
Popup.displayName = 'Autocomplete.Popup';

export const Empty = React.forwardRef<
  React.ComponentRef<typeof H.Empty>,
  React.ComponentPropsWithoutRef<typeof H.Empty>
>(({ className, ...props }, ref) => (
  <H.Empty className={cx('tale-autocomplete__empty', className)} ref={ref} {...props} />
));
Empty.displayName = 'Autocomplete.Empty';

export const Item = React.forwardRef<
  React.ComponentRef<typeof H.Item>,
  React.ComponentPropsWithoutRef<typeof H.Item>
>(({ className, ...props }, ref) => (
  <H.Item className={cx('tale-autocomplete__item', className)} ref={ref} {...props} />
));
Item.displayName = 'Autocomplete.Item';
