import * as React from 'react';
import '@tale-ui/react-styles/index.css';

// ─── Form with Validation ─────────────────────────────────────────────────────
import { Form } from '@tale-ui/react/form';
import { Fieldset } from '@tale-ui/react/fieldset';
import { TextField } from '@tale-ui/react/text-field';
import { Select } from '@tale-ui/react/select';
import { Checkbox } from '@tale-ui/react/checkbox';
import { Button } from '@tale-ui/react/button';
import { Icon } from '@tale-ui/react/icon';
import { Check, MoreHorizontal } from 'lucide-react';

// ─── Data Table with Sorting ──────────────────────────────────────────────────
import { Table } from '@tale-ui/react/table';
import { Menu } from '@tale-ui/react/menu';
import { Pagination } from '@tale-ui/react/pagination';
import type { SortDescriptor } from 'react-aria-components';

// ─── Search with Autocomplete ─────────────────────────────────────────────────
import { Combobox } from '@tale-ui/react/combobox';

// ─── Settings Page ────────────────────────────────────────────────────────────
import { Switch } from '@tale-ui/react/switch';
import { Radio } from '@tale-ui/react/radio';
import { Separator } from '@tale-ui/react/separator';

// ---------------------------------------------------------------------------
// Recipe 1: Form with Validation
// ---------------------------------------------------------------------------

function FormWithValidation() {
  return (
    <Form onSubmit={(e) => { e.preventDefault(); }}>
      <Fieldset.Root>
        <Fieldset.Legend>Personal Information</Fieldset.Legend>

        <TextField.Root isRequired>
          <TextField.Label>Full Name</TextField.Label>
          <TextField.Input placeholder="Jane Doe" />
          <TextField.Description>As it appears on your ID.</TextField.Description>
          <TextField.ErrorMessage>Name is required.</TextField.ErrorMessage>
        </TextField.Root>

        <TextField.Root isRequired type="email">
          <TextField.Label>Email</TextField.Label>
          <TextField.Input placeholder="jane@example.com" />
          <TextField.ErrorMessage>Enter a valid email address.</TextField.ErrorMessage>
        </TextField.Root>

        <Select.Root isRequired placeholder="Select a country">
          <Select.Label>Country</Select.Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Popover>
            <Select.ListBox>
              <Select.Item id="us">United States</Select.Item>
              <Select.Item id="gb">United Kingdom</Select.Item>
              <Select.Item id="ca">Canada</Select.Item>
              <Select.Item id="au">Australia</Select.Item>
            </Select.ListBox>
          </Select.Popover>
        </Select.Root>
      </Fieldset.Root>

      <Checkbox.Root value="terms" isRequired>
        <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
        I agree to the terms of service
      </Checkbox.Root>

      <div style={{ display: 'flex', gap: 'var(--space-xs)', marginTop: 'var(--space-s)' }}>
        <Button type="submit" variant="primary">Sign Up</Button>
        <Button type="reset" variant="ghost">Reset</Button>
      </div>
    </Form>
  );
}

// ---------------------------------------------------------------------------
// Recipe 2: Data Table with Sorting
// ---------------------------------------------------------------------------

const tableData = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer' },
  { id: 4, name: 'Dave Brown', email: 'dave@example.com', role: 'Admin' },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'Editor' },
];

function DataTableWithSorting() {
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });

  const sorted = [...tableData].sort((a, b) => {
    const key = sortDescriptor.column as keyof (typeof tableData)[0];
    const cmp = String(a[key]).localeCompare(String(b[key]));
    return sortDescriptor.direction === 'ascending' ? cmp : -cmp;
  });

  return (
    <div>
      <Table.Root
        aria-label="Users"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <Table.Header>
          <Table.Column id="name" isRowHeader allowsSorting>Name</Table.Column>
          <Table.Column id="email" allowsSorting>Email</Table.Column>
          <Table.Column id="role">Role</Table.Column>
          <Table.Column id="actions" width={48}>Actions</Table.Column>
        </Table.Header>
        <Table.Body>
          {sorted.map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell>{user.name}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{user.role}</Table.Cell>
              <Table.Cell>
                <Menu.Root>
                  <Menu.Trigger className="tale-button tale-button--ghost tale-button--sm">
                    <Icon icon={MoreHorizontal} size="sm" />
                  </Menu.Trigger>
                  <Menu.Popover>
                    <Menu.MenuList>
                      <Menu.Item>Edit</Menu.Item>
                      <Menu.Item>Delete</Menu.Item>
                    </Menu.MenuList>
                  </Menu.Popover>
                </Menu.Root>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Pagination.Root aria-label="Table pagination" style={{ marginTop: 'var(--space-s)' }}>
        <Pagination.PreviousTrigger disabled />
        <Pagination.Item page={1} current />
        <Pagination.Item page={2} />
        <Pagination.Item page={3} />
        <Pagination.NextTrigger />
      </Pagination.Root>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Recipe 3: Search with Autocomplete
// ---------------------------------------------------------------------------

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

function SearchWithAutocomplete() {
  const [query, setQuery] = React.useState('');

  const filtered = searchItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
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
  );
}

// ---------------------------------------------------------------------------
// Recipe 4: Settings Page
// ---------------------------------------------------------------------------

function SettingsPage() {
  return (
    <Form onSubmit={(e) => { e.preventDefault(); }}>
      <Fieldset.Root>
        <Fieldset.Legend>Notifications</Fieldset.Legend>

        <Switch.Root defaultSelected>
          <Switch.Thumb />
          Email notifications
        </Switch.Root>

        <Switch.Root>
          <Switch.Thumb />
          Push notifications
        </Switch.Root>

        <Switch.Root defaultSelected>
          <Switch.Thumb />
          Weekly digest
        </Switch.Root>
      </Fieldset.Root>

      <Separator />

      <Fieldset.Root>
        <Fieldset.Legend>Appearance</Fieldset.Legend>

        <Radio.Group defaultValue="system" label="Theme">
          <Radio.Root value="light"><Radio.Indicator />Light</Radio.Root>
          <Radio.Root value="dark"><Radio.Indicator />Dark</Radio.Root>
          <Radio.Root value="system"><Radio.Indicator />System</Radio.Root>
        </Radio.Group>

        <Select.Root defaultValue="comfortable" placeholder="Select density">
          <Select.Label>Display Density</Select.Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Popover>
            <Select.ListBox>
              <Select.Item id="compact">Compact</Select.Item>
              <Select.Item id="comfortable">Comfortable</Select.Item>
              <Select.Item id="spacious">Spacious</Select.Item>
            </Select.ListBox>
          </Select.Popover>
        </Select.Root>
      </Fieldset.Root>

      <Separator />

      <Fieldset.Root>
        <Fieldset.Legend>Profile</Fieldset.Legend>

        <TextField.Root>
          <TextField.Label>Display Name</TextField.Label>
          <TextField.Input defaultValue="Jane Doe" />
        </TextField.Root>

        <TextField.Root type="email">
          <TextField.Label>Email</TextField.Label>
          <TextField.Input defaultValue="jane@example.com" />
        </TextField.Root>
      </Fieldset.Root>

      <Separator />

      <div style={{ display: 'flex', gap: 'var(--space-xs)', justifyContent: 'flex-end' }}>
        <Button type="reset" variant="ghost">Cancel</Button>
        <Button type="submit" variant="primary">Save Changes</Button>
      </div>
    </Form>
  );
}

// ---------------------------------------------------------------------------
// Main playground
// ---------------------------------------------------------------------------

const h2Style: React.CSSProperties = {
  fontSize: 'var(--text-l-font-size)',
  marginTop: 'var(--space-2xl)',
  marginBottom: 'var(--space-m)',
};

export default function RecipePlayground() {
  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto', padding: 'var(--space-l) var(--space-m)' }}>
      <h1>Recipe Playground</h1>

      <h2 style={h2Style}>Form with Validation</h2>
      <FormWithValidation />

      <h2 style={h2Style}>Data Table with Sorting</h2>
      <DataTableWithSorting />

      <h2 style={h2Style}>Search with Autocomplete</h2>
      <SearchWithAutocomplete />

      <h2 style={h2Style}>Settings Page</h2>
      <SettingsPage />
    </div>
  );
}
