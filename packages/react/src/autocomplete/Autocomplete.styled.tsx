import * as React from 'react';
import {
  Autocomplete as AriaAutocomplete,
  SearchField as AriaSearchField,
  Input as AriaInput,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  ListBoxSection as AriaListBoxSection,
  Header as AriaHeader,
  Separator as AriaSeparator,
  type AutocompleteProps as AriaAutocompleteProps,
  type SearchFieldProps as AriaSearchFieldProps,
  type InputProps as AriaInputProps,
  type ListBoxProps as AriaListBoxProps,
  type ListBoxItemProps as AriaListBoxItemProps,
  type ListBoxSectionProps as AriaListBoxSectionProps,
  type SeparatorProps as AriaSeparatorProps,
} from 'react-aria-components';
import { cx } from '../_cx';

/* ─── Root (Autocomplete filtering context) ──────────────────────────────── */

export type RootProps<T extends object = object> = AriaAutocompleteProps<T>;

export function Root<T extends object>(props: RootProps<T>) {
  return <AriaAutocomplete {...props} />;
}

/* ─── SearchField ────────────────────────────────────────────────────────── */

export type SearchFieldProps = Omit<AriaSearchFieldProps, 'className'> & { className?: string };

export const SearchField = React.forwardRef<HTMLDivElement, SearchFieldProps>(
  ({ className, ...props }, ref) => (
    <AriaSearchField ref={ref} className={cx('tale-autocomplete__search-field', className)} {...props} />
  ),
);
SearchField.displayName = 'Autocomplete.SearchField';

/* ─── Input ──────────────────────────────────────────────────────────────── */

export type InputProps = Omit<AriaInputProps, 'className'> & { className?: string };

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <AriaInput ref={ref} className={cx('tale-autocomplete__input', className)} {...props} />
  ),
);
Input.displayName = 'Autocomplete.Input';

/* ─── ListBox ────────────────────────────────────────────────────────────── */

export type ListBoxProps<T extends object = object> = Omit<AriaListBoxProps<T>, 'className'> & {
  className?: string;
};

export const ListBox: <T extends object = object>(
  props: ListBoxProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null = React.forwardRef(
  ({ className, ...props }: ListBoxProps, ref) => (
    <AriaListBox
      ref={ref as React.Ref<HTMLDivElement>}
      className={cx('tale-autocomplete__listbox', className)}
      {...props}
    />
  ),
) as any;
(ListBox as any).displayName = 'Autocomplete.ListBox';

/* ─── Item (ListBoxItem) ─────────────────────────────────────────────────── */

export type ItemProps<T = object> = Omit<AriaListBoxItemProps<T>, 'className'> & { className?: string };

export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, ...props }, ref) => (
    <AriaListBoxItem ref={ref} className={cx('tale-autocomplete__item', className)} {...props} />
  ),
);
Item.displayName = 'Autocomplete.Item';

/* ─── Section (ListBoxSection) ───────────────────────────────────────────── */

export type SectionProps<T = object> = AriaListBoxSectionProps<T>;

export const Section: <T extends object>(
  props: SectionProps<T> & React.RefAttributes<HTMLElement>,
) => React.ReactElement | null = AriaListBoxSection as any;

/* ─── Header ─────────────────────────────────────────────────────────────── */

export type HeaderProps = Omit<React.HTMLAttributes<HTMLElement>, 'className'> & { className?: string };

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, ...props }, ref) => (
    <AriaHeader
      ref={ref as React.Ref<HTMLElement>}
      className={cx('tale-autocomplete__header', className)}
      {...props}
    />
  ),
);
Header.displayName = 'Autocomplete.Header';

/* ─── Empty state ────────────────────────────────────────────────────────── */

export type EmptyProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> & { className?: string };

export const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-autocomplete__empty', className)} {...props} />
  ),
);
Empty.displayName = 'Autocomplete.Empty';

/* ─── Separator ──────────────────────────────────────────────────────────── */

export type SeparatorProps = Omit<AriaSeparatorProps, 'className'> & { className?: string };

export const Separator = React.forwardRef<HTMLElement, SeparatorProps>(
  ({ className, ...props }, ref) => (
    <AriaSeparator ref={ref} className={cx('tale-autocomplete__separator', className)} {...props} />
  ),
);
Separator.displayName = 'Autocomplete.Separator';
