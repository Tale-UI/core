'use client';
import * as React from 'react';

export interface FormContext {
  clearErrors(name: string | undefined): void;
}

const defaultContext: FormContext = {
  clearErrors() {},
};

export const FormContext = React.createContext<FormContext>(defaultContext);

export function useFormContext(): FormContext {
  return React.useContext(FormContext);
}
