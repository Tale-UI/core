'use client';
import * as React from 'react';
import { useIsoLayoutEffect } from '@tale-ui/utils/useIsoLayoutEffect';
import { useTaleUiId } from '../../utils/useTaleUiId';
import { useRenderElement } from '../../utils/useRenderElement';
import { useProgressRootContext } from '../root/ProgressRootContext';
import { progressStateAttributesMapping } from '../root/stateAttributesMapping';
import type { ProgressRoot } from '../root/ProgressRoot';
import type { TaleUIComponentProps } from '../../utils/types';

/**
 * An accessible label for the progress bar.
 * Renders a `<span>` element.
 *
 * Documentation: [Tale UI Progress](https://base-ui.com/react/components/progress)
 */
export const ProgressLabel = React.forwardRef(function ProgressLabel(
  componentProps: ProgressLabel.Props,
  forwardedRef: React.ForwardedRef<HTMLSpanElement>,
) {
  const { render, className, id: idProp, ...elementProps } = componentProps;

  const id = useTaleUiId(idProp);

  const { setLabelId, state } = useProgressRootContext();

  useIsoLayoutEffect(() => {
    setLabelId(id);
    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  const element = useRenderElement('span', componentProps, {
    state,
    ref: forwardedRef,
    props: [
      {
        id,
      },
      elementProps,
    ],
    stateAttributesMapping: progressStateAttributesMapping,
  });

  return element;
});

export interface ProgressLabelProps extends TaleUIComponentProps<'span', ProgressRoot.State> {}

export namespace ProgressLabel {
  export type Props = ProgressLabelProps;
}
