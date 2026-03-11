'use client';
import * as React from 'react';
import type { TaleUIComponentProps, NativeButtonProps } from '../../utils/types';
import { usePopoverRootContext } from '../root/PopoverRootContext';
import { useRenderElement } from '../../utils/useRenderElement';
import { useButton } from '../../use-button';
import { createChangeEventDetails } from '../../utils/createTaleUIEventDetails';
import { REASONS } from '../../utils/reasons';

/**
 * A button that closes the popover.
 * Renders a `<button>` element.
 *
 * Documentation: [Tale UI Popover](https://base-ui.com/react/components/popover)
 */
export const PopoverClose = React.forwardRef(function PopoverClose(
  props: PopoverClose.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { render, className, disabled = false, nativeButton = true, ...elementProps } = props;

  const { buttonRef, getButtonProps } = useButton({
    disabled,
    focusableWhenDisabled: false,
    native: nativeButton,
  });

  const { store } = usePopoverRootContext();

  const element = useRenderElement('button', props, {
    ref: [forwardedRef, buttonRef],
    props: [
      {
        onClick(event) {
          store.setOpen(
            false,
            createChangeEventDetails(REASONS.closePress, event.nativeEvent, event.currentTarget),
          );
        },
      },
      elementProps,
      getButtonProps,
    ],
  });

  return element;
});

export interface PopoverCloseState {}

export interface PopoverCloseProps
  extends NativeButtonProps, TaleUIComponentProps<'button', PopoverClose.State> {}

export namespace PopoverClose {
  export type State = PopoverCloseState;
  export type Props = PopoverCloseProps;
}
