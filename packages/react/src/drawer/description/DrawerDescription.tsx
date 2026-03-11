'use client';
import type * as React from 'react';
import { DialogDescription } from '../../dialog/description/DialogDescription';
import type { TaleUIComponentProps } from '../../utils/types';

/**
 * A paragraph with additional information about the drawer.
 * Renders a `<p>` element.
 *
 * Documentation: [Tale UI Drawer](https://base-ui.com/react/components/drawer)
 */
export const DrawerDescription = DialogDescription as DrawerDescription;

export interface DrawerDescriptionProps extends TaleUIComponentProps<
  'p',
  DrawerDescription.State
> {}

export interface DrawerDescriptionState {}

export interface DrawerDescription {
  (componentProps: DrawerDescriptionProps): React.JSX.Element;
}

export namespace DrawerDescription {
  export type Props = DrawerDescriptionProps;
  export type State = DrawerDescriptionState;
}
