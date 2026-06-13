import { Menu } from '@tale-ui/react/menu';
import { Link } from 'react-router';

export default function ReactRouterLinkItemNavigation() {
  return (
    <div className="p-4">
      <h1 data-testid="page-heading" className="mb-4 text-2xl font-bold">
        Menu with React Router Link Items
      </h1>

      <Menu.Root>
        <Menu.Trigger
          data-testid="menu-trigger"
          className="rounded bg-gray-50 px-4 py-2 text-gray-900 hover:bg-gray-100"
        >
          Open Menu
        </Menu.Trigger>

        <Menu.Popover>
          <Menu.MenuList
            aria-label="Navigation"
            className="w-48 rounded bg-[canvas] p-1 shadow-lg shadow-gray-200"
          >
            <Menu.LinkItem
              id="page-one"
              data-testid="link-one"
              href="/e2e-fixtures/menu/PageOne"
              render={(props) => <Link {...props} to="/e2e-fixtures/menu/PageOne" />}
              textValue="Page one"
              className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-blue-800 data-[focused]:bg-gray-900 data-[focused]:text-gray-50"
            >
              Page one
            </Menu.LinkItem>

            <Menu.LinkItem
              id="page-two"
              data-testid="link-two"
              href="/e2e-fixtures/menu/PageTwo"
              render={(props) => <Link {...props} to="/e2e-fixtures/menu/PageTwo" />}
              textValue="Page two"
              className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-blue-800 data-[focused]:bg-gray-900 data-[focused]:text-gray-50"
            >
              Page two
            </Menu.LinkItem>
          </Menu.MenuList>
        </Menu.Popover>
      </Menu.Root>
    </div>
  );
}
