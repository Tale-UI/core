import * as React from 'react';
import { Toolbar as H } from '@tale-ui/react/toolbar';
import { cx } from '../_cx';

export const Root = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-toolbar', className)} ref={ref} {...props} />
));
Root.displayName = 'Toolbar.Root';

export const Group = React.forwardRef<
  React.ComponentRef<typeof H.Group>,
  React.ComponentPropsWithoutRef<typeof H.Group>
>(({ className, ...props }, ref) => (
  <H.Group className={cx('tale-toolbar__group', className)} ref={ref} {...props} />
));
Group.displayName = 'Toolbar.Group';

export const Button = React.forwardRef<
  React.ComponentRef<typeof H.Button>,
  React.ComponentPropsWithoutRef<typeof H.Button>
>(({ className, ...props }, ref) => (
  <H.Button className={cx('tale-toolbar__button', className)} ref={ref} {...props} />
));
Button.displayName = 'Toolbar.Button';

export const Link = React.forwardRef<
  React.ComponentRef<typeof H.Link>,
  React.ComponentPropsWithoutRef<typeof H.Link>
>(({ className, ...props }, ref) => (
  <H.Link className={cx('tale-toolbar__link', className)} ref={ref} {...props} />
));
Link.displayName = 'Toolbar.Link';

export const Input = React.forwardRef<
  React.ComponentRef<typeof H.Input>,
  React.ComponentPropsWithoutRef<typeof H.Input>
>(({ className, ...props }, ref) => (
  <H.Input className={cx('tale-toolbar__input tale-input', className)} ref={ref} {...props} />
));
Input.displayName = 'Toolbar.Input';

export const Separator = React.forwardRef<
  React.ComponentRef<typeof H.Separator>,
  React.ComponentPropsWithoutRef<typeof H.Separator>
>(({ className, ...props }, ref) => (
  <H.Separator className={cx('tale-toolbar__separator', className)} ref={ref} {...props} />
));
Separator.displayName = 'Toolbar.Separator';
