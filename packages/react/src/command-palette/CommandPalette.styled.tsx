import * as React from 'react';
import { X } from 'lucide-react';
import {
  Autocomplete as AriaAutocomplete,
  Button as AriaButton,
  Collection as AriaCollection,
  Dialog as AriaDialog,
  Header as AriaHeader,
  Heading as AriaHeading,
  Input as AriaInput,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  ListBoxSection as AriaListBoxSection,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  SearchField as AriaSearchField,
  Separator as AriaSeparator,
  type AutocompleteProps as AriaAutocompleteProps,
  type ButtonProps as AriaButtonProps,
  type CollectionProps as AriaCollectionProps,
  type DialogProps as AriaDialogProps,
  type HeaderProps as AriaHeaderProps,
  type HeadingProps as AriaHeadingProps,
  type InputProps as AriaInputProps,
  type ListBoxItemProps as AriaListBoxItemProps,
  type ListBoxProps as AriaListBoxProps,
  type ListBoxSectionProps as AriaListBoxSectionProps,
  type ModalOverlayProps as AriaModalOverlayProps,
  type SearchFieldProps as AriaSearchFieldProps,
  type SeparatorProps as AriaSeparatorProps,
} from 'react-aria-components';
import { Icon } from '../icon';
import { cx } from '../_cx';
import type { CommandPaletteCommand } from './useCommandPalette';

type Size = 'sm' | 'md' | 'lg';

interface CommandPaletteContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  size: Size;
  closeOnSelect: boolean;
}

const CommandPaletteContext = React.createContext<CommandPaletteContextValue | null>(null);

function useCommandPaletteContext(part: string): CommandPaletteContextValue {
  const context = React.useContext(CommandPaletteContext);

  if (!context) {
    throw new Error(`Tale UI: CommandPalette.${part} must be rendered inside CommandPalette.Root.`);
  }

  return context;
}

function hasAccessibleLabel(props: {
  'aria-label'?: string | undefined;
  'aria-labelledby'?: string | undefined;
}): boolean {
  return Boolean(props['aria-label'] || props['aria-labelledby']);
}

/* Root */

export interface RootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  size?: Size | undefined;
  closeOnSelect?: boolean | undefined;
  className?: string | undefined;
}

/**
 * App-wide command discovery, navigation, and quick actions.
 *
 * @status stable
 * @example
 * ```tsx
 * import { CommandPalette } from '@tale-ui/react/command-palette';
 *
 * <CommandPalette.Root>
 *   <CommandPalette.Trigger className="tale-button tale-button--neutral tale-button--md">
 *     Search
 *   </CommandPalette.Trigger>
 *   <CommandPalette.Backdrop>
 *     <CommandPalette.Popup aria-label="Command palette">
 *       <CommandPalette.Content>
 *         <CommandPalette.SearchField>
 *           <CommandPalette.Input placeholder="Search commands..." />
 *           <CommandPalette.ClearButton />
 *         </CommandPalette.SearchField>
 *         <CommandPalette.ListBox>
 *           <CommandPalette.Item id="docs" textValue="Open docs">Open docs</CommandPalette.Item>
 *         </CommandPalette.ListBox>
 *       </CommandPalette.Content>
 *     </CommandPalette.Popup>
 *   </CommandPalette.Backdrop>
 * </CommandPalette.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  (
    {
      className,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      size = 'md',
      closeOnSelect = true,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const open = openProp ?? uncontrolledOpen;

    const setOpen = React.useCallback(
      (nextOpen: boolean) => {
        if (openProp === undefined) {
          setUncontrolledOpen(nextOpen);
        }

        onOpenChange?.(nextOpen);
      },
      [onOpenChange, openProp],
    );

    const contextValue = React.useMemo(
      () => ({ closeOnSelect, open, setOpen, size }),
      [closeOnSelect, open, setOpen, size],
    );

    const sizeClass = size !== 'md' ? ` tale-command-palette--${size}` : '';

    return (
      <CommandPaletteContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-open={open || undefined}
          className={cx(`tale-command-palette${sizeClass}`, className)}
          {...props}
        />
      </CommandPaletteContext.Provider>
    );
  },
);
Root.displayName = 'CommandPalette.Root';

/* Trigger */

export type TriggerProps = Omit<AriaButtonProps, 'className'> & { className?: string | undefined };

export const Trigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  ({ className, onPress, ...props }, ref) => {
    const { setOpen } = useCommandPaletteContext('Trigger');

    return (
      <AriaButton
        ref={ref}
        className={cx('tale-command-palette__trigger', className)}
        onPress={(event) => {
          onPress?.(event);
          setOpen(true);
        }}
        {...props}
      />
    );
  },
);
Trigger.displayName = 'CommandPalette.Trigger';

/* Backdrop */

export type BackdropProps = Omit<AriaModalOverlayProps, 'className' | 'isOpen' | 'onOpenChange'> & {
  className?: string | undefined;
};

/**
 * Modal backdrop that wraps `CommandPalette.Popup`.
 *
 * Dismisses the palette when users press outside the popup by default.
 * Pass `isDismissable={false}` for workflows that must stay open until an explicit action.
 */
export const Backdrop = React.forwardRef<HTMLDivElement, BackdropProps>(
  ({ className, isDismissable = true, ...props }, ref) => {
    const { open, setOpen } = useCommandPaletteContext('Backdrop');

    return (
      <AriaModalOverlay
        ref={ref}
        isOpen={open}
        onOpenChange={setOpen}
        isDismissable={isDismissable}
        className={cx('tale-command-palette__backdrop', className)}
        {...props}
      />
    );
  },
);
Backdrop.displayName = 'CommandPalette.Backdrop';

/* Popup */

export type PopupProps = Omit<AriaDialogProps, 'className'> & {
  className?: string | undefined;
  modalProps?: Omit<AriaModalOverlayProps, 'children' | 'isOpen' | 'onOpenChange'> | undefined;
};

export const Popup = React.forwardRef<HTMLElement, PopupProps>(
  ({ className, modalProps, children, ...props }, ref) => {
    const { className: modalClassName, ...resolvedModalProps } = modalProps ?? {};
    const popupClassName =
      typeof modalClassName === 'function'
        ? (values: Parameters<typeof modalClassName>[0]): string => {
            const result = modalClassName(values);
            return result ? `tale-command-palette__popup ${result}` : 'tale-command-palette__popup';
          }
        : cx('tale-command-palette__popup', modalClassName);

    return (
      <AriaModal {...resolvedModalProps} className={popupClassName}>
        <AriaDialog ref={ref} className={cx('tale-command-palette__dialog', className)} {...props}>
          {children}
        </AriaDialog>
      </AriaModal>
    );
  },
);
Popup.displayName = 'CommandPalette.Popup';

/* Title, Description, Close */

export type TitleProps = Omit<AriaHeadingProps, 'className'> & { className?: string | undefined };

export const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className, slot = 'title', ...props }, ref) => (
    <AriaHeading
      ref={ref}
      slot={slot}
      className={cx('tale-command-palette__title', className)}
      {...props}
    />
  ),
);
Title.displayName = 'CommandPalette.Title';

export type DescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & {
  className?: string | undefined;
};

export const Description = React.forwardRef<HTMLParagraphElement, DescriptionProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cx('tale-command-palette__description', className)} {...props} />
  ),
);
Description.displayName = 'CommandPalette.Description';

export type CloseProps = Omit<AriaButtonProps, 'className'> & { className?: string | undefined };

export const Close = React.forwardRef<HTMLButtonElement, CloseProps>(
  ({ className, children, onPress, ...props }, ref) => {
    const { setOpen } = useCommandPaletteContext('Close');

    return (
      <AriaButton
        ref={ref}
        className={cx(
          'tale-icon-button tale-icon-button--sm tale-button tale-button--ghost tale-command-palette__close',
          className,
        )}
        onPress={(event) => {
          onPress?.(event);
          setOpen(false);
        }}
        {...props}
      >
        {children ?? <Icon icon={X} size="sm" />}
      </AriaButton>
    );
  },
);
Close.displayName = 'CommandPalette.Close';

/* Content (Autocomplete context) */

export type ContentProps<T extends object = object> = AriaAutocompleteProps<T> & {
  className?: string | undefined;
};

export const Content = React.forwardRef<HTMLDivElement, ContentProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cx('tale-command-palette__content', className)}>
      <AriaAutocomplete {...props}>{children}</AriaAutocomplete>
    </div>
  ),
);
Content.displayName = 'CommandPalette.Content';

/* SearchField, Input, ClearButton */

export type SearchFieldProps = Omit<AriaSearchFieldProps, 'className'> & {
  className?: string | undefined;
  variant?: 'default' | 'inline' | undefined;
};

export const SearchField = React.forwardRef<HTMLDivElement, SearchFieldProps>(
  ({ className, variant = 'inline', ...props }, ref) => {
    const defaultLabelProps = hasAccessibleLabel(props)
      ? undefined
      : { 'aria-label': 'Search commands' };

    return (
      <AriaSearchField
        ref={ref}
        className={cx(
          `tale-command-palette__search-field tale-command-palette__search-field--${variant}`,
          className,
        )}
        {...defaultLabelProps}
        {...props}
      />
    );
  },
);
SearchField.displayName = 'CommandPalette.SearchField';

export type InputProps = Omit<AriaInputProps, 'className'> & {
  className?: string | undefined;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ autoFocus = true, className, ...props }, ref) => (
    <AriaInput
      ref={ref}
      autoFocus={autoFocus}
      className={cx('tale-command-palette__input', className)}
      {...props}
    />
  ),
);
Input.displayName = 'CommandPalette.Input';

export type ClearButtonProps = Omit<AriaButtonProps, 'className'> & {
  className?: string | undefined;
};

export const ClearButton = React.forwardRef<HTMLButtonElement, ClearButtonProps>(
  ({ className, children, ...props }, ref) => (
    <AriaButton
      ref={ref}
      className={cx(
        'tale-button tale-button--ghost tale-button--sm tale-command-palette__clear',
        className,
      )}
      {...props}
    >
      {children ?? 'Clear'}
    </AriaButton>
  ),
);
ClearButton.displayName = 'CommandPalette.ClearButton';

/* ListBox and collection parts */

export type ListBoxProps<T extends object = object> = Omit<AriaListBoxProps<T>, 'className'> & {
  className?: string | undefined;
};

export const ListBox = React.forwardRef<HTMLDivElement, ListBoxProps>(
  ({ className, ...props }, ref) => {
    const { size } = useCommandPaletteContext('ListBox');
    const sizeClass = size !== 'md' ? ` tale-command-palette__listbox--${size}` : '';
    const defaultLabelProps = hasAccessibleLabel(props)
      ? undefined
      : { 'aria-label': 'Command results' };

    return (
      <AriaListBox
        ref={ref}
        className={cx(`tale-command-palette__listbox${sizeClass}`, className)}
        {...defaultLabelProps}
        {...props}
      />
    );
  },
);
ListBox.displayName = 'CommandPalette.ListBox';

export type SectionProps<T extends object = object> = Omit<
  AriaListBoxSectionProps<T>,
  'className'
> & {
  className?: string | undefined;
};

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, ...props }, ref) => (
    <AriaListBoxSection
      ref={ref}
      className={cx('tale-command-palette__section', className)}
      {...props}
    />
  ),
);
Section.displayName = 'CommandPalette.Section';

export type SectionHeaderProps = Omit<AriaHeaderProps, 'className'> & {
  className?: string | undefined;
};

export const SectionHeader = React.forwardRef<HTMLElement, SectionHeaderProps>(
  ({ className, ...props }, ref) => (
    <AriaHeader
      ref={ref}
      className={cx('tale-command-palette__section-header', className)}
      {...props}
    />
  ),
);
SectionHeader.displayName = 'CommandPalette.SectionHeader';

export type ItemProps<T = object> = Omit<AriaListBoxItemProps<T>, 'className'> & {
  command?: CommandPaletteCommand | undefined;
  closeOnSelect?: boolean | undefined;
  className?: string | undefined;
};

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return Boolean(value && typeof (value as { then?: unknown }).then === 'function');
}

export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  (
    {
      className,
      command,
      closeOnSelect,
      id,
      textValue,
      isDisabled,
      href,
      target,
      onAction,
      ...props
    },
    ref,
  ) => {
    const context = useCommandPaletteContext('Item');
    const resolvedIsDisabled = isDisabled ?? command?.disabled;
    const resolvedCloseOnSelect = closeOnSelect ?? command?.closeOnSelect ?? context.closeOnSelect;
    const resolvedAction = onAction ?? command?.action;
    const resolvedHref = href ?? command?.href;
    const resolvedTarget = target ?? command?.target;
    const linkProps = resolvedHref
      ? {
          href: resolvedHref,
          target: resolvedTarget,
        }
      : {};

    const handleAction = React.useCallback(() => {
      if (resolvedIsDisabled) {
        return;
      }

      const result = resolvedAction?.();

      if (!resolvedCloseOnSelect) {
        return;
      }

      if (isPromiseLike(result)) {
        void Promise.resolve(result).then(() => context.setOpen(false));
        return;
      }

      context.setOpen(false);
    }, [context, resolvedAction, resolvedCloseOnSelect, resolvedIsDisabled]);

    return (
      <AriaListBoxItem
        ref={ref}
        id={id ?? command?.id}
        textValue={textValue ?? command?.title}
        isDisabled={resolvedIsDisabled}
        {...linkProps}
        onAction={handleAction}
        className={cx('tale-command-palette__item', className)}
        {...props}
      />
    );
  },
);
Item.displayName = 'CommandPalette.Item';

export type SeparatorProps = Omit<AriaSeparatorProps, 'className'> & {
  className?: string | undefined;
};

export const Separator = React.forwardRef<HTMLElement, SeparatorProps>(
  ({ className, ...props }, ref) => (
    <AriaSeparator
      ref={ref}
      className={cx('tale-command-palette__separator', className)}
      {...props}
    />
  ),
);
Separator.displayName = 'CommandPalette.Separator';

export type LoadMoreItemProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string | undefined;
};

export const LoadMoreItem = React.forwardRef<HTMLDivElement, LoadMoreItemProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="presentation"
      className={cx('tale-command-palette__load-more-item', className)}
      {...props}
    />
  ),
);
LoadMoreItem.displayName = 'CommandPalette.LoadMoreItem';

export type CollectionProps<T extends object = object> = AriaCollectionProps<T>;

export const Collection: typeof AriaCollection = AriaCollection;

/* Presentational slots */

export type ItemIconProps = React.HTMLAttributes<HTMLSpanElement> & {
  className?: string | undefined;
};
export type ItemContentProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string | undefined;
};
export type ItemTitleProps = React.HTMLAttributes<HTMLSpanElement> & {
  className?: string | undefined;
};
export type ItemDescriptionProps = React.HTMLAttributes<HTMLSpanElement> & {
  className?: string | undefined;
};
export type ItemMetaProps = React.HTMLAttributes<HTMLSpanElement> & {
  className?: string | undefined;
};

export const ItemIcon = React.forwardRef<HTMLSpanElement, ItemIconProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-command-palette__item-icon', className)} {...props} />
  ),
);
ItemIcon.displayName = 'CommandPalette.ItemIcon';

export const ItemContent = React.forwardRef<HTMLDivElement, ItemContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-command-palette__item-content', className)} {...props} />
  ),
);
ItemContent.displayName = 'CommandPalette.ItemContent';

export const ItemTitle = React.forwardRef<HTMLSpanElement, ItemTitleProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-command-palette__item-title', className)} {...props} />
  ),
);
ItemTitle.displayName = 'CommandPalette.ItemTitle';

export const ItemDescription = React.forwardRef<HTMLSpanElement, ItemDescriptionProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cx('tale-command-palette__item-description', className)}
      {...props}
    />
  ),
);
ItemDescription.displayName = 'CommandPalette.ItemDescription';

export const ItemMeta = React.forwardRef<HTMLSpanElement, ItemMetaProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-command-palette__item-meta', className)} {...props} />
  ),
);
ItemMeta.displayName = 'CommandPalette.ItemMeta';

export type ShortcutProps = React.HTMLAttributes<HTMLSpanElement> & {
  keys?: readonly string[] | undefined;
  className?: string | undefined;
};

export const Shortcut = React.forwardRef<HTMLSpanElement, ShortcutProps>(
  ({ 'aria-hidden': ariaHidden = true, className, keys, children, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden={ariaHidden}
      className={cx('tale-command-palette__shortcut', className)}
      {...props}
    >
      {keys
        ? keys.map((key) => (
            <kbd key={key} className="tale-command-palette__shortcut-key">
              {key}
            </kbd>
          ))
        : children}
    </span>
  ),
);
Shortcut.displayName = 'CommandPalette.Shortcut';

export type EmptyProps = React.HTMLAttributes<HTMLDivElement> & { className?: string | undefined };
export type FooterProps = React.HTMLAttributes<HTMLDivElement> & { className?: string | undefined };
export type ChipsProps = React.HTMLAttributes<HTMLDivElement> & { className?: string | undefined };
export type ChipProps = React.HTMLAttributes<HTMLSpanElement> & { className?: string | undefined };
export type ChipRemoveProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string | undefined;
};

export const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-command-palette__empty', className)} {...props} />
  ),
);
Empty.displayName = 'CommandPalette.Empty';

export const Footer = React.forwardRef<HTMLDivElement, FooterProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-command-palette__footer', className)} {...props} />
  ),
);
Footer.displayName = 'CommandPalette.Footer';

export const Chips = React.forwardRef<HTMLDivElement, ChipsProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-command-palette__chips', className)} {...props} />
  ),
);
Chips.displayName = 'CommandPalette.Chips';

export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(({ className, ...props }, ref) => (
  <span ref={ref} className={cx('tale-command-palette__chip', className)} {...props} />
));
Chip.displayName = 'CommandPalette.Chip';

export const ChipRemove = React.forwardRef<HTMLButtonElement, ChipRemoveProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      {...props}
      type="button"
      className={cx('tale-command-palette__chip-remove', className)}
    >
      {children ?? <Icon icon={X} size="sm" />}
    </button>
  ),
);
ChipRemove.displayName = 'CommandPalette.ChipRemove';
