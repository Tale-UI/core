'use client';
import * as React from 'react';
import type { MeterRoot } from '../root/MeterRoot';
import { TaleUIComponentProps } from '../../utils/types';
import { useRenderElement } from '../../utils/useRenderElement';

/**
 * Contains the meter indicator and represents the entire range of the meter.
 * Renders a `<div>` element.
 *
 * Documentation: [Tale UI Meter](https://base-ui.com/react/components/meter)
 */
export const MeterTrack = React.forwardRef(function MeterTrack(
  componentProps: MeterTrack.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { render, className, ...elementProps } = componentProps;

  return useRenderElement('div', componentProps, {
    ref: forwardedRef,
    props: elementProps,
  });
});

export interface MeterTrackProps extends TaleUIComponentProps<'div', MeterRoot.State> {}

export namespace MeterTrack {
  export type Props = MeterTrackProps;
}
