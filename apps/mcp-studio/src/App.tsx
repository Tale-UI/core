import * as React from 'react';
import { Tabs } from '@tale-ui/react/tabs';
import { ColorModeToggle } from '@tale-ui/react/color-mode-toggle';
import { Link } from '@tale-ui/react/link';
import { PromptStudio } from './panes/PromptStudio';
import { ComponentBrowser } from './panes/ComponentBrowser';
import { RecipeBrowser } from './panes/RecipeBrowser';
import { AuthorFixDrawer } from './panes/AuthorFixDrawer';

export type ActiveTab = 'prompt' | 'components' | 'recipes';

export interface AuthorFixState {
  open: boolean;
  component?: string;
}

export function App() {
  const [tab, setTab] = React.useState<ActiveTab>('prompt');
  const [authorFix, setAuthorFix] = React.useState<AuthorFixState>({ open: false });

  return (
    <div className="studio-root">
      <div className="studio-topbar">
        <span className="studio-topbar-title">MCP Studio</span>
        <div className="studio-topbar-tabs">
          <Tabs.Root
            selectedKey={tab}
            onSelectionChange={k => setTab(k as ActiveTab)}
          >
            <Tabs.List>
              <Tabs.Tab id="prompt">Prompt Studio</Tabs.Tab>
              <Tabs.Tab id="components">Components</Tabs.Tab>
              <Tabs.Tab id="recipes">Recipes</Tabs.Tab>
            </Tabs.List>
          </Tabs.Root>
        </div>
        <nav className="studio-topbar-links" aria-label="Dev app links">
          <Link href="http://localhost:5173/">Vite Playground</Link>
          <Link href="http://localhost:5174/">Theme Playground</Link>
          <Link href="http://localhost:5176/">Dashboard</Link>
        </nav>
        <ColorModeToggle />
      </div>

      {tab === 'prompt' && (
        <PromptStudio onAuthorFix={component => setAuthorFix({ open: true, component })} />
      )}
      {tab === 'components' && (
        <ComponentBrowser onAuthorFix={component => setAuthorFix({ open: true, component })} />
      )}
      {tab === 'recipes' && <RecipeBrowser />}

      <AuthorFixDrawer
        isOpen={authorFix.open}
        defaultComponent={authorFix.component}
        onClose={() => setAuthorFix({ open: false })}
      />
    </div>
  );
}
