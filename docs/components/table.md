# Table

`import { Table } from '@tale-ui/react/table';`

An accessible data table with support for sorting and row selection.

## Parts

| Part | Description |
|------|-------------|
| `Table.Root` | `<table>` wrapper. Accepts `aria-label`, `selectionMode`, `sortDescriptor`, and `onSortChange`. |
| `Table.Header` | `<thead>` section containing columns. |
| `Table.Column` | A column header cell. Supports `isRowHeader` and `allowsSorting`. |
| `Table.Body` | `<tbody>` section containing rows. |
| `Table.Row` | A table row. Requires `id`. |
| `Table.Cell` | A table data cell. |

## Basic Usage

```tsx
<Table.Root aria-label="People">
  <Table.Header>
    <Table.Column isRowHeader>Name</Table.Column>
    <Table.Column>Email</Table.Column>
    <Table.Column>Role</Table.Column>
  </Table.Header>
  <Table.Body>
    <Table.Row id="1">
      <Table.Cell>Alice</Table.Cell>
      <Table.Cell>alice@example.com</Table.Cell>
      <Table.Cell>Admin</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

## Examples

### With Selection

```tsx
<Table.Root aria-label="People" selectionMode="multiple">
  <Table.Header>
    <Table.Column isRowHeader>Name</Table.Column>
    <Table.Column>Email</Table.Column>
    <Table.Column>Role</Table.Column>
  </Table.Header>
  <Table.Body>
    <Table.Row id="1">
      <Table.Cell>Alice</Table.Cell>
      <Table.Cell>alice@example.com</Table.Cell>
      <Table.Cell>Admin</Table.Cell>
    </Table.Row>
    <Table.Row id="2">
      <Table.Cell>Bob</Table.Cell>
      <Table.Cell>bob@example.com</Table.Cell>
      <Table.Cell>Editor</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

### With Sorting

```tsx
import { useState } from 'react';
import type { SortDescriptor } from 'react-aria-components';

function SortableTable() {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });

  const rows = [
    { id: '1', name: 'Alice', email: 'alice@example.com', role: 'Admin' },
    { id: '2', name: 'Bob', email: 'bob@example.com', role: 'Editor' },
  ];

  const sorted = [...rows].sort((a, b) => {
    const col = sortDescriptor.column as keyof typeof a;
    const cmp = a[col].localeCompare(b[col]);
    return sortDescriptor.direction === 'descending' ? -cmp : cmp;
  });

  return (
    <Table.Root
      aria-label="People"
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
    >
      <Table.Header>
        <Table.Column id="name" isRowHeader allowsSorting>Name</Table.Column>
        <Table.Column id="email" allowsSorting>Email</Table.Column>
        <Table.Column id="role" allowsSorting>Role</Table.Column>
      </Table.Header>
      <Table.Body>
        {sorted.map((row) => (
          <Table.Row key={row.id} id={row.id}>
            <Table.Cell>{row.name}</Table.Cell>
            <Table.Cell>{row.email}</Table.Cell>
            <Table.Cell>{row.role}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
```

## CSS Classes

- `.tale-table` — Base
- `.tale-table__header` — Header section
- `.tale-table__column` — Column header cell
- `.tale-table__body` — Body section
- `.tale-table__row` — Row
- `.tale-table__cell` — Data cell

## Notes

- Set `allowsSorting` on individual columns and provide `sortDescriptor` / `onSortChange` on `Root` to enable sorting.
- `selectionMode` can be `"none"`, `"single"`, or `"multiple"`.
- Built on React Aria `Table`, `TableHeader`, `Column`, `TableBody`, `Row`, and `Cell`.
