import * as React from 'react';
import { marked } from 'marked';
import { Badge } from '@tale-ui/react/badge';
import { Banner } from '@tale-ui/react/banner';
import { Button } from '@tale-ui/react/button';
import { Card } from '@tale-ui/react/card';
import { Column } from '@tale-ui/react/column';
import { EmptyState } from '@tale-ui/react/empty-state';
import { Icon } from '@tale-ui/react/icon';
import { Link } from '@tale-ui/react/link';
import { Row } from '@tale-ui/react/row';
import { SearchField } from '@tale-ui/react/search-field';
import { Spinner } from '@tale-ui/react/spinner';
import { Tabs } from '@tale-ui/react/tabs';
import { Text } from '@tale-ui/react/text';
import {
  BookOpenIcon,
  ClipboardIcon,
  Code2Icon,
  ExternalLinkIcon,
  FileTextIcon,
  MonitorIcon,
  RefreshCwIcon,
  XCircleIcon,
  XIcon,
} from 'lucide-react';
import { apiGetRecipe, apiListRecipes, type RecipeSummary } from './lib/api';
import { PreviewPane } from './panes/PreviewPane';

type RecipeView = 'preview' | 'docs' | 'tsx';

function getInitialRecipeSlug(): string | null {
  return new URLSearchParams(window.location.search).get('recipe');
}

function groupRecipesByCategory(recipes: RecipeSummary[]) {
  return recipes.reduce<Record<string, RecipeSummary[]>>((groups, recipe) => {
    groups[recipe.category] ??= [];
    groups[recipe.category].push(recipe);
    return groups;
  }, {});
}

function formatModifiedAt(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function copyText(value: string) {
  void navigator.clipboard?.writeText(value);
}

function updateRecipeUrl(slug: string) {
  const url = new URL(window.location.href);
  url.searchParams.set('recipe', slug);
  window.history.replaceState(null, '', url);
}

function extractTsx(markdown: string): string | null {
  const blocks = [...markdown.matchAll(/```tsx\n([\s\S]*?)```/g)].map(match => match[1]);
  if (blocks.length === 0) {
    return null;
  }

  let code = blocks.join('\n\n');
  code = code.replace(/^import\s+['"]@tale-ui\/charts\/styles['"];?\n/gm, '');

  if (/export\s+function\s+Example\b/.test(code)) {
    return code;
  }

  const functions = [...code.matchAll(/^(export(?:\s+default)?\s+)?function\s+(\w+)/gm)];
  if (functions.length === 0) {
    return null;
  }
  const target = functions[functions.length - 1];
  return (
    `${code.slice(0, target.index!)
    }export function Example${
    code.slice(target.index! + target[0].length)}`
  );
}

function RecipeList({
  recipes,
  selectedSlug,
  query,
  onQueryChange,
  onSelect,
}: {
  recipes: RecipeSummary[];
  selectedSlug: string | null;
  query: string;
  onQueryChange: (value: string) => void;
  onSelect: (slug: string) => void;
}) {
  const filteredRecipes = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return recipes;
    }
    return recipes.filter((recipe) => {
      const searchable = [
        recipe.title,
        recipe.slug,
        recipe.summary,
        recipe.category,
        recipe.path,
        ...recipe.components,
      ].join(' ').toLowerCase();
      return searchable.includes(q);
    });
  }, [query, recipes]);

  const grouped = React.useMemo(() => groupRecipesByCategory(filteredRecipes), [filteredRecipes]);

  return (
    <aside className="recipe-sidebar">
      <div className="recipe-sidebar__search">
        <SearchField.Root value={query} onChange={onQueryChange}>
          <SearchField.Label>Search recipes</SearchField.Label>
          <SearchField.Input placeholder="Pattern, component, or slug" />
          <SearchField.ClearButton>
            <Icon icon={XIcon} size="sm" />
          </SearchField.ClearButton>
        </SearchField.Root>
      </div>

      {Object.entries(grouped).length > 0 ? (
        <div className="recipe-list-groups">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="recipe-list-group">
              <div className="recipe-list-group__label">{category}</div>
              <div className="recipe-list">
                {items.map((recipe) => {
                  const selected = recipe.slug === selectedSlug;
                  return (
                    <button
                      key={recipe.slug}
                      type="button"
                      className={selected ? 'recipe-list-item recipe-list-item--selected' : 'recipe-list-item'}
                      onClick={() => onSelect(recipe.slug)}
                    >
                      <span className="recipe-list-item__main">
                        <span className="recipe-list-item__title">{recipe.title}</span>
                        <span className="recipe-list-item__summary">{recipe.summary}</span>
                      </span>
                      <Badge variant={recipe.previewable ? 'success' : 'warning'} size="sm" type="rounded">
                        {recipe.tsxBlockCount} TSX
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState.Root size="sm">
          <EmptyState.Icon>
            <Icon icon={BookOpenIcon} size="lg" />
          </EmptyState.Icon>
          <EmptyState.Title>No recipes match</EmptyState.Title>
          <EmptyState.Description>
            Clear search or add a markdown file under docs/recipes.
          </EmptyState.Description>
        </EmptyState.Root>
      )}
    </aside>
  );
}

function RecipeHeader({
  recipe,
  onRefresh,
}: {
  recipe: RecipeSummary;
  onRefresh: () => void;
}) {
  return (
    <header className="recipe-detail-header">
      <div className="recipe-detail-header__main">
        <Row gap="xs" align="center" wrap>
          <Text as="h2" variant="heading" size="l">
            {recipe.title}
          </Text>
          <Badge variant={recipe.previewable ? 'success' : 'warning'} size="sm" type="rounded">
            {recipe.previewable ? 'previewable' : 'no preview'}
          </Badge>
        </Row>
        <Text as="p" variant="text" size="s" color="muted">
          {recipe.summary}
        </Text>
        <Row gap="2xs" wrap>
          <Badge variant="neutral" size="sm" type="rounded">
            {recipe.category}
          </Badge>
          <Badge variant="neutral" size="sm" type="rounded">
            {recipe.tsxBlockCount} TSX blocks
          </Badge>
          <Badge variant="neutral" size="sm" type="rounded">
            Modified {formatModifiedAt(recipe.modifiedAt)}
          </Badge>
        </Row>
      </div>

      <div className="recipe-detail-header__actions">
        <Button variant="neutral" size="sm" onPress={onRefresh}>
          <Icon icon={RefreshCwIcon} size="sm" />
          Refresh
        </Button>
        <Button variant="neutral" size="sm" onPress={() => copyText(recipe.path)}>
          <Icon icon={ClipboardIcon} size="sm" />
          Copy path
        </Button>
      </div>
    </header>
  );
}

function RecipeMetadata({ recipe }: { recipe: RecipeSummary }) {
  return (
    <Card.Root variant="outlined" padding="md" className="recipe-metadata-card">
      <Card.Body>
        <Column gap="s">
          <div>
            <Text variant="label" size="s">
              Source
            </Text>
            <Text variant="mono" size="xs" color="muted">
              {recipe.path}
            </Text>
          </div>
          <div>
            <Text variant="label" size="s">
              Components
            </Text>
            {recipe.components.length > 0 ? (
              <Row gap="2xs" wrap>
                {recipe.components.map((component) => (
                  <Badge key={component} variant="brand" size="sm" type="modern">
                    {component}
                  </Badge>
                ))}
              </Row>
            ) : (
              <Text variant="text" size="s" color="muted">
                No Components Used section found.
              </Text>
            )}
          </div>
        </Column>
      </Card.Body>
    </Card.Root>
  );
}

export function App() {
  const [recipes, setRecipes] = React.useState<RecipeSummary[]>([]);
  const [selectedSlug, setSelectedSlug] = React.useState<string | null>(getInitialRecipeSlug);
  const [query, setQuery] = React.useState('');
  const [markdown, setMarkdown] = React.useState('');
  const [view, setView] = React.useState<RecipeView>('preview');
  const [loadingRecipes, setLoadingRecipes] = React.useState(true);
  const [loadingRecipe, setLoadingRecipe] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const selectedRecipe = React.useMemo(
    () => recipes.find((recipe) => recipe.slug === selectedSlug) ?? null,
    [recipes, selectedSlug],
  );

  const loadRecipes = React.useCallback(async () => {
    setError(null);
    setLoadingRecipes(true);
    try {
      const nextRecipes = await apiListRecipes();
      setRecipes(nextRecipes);
      setSelectedSlug(current => {
        if (current && nextRecipes.some(recipe => recipe.slug === current)) {
          return current;
        }
        return nextRecipes[0]?.slug ?? null;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoadingRecipes(false);
    }
  }, []);

  const loadSelectedRecipe = React.useCallback(async () => {
    if (!selectedSlug) {
      setMarkdown('');
      return;
    }
    setLoadingRecipe(true);
    setError(null);
    try {
      const nextMarkdown = await apiGetRecipe(selectedSlug);
      setMarkdown(nextMarkdown);
      updateRecipeUrl(selectedSlug);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setMarkdown('');
    } finally {
      setLoadingRecipe(false);
    }
  }, [selectedSlug]);

  React.useEffect(() => {
    void loadRecipes();
  }, [loadRecipes]);

  React.useEffect(() => {
    void loadSelectedRecipe();
  }, [loadSelectedRecipe]);

  const docsHtml = React.useMemo(() => marked.parse(markdown) as string, [markdown]);
  const tsxCode = React.useMemo(() => extractTsx(markdown), [markdown]);

  return (
    <div className="recipe-root">
      <header className="recipe-topbar">
        <div className="recipe-brand">
          <span className="recipe-brand__icon" aria-hidden="true">
            <Icon icon={BookOpenIcon} size="md" />
          </span>
          <Column gap="4xs">
            <Text as="h1" variant="heading" size="l">
              Recipe Studio
            </Text>
            <Text as="p" variant="text" size="s" color="muted">
              Browse, inspect, and preview canonical docs/recipes patterns
            </Text>
          </Column>
        </div>
        <nav className="recipe-topbar__links" aria-label="Recipe app links">
          <Link href="http://localhost:5176/">Dashboard</Link>
          <Link href="http://localhost:5175/?tab=recipes">
            MCP Studio
            <Icon icon={ExternalLinkIcon} size="sm" />
          </Link>
        </nav>
      </header>

      <main className="recipe-main">
        {error && (
          <Banner.Root variant="error" className="recipe-error">
            <Banner.Icon>
              <Icon icon={XCircleIcon} size="sm" />
            </Banner.Icon>
            <Banner.Title>Recipe data failed</Banner.Title>
            <Banner.Description>{error}</Banner.Description>
            <Banner.Actions>
              <Button variant="danger-ghost" size="sm" onPress={() => void loadRecipes()}>
                Retry
              </Button>
            </Banner.Actions>
          </Banner.Root>
        )}

        {loadingRecipes ? (
          <div className="recipe-loading">
            <Spinner size="md" />
          </div>
        ) : (
          <>
            <RecipeList
              recipes={recipes}
              selectedSlug={selectedSlug}
              query={query}
              onQueryChange={setQuery}
              onSelect={setSelectedSlug}
            />

            <section className="recipe-detail" aria-label="Recipe detail">
              {selectedRecipe ? (
                <>
                  <RecipeHeader recipe={selectedRecipe} onRefresh={() => void loadSelectedRecipe()} />
                  <RecipeMetadata recipe={selectedRecipe} />

                  <Tabs.Root
                    selectedKey={view}
                    onSelectionChange={key => setView(key as RecipeView)}
                    className="recipe-tabs"
                  >
                    <Tabs.List>
                      <Tabs.Tab id="preview">
                        <Icon icon={MonitorIcon} size="sm" />
                        Preview
                      </Tabs.Tab>
                      <Tabs.Tab id="docs">
                        <Icon icon={FileTextIcon} size="sm" />
                        Docs
                      </Tabs.Tab>
                      <Tabs.Tab id="tsx">
                        <Icon icon={Code2Icon} size="sm" />
                        TSX
                      </Tabs.Tab>
                      <Tabs.Indicator />
                    </Tabs.List>

                    <Tabs.Panel id="preview" className="recipe-tab-panel">
                      {loadingRecipe ? (
                        <div className="recipe-loading">
                          <Spinner size="md" />
                        </div>
                      ) : tsxCode ? (
                        <PreviewPane code={tsxCode} />
                      ) : (
                        <EmptyState.Root>
                          <EmptyState.Icon>
                            <Icon icon={Code2Icon} size="lg" />
                          </EmptyState.Icon>
                          <EmptyState.Title>No renderable TSX</EmptyState.Title>
                          <EmptyState.Description>
                            Add a fenced tsx block to this recipe to enable preview.
                          </EmptyState.Description>
                        </EmptyState.Root>
                      )}
                    </Tabs.Panel>

                    <Tabs.Panel id="docs" className="recipe-tab-panel recipe-docs-panel">
                      <article
                        className="recipe-markdown"
                        // Markdown is loaded from local repository files.
                        dangerouslySetInnerHTML={{ __html: docsHtml }}
                      />
                    </Tabs.Panel>

                    <Tabs.Panel id="tsx" className="recipe-tab-panel">
                      {tsxCode ? (
                        <pre className="recipe-code-block">{tsxCode}</pre>
                      ) : (
                        <EmptyState.Root>
                          <EmptyState.Title>No TSX blocks found</EmptyState.Title>
                        </EmptyState.Root>
                      )}
                    </Tabs.Panel>
                  </Tabs.Root>
                </>
              ) : (
                <EmptyState.Root>
                  <EmptyState.Icon>
                    <Icon icon={BookOpenIcon} size="lg" />
                  </EmptyState.Icon>
                  <EmptyState.Title>No recipes loaded</EmptyState.Title>
                  <EmptyState.Description>
                    Add a markdown file under docs/recipes.
                  </EmptyState.Description>
                </EmptyState.Root>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
