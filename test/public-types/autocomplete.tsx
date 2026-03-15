import * as React from 'react';
import { Autocomplete } from '@tale-ui/react/autocomplete';

// Verify the RAC Autocomplete API types are accessible
export type AutocompleteRootProps = Autocomplete.RootProps;
export type AutocompleteSearchFieldProps = Autocomplete.SearchFieldProps;
export type AutocompleteInputProps = Autocomplete.InputProps;
export type AutocompleteListBoxProps = Autocomplete.ListBoxProps;
export type AutocompleteItemProps = Autocomplete.ItemProps;
export type AutocompleteSectionProps = Autocomplete.SectionProps;
export type AutocompleteHeaderProps = Autocomplete.HeaderProps;
export type AutocompleteEmptyProps = Autocomplete.EmptyProps;

export interface SimpleAutocompleteProps {
  items: readonly string[];
  placeholder?: string;
}

export function AutocompleteHarness({ items, placeholder }: SimpleAutocompleteProps) {
  return (
    <Autocomplete.Root>
      <Autocomplete.SearchField aria-label="Search">
        <Autocomplete.Input placeholder={placeholder} />
      </Autocomplete.SearchField>
      <Autocomplete.ListBox aria-label="Suggestions">
        <Autocomplete.Empty>No results</Autocomplete.Empty>
        {items.map((item) => (
          <Autocomplete.Item key={item} id={item}>
            {item}
          </Autocomplete.Item>
        ))}
      </Autocomplete.ListBox>
    </Autocomplete.Root>
  );
}
