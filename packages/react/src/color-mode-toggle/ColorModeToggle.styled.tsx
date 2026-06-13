import * as React from 'react';
import { Switch as AriaSwitch } from 'react-aria-components';
import type { SwitchProps as AriaSwitchProps } from 'react-aria-components';
import { cx } from '../_cx';

export interface ColorModeToggleProps extends Omit<AriaSwitchProps, 'className' | 'isSelected' | 'onChange'> {
  /** Initial colour mode when no localStorage value exists. Defaults to OS preference. */
  defaultMode?: 'light' | 'dark';
  /** localStorage key for persisting the colour mode. @default 'color-mode' */
  storageKey?: string;
  className?: string;
}

/**
 * A sun/moon toggle that switches between light and dark colour modes.
 * Persists the choice to localStorage and sets `data-color-mode` on `<html>`.
 *
 * @example
 * ```tsx
 * import { ColorModeToggle } from '@tale-ui/react/color-mode-toggle';
 *
 * <ColorModeToggle />
 * ```
 */
export const ColorModeToggle = React.forwardRef<HTMLLabelElement, ColorModeToggleProps>(
  ({ defaultMode, storageKey = 'color-mode', className, ...props }, ref) => {
    const [dark, setDark] = React.useState(() => {
      if (typeof window === 'undefined') {return false;}
      const saved = localStorage.getItem(storageKey);
      if (saved) {return saved === 'dark';}
      if (defaultMode) {return defaultMode === 'dark';}
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    React.useEffect(() => {
      const mode = dark ? 'dark' : 'light';
      document.documentElement.setAttribute('data-color-mode', mode);
      localStorage.setItem(storageKey, mode);
    }, [dark, storageKey]);

    return (
      <AriaSwitch
        ref={ref}
        aria-label="Toggle dark mode"
        isSelected={dark}
        onChange={setDark}
        className={cx('tale-color-mode-toggle', className)}
        {...props}
      />
    );
  },
);
ColorModeToggle.displayName = 'ColorModeToggle';
