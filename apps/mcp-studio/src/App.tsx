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

function getInitialTab(): ActiveTab {
  if (typeof window === 'undefined') {
    return 'prompt';
  }
  const tab = new URLSearchParams(window.location.search).get('tab');
  return tab === 'components' || tab === 'recipes' ? tab : 'prompt';
}

function getInitialRecipeSlug(): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return new URLSearchParams(window.location.search).get('recipe') ?? undefined;
}

export function App() {
  const [tab, setTab] = React.useState<ActiveTab>(getInitialTab);
  const [initialRecipeSlug] = React.useState<string | undefined>(getInitialRecipeSlug);
  const [authorFix, setAuthorFix] = React.useState<AuthorFixState>({ open: false });

  const handleTabChange = (key: React.Key) => {
    const nextTab = key as ActiveTab;
    setTab(nextTab);

    const url = new URL(window.location.href);
    if (nextTab === 'prompt') {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', nextTab);
    }
    if (nextTab !== 'recipes') {
      url.searchParams.delete('recipe');
    }
    window.history.replaceState(null, '', url);
  };

  const handleRecipeSelect = (slug: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', 'recipes');
    url.searchParams.set('recipe', slug);
    window.history.replaceState(null, '', url);
  };

  return (
    <div className="studio-root">
      <div className="studio-topbar">
        <span className="studio-topbar-title">MCP Studio</span>
        <div className="studio-topbar-tabs">
          <Tabs.Root
            selectedKey={tab}
            onSelectionChange={handleTabChange}
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
      {tab === 'recipes' && (
        <RecipeBrowser initialRecipeSlug={initialRecipeSlug} onRecipeSelect={handleRecipeSelect} />
      )}

      <AuthorFixDrawer
        isOpen={authorFix.open}
        defaultComponent={authorFix.component}
        onClose={() => setAuthorFix({ open: false })}
      />
    </div>
  );
}
