'use client';
import * as React from 'react';
import type { Orientation } from '../utils/types';
import type { TaleUIChangeEventDetails } from '../utils/createTaleUIEventDetails';
import type { TaleUIEventReasons } from '../utils/reasons';

export interface ToggleGroupContext<Value> {
  value: readonly Value[];
  setGroupValue: (
    newValue: Value,
    nextPressed: boolean,
    eventDetails: TaleUIChangeEventDetails<TaleUIEventReasons['none']>,
  ) => void;
  disabled: boolean;
  orientation: Orientation;
  /**
   * Indicates whether the value has been initialized via `value` or `defaultValue` props.
   * Used to determine if Toggle should warn users about data inconsistency problems.
   */
  isValueInitialized: boolean;
}

export const ToggleGroupContext = React.createContext<ToggleGroupContext<any> | undefined>(
  undefined,
);

export function useToggleGroupContext<Value>(optional = true) {
  const context = React.useContext<ToggleGroupContext<Value> | undefined>(ToggleGroupContext);
  if (context === undefined && !optional) {
    throw new Error(
      'Tale UI: ToggleGroupContext is missing. ToggleGroup parts must be placed within <ToggleGroup>.',
    );
  }

  return context;
}
