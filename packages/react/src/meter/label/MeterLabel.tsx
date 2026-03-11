'use client';
import * as React from 'react';
import { useIsoLayoutEffect } from '@tale-ui/utils/useIsoLayoutEffect';
import { useTaleUiId } from '../../utils/useTaleUiId';
import { useMeterRootContext } from '../root/MeterRootContext';
import type { MeterRoot } from '../root/MeterRoot';
import { TaleUIComponentProps } from '../../utils/types';
import { useRenderElement } from '../../utils/useRenderElement';

/**
 * An accessible label for the meter.
 * Renders a `<span>` element.
 *
 * Documentation: [Tale UI Meter](https://base-ui.com/react/components/meter)
 */
export const MeterLabel = React.forwardRef(function MeterLabel(
  componentProps: MeterLabel.Props,
  forwardedRef: React.ForwardedRef<HTMLSpanElement>,
) {
  const { render, className, id: idProp, ...elementProps } = componentProps;

  const id = useTaleUiId(idProp);

  const { setLabelId } = useMeterRootContext();

  useIsoLayoutEffect(() => {
    setLabelId(id);
    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  return useRenderElement('span', componentProps, {
    ref: forwardedRef,
    props: [{ id }, elementProps],
  });
});

export interface MeterLabelProps extends TaleUIComponentProps<'span', MeterRoot.State> {}

export namespace MeterLabel {
  export type Props = MeterLabelProps;
}
