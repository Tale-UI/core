import * as React from 'react';
import { marked } from 'marked';
import { Spinner } from '@tale-ui/react/spinner';
import { Banner } from '@tale-ui/react/banner';
import { Tabs } from '@tale-ui/react/tabs';
import { apiListRecipes, apiGetRecipe, type RecipeSummary } from '../lib/api';
import { PreviewPane } from './PreviewPane';

function extractTsx(markdown: string): string | null {
  const blocks = [...markdown.matchAll(/```tsx\n([\s\S]*?)```/g)].map(m => m[1]);
  if (blocks.length === 0) {return null;}
  let code = blocks.join('\n\n');

  // Strip @tale-ui/charts/styles — sandbox uses chart.css
  code = code.replace(/^import\s+['"]@tale-ui\/charts\/styles['"];?\n/gm, '');

  // If an explicit Example export is present (e.g. from a ## Preview block), use as-is
  if (/export\s+function\s+Example\b/.test(code)) {return code;}

  // Otherwise rename the last function declaration to Example
  const fns = [...code.matchAll(/^(export(?:\s+default)?\s+)?function\s+(\w+)/gm)];
  if (fns.length === 0) {return null;}
  const target = fns[fns.length - 1];
  return (
    `${code.slice(0, target.index!) 
    }export function Example${ 
    code.slice(target.index! + target[0].length)}`
  );
}

interface RecipeBrowserProps {
  initialRecipeSlug?: string;
  onRecipeSelect?: (slug: string) => void;
}

export function RecipeBrowser({ initialRecipeSlug, onRecipeSelect }: RecipeBrowserProps) {
  const [recipes, setRecipes] = React.useState<RecipeSummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [content, setContent] = React.useState<string | null>(null);
  const [contentLoading, setContentLoading] = React.useState(false);

  React.useEffect(() => {
    apiListRecipes()
      .then(list => setRecipes(list))
      .catch(err => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, []);

  const grouped = React.useMemo(() => {
    const map = new Map<string, RecipeSummary[]>();
    for (const r of recipes) {
      const cat = r.file?.split('/')[0] ?? 'Other';
      if (!map.has(cat)) {map.set(cat, []);}
      map.get(cat)!.push(r);
    }
    return map;
  }, [recipes]);

  const handleSelect = React.useCallback(async (slug: string) => {
    setSelected(slug);
    onRecipeSelect?.(slug);
    setContent(null);
    setContentLoading(true);
    try {
      const md = await apiGetRecipe(slug);
      setContent(md);
    } catch (err) {
      setContent(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setContentLoading(false);
    }
  }, [onRecipeSelect]);

  React.useEffect(() => {
    if (!initialRecipeSlug || selected !== null) {return;}
    void handleSelect(initialRecipeSlug);
  }, [handleSelect, initialRecipeSlug, selected]);

  const html = React.useMemo(() => content ? marked.parse(content) as string : null, [content]);
  const tsxCode = React.useMemo(() => content ? extractTsx(content) : null, [content]);

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Left: recipe list */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '28rem', flexShrink: 0, borderRight: '1px solid var(--neutral-20)', overflowY: 'auto' }}>
        {loading && (
          <div style={{ padding: 'var(--space-l)', display: 'flex', justifyContent: 'center' }}>
            <Spinner size="md" />
          </div>
        )}
        {error && (
          <Banner.Root variant="error" style={{ margin: 'var(--space-m)' }}>
            <Banner.Description>{error}</Banner.Description>
          </Banner.Root>
        )}
        {!loading && !error && [...grouped.entries()].map(([cat, items]) => (
          <div key={cat}>
            <div style={{
              padding: 'var(--space-xs) var(--space-m)',
              fontSize: 'var(--label-xs-font-size)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--neutral-50)',
              background: 'var(--neutral-14)',
              position: 'sticky',
              top: 0,
            }}>
              {cat}
            </div>
            {items.map(r => (
              <button
                key={r.slug}
                type="button"
                onClick={() => void handleSelect(r.slug)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: 'var(--space-xs) var(--space-m)',
                  background: selected === r.slug ? 'var(--color-10)' : 'transparent',
                  color: selected === r.slug ? 'var(--color-70)' : 'var(--neutral-80)',
                  fontSize: 'var(--text-s-font-size)',
                  fontWeight: selected === r.slug ? 600 : 400,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
              >
                {r.title ?? r.slug}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Right: recipe content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {!selected && (
          <div className="studio-hint" style={{ flex: 1 }}>
            <span>Select a recipe to view it</span>
          </div>
        )}
        {selected && contentLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-xl)', flex: 1 }}>
            <Spinner size="md" />
          </div>
        )}
        {selected && !contentLoading && (
          <Tabs.Root defaultSelectedKey="preview" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <Tabs.List>
              <Tabs.Tab id="preview">Preview</Tabs.Tab>
              <Tabs.Tab id="docs">Docs</Tabs.Tab>
              <Tabs.Indicator />
            </Tabs.List>
            <Tabs.Panel id="preview" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {tsxCode ? (
                <PreviewPane code={tsxCode} />
              ) : (
                <div className="studio-hint" style={{ flex: 1 }}>
                  <span>No renderable code block in this recipe</span>
                </div>
              )}
            </Tabs.Panel>
            <Tabs.Panel id="docs" style={{ flex: 1, overflow: 'auto', padding: 'var(--space-l)' }}>
              {html && (
                <div
                  className="plan-result"
                  // Markdown from our own MCP server — not user-supplied HTML
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              )}
            </Tabs.Panel>
          </Tabs.Root>
        )}
      </div>
    </div>
  );
}
