'use client';

import * as React from 'react';
import { Menu } from '@tale-ui/react/menu';
import { SubmenuTrigger } from 'react-aria-components';
import styles from './pointer-events-scope.module.css';

const menuItemCount = 240;
const popupItemCount = 60;
const outsideTileCount = 14000;
const outsideMeshNodeCount = 6000;
const outsideMeshColumns = 30;

const menuItems = Array.from({ length: menuItemCount }, (_, index) => ({
  id: index,
  label: `Submenu trigger ${index + 1}`,
}));

const popupItems = Array.from({ length: popupItemCount }, (_, index) => ({
  id: index,
  label: `Item ${index + 1}`,
}));

const outsideTiles = Array.from({ length: outsideTileCount }, (_, index) => ({
  id: index,
  label: `Node ${index + 1}`,
}));

const outsideMeshNodes = Array.from({ length: outsideMeshNodeCount }, (_, index) => {
  const row = Math.floor(index / outsideMeshColumns);
  const col = index % outsideMeshColumns;
  const rowCount = Math.ceil(outsideMeshNodeCount / outsideMeshColumns);

  const jitterX = (index * 17) % 9;
  const jitterY = (index * 29) % 11;

  return {
    id: index,
    left: (col / (outsideMeshColumns - 1)) * 92 + 2 + jitterX * 0.35,
    top: (row / (rowCount - 1)) * 96 + 2 + jitterY * 0.2,
    width: 10 + ((index * 13) % 28),
    height: 8 + ((index * 7) % 18),
    rotate: ((index * 11) % 32) - 16,
  };
});

export default function PointerEventsScopeExperiment() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [mainMenuEntryCount, setMainMenuEntryCount] = React.useState(menuItemCount);

  const mainMenuEntries = Math.max(1, Math.min(menuItemCount, Math.trunc(mainMenuEntryCount) || 1));
  const visibleMenuItems = menuItems.slice(0, mainMenuEntries);

  return (
    <div className={styles.root}>
      <h1>Pointer events scope benchmark (real Menu)</h1>

      <div className={styles.controls}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Main menu entries</span>
          <input
            className={styles.numberInput}
            max={menuItemCount}
            min={1}
            step={1}
            type="number"
            value={mainMenuEntryCount}
            onChange={(event) => {
              const next = Number(event.target.value);
              setMainMenuEntryCount(Number.isFinite(next) ? next : 1);
            }}
          />
        </label>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>Scope mode: scoped</div>
        <div className={styles.stat}>Outside nodes: {outsideTileCount + outsideMeshNodeCount}</div>
        <div className={styles.stat}>Main menu entries: {mainMenuEntries}</div>
        <div className={styles.stat}>
          Root menu: <span className={styles.statusValue}>{menuOpen ? 'open' : 'closed'}</span>
        </div>
      </div>

      <div className={styles.canvas}>
        <section className={styles.menuWrap}>
          <div className={styles.menuHeader}>Menu region (real Menu primitives)</div>
          <div className={styles.menuBody}>
            <Menu.Root isOpen={menuOpen} onOpenChange={setMenuOpen}>
              <Menu.Trigger className={styles.rootTrigger}>Open Menu</Menu.Trigger>

              <Menu.Popover className={styles.positioner}>
                <Menu.MenuList className={styles.popup}>
                  {visibleMenuItems.map((menuItem) => (
                    <SubmenuTrigger key={menuItem.id} delay={0}>
                      <Menu.Item
                        className={styles.menuRow}
                        data-bench-submenu-trigger
                      >
                        <span>{menuItem.label}</span>
                        <span>&#9654;</span>
                      </Menu.Item>
                      <Menu.Popover className={styles.positioner}>
                        <Menu.MenuList className={styles.submenuPopup}>
                          {popupItems.map((popupItem) => (
                            <Menu.Item key={popupItem.id} className={styles.popupItem}>
                              {popupItem.label}
                            </Menu.Item>
                          ))}
                        </Menu.MenuList>
                      </Menu.Popover>
                    </SubmenuTrigger>
                  ))}
                </Menu.MenuList>
              </Menu.Popover>
            </Menu.Root>
          </div>
        </section>

        <section className={styles.outside}>
          <h2>Outside document area (large DOM + hit-test mesh)</h2>
          <div className={styles.outsideSurface}>
            <div className={styles.hitTestMesh} aria-hidden>
              {outsideMeshNodes.map((meshNode) => (
                <div
                  key={`mesh-${meshNode.id}`}
                  className={styles.hitTestNode}
                  data-bench-outside-node
                  style={
                    {
                      '--mesh-height': `${meshNode.height}px`,
                      '--mesh-left': `${meshNode.left}%`,
                      '--mesh-rotate': `${meshNode.rotate}deg`,
                      '--mesh-top': `${meshNode.top}%`,
                      '--mesh-width': `${meshNode.width}px`,
                    } as React.CSSProperties
                  }
                >
                  <span className={styles.hitTestNodeInner}>
                    <span className={styles.hitTestNodeCore} />
                  </span>
                </div>
              ))}
            </div>
            <div className={styles.outsideGrid}>
              {outsideTiles.map((tile) => (
                <div key={tile.id} className={styles.tile} data-bench-outside-node>
                  {tile.label}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
