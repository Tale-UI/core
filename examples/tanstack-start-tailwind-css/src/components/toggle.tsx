import * as React from 'react';
import clsx from 'clsx';
import { ToggleButton as BaseToggleButton } from '@tale-ui/react/toggle-button';
import type { ToggleButtonProps as BaseToggleButtonProps } from '@tale-ui/react/toggle-button';

export const ToggleButton = React.forwardRef<HTMLButtonElement, BaseToggleButtonProps>(function ToggleButton(
  { className, ...props }: BaseToggleButtonProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  return (
    <BaseToggleButton
      ref={forwardedRef}
      className={clsx(
        'flex size-8 items-center justify-center rounded-sm text-gray-600 select-none hover:bg-gray-100 focus-visible:bg-none focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-200 data-[pressed]:text-gray-900',
        className,
      )}
      {...props}
    />
  );
});

/** @deprecated Use `ToggleButton` instead. */
export const Toggle = ToggleButton;
