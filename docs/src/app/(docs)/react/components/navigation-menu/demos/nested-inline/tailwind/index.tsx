'use client';
import * as React from 'react';
import { NavigationMenu } from '@tale-ui/react/navigation-menu';
import { audienceMenus, guideLinks, guidesPanel } from '../data';

export default function ExampleNavigationMenu() {
  return (
    <NavigationMenu.Root className="min-w-max rounded-lg bg-gray-50 p-1 text-gray-900">
      <NavigationMenu.List className="relative flex">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={triggerClassName}>
            Product
            <span className="transition-transform duration-200 ease-in-out">
              <ChevronDownIcon />
            </span>
          </NavigationMenu.Trigger>

          <NavigationMenu.Content className={productContentClassName}>
            <div className="grid grid-cols-1 overflow-clip rounded-lg min-[700px]:grid-cols-[13rem_minmax(0,1fr)]">
              <NavigationMenu.List className="m-0 flex list-none flex-row gap-1 overflow-x-auto bg-gray-100 p-4 min-[700px]:box-border min-[700px]:flex-col min-[700px]:gap-0 min-[700px]:overflow-x-visible min-[700px]:overflow-y-auto min-[700px]:border-r min-[700px]:border-r-gray-200 dark:bg-black/20 dark:border-r-gray-300">
                {audienceMenus.map((menu) => (
                  <NavigationMenu.Item key={menu.value}>
                    <NavigationMenu.Trigger className={submenuTriggerClassName}>
                      <span className="text-base leading-[1.2] font-medium text-gray-900">
                        {menu.label}
                      </span>
                      <span className="text-sm leading-[1.35] text-gray-500">{menu.hint}</span>
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content className={submenuContentClassName}>
                      <h4 className="m-0 text-[1.125rem] leading-[1.3] font-medium">
                        {menu.title}
                      </h4>
                      <p className="m-0 mt-2.5 text-base leading-[1.5] text-gray-500">
                        {menu.description}
                      </p>
                      <ul className="-mx-2 m-0 mt-4 grid list-none gap-0 p-0">
                        {menu.links.map((link) => (
                          <li key={link.href}>
                            <NavigationMenu.Link className={linkCardClassName} href={link.href}>
                              <h5 className="m-0 text-base leading-[1.25] font-medium">
                                {link.title}
                              </h5>
                              <p className="m-0 mt-[0.35rem] text-[0.95rem] leading-[1.45] text-gray-500">
                                {link.description}
                              </p>
                            </NavigationMenu.Link>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>
                ))}
              </NavigationMenu.List>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={triggerClassName}>
            Learn
            <span className="transition-transform duration-200 ease-in-out">
              <ChevronDownIcon />
            </span>
          </NavigationMenu.Trigger>

          <NavigationMenu.Content className={guidesContentClassName}>
            <div className="p-7 text-gray-900 min-[700px]:p-8">
              <h4 className="m-0 text-[1.125rem] leading-[1.3] font-medium">{guidesPanel.title}</h4>
              <p className="m-0 mt-2.5 text-base leading-[1.5] text-gray-500">
                {guidesPanel.description}
              </p>
              <ul className="-mx-2 m-0 mt-4 grid list-none gap-0 p-0">
                {guideLinks.map((link) => (
                  <li key={link.href}>
                    <NavigationMenu.Link className={linkCardClassName} href={link.href}>
                      <h5 className="m-0 text-base leading-[1.25] font-medium">{link.title}</h5>
                      <p className="m-0 mt-[0.35rem] text-[0.95rem] leading-[1.45] text-gray-500">
                        {link.description}
                      </p>
                    </NavigationMenu.Link>
                  </li>
                ))}
              </ul>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link className={triggerClassName} href="/react/overview/releases">
            Releases
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link
            className={triggerClassName}
            href="https://github.com/Tale-UI/tale-ui"
          >
            GitHub
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

function ChevronDownIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" {...props}>
      <path d="M1 3.5L5 7.5L9 3.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const triggerClassName =
  'box-border flex items-center justify-center gap-1.5 h-10 ' +
  'px-2 sm:px-3.5 m-0 rounded-md bg-gray-50 text-gray-900 font-medium ' +
  'text-[0.925rem] sm:text-base leading-6 select-none no-underline ' +
  'hover:bg-gray-100 active:bg-gray-100 ' +
  'focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 focus-visible:relative';

const sharedContentClassName = 'h-full w-[calc(100vw_-_40px)]';

const productContentClassName = `${sharedContentClassName} min-[700px]:max-w-[675px] p-0`;

const guidesContentClassName = `${sharedContentClassName} min-[700px]:max-w-[500px] p-0`;

const submenuTriggerClassName =
  'box-border m-0 flex w-full min-w-[10rem] flex-col items-start gap-0.5 rounded-lg ' +
  'bg-transparent px-3 py-2.5 text-left text-inherit ' +
  'hover:bg-gray-100 focus-visible:outline-2 ' +
  'focus-visible:-outline-offset-1 focus-visible:outline-blue-800';

const submenuContentClassName = 'h-full translate-x-0 p-7 min-[700px]:p-8';

const linkCardClassName =
  'box-border block rounded-lg bg-transparent px-2 py-3 no-underline text-inherit ' +
  'hover:bg-gray-100 focus-visible:outline-2 ' +
  'focus-visible:-outline-offset-1 focus-visible:outline-blue-800';
