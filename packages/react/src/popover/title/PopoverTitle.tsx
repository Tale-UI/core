'use client';
import * as React from 'react';
import { useIsoLayoutEffect } from '@tale-ui/utils/useIsoLayoutEffect';
import type { TaleUIComponentProps } from '../../utils/types';
import { usePopoverRootContext } from '../root/PopoverRootContext';
import { useRenderElement } from '../../utils/useRenderElement';
import { useTaleUiId } from '../../utils/useTaleUiId';

/**
 * A heading that labels the popover.
 * Renders an `<h2>` element.
 *
 * Documentation: [Tale UI Popover](https://base-ui.com/react/components/popover)
 */
export const PopoverTitle = React.forwardRef(function PopoverTitle(
  componentProps: PopoverTitle.Props,
  forwardedRef: React.ForwardedRef<HTMLHeadingElement>,
) {
  const { render, className, ...elementProps } = componentProps;

  const { store } = usePopoverRootContext();

  const id = useTaleUiId(elementProps.id);

  useIsoLayoutEffect(() => {
    store.set('titleElementId', id);
    return () => {
      store.set('titleElementId', undefined);
    };
  }, [store, id]);

  const element = useRenderElement('h2', componentProps, {
    ref: forwardedRef,
    props: [{ id }, elementProps],
  });

  return element;
});

export interface PopoverTitleState {}

export interface PopoverTitleProps extends TaleUIComponentProps<
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
  PopoverTitle.State
> {}

export namespace PopoverTitle {
  export type State = PopoverTitleState;
  export type Props = PopoverTitleProps;
}
