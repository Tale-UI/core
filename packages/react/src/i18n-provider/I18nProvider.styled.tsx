'use client';
import * as React from 'react';
import { I18nProvider as AriaI18nProvider, useLocale } from 'react-aria-components';

export interface I18nProviderProps {
  /** Contents that should have the locale applied. */
  children: React.ReactNode;
  /** The locale to apply to the children (e.g. `"en-US"`, `"ar-AE"`). */
  locale?: string | undefined;
}

/**
 * Sets the locale and text direction for Tale UI components.
 * Wraps React Aria's `I18nProvider`.
 *
 * @example
 * ```tsx
 * import { I18nProvider } from '@tale-ui/react/i18n-provider';
 *
 * <I18nProvider locale="en-US">
 *   <App />
 * </I18nProvider>
 * ```
 */
export function I18nProvider(props: I18nProviderProps) {
  return <AriaI18nProvider {...props} />;
}

export { useLocale };
