'use client';
import * as React from 'react';
import { useIsoLayoutEffect } from '@tale-ui/utils/useIsoLayoutEffect';
import { useTaleUiId } from '../../utils/useTaleUiId';
import { useRenderElement } from '../../utils/useRenderElement';
import { useFieldsetRootContext } from '../root/FieldsetRootContext';
import type { TaleUIComponentProps } from '../../utils/types';

/**
 * An accessible label that is automatically associated with the fieldset.
 * Renders a `<div>` element.
 *
 * Documentation: [Tale UI Fieldset](https://base-ui.com/react/components/fieldset)
 */
export const FieldsetLegend = React.forwardRef(function FieldsetLegend(
  componentProps: FieldsetLegend.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { render, className, id: idProp, ...elementProps } = componentProps;

  const { disabled, setLegendId } = useFieldsetRootContext();

  const id = useTaleUiId(idProp);

  useIsoLayoutEffect(() => {
    setLegendId(id);
    return () => {
      setLegendId(undefined);
    };
  }, [setLegendId, id]);

  const state: FieldsetLegend.State = {
    disabled: disabled ?? false,
  };

  const element = useRenderElement('div', componentProps, {
    state,
    ref: forwardedRef,
    props: [{ id }, elementProps],
  });

  return element;
});

export interface FieldsetLegendState {
  /**
   * Whether the component should ignore user interaction.
   */
  disabled: boolean;
}

export interface FieldsetLegendProps extends TaleUIComponentProps<'div', FieldsetLegend.State> {}

export namespace FieldsetLegend {
  export type State = FieldsetLegendState;
  export type Props = FieldsetLegendProps;
}
