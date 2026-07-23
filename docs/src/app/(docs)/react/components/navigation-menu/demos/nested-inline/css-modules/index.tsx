'use client';
import * as React from 'react';
import { NavigationMenu } from '@tale-ui/react/navigation-menu';
import { audienceMenus, guideLinks, guidesPanel } from '../data';
import styles from './index.module.css';

export default function ExampleNavigationMenu() {
  return (
    <NavigationMenu.Root className={styles.Root}>
      <NavigationMenu.List className={styles.List}>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={styles.Trigger}>
            Product
            <span className={styles.Icon}>
              <ChevronDownIcon />
            </span>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className={`${styles.Content} ${styles.ProductContent}`}>
            <div className={styles.SubmenuLayout}>
              <NavigationMenu.List className={styles.SubmenuList}>
                {audienceMenus.map((menu) => (
                  <NavigationMenu.Item key={menu.value}>
                    <NavigationMenu.Trigger className={styles.SubmenuTrigger}>
                      <span className={styles.SubmenuLabel}>{menu.label}</span>
                      <span className={styles.SubmenuHint}>{menu.hint}</span>
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content className={styles.SubmenuContent}>
                      <h4 className={styles.SubmenuTitle}>{menu.title}</h4>
                      <p className={styles.SubmenuDescription}>{menu.description}</p>
                      <ul className={styles.LinkList}>
                        {menu.links.map((link) => (
                          <li key={link.href}>
                            <NavigationMenu.Link className={styles.LinkCard} href={link.href}>
                              <h5 className={styles.LinkTitle}>{link.title}</h5>
                              <p className={styles.LinkDescription}>{link.description}</p>
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
          <NavigationMenu.Trigger className={styles.Trigger}>
            Learn
            <span className={styles.Icon}>
              <ChevronDownIcon />
            </span>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className={`${styles.Content} ${styles.GuidesContent}`}>
            <div className={styles.GuidesPanel}>
              <h4 className={styles.SubmenuTitle}>{guidesPanel.title}</h4>
              <p className={styles.SubmenuDescription}>{guidesPanel.description}</p>
              <ul className={styles.LinkList}>
                {guideLinks.map((link) => (
                  <li key={link.href}>
                    <NavigationMenu.Link className={styles.LinkCard} href={link.href}>
                      <h5 className={styles.LinkTitle}>{link.title}</h5>
                      <p className={styles.LinkDescription}>{link.description}</p>
                    </NavigationMenu.Link>
                  </li>
                ))}
              </ul>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link className={styles.Trigger} href="/react/overview/releases">
            Releases
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link className={styles.Trigger} href="https://github.com/Tale-UI/tale-ui">
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
      <path d="M1 3.5L5 7.5L9 3.5" stroke="currentcolor" strokeWidth="1.5" />
    </svg>
  );
}
