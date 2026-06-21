import * as React from 'react';
import { useStableCallback } from '@tale-ui/utils/useStableCallback';

export type CommandPaletteShortcut = readonly string[];
export type CommandPaletteKey = string | number;

export interface CommandPaletteCommand {
  id: CommandPaletteKey;
  title: string;
  subtitle?: string | undefined;
  keywords?: readonly string[] | undefined;
  group?: string | undefined;
  icon?: React.ReactNode | undefined;
  shortcut?: CommandPaletteShortcut | undefined;
  disabled?: boolean | undefined;
  href?: string | undefined;
  target?: string | undefined;
  action?: (() => void | Promise<void>) | undefined;
  closeOnSelect?: boolean | undefined;
}

export interface CommandPaletteGroup<TCommand extends CommandPaletteCommand = CommandPaletteCommand> {
  id: CommandPaletteKey;
  title: string;
  commands: readonly TCommand[];
}

export interface UseCommandPaletteOptions<TCommand extends CommandPaletteCommand> {
  commands: readonly TCommand[];
  query?: string | undefined;
  defaultQuery?: string | undefined;
  onQueryChange?: ((query: string) => void) | undefined;
  filter?: ((command: TCommand, query: string) => boolean) | undefined;
  sort?: ((a: TCommand, b: TCommand, query: string) => number) | undefined;
  groupBy?: ((command: TCommand) => CommandPaletteKey | null | undefined) | undefined;
  getGroupTitle?: ((groupId: CommandPaletteKey) => string) | undefined;
  onAction?: ((command: TCommand) => void | Promise<void>) | undefined;
  close?: (() => void) | undefined;
  closeOnSelect?: boolean | undefined;
}

export interface UseCommandPaletteReturn<TCommand extends CommandPaletteCommand> {
  query: string;
  setQuery: (query: string) => void;
  filteredCommands: readonly TCommand[];
  groupedCommands: readonly CommandPaletteGroup<TCommand>[];
  runCommand: (commandOrId: TCommand | CommandPaletteKey) => Promise<void>;
  getItemProps: (command: TCommand) => {
    id: CommandPaletteKey;
    textValue: string;
    isDisabled?: boolean | undefined;
    href?: string | undefined;
    target?: string | undefined;
    onAction: () => void;
  };
}

function normalizeSearchText(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function searchableText(command: CommandPaletteCommand): string {
  return [
    command.title,
    command.subtitle,
    command.group,
    ...(command.keywords ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase();
}

export function commandPaletteDefaultFilter<TCommand extends CommandPaletteCommand>(
  command: TCommand,
  query: string,
): boolean {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return true;
  }

  return searchableText(command).includes(normalizedQuery);
}

function commandScore(command: CommandPaletteCommand, query: string): number {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return 0;
  }

  const title = command.title.toLocaleLowerCase();

  if (title === normalizedQuery) {
    return 0;
  }

  if (title.startsWith(normalizedQuery)) {
    return 1;
  }

  if (title.includes(normalizedQuery)) {
    return 2;
  }

  const secondary = [
    command.subtitle,
    command.group,
    ...(command.keywords ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase();

  return secondary.includes(normalizedQuery) ? 3 : 4;
}

export function commandPaletteDefaultSort<TCommand extends CommandPaletteCommand>(
  a: TCommand,
  b: TCommand,
  query: string,
): number {
  return commandScore(a, query) - commandScore(b, query);
}

export function useCommandPalette<TCommand extends CommandPaletteCommand>(
  options: UseCommandPaletteOptions<TCommand>,
): UseCommandPaletteReturn<TCommand> {
  const {
    commands,
    query: queryProp,
    defaultQuery = '',
    onQueryChange,
    filter = commandPaletteDefaultFilter,
    sort = commandPaletteDefaultSort,
    groupBy = (command) => command.group,
    getGroupTitle = (groupId) => String(groupId),
    onAction,
    close,
    closeOnSelect = true,
  } = options;

  const [uncontrolledQuery, setUncontrolledQuery] = React.useState(defaultQuery);
  const query = queryProp ?? uncontrolledQuery;
  const runGlobalAction = useStableCallback(onAction);
  const closePalette = useStableCallback(close);

  const setQuery = React.useCallback(
    (nextQuery: string) => {
      if (queryProp === undefined) {
        setUncontrolledQuery(nextQuery);
      }

      onQueryChange?.(nextQuery);
    },
    [onQueryChange, queryProp],
  );

  const indexedCommands = React.useMemo(
    () => commands.map((command, index) => ({ command, index })),
    [commands],
  );

  const filteredCommands = React.useMemo(() => {
    return indexedCommands
      .filter(({ command }) => filter(command, query))
      .sort((left, right) => {
        const result = sort(left.command, right.command, query);
        return result === 0 ? left.index - right.index : result;
      })
      .map(({ command }) => command);
  }, [filter, indexedCommands, query, sort]);

  const groupedCommands = React.useMemo(() => {
    const groups = new Map<CommandPaletteKey, TCommand[]>();
    const ungroupedId = '__command-palette-ungrouped__';

    for (const command of filteredCommands) {
      const groupId = groupBy(command) ?? ungroupedId;
      const groupCommands = groups.get(groupId) ?? [];
      groupCommands.push(command);
      groups.set(groupId, groupCommands);
    }

    return [...groups].map(([id, groupCommands]) => ({
      id,
      title: id === ungroupedId ? '' : getGroupTitle(id),
      commands: groupCommands,
    }));
  }, [filteredCommands, getGroupTitle, groupBy]);

  const runCommand = React.useCallback(
    async (commandOrId: TCommand | CommandPaletteKey) => {
      const command = typeof commandOrId === 'object'
        ? commandOrId
        : commands.find((item) => item.id === commandOrId);

      if (!command || command.disabled) {
        return;
      }

      await command.action?.();
      await runGlobalAction?.(command);

      if (command.closeOnSelect ?? closeOnSelect) {
        closePalette?.();
      }
    },
    [closeOnSelect, closePalette, commands, runGlobalAction],
  );

  const getItemProps = React.useCallback(
    (command: TCommand) => ({
      id: command.id,
      textValue: command.title,
      isDisabled: command.disabled,
      href: command.href,
      target: command.target,
      onAction: () => {
        void runCommand(command);
      },
    }),
    [runCommand],
  );

  return {
    query,
    setQuery,
    filteredCommands,
    groupedCommands,
    runCommand,
    getItemProps,
  };
}

interface ParsedShortcut {
  key: string;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  modKey: boolean;
}

export interface UseCommandPaletteShortcutOptions {
  open: boolean;
  setOpen: (open: boolean) => void;
  shortcut?: string | readonly string[] | undefined;
  enabled?: boolean | undefined;
  ignoreEditable?: boolean | undefined;
  target?: Document | HTMLElement | null | undefined;
}

function isMacPlatform(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return /mac|iphone|ipad|ipod/i.test(navigator.platform);
}

function parseShortcut(shortcut: string): ParsedShortcut {
  const parts = shortcut.toLocaleLowerCase().split('+').map((part) => part.trim()).filter(Boolean);
  const key = parts.at(-1);

  if (!key || parts.length === 0) {
    throw new Error(
      'Tale UI: Invalid command palette shortcut. Use a string like "mod+k", "ctrl+k", or "meta+shift+p".',
    );
  }

  const modifiers = parts.slice(0, -1);
  const allowed = new Set(['alt', 'ctrl', 'meta', 'mod', 'shift']);

  for (const modifier of modifiers) {
    if (!allowed.has(modifier)) {
      throw new Error(
        'Tale UI: Invalid command palette shortcut modifier. Supported modifiers are alt, ctrl, meta, mod, and shift.',
      );
    }
  }

  return {
    key,
    altKey: modifiers.includes('alt'),
    ctrlKey: modifiers.includes('ctrl'),
    metaKey: modifiers.includes('meta'),
    shiftKey: modifiers.includes('shift'),
    modKey: modifiers.includes('mod'),
  };
}

export function normalizeCommandPaletteShortcut(
  shortcut: string | readonly string[] = 'mod+k',
): readonly ParsedShortcut[] {
  const shortcuts = Array.isArray(shortcut) ? shortcut : [shortcut];
  return shortcuts.map(parseShortcut);
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  const tagName = target.tagName.toLocaleLowerCase();
  return tagName === 'input' || tagName === 'textarea' || tagName === 'select';
}

function shortcutMatches(event: KeyboardEvent, shortcut: ParsedShortcut): boolean {
  const expectedMeta = shortcut.modKey && isMacPlatform() ? true : shortcut.metaKey;
  const expectedCtrl = shortcut.modKey && !isMacPlatform() ? true : shortcut.ctrlKey;

  return event.key.toLocaleLowerCase() === shortcut.key
    && event.altKey === shortcut.altKey
    && event.shiftKey === shortcut.shiftKey
    && event.metaKey === expectedMeta
    && event.ctrlKey === expectedCtrl;
}

export function useCommandPaletteShortcut(options: UseCommandPaletteShortcutOptions): void {
  const {
    open,
    setOpen,
    shortcut = 'mod+k',
    enabled = true,
    ignoreEditable = true,
    target,
  } = options;

  const stableSetOpen = useStableCallback(setOpen);

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    const eventTarget = target ?? (typeof document !== 'undefined' ? document : null);

    if (!eventTarget) {
      return;
    }

    const parsedShortcuts = normalizeCommandPaletteShortcut(shortcut);

    function handleKeyDown(event: KeyboardEvent) {
      if (ignoreEditable && isEditableTarget(event.target)) {
        return;
      }

      if (!parsedShortcuts.some((parsedShortcut) => shortcutMatches(event, parsedShortcut))) {
        return;
      }

      event.preventDefault();
      stableSetOpen(!open);
    }

    eventTarget.addEventListener('keydown', handleKeyDown as EventListener);

    return () => {
      eventTarget.removeEventListener('keydown', handleKeyDown as EventListener);
    };
  }, [enabled, ignoreEditable, open, shortcut, stableSetOpen, target]);
}
