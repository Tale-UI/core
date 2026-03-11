'use client';
import type * as React from 'react';
import { DialogTitle } from '../../dialog/title/DialogTitle';
import type { TaleUIComponentProps } from '../../utils/types';

/**
 * A heading that labels the drawer.
 * Renders an `<h2>` element.
 *
 * Documentation: [Tale UI Drawer](https://base-ui.com/react/components/drawer)
 */
export const DrawerTitle = DialogTitle as DrawerTitle;

export interface DrawerTitleProps extends TaleUIComponentProps<'h2', DrawerTitle.State> {}

export interface DrawerTitleState {}

export interface DrawerTitle {
  (componentProps: DrawerTitleProps): React.JSX.Element;
}

export namespace DrawerTitle {
  export type Props = DrawerTitleProps;
  export type State = DrawerTitleState;
}
