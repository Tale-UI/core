'use client';
import * as React from 'react';
import { useIsoLayoutEffect } from '@tale-ui/utils/useIsoLayoutEffect';
import { TaleUIComponentProps } from '../../utils/types';
import { useTaleUiId } from '../../utils/useTaleUiId';
import { useComboboxGroupContext } from '../group/ComboboxGroupContext';
import { useRenderElement } from '../../utils/useRenderElement';

/**
 * An accessible label that is automatically associated with its parent group.
 * Renders a `<div>` element.
 */
export const ComboboxGroupLabel = React.forwardRef(function ComboboxGroupLabel(
  componentProps: ComboboxGroupLabel.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { render, className, id: idProp, ...elementProps } = componentProps;

  const { setLabelId } = useComboboxGroupContext();

  const id = useTaleUiId(idProp);

  useIsoLayoutEffect(() => {
    setLabelId(id);
    return () => {
      setLabelId(undefined);
    };
  }, [id, setLabelId]);

  const element = useRenderElement('div', componentProps, {
    ref: forwardedRef,
    props: [{ id }, elementProps],
  });

  return element;
});

export interface ComboboxGroupLabelState {}

export interface ComboboxGroupLabelProps extends TaleUIComponentProps<
  'div',
  ComboboxGroupLabel.State
> {}

export namespace ComboboxGroupLabel {
  export type State = ComboboxGroupLabelState;
  export type Props = ComboboxGroupLabelProps;
}
