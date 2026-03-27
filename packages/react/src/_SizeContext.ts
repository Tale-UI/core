import { createContext, useContext } from 'react';

type Size = 'sm' | 'md' | 'lg';

export const SizeContext = createContext<Size | undefined>(undefined);

/**
 * Returns the effective size: explicit prop > context > fallback.
 */
export function useSize(explicit: Size | undefined, fallback: Size): Size {
  const fromContext = useContext(SizeContext);
  return explicit ?? fromContext ?? fallback;
}
