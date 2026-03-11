'use client';
import * as React from 'react';
import { useDialogRootContext } from '../root/DialogRootContext';
import { useRenderElement } from '../../utils/useRenderElement';
import { useTaleUiId } from '../../utils/useTaleUiId';
import { type TaleUIComponentProps } from '../../utils/types';

/**
 * A heading that labels the dialog.
 * Renders an `<h2>` element.
 *
 * Documentation: [Tale UI Dialog](https://base-ui.com/react/components/dialog)
 */
export const DialogTitle = React.forwardRef(function DialogTitle(
  componentProps: DialogTitle.Props,
  forwardedRef: React.ForwardedRef<HTMLHeadingElement>,
) {
  const { render, className, id: idProp, ...elementProps } = componentProps;
  const { store } = useDialogRootContext();

  const id = useTaleUiId(idProp);

  store.useSyncedValueWithCleanup('titleElementId', id);

  return useRenderElement('h2', componentProps, {
    ref: forwardedRef,
    props: [{ id }, elementProps],
  });
});

export interface DialogTitleProps extends TaleUIComponentProps<'h2', DialogTitle.State> {}

export interface DialogTitleState {}

export namespace DialogTitle {
  export type Props = DialogTitleProps;
  export type State = DialogTitleState;
}
