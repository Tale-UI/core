import * as React from 'react';
import { Table } from '@tale-ui/react/table';
import { Menu } from '@tale-ui/react/menu';
import { Pagination } from '@tale-ui/react/pagination';
import { Icon } from '@tale-ui/react/icon';
import { MoreHorizontal } from 'lucide-react';
import type { SortDescriptor } from 'react-aria-components';

const tableData = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer' },
  { id: 4, name: 'Dave Brown', email: 'dave@example.com', role: 'Admin' },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'Editor' },
];

export default function DataTableWithSorting() {
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
    <div style={{ maxWidth: '48rem', margin: '0 auto', padding: 'var(--space-l) var(--space-m)' }}>
      <h1>Data Table with Sorting</h1>
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
