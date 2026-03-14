import React from 'react';
import { addons, types, useStorybookApi } from '@storybook/manager-api';
import { IconButton } from '@storybook/components';
import { SunIcon, MoonIcon } from '@storybook/icons';
import { buildTheme } from './theme';

const STORAGE_KEY = 'tale-ui-shell-color-mode';

function getInitialMode(): 'light' | 'dark' {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const ShellThemeTool: React.FC = () => {
  const api = useStorybookApi();
  const [mode, setMode] = React.useState<'light' | 'dark'>(getInitialMode);

  const toggle = () => {
    const next: 'light' | 'dark' = mode === 'light' ? 'dark' : 'light';
    localStorage.setItem(STORAGE_KEY, next);
    setMode(next);
    api.setOptions({ theme: buildTheme(next) });
  };

  return React.createElement(
    IconButton,
    { key: 'shell-theme-toggle', title: `Switch to ${mode === 'light' ? 'dark' : 'light'} UI`, onClick: toggle },
    React.createElement(mode === 'light' ? MoonIcon : SunIcon, null),
  );
};

// Apply initial theme at config time (before React hydrates the manager)
addons.setConfig({ theme: buildTheme(getInitialMode()) });

addons.register('tale-ui/shell-theme', () => {
  addons.add('tale-ui/shell-theme/tool', {
    type: types.TOOL,
    title: 'Shell color mode',
    render: ShellThemeTool,
  });
});
