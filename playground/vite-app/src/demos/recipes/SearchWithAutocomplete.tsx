import * as React from 'react';
import { Combobox } from '@tale-ui/react/combobox';
import { Column } from '@tale-ui/react/column';
import { Text } from '@tale-ui/react/text';

const searchItems = [
  { id: 'button', label: 'Button' },
  { id: 'checkbox', label: 'Checkbox' },
  { id: 'dialog', label: 'Dialog' },
  { id: 'drawer', label: 'Drawer' },
  { id: 'menu', label: 'Menu' },
  { id: 'pagination', label: 'Pagination' },
  { id: 'select', label: 'Select' },
  { id: 'table', label: 'Table' },
  { id: 'tabs', label: 'Tabs' },
  { id: 'tooltip', label: 'Tooltip' },
];

export default function SearchWithAutocomplete() {
  const [query, setQuery] = React.useState('');

  const filtered = searchItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Column
      gap="m"
      style={{ maxWidth: '30rem', margin: '0 auto', padding: 'var(--space-l) var(--space-m)' }}
    >
      <Text as="h1" variant="heading" size="l">
        Search with Autocomplete
      </Text>
      <Combobox.Root inputValue={query} onInputChange={setQuery} menuTrigger="focus">
        <Combobox.Label>Search components</Combobox.Label>
        <Combobox.InputGroup>
          <Combobox.Input placeholder="Type to search..." />
          <Combobox.Trigger />
        </Combobox.InputGroup>
        <Combobox.Popover>
          <Combobox.ListBox>
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <Combobox.Item key={item.id} id={item.id} textValue={item.label}>
                  {item.label}
                </Combobox.Item>
              ))
            ) : (
              <Combobox.Empty>No results found</Combobox.Empty>
            )}
          </Combobox.ListBox>
        </Combobox.Popover>
      </Combobox.Root>
    </Column>
  );
}
