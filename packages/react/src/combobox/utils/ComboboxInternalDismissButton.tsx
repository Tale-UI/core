'use client';
import * as React from 'react';
import { useMergedRefs } from '@tale-ui/utils/useMergedRefs';
import { useStableCallback } from '@tale-ui/utils/useStableCallback';
import { visuallyHiddenInput } from '@tale-ui/utils/visuallyHidden';
import { useButton } from '../../use-button';
import { createChangeEventDetails } from '../../utils/createTaleUIEventDetails';
import { REASONS } from '../../utils/reasons';
import { useComboboxRootContext } from '../root/ComboboxRootContext';

type DismissEvent = React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;

/**
 * @internal
 */
export const ComboboxInternalDismissButton = React.forwardRef<HTMLSpanElement>(
  function ComboboxInternalDismissButton(_, forwardedRef) {
    const store = useComboboxRootContext();

    const { buttonRef, getButtonProps } = useButton({
      native: false,
    });

    const mergedRef = useMergedRefs(forwardedRef, buttonRef);

    const handleDismiss = useStableCallback((event: DismissEvent) => {
      store.state.setOpen(
        false,
        createChangeEventDetails(REASONS.closePress, event.nativeEvent, event.currentTarget),
      );
    });

    const dismissProps = getButtonProps({
      onClick: handleDismiss,
    });

    return (
      <span
        ref={mergedRef}
        {...dismissProps}
        aria-label="Dismiss"
        tabIndex={undefined}
        style={visuallyHiddenInput}
      />
    );
  },
);
