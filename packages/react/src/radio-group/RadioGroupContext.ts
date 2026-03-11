'use client';
import * as React from 'react';
import type { UseFieldValidationReturnValue } from '../field/root/useFieldValidation';
import type { TaleUIChangeEventDetails } from '../utils/createTaleUIEventDetails';
import type { TaleUIEventReasons } from '../utils/reasons';

export interface RadioGroupContext<Value> {
  disabled: boolean | undefined;
  readOnly: boolean | undefined;
  required: boolean | undefined;
  name: string | undefined;
  checkedValue: Value | undefined;
  setCheckedValue: (
    value: Value,
    eventDetails: TaleUIChangeEventDetails<TaleUIEventReasons['none']>,
  ) => void;
  onValueChange: (
    value: Value,
    eventDetails: TaleUIChangeEventDetails<TaleUIEventReasons['none']>,
  ) => void;
  touched: boolean;
  setTouched: React.Dispatch<React.SetStateAction<boolean>>;
  validation?: UseFieldValidationReturnValue | undefined;
  registerControlRef: (element: HTMLElement | null, disabled?: boolean) => void;
  registerInputRef: (element: HTMLInputElement | null) => void;
}

export const RadioGroupContext = React.createContext<RadioGroupContext<any> | undefined>(undefined);

export function useRadioGroupContext() {
  return React.useContext(RadioGroupContext);
}
