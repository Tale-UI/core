'use client';
import { useId } from '@tale-ui/utils/useId';

/**
 * Wraps `useId` and prefixes generated `id`s with `tale-ui-`
 * @param {string | undefined} idOverride overrides the generated id when provided
 * @returns {string | undefined}
 */
export function useTaleUiId(idOverride?: string): string | undefined {
  return useId(idOverride, 'tale-ui');
}
