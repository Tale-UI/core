'use client';
import * as React from 'react';
import { useIsoLayoutEffect } from '@tale-ui/utils/useIsoLayoutEffect';
import type { TaleUIComponentProps } from '../../utils/types';
import { useTaleUiId } from '../../utils/useTaleUiId';
import { useSelectGroupContext } from '../group/SelectGroupContext';
import { useRenderElement } from '../../utils/useRenderElement';

/**
 * An accessible label that is automatically associated with its parent group.
 * Renders a `<div>` element.
 *
 * Documentation: [Tale UI Select](https://base-ui.com/react/components/select)
 */
export const SelectGroupLabel = React.forwardRef(function SelectGroupLabel(
  componentProps: SelectGroupLabel.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, id: idProp, ...elementProps } = componentProps;

  const { setLabelId } = useSelectGroupContext();

  const id = useTaleUiId(idProp);

  useIsoLayoutEffect(() => {
    setLabelId(id);
  }, [id, setLabelId]);

  const element = useRenderElement('div', componentProps, {
    ref: forwardedRef,
    props: [{ id }, elementProps],
  });

  return element;
});

export interface SelectGroupLabelState {}

export interface SelectGroupLabelProps extends TaleUIComponentProps<
  'div',
  SelectGroupLabel.State
> {}

export namespace SelectGroupLabel {
  export type State = SelectGroupLabelState;
  export type Props = SelectGroupLabelProps;
}
