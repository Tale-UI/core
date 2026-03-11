'use client';
import * as React from 'react';
import { useIsoLayoutEffect } from '@tale-ui/utils/useIsoLayoutEffect';
import { usePopoverRootContext } from '../root/PopoverRootContext';
import type { TaleUIComponentProps } from '../../utils/types';
import { useTaleUiId } from '../../utils/useTaleUiId';
import { useRenderElement } from '../../utils/useRenderElement';

/**
 * A paragraph with additional information about the popover.
 * Renders a `<p>` element.
 *
 * Documentation: [Tale UI Popover](https://base-ui.com/react/components/popover)
 */
export const PopoverDescription = React.forwardRef(function PopoverDescription(
  componentProps: PopoverDescription.Props,
  forwardedRef: React.ForwardedRef<HTMLParagraphElement>,
) {
  const { render, className, ...elementProps } = componentProps;

  const { store } = usePopoverRootContext();

  const id = useTaleUiId(elementProps.id);

  useIsoLayoutEffect(() => {
    store.set('descriptionElementId', id);
    return () => {
      store.set('descriptionElementId', undefined);
    };
  }, [store, id]);

  const element = useRenderElement('p', componentProps, {
    ref: forwardedRef,
    props: [{ id }, elementProps],
  });

  return element;
});

export interface PopoverDescriptionState {}

export interface PopoverDescriptionProps extends TaleUIComponentProps<
  'p',
  PopoverDescription.State
> {}

export namespace PopoverDescription {
  export type State = PopoverDescriptionState;
  export type Props = PopoverDescriptionProps;
}
