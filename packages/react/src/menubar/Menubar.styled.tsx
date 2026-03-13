import * as React from 'react';
import { Menubar as H } from './Menubar';
import { cx } from '../_cx';
import type { MenubarState, MenubarProps } from './Menubar';

const StyledMenubar = React.forwardRef<
  React.ComponentRef<typeof H>,
  React.ComponentPropsWithoutRef<typeof H>
>(({ className, ...props }, ref) => (
  <H className={cx('tale-menubar', className)} ref={ref} {...props} />
));
StyledMenubar.displayName = 'Menubar';
export const Menubar = StyledMenubar as typeof H;

export namespace Menubar {
  export type State = MenubarState;
  export type Props = MenubarProps;
}
